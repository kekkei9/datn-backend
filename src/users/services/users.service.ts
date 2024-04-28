import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { In, Repository } from 'typeorm';
import {
  CreateAdminDto,
  CreateUserDto,
  UpdateUserDto,
} from '../dto/create-user.dto';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import {
  FriendRequest,
  FriendRequest_Status,
} from '../entities/friend-request.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}

  async create(createUserDto: CreateUserDto | CreateAdminDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new BadRequestException();
    }

    const createdUser = await this.userRepository.create(createUserDto);
    const saveUser = await this.userRepository.save(createdUser);
    delete saveUser.password;
    delete saveUser.refreshToken;
    return saveUser;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findByEmailAndGetPassword(email: string) {
    return await this.userRepository.findOne({
      select: ['id', 'password', 'role'],
      where: { email },
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findUserById(id: number) {
    return await this.userRepository.findOneOrFail({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneOrFail({
      where: { email },
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

  async hasRequestBeenSentOrReceived(
    creator: { id: number },
    receiver: { id: number },
  ) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        { creator, receiver },
        { creator: receiver, receiver: creator },
      ],
    });

    if (!friendRequest) return false;
    return true;
  }

  async sendFriendRequest(
    receiverId: number,
    { id: creatorId }: { id: number },
  ) {
    if (receiverId === creatorId)
      return { error: 'It is not possible to add yourself!' };

    const receiver = await this.findUserById(receiverId);
    const creator = await this.findUserById(creatorId);
    const hasRequestBeenSentOrReceived =
      await this.hasRequestBeenSentOrReceived(creator, receiver);

    if (hasRequestBeenSentOrReceived)
      return {
        error:
          'A friend request has already been sent of received to your account!',
      };
    const friendRequest: FriendRequest = {
      creator,
      receiver,
      status: 'pending',
    };
    return await this.friendRequestRepository.save(friendRequest);
  }

  async getFriendRequestStatus(
    receiverId: number,
    { id: currentUserId }: { id: number },
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
        status: 'waiting-for-current-user-response' as FriendRequest_Status,
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
    statusResponse: FriendRequest_Status,
    friendRequestId: number,
  ) {
    const friendRequest = await this.getFriendRequestUserById(friendRequestId);

    return await this.friendRequestRepository.save({
      ...friendRequest,
      status: statusResponse,
    });
  }

  async getFriendRequestsFromRecipients({ id: currentUserId }: { id: number }) {
    return await this.friendRequestRepository.find({
      where: {
        receiver: {
          id: currentUserId,
        },
      },
      relations: ['receiver', 'creator'],
    });
  }

  async getFriends({ id: currentUserId }: { id: number }) {
    const friends = await this.friendRequestRepository.find({
      where: [
        { creator: { id: currentUserId }, status: 'accepted' },
        { receiver: { id: currentUserId }, status: 'accepted' },
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
}
