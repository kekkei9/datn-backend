import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (userEntity) => userEntity.sentAppointments)
  requestUser: User;

  @ManyToOne(() => User, (userEntity) => userEntity.confirmedAppointments)
  confirmUser: User;

  @Column()
  status: 'pending' | 'ongoing' | 'declined' | 'completed';

  @Column()
  beginTimestamp: number;
}
