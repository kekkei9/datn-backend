import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (userEntity) => userEntity.sentDoctorRequest)
  requestUser: User;

  @ManyToOne(() => User, (userEntity) => userEntity.confirmedDoctorRequests)
  confirmUser: User;

  @Column()
  status: 'pending' | 'ongoing' | 'declined' | 'completed';

  @Column()
  beginTimestamp: number;
}
