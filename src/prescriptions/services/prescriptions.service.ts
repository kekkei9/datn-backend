import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrescriptionEntity } from '../entities/prescription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadToken } from '../../auth/models/token.model';
import {
  CreatePrescriptionDto,
  PatchPrescriptionDto,
} from '../dto/create-prescription.dto';
import { UsersService } from '../../users/services/users.service';
import { Role } from '../../auth/models/roles.model';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(PrescriptionEntity)
    private prescriptionRepository: Repository<PrescriptionEntity>,

    private usersService: UsersService,
  ) {}

  async create(prescription: CreatePrescriptionDto, user: PayloadToken) {
    const { data, belongTo } = prescription;

    const belongToUser = await this.usersService.findUserById(belongTo);

    if (belongToUser.role !== Role.PATIENT) {
      throw new HttpException(
        'Only patients can have prescriptions',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.prescriptionRepository.save({
      data,
      createdBy: {
        id: user.id,
      },
      belongTo: {
        id: belongTo,
      },
    });
  }

  async patch(
    { data }: PatchPrescriptionDto,
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

    return this.prescriptionRepository.update(prescriptionId, {
      data,
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
}
