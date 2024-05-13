import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentAppointments)
  requestUser: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.confirmedAppointments)
  confirmUser: UserEntity;

  @Column()
  status: 'pending' | 'ongoing' | 'declined' | 'completed';

  @Column()
  beginTimestamp: number;
}
