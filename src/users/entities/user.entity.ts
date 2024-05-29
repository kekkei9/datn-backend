import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import { Role } from '../../auth/models/roles.model';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { FriendRequestEntity } from './friend-request.entity';
import { DoctorRequestEntity } from './doctor-request.entity';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';
import { MessageEntity } from '../../chat/models/message.entity';
import { ConversationEntity } from '../../chat/models/conversation.entity';
import { PrescriptionEntity } from '../../prescriptions/entities/prescription.entity';
import { DiaryEntity } from '../../diaries/entities/diary.entity';
import { NotificationEntity } from '../../notifications/entities/notification.entity';
import { ReportEntity } from '../../reports/entities/report.entity';

@Entity('users')
export class UserEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
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

  @OneToMany(
    () => PrescriptionEntity,
    (prescriptionEntity) => prescriptionEntity.createdBy,
  )
  createdPrescriptions: PrescriptionEntity[];

  @OneToMany(
    () => PrescriptionEntity,
    (prescriptionEntity) => prescriptionEntity.belongTo,
  )
  prescriptions: PrescriptionEntity[];

  @OneToMany(
    () => DiaryEntity,
    (prescriptionEntity) => prescriptionEntity.createdBy,
  )
  createdDiaries: DiaryEntity[];

  @OneToMany(
    () => DiaryEntity,
    (prescriptionEntity) => prescriptionEntity.belongTo,
  )
  diaries: DiaryEntity[];

  @OneToMany(
    () => NotificationEntity,
    (notificationEntity) => notificationEntity.belongTo,
  )
  createdNotifications: NotificationEntity[];

  @OneToMany(
    () => NotificationEntity,
    (notificationEntity) => notificationEntity.belongTo,
  )
  notifications: NotificationEntity[];

  @OneToMany(
    () => ReportEntity,
    (notificationEntity) => notificationEntity.belongTo,
  )
  createdReports: ReportEntity[];

  @OneToMany(
    () => ReportEntity,
    (notificationEntity) => notificationEntity.belongTo,
  )
  reports: ReportEntity[];

  @VirtualColumn({
    type: 'int',
    query: (entity) =>
      `SELECT SUM(balance) FROM account WHERE ownerId = ${entity}.id AND deleted_at IS NULL`,
  })
  reportsCount: number;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
