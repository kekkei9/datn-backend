import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../auth/models/roles.model';
import { PayloadToken } from '../../auth/models/token.model';
import { ImageService } from '../../image/services/image.service';
import { NotificationType } from '../../notifications/entities/notification.entity';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { UsersService } from '../../users/services/users.service';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';
import { PrescriptionEntity } from '../entities/prescription.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(PrescriptionEntity)
    private prescriptionRepository: Repository<PrescriptionEntity>,

    private usersService: UsersService,

    private notificationsService: NotificationsService,

    private imageService: ImageService,
  ) {}

  async create(
    prescription: CreatePrescriptionDto,
    files: Express.Multer.File[],
    user: PayloadToken,
  ) {
    const { data, belongTo } = prescription;

    const belongToUser = await this.usersService.findUserById(belongTo);

    if (belongToUser.role !== Role.PATIENT) {
      throw new HttpException(
        'Only patients can have prescriptions',
        HttpStatus.FORBIDDEN,
      );
    }

    const images = await this.imageService.uploadImages(files);

    const createdPrescription = await this.prescriptionRepository.save({
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
      referenceId: createdPrescription.id,
      type: NotificationType.PRESCRIPTION,
    });

    return createdPrescription;
  }

  async patch(
    { data }: { data: object },
    files: Express.Multer.File[],
    prescriptionId: number,
    user: PayloadToken,
  ) {
    const currentUser = await this.usersService.findUserById(user.id);
    const prescription = await this.findById(prescriptionId);

    if (
      currentUser.id !== prescription.createdBy.id &&
      currentUser.role !== Role.ADMIN
    ) {
      throw new HttpException(
        'Cannot update this prescription',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!prescription) {
      throw new HttpException('Prescription not found', HttpStatus.NOT_FOUND);
    }
    const images = await this.imageService.uploadImages(files);

    return this.prescriptionRepository.update(prescriptionId, {
      data,
      imagePaths: images.map((image) => image.imagePath),
    });
  }

  delete(prescriptionId: number) {
    return this.prescriptionRepository.delete(prescriptionId);
  }

  findAll() {
    return this.prescriptionRepository.find({
      relations: ['createdBy', 'belongTo'],
    });
  }

  findById(prescriptionId: number) {
    return this.prescriptionRepository.findOne({
      relations: ['createdBy', 'belongTo'],
      where: {
        id: prescriptionId,
      },
    });
  }

  getMyPrescriptions(user: PayloadToken) {
    return this.prescriptionRepository.find({
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

  async getUserPrescriptions(currentUser: PayloadToken, targetUserId: number) {
    const friends = await this.usersService.getFriends(currentUser);

    if (
      !friends.find((friend) => friend.id === targetUserId) &&
      currentUser.role !== Role.ADMIN
    ) {
      throw new HttpException(
        'Cannot view prescriptions of this user',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.prescriptionRepository.find({
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
