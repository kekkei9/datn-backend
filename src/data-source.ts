import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { User } from './users/entities/user.entity';
import { FriendRequestEntity } from './users/entities/friend-request.entity';
import { DoctorRequestEntity } from './users/entities/doctor-request.entity';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '12345679',
  database: 'datn-backend',
  port: 5432,
  entities: [User, FriendRequestEntity, DoctorRequestEntity],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  seedTracking: true,
  factories: ['src/database/factories/**/*{.ts,.js}'],
};

export default new DataSource(options);
