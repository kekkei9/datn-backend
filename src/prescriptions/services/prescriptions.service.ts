import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadToken } from '../../auth/models/token.model';
import { ImageService } from '../../image/services/image.service';
import { NotificationType } from '../../notifications/entities/notification.entity';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { Role } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { CreateDiagnoseDto } from '../dto/create-diagnose.dto';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';
import { GetAllDiagnoses } from '../dto/get-diagnoses.dto';
import { GetAllPrescriptionDto } from '../dto/get-prescription.dto';
import { DiagnoseEntity } from '../entities/diagnose.entity';
import { PrescriptionEntity } from '../entities/prescription.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(PrescriptionEntity)
    private prescriptionRepository: Repository<PrescriptionEntity>,

    @InjectRepository(DiagnoseEntity)
    private diagnoseRepository: Repository<DiagnoseEntity>,

    private usersService: UsersService,

    private notificationsService: NotificationsService,

    private imageService: ImageService,
  ) {}

  async create(
    { data, belongTo }: CreatePrescriptionDto,
    files: Express.Multer.File[],
    user: PayloadToken,
  ) {
    const belongToId = Number(belongTo);

    const belongToUser = await this.usersService.findUserById(belongToId);

    if (belongToUser.role !== Role.PATIENT) {
      throw new HttpException(
        'Only patients can have prescriptions',
        HttpStatus.FORBIDDEN,
      );
    }

    const images = await this.imageService.uploadImages(files);

    const createdPrescription = await this.prescriptionRepository.save({
      data: JSON.parse(data),
      createdBy: {
        id: user.id,
      },
      belongTo: {
        id: belongToId,
      },
      images: images.map((image) => image.url),
    });

    this.notificationsService.create({
      belongTo: {
        id: belongToId,
      },
      createdBy: {
        id: user.id,
      },
      message:
        user.id === belongToId
          ? 'You have created a prescription'
          : 'A prescription has been created for you',
      referenceId: createdPrescription.id,
      type: NotificationType.PRESCRIPTION,
    });

    return createdPrescription;
  }

  async patch(
    { data }: { data: string },
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
      data: JSON.parse(data),
      images: images.map((image) => image.url),
    });
  }

  delete(prescriptionId: number) {
    return this.prescriptionRepository.delete(prescriptionId);
  }

  async findAll({
    page,
    pageSize,
    userId: targetUserId,
    currentUser,
  }: GetAllPrescriptionDto & {
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

    return await this.prescriptionRepository.find({
      order: {
        updatedAt: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      ...(targetUserId
        ? {
            where: {
              belongTo: { id: targetUserId },
            },
            relations: ['createdBy'],
          }
        : { relations: ['createdBy', 'belongTo'] }),
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

  async findAllDiagnoses({
    page,
    pageSize,
    userId: targetUserId,
    currentUser,
  }: GetAllDiagnoses & {
    currentUser: PayloadToken;
  }) {
    const friends = await this.usersService.getFriends(currentUser);

    if (
      !friends.find((friend) => friend.id === targetUserId) &&
      currentUser.role !== Role.ADMIN &&
      currentUser.id !== targetUserId
    ) {
      throw new HttpException(
        'Cannot view diagnoses of this user',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.diagnoseRepository.find({
      ...(targetUserId
        ? {
            where: {
              prescription: {
                belongTo: {
                  id: targetUserId,
                },
              },
            },
          }
        : {}),
      order: {
        updatedAt: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async addDiagnoseToPrescription(
    createDiagnoseDto: CreateDiagnoseDto,
    files: Express.Multer.File[],
    prescriptionId: number,
    user: PayloadToken,
  ) {
    const prescription = await this.findById(prescriptionId);

    if (user.id !== prescription.createdBy.id && user.role !== Role.ADMIN) {
      throw new HttpException(
        'Cannot add diagnose to this prescription',
        HttpStatus.FORBIDDEN,
      );
    }

    const images = await this.imageService.uploadImages(files);

    return this.diagnoseRepository.save({
      ...createDiagnoseDto,
      prescription: {
        id: prescriptionId,
      },
      images: images.map((image) => image.url),
    });
  }

  async patchDiagnoseOfPrescription(
    createDiagnoseDto: CreateDiagnoseDto,
    files: Express.Multer.File[],
    prescriptionId: number,
    diagnoseId: number,
    user: PayloadToken,
  ) {
    const currentUser = await this.usersService.findUserById(user.id);
    const diagnose = await this.diagnoseRepository.findOne({
      where: {
        id: diagnoseId,
        prescription: {
          id: prescriptionId,
        },
      },
      relations: ['prescription'],
    });

    if (
      currentUser.id !== diagnose.prescription.createdBy.id &&
      currentUser.role !== Role.ADMIN
    ) {
      throw new HttpException(
        'Cannot update this diagnose',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!diagnose) {
      throw new HttpException('Diagnose not found', HttpStatus.NOT_FOUND);
    }

    const images = await this.imageService.uploadImages(files);

    return this.diagnoseRepository.update(diagnoseId, {
      ...createDiagnoseDto,
      images: images.map((image) => image.url),
    });
  }

  async getDiagnosesOfPrescription(prescriptionId: number) {
    return this.diagnoseRepository.find({
      where: {
        prescription: {
          id: prescriptionId,
        },
      },
    });
  }
}
