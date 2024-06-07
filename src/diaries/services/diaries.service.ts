import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DiaryEntity } from '../entities/diary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadToken } from '../../auth/models/token.model';
import { CreateDiaryDto } from '../dto/create-diary.dto';
import { UsersService } from '../../users/services/users.service';
import { Role } from '../../auth/models/roles.model';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { NotificationType } from '../../notifications/entities/notification.entity';
import { ImageService } from '../../image/services/image.service';

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(DiaryEntity)
    private diaryRepository: Repository<DiaryEntity>,

    private usersService: UsersService,

    private notificationsService: NotificationsService,

    private imageService: ImageService,
  ) {}

  async create(
    diary: CreateDiaryDto,
    files: Express.Multer.File[],
    user: PayloadToken,
  ) {
    const { data, belongTo } = diary;

    const belongToUser = await this.usersService.findUserById(belongTo);

    if (belongToUser.role !== Role.PATIENT) {
      throw new HttpException(
        'Only patients can have diaries',
        HttpStatus.FORBIDDEN,
      );
    }

    const images = await this.imageService.uploadImages(files);

    const createdDiary = await this.diaryRepository.save({
      data,
      createdBy: {
        id: user.id,
      },
      belongTo: {
        id: belongTo,
      },
      imagePaths: images.map((image) => image.imagePath),
    });

    this.notificationsService.create({
      belongTo: {
        id: belongTo,
      },
      createdBy: {
        id: user.id,
      },
      message: 'Diary created',
      referenceId: createdDiary.id,
      type: NotificationType.DIARY,
    });

    return createdDiary;
  }

  async patch(
    { data }: { data: object },
    files: Express.Multer.File[],
    diaryId: number,
    user: PayloadToken,
  ) {
    const currentUser = await this.usersService.findUserById(user.id);
    const diary = await this.findById(diaryId);

    if (
      currentUser.id !== diary.createdBy.id &&
      currentUser.role !== Role.ADMIN
    ) {
      throw new HttpException('Cannot update this diary', HttpStatus.FORBIDDEN);
    }

    if (!diary) {
      throw new HttpException('Diary not found', HttpStatus.NOT_FOUND);
    }

    const images = await this.imageService.uploadImages(files);

    return this.diaryRepository.update(diaryId, {
      data,
      imagePaths: images.map((image) => image.imagePath),
    });
  }

  delete(diaryId: number) {
    return this.diaryRepository.delete(diaryId);
  }

  findAll() {
    return this.diaryRepository.find({
      relations: ['createdBy', 'belongTo'],
    });
  }

  findById(diaryId: number) {
    return this.diaryRepository.findOne({
      relations: ['createdBy', 'belongTo'],
      where: {
        id: diaryId,
      },
    });
  }

  getMyDiaries(user: PayloadToken) {
    return this.diaryRepository.find({
      where: {
        belongTo: {
          id: user.id,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async getUserDiaries(currentUser: PayloadToken, targetUserId: number) {
    const friends = await this.usersService.getFriends(currentUser);

    if (
      !friends.find((friend) => friend.id === targetUserId) &&
      currentUser.role !== Role.ADMIN
    ) {
      throw new HttpException(
        'Cannot view diaries of this user',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.diaryRepository.find({
      where: {
        belongTo: {
          id: targetUserId,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }
}
