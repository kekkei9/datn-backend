import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('request')
export class DoctorRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (userEntity) => userEntity.sentDoctorRequest)
  requestUser: User;

  @ManyToOne(() => User, (userEntity) => userEntity.confirmedDoctorRequests)
  confirmUser: User;

  @Column('jsonb', { nullable: true })
  metadata: object;
}
