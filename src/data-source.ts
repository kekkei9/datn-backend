import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { User } from './users/entities/user.entity';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '12345679',
  database: 'datn',
  port: 5432,
  entities: [User],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  seedTracking: true,
  factories: ['src/database/factories/**/*{.ts,.js}'],
};

export default new DataSource(options);