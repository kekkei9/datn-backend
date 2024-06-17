import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { PrescriptionEntity } from '../../prescriptions/entities/prescription.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  DECLINED = 'declined',
  COMPLETED = 'completed',
}

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentAppointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_user_id' })
  requestUser: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.confirmedAppointments,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'confirm_user_id' })
  confirmUser: UserEntity;

  @Column({
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @Column({
    name: 'begin_timestamp',
  })
  beginTimestamp: number;

  @OneToOne(
    () => PrescriptionEntity,
    (prescriptionEntity) => prescriptionEntity.appointment,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'prescription_id' })
  prescription: PrescriptionEntity;
}
