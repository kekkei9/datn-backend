import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('active_conversation')
export class ActiveConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'socket_id',
  })
  socketId: string;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'conversation_id',
  })
  conversationId: number;
}
