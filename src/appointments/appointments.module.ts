import { AppointmentEntity } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './services/appointments.service';
import { Module } from '@nestjs/common';
import { AppointmentsController } from './controllers/appointments.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { NotificationsModule } from '../notifications/notifications.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    ReportsModule,
    TypeOrmModule.forFeature([AppointmentEntity]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, JwtStrategy],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
