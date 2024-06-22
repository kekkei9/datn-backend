import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSpecialtyEntity } from './entities/doctor-specialty.entity';
import { DoctorSpecialtiesController } from './controllers/doctorSpecialties.controller';
import { DoctorSpecialtiesService } from './services/doctorSpecialties.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSpecialtyEntity])],
  controllers: [DoctorSpecialtiesController],
  providers: [DoctorSpecialtiesService],
  exports: [DoctorSpecialtiesService],
})
export class DoctorSpecialtiesModule {}
