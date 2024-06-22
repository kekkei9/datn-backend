import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';
import { DiaryEntity } from '../../diaries/entities/diary.entity';
import { NotificationEntity } from '../../notifications/entities/notification.entity';
import { PrescriptionEntity } from '../../prescriptions/entities/prescription.entity';
import { ReportEntity } from '../../reports/entities/report.entity';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { DoctorRequestEntity } from './doctor-request.entity';
import { FriendRequestEntity } from './friend-request.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Role {
  ADMIN = 'admin',
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

@Entity('users')
export class UserEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ unique: true, name: 'phone_number' })
  public phoneNumber: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, default: false })
  deactivated: boolean;

  @Column({ select: false, nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: true,
    enum: Gender,
  })
  gender: Gender;

  @Column({
    nullable: true,
  })
  birthdate: Date;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  height: number;

  @Column({
    nullable: true,
  })
  weight: number;

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

  @Column('jsonb', {
    select: false,
    nullable: true,
  })
  metadata: object;

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

  @OneToMany(() => DiaryEntity, (diaryEntity) => diaryEntity.user)
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

  @ManyToMany(() => DoctorRequestEntity, {
    cascade: true,
  })
  @JoinTable()
  specialties: DoctorRequestEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
