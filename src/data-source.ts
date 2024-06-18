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
import { DiagnoseEntity } from './prescriptions/entities/diagnose.entity';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '12345679',
  database: 'datn-backend',
  // url: 'postgres://datn_be_user:sBmqW17UKMtkJFzgZ63cyWUzQpzSZK3T@dpg-cpogs5uehbks73ej1plg-a.oregon-postgres.render.com/datn_be_kb2j',
  // host: 'dpg-cpogs5uehbks73ej1plg-a.oregon-postgres.render.com',
  // username: 'datn_be_user',
  // password: 'sBmqW17UKMtkJFzgZ63cyWUzQpzSZK3T',
  // database: 'datn_be_kb2j',
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
    DiagnoseEntity,
  ],
  // ssl: true,
  // ssl: { rejectUnauthorized: false },
  // connectTimeoutMS: 0,
  seedTracking: true,
  factories: ['src/database/factories/**/*{.ts,.js}'],
  migrations: ['db/migrations/*{.ts,.js}'],
  seeds: [MainSeeder],
};

export default new DataSource(options);
