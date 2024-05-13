import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('doctor-request')
export class DoctorRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.sentDoctorRequest)
  requestUser: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.confirmedDoctorRequests,
  )
  confirmUser: UserEntity;

  @Column('jsonb', { nullable: true })
  metadata: object;
}
