import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { DeepPartial, In, Not, Repository } from 'typeorm';
import { Role } from '../../auth/models/roles.model';
import { PayloadToken } from '../../auth/models/token.model';
import {
  CreateAdminDto,
  CreateUserDto,
  UpdateUserDto,
} from '../dto/create-user.dto';
import { DoctorRequestEntity } from '../entities/doctor-request.entity';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import {
  FriendRequest,
  FriendRequestStatus,
} from '../entities/friend-request.interface';
import { UserEntity } from '../entities/user.entity';
import SmsService from '../../sms/services/sms.service';
import { ResponseFriendRequestDto } from '../dto/friend-request.dto';
import { isPhoneNumber } from 'class-validator';
import { DeactivateUserDto } from '../dto/deactivate-user.dto';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { NotificationType } from '../../notifications/entities/notification.entity';
import { ImageService } from '../../image/services/image.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,

    @InjectRepository(DoctorRequestEntity)
    private readonly doctorRequestRepository: Repository<DoctorRequestEntity>,

    private readonly smsService: SmsService,

    private notificationsService: NotificationsService,

    private readonly imageService: ImageService,
  ) {}

  //-------------------------------------COMMON----------------------------------------------

  async checkPhoneAvailability(phoneNumber: string) {
    if (!isPhoneNumber(phoneNumber)) {
      return {
        status: 'INVALID-PHONE-NUMBER',
      };
    }

    const user = await this.userRepository.findOne({
      where: {
        phoneNumber,
      },
    });

    return {
      status: !!user ? 'ALREADY-IN-USE' : 'AVAILABLE',
    };
  }

  deactivateUser(userId: number, deactivateUserDto: DeactivateUserDto) {
    return this.userRepository.update(userId, deactivateUserDto);
  }

  async create(
    createUserDto:
      | (Omit<CreateUserDto, 'token' | 'refererToken'> & {
          phoneNumber: string;
        })
      | (CreateAdminDto & { phoneNumber: string }),
  ) {
    const user = await this.userRepository.findOne({
      where: {
        phoneNumber: createUserDto.phoneNumber,
      },
    });

    if (user) {
      throw new BadRequestException(
        'User with this phone number already exists',
      );
    }

    const createdUser = this.userRepository.create(createUserDto);
    const saveUser = await this.userRepository.save(createdUser);
    delete saveUser.password;
    delete saveUser.refreshToken;
    return saveUser;
  }

  async findAll() {
    return this.userRepository.find({
      relations: ['reports'],
    });
  }

  async findByPhoneNumberAndGetPassword(phoneNumber: string) {
    return await this.userRepository.findOne({
      select: ['id', 'password', 'role', 'deactivated'],
      where: { phoneNumber },
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  findUserById(id: number) {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async forgotPassword(phoneNumber: string) {
    const foundUserWithPhoneNumber = await this.userRepository.findOne({
      where: {
        phoneNumber,
      },
    });

    if (!foundUserWithPhoneNumber) {
      throw new NotFoundException('User with this phone number does not exist');
    }

    return this.smsService.initiatePhoneNumberVerification(phoneNumber);
  }

  resetPassword(phoneNumber: string, newPassword: string) {
    const newUser = { password: newPassword };
    const userDto = this.userRepository.create(newUser);
    const userAccount = this.userRepository.update(
      {
        phoneNumber,
      },
      userDto,
    );

    return {
      isSuccess: !!userAccount,
    };
  }

  async findUserByPhoneNumber(text: string) {
    return await this.userRepository.find({
      where: {
        phoneNumber: text,
        role: Not(Role.ADMIN),
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.userRepository.remove(user);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    //crypto is a node module, and bcrypt the maximum length of the hash is 60 characters, and token is longer than that, so we need to hash it
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const currentHashedRefreshToken = await bcrypt.hashSync(hash, 10);
    return await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    await this.findUserById(userId);

    return this.userRepository.update(
      { id: userId },
      {
        refreshToken: null,
      },
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOne({
      select: ['id', 'refreshToken', 'role'],
      where: { id: userId },
    });

    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return { id: user.id, role: user.role };
    }
  }

  async hasRequestBeenSentOrReceived(creatorId: number, receiverId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        {
          creator: {
            id: creatorId,
          },
          receiver: {
            id: creatorId,
          },
        },
        {
          creator: {
            id: receiverId,
          },
          receiver: {
            id: creatorId,
          },
        },
      ],
    });

    if (!friendRequest) return false;
    return true;
  }

  //-------------------------------------FRIEND REQUEST----------------------------------------------

  createFriendRequest(friendRequest: DeepPartial<FriendRequestEntity>) {
    return this.friendRequestRepository.save(friendRequest);
  }

  async sendFriendRequest(
    receiverId: number,
    { id: creatorId }: PayloadToken,
    method?: 'OTP',
  ) {
    if (receiverId === creatorId)
      return { error: 'It is not possible to add yourself!' };

    const hasRequestBeenSentOrReceived =
      await this.hasRequestBeenSentOrReceived(creatorId, receiverId);

    if (hasRequestBeenSentOrReceived)
      return {
        error:
          'A friend request has already been sent of received to your account!',
      };

    const saveRequest: DeepPartial<FriendRequestEntity> = {
      creator: {
        id: creatorId,
      },
      receiver: {
        id: receiverId,
      },
      status: FriendRequestStatus.PENDING,
    };

    if (method === 'OTP') {
      const receiver = await this.findUserById(receiverId);

      const result = await this.smsService.initiatePhoneNumberVerification(
        receiver.phoneNumber,
      );

      saveRequest.pinId = result.pinId;
    }

    const savedRequest = await this.friendRequestRepository.save(saveRequest);

    this.notificationsService.create({
      message: 'You have a new friend request!',
      belongTo: { id: receiverId },
      createdBy: { id: creatorId },
      type: NotificationType.FRIEND,
      referenceId: savedRequest.id,
    });

    return savedRequest;
  }

  async getFriendRequestStatus(
    receiverId: number,
    { id: currentUserId }: PayloadToken,
  ) {
    const receiver = await this.findUserById(receiverId);
    const currentUser = await this.findUserById(currentUserId);
    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        { creator: currentUser, receiver: receiver },
        { creator: receiver, receiver: currentUser },
      ],
      relations: ['creator', 'receiver'],
    });

    if (friendRequest?.receiver.id === currentUser.id) {
      return {
        status: 'waiting-for-current-user-response' as FriendRequestStatus,
      };
    }
    return { status: friendRequest?.status || 'not-sent' };
  }

  async getFriendRequestUserById(friendRequestId: number) {
    return await this.friendRequestRepository.findOne({
      where: [{ id: friendRequestId }],
    });
  }

  async respondToFriendRequest(
    responseFriendRequestDto: ResponseFriendRequestDto,
    friendRequestId: number,
  ) {
    const friendRequest = await this.getFriendRequestUserById(friendRequestId);

    if (friendRequest.pinId) {
      if (!responseFriendRequestDto.code) {
        throw new HttpException('Code is required', HttpStatus.BAD_REQUEST);
      }
      //check if the code is correct
      const isCodeCorrect = await this.smsService.confirmPhoneNumber(
        friendRequest.pinId,
        responseFriendRequestDto.code,
      );

      if (!isCodeCorrect.token) {
        throw new HttpException('Code is incorrect', HttpStatus.BAD_REQUEST);
      }
    }

    return await this.friendRequestRepository.save({
      ...friendRequest,
      status: responseFriendRequestDto.status,
    });
  }

  async getFriendRequestsFromRecipients({ id: currentUserId }: PayloadToken) {
    return await this.friendRequestRepository.find({
      where: {
        receiver: {
          id: currentUserId,
        },
        status: Not(FriendRequestStatus.ACCEPTED),
      },
      relations: ['receiver', 'creator'],
      select: ['id', 'status', 'creator'],
    });
  }

  async getFriends({ id: currentUserId }: PayloadToken) {
    const friends = await this.friendRequestRepository.find({
      where: [
        {
          creator: { id: currentUserId },
          status: FriendRequestStatus.ACCEPTED,
        },
        {
          receiver: { id: currentUserId },
          status: FriendRequestStatus.ACCEPTED,
        },
      ],
      relations: ['creator', 'receiver'],
    });

    const userIds: number[] = [];

    friends.forEach((friend: FriendRequest) => {
      if (friend.creator.id === currentUserId) {
        userIds.push(friend.receiver.id);
      } else if (friend.receiver.id === currentUserId) {
        userIds.push(friend.creator.id);
      }
    });

    return await this.userRepository.findBy({ id: In(userIds) });
  }

  //-------------------------------------DOCTOR REGISTER----------------------------------------------
  async registerToBeADoctor(
    { id: userId }: PayloadToken,
    metadata: Record<string, any>,
  ) {
    return this.doctorRequestRepository.save({ id: userId, metadata });
  }

  async getDoctorRequests() {
    return this.doctorRequestRepository.find();
  }

  async acceptDoctorRegistration(doctorRequestId: number) {
    const doctorRequest = await this.doctorRequestRepository.findOne({
      where: { id: doctorRequestId },
    });

    //set user role to doctor
    await this.userRepository.update(doctorRequest.id, { role: Role.DOCTOR });
    return this.doctorRequestRepository.remove(doctorRequest);
  }

  async uploadAvatar(user: PayloadToken, avatar: Express.Multer.File) {
    const { imagePath } = await this.imageService.uploadImage(avatar);

    return this.userRepository.update(user.id, { avatar: imagePath });
  }
}
