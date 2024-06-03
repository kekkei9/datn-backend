import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'users_id',
  })
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (messageEntity) => messageEntity.conversation)
  messages: MessageEntity[];

  @UpdateDateColumn({
    name: 'last_updated',
  })
  lastUpdated: Date;
}
