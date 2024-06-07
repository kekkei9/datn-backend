import { Module } from '@nestjs/common';
import { PrescriptionsController } from './controllers/prescriptions.controller';
import { PrescriptionsService } from './services/prescriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionEntity } from './entities/prescription.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ImageModule } from '../image/image.module';
import { DiagnoseEntity } from './entities/diagnose.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrescriptionEntity, DiagnoseEntity]),
    UsersModule,
    NotificationsModule,
    ImageModule,
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
