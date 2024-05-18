import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../auth/models/roles.model';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { FriendRequestEntity } from './friend-request.entity';
import { DoctorRequestEntity } from './doctor-request.entity';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';
import { MessageEntity } from '../../chat/models/message.entity';
import { ConversationEntity } from '../../chat/models/conversation.entity';

@Entity('users')
export class UserEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ unique: true })
  public phoneNumber: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PATIENT,
  })
  role: Role;

  @OneToMany(
    () => FriendRequestEntity,
    (friendRequestEntity) => friendRequestEntity.creator,
  )
  sentFriendRequests: FriendRequestEntity[];

  @OneToMany(
    () => FriendRequestEntity,
    (friendRequestEntity) => friendRequestEntity.receiver,
  )
  receivedFriendRequests: FriendRequestEntity[];

  @OneToOne(
    () => DoctorRequestEntity,
    (doctorRequestEntity) => doctorRequestEntity.requestUser,
  )
  sentDoctorRequest: DoctorRequestEntity;

  @OneToMany(
    () => DoctorRequestEntity,
    (doctorRequestEntity) => doctorRequestEntity.confirmUser,
  )
  confirmedDoctorRequests: DoctorRequestEntity[];

  @OneToMany(
    () => AppointmentEntity,
    (appointmentEntity) => appointmentEntity.requestUser,
  )
  sentAppointments: AppointmentEntity[];

  @OneToMany(
    () => AppointmentEntity,
    (appointmentEntity) => appointmentEntity.confirmUser,
  )
  confirmedAppointments: AppointmentEntity[];

  @OneToMany(() => MessageEntity, (messageEntity) => messageEntity.user)
  messages: MessageEntity[];

  @ManyToMany(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.users,
  )
  conversations: ConversationEntity[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
