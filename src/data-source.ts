import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { UserEntity } from './users/entities/user.entity';
import { FriendRequestEntity } from './users/entities/friend-request.entity';
import { DoctorRequestEntity } from './users/entities/doctor-request.entity';
import { AppointmentEntity } from './appointments/entities/appointment.entity';
import { ConversationEntity } from './chat/models/conversation.entity';
import { MessageEntity } from './chat/models/message.entity';

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
    ConversationEntity,
    MessageEntity,
  ],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  seedTracking: true,
  factories: ['src/database/factories/**/*{.ts,.js}'],
};

export default new DataSource(options);
