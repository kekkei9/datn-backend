import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import config from './config';
import { DiariesModule } from './diaries/diaries.module';
import { DrugsModule } from './drugs/drugs.module';
import { enviroments } from './environments';
import { ImageModule } from './image/image.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { ReportsModule } from './reports/reports.module';
import { SmsModule } from './sms/sms.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
        INFOBIP_BASE_URL: Joi.string().required(),
        INFOBIP_API_KEY: Joi.string().required(),
        INFOBIP_MESSAGE_ID: Joi.string().required(),
        INFOBIP_APPLICATION_ID: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true, //when true, stops validation on the first error, otherwise returns all the errors found. Defaults to true.
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          type: 'postgres',
          host: configService.postgres.host,
          port: configService.postgres.port,
          database: configService.postgres.name,
          username: configService.postgres.user,
          password: configService.postgres.password,
          autoLoadEntities: true,
          keepConnectionAlive: true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    AppointmentsModule,
    ChatModule,
    SmsModule,
    DrugsModule,
    PrescriptionsModule,
    DiariesModule,
    NotificationsModule,
    ReportsModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
