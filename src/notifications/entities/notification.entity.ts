import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('notification')
export class NotificationEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: false,
  })
  isRead: boolean;

  @Column()
  message: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}
