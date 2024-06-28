import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('doctor_requests')
export class DoctorRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentDoctorRequest, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_user_id' })
  requestUser: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.confirmedDoctorRequests,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'confirm_user_id' })
  confirmUser: UserEntity;

  @Column('jsonb', { nullable: true })
  metadata: object;

  @Column('int', {
    default: {},
    array: true,
  })
  specialties: number[];

  @Column({
    default: false,
  })
  isDone: boolean;

  @Column({
    nullable: true,
  })
  idCardFront: string;

  @Column({
    nullable: true,
  })
  idCardBack: string;

  @Column('text', {
    default: {},
    array: true,
  })
  images: string[];
}
