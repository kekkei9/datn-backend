import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { DiagnoseEntity } from './diagnose.entity';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';

@Entity('prescriptions')
export class PrescriptionEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  data: string;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.createdPrescriptions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.prescriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'belong_to_id' })
  belongTo: UserEntity;

  @OneToMany(
    () => DiagnoseEntity,
    (diagnoseEntity) => diagnoseEntity.prescription,
  )
  diagnoses: DiagnoseEntity[];

  @OneToOne(
    () => AppointmentEntity,
    (appointmentEntity) => appointmentEntity.prescription,
  )
  @JoinColumn({ name: 'appointment_id' })
  appointment: AppointmentEntity;

  @Column('text', {
    default: {},
    array: true,
    name: 'images',
  })
  images: string[];
}
