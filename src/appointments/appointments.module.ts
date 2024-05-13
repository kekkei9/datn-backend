import { AppointmentEntity } from './entities/appointment.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './services/appointments.service';
import { Module } from '@nestjs/common';
import { AppointmentsController } from './controllers/appointments.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([AppointmentEntity])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, JwtStrategy],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
