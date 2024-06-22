import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import config from '../config';
import { DiaryEntity } from '../diaries/entities/diary.entity';
import { NotificationEntity } from '../notifications/entities/notification.entity';
import { PrescriptionEntity } from '../prescriptions/entities/prescription.entity';
import { UsersController } from './controllers/users.controller';
import { DoctorRequestEntity } from './entities/doctor-request.entity';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { SmsModule } from '../sms/sms.module';
import { ReportEntity } from '../reports/entities/report.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { ImageModule } from '../image/image.module';
import { DoctorSpecialtyEntity } from '../doctorSpecialties/entities/doctor-specialty.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwt.jwtSecret,
          signOptions: {
            expiresIn: configService.jwt.accessTokenExpiration,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      FriendRequestEntity,
      DoctorRequestEntity,
      PrescriptionEntity,
      NotificationEntity,
      DiaryEntity,
      ReportEntity,
      DoctorSpecialtyEntity,
    ]),
    SmsModule,
    NotificationsModule,
    ImageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
