import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadToken } from '../../auth/models/token.model';
import { ImageService } from '../../image/services/image.service';
import { Role } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { CreateDiaryDto } from '../dto/create-diary.dto';
import { GetAllDiariesDto } from '../dto/find-diaries.dto';
import { DiaryEntity } from '../entities/diary.entity';

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(DiaryEntity)
    private diaryRepository: Repository<DiaryEntity>,

    private usersService: UsersService,

    private imageService: ImageService,
  ) {}

  async create(
    { data, type }: CreateDiaryDto,
    files: Express.Multer.File[],
    user: PayloadToken,
  ) {
    if (user.role !== Role.PATIENT) {
      throw new HttpException(
        'Only patients can create diaries',
        HttpStatus.FORBIDDEN,
      );
    }

    const images = await this.imageService.uploadImages(files);

    const createdDiary = await this.diaryRepository.save({
      data: JSON.parse(data),
      user: {
        id: user.id,
      },
      type,
      images: images.map((image) => image.url),
    });

    return createdDiary;
  }

  async patch(
    { data }: { data: string },
    files: Express.Multer.File[],
    diaryId: number,
    user: PayloadToken,
  ) {
    const currentUser = await this.usersService.findUserById(user.id);
    const diary = await this.findById(diaryId);

    if (currentUser.id !== diary.user.id && currentUser.role !== Role.ADMIN) {
      throw new HttpException('Cannot update this diary', HttpStatus.FORBIDDEN);
    }

    if (!diary) {
      throw new HttpException('Diary not found', HttpStatus.NOT_FOUND);
    }

    const images = await this.imageService.uploadImages(files);

    return this.diaryRepository.update(diaryId, {
      data: JSON.parse(data),
      images: images.map((image) => image.url),
    });
  }

  delete(diaryId: number) {
    return this.diaryRepository.delete(diaryId);
  }

  async findAll({
    page,
    pageSize,
    userId: targetUserId,
    currentUser,
    type,
  }: GetAllDiariesDto & {
    currentUser: PayloadToken;
  }) {
    const friends = await this.usersService.getFriends(currentUser);
    if (
      !friends.find((friend) => friend.id === targetUserId) &&
      currentUser.role !== Role.ADMIN &&
      currentUser.id !== targetUserId
    ) {
      throw new HttpException(
        'Cannot view prescriptions of this user',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.diaryRepository.find({
      order: {
        updatedAt: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      ...(targetUserId
        ? { where: { user: { id: targetUserId }, ...(type ? { type } : {}) } }
        : { relations: ['user'] }),
    });
  }

  findById(diaryId: number) {
    return this.diaryRepository.findOne({
      relations: ['user'],
      where: {
        id: diaryId,
      },
    });
  }
}
