import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('doctor_request')
export class DoctorRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.sentDoctorRequest, {
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
}
