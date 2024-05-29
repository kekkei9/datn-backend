import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { IsEnum } from 'class-validator';

export enum NotificationType {
  PRESCRIPTION = 'prescription',
  APPOINTMENT = 'appointment',
  FRIEND = 'add_friend',
  DIARY = 'diary',
}

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

  @Column({
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ManyToOne(() => UserEntity, (user) => user.createdNotifications)
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  belongTo: UserEntity;
}
