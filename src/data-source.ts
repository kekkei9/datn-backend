import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { UserEntity } from './users/entities/user.entity';
import { FriendRequestEntity } from './users/entities/friend-request.entity';
import { DoctorRequestEntity } from './users/entities/doctor-request.entity';
import { AppointmentEntity } from './appointments/entities/appointment.entity';
import { PrescriptionEntity } from './prescriptions/entities/prescription.entity';
import { DiaryEntity } from './diaries/entities/diary.entity';
import { NotificationEntity } from './notifications/entities/notification.entity';
import { ReportEntity } from './reports/entities/report.entity';
import { MainSeeder } from './database/seeds/main.seeder';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '12345679',
  database: 'datn-backend',
  port: 5432,
  entities: [
    UserEntity,
    FriendRequestEntity,
    DoctorRequestEntity,
    AppointmentEntity,
    PrescriptionEntity,
    DiaryEntity,
    NotificationEntity,
    ReportEntity,
  ],
  seedTracking: true,
  factories: ['src/database/factories/**/*{.ts,.js}'],
  seeds: [MainSeeder],
};

export default new DataSource(options);
