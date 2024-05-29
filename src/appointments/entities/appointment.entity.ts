import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

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

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentAppointments)
  requestUser: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.confirmedAppointments)
  confirmUser: UserEntity;

  @Column({
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @Column()
  beginTimestamp: number;
}
