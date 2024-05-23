import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { DoctorRequestEntity } from './entities/doctor-request.entity';
import { ConversationEntity } from '../chat/models/conversation.entity';
import { JwtModule } from '@nestjs/jwt';
import config from '../config';
import { ConfigType } from '@nestjs/config';
import { PrescriptionEntity } from '../prescriptions/entities/prescription.entity';
import { DiariesModule } from '../diaries/diaries.module';

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
      DiariesModule,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
