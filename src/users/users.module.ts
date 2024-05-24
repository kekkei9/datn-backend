import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ConversationEntity } from '../chat/models/conversation.entity';
import config from '../config';
import { DiaryEntity } from '../diaries/entities/diary.entity';
import { NotificationEntity } from '../notifications/entities/notification.entity';
import { PrescriptionEntity } from '../prescriptions/entities/prescription.entity';
import { UsersController } from './controllers/users.controller';
import { DoctorRequestEntity } from './entities/doctor-request.entity';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/users.service';

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
      ConversationEntity,
      PrescriptionEntity,
      NotificationEntity,
      DiaryEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
