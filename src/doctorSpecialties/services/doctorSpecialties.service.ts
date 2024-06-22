import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';
import { CreateDoctorSpecialtyDto } from '../dto/create-doctor-specialty.dto';
import { DoctorSpecialtyEntity } from '../entities/doctor-specialty.entity';

@Injectable()
export class DoctorSpecialtiesService {
  constructor(
    @InjectRepository(DoctorSpecialtyEntity)
    private doctorSpecialtyRepository: Repository<DoctorSpecialtyEntity>,
  ) {}

  create({ label }: CreateDoctorSpecialtyDto) {
    return this.doctorSpecialtyRepository.save({
      label,
    });
  }

  async patch({ label }: CreateDoctorSpecialtyDto, doctorSpecialtyId: number) {
    return this.doctorSpecialtyRepository.update(doctorSpecialtyId, {
      label,
    });
  }

  delete(doctorSpecialtyId: number) {
    return this.doctorSpecialtyRepository.delete(doctorSpecialtyId);
  }

  findAll({ page, pageSize }: DefaultPaginationDto) {
    return this.doctorSpecialtyRepository.find({
      order: {
        updatedAt: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  findById(doctorSpecialtyId: number) {
    return this.doctorSpecialtyRepository.findOne({
      where: {
        id: doctorSpecialtyId,
      },
    });
  }
}
