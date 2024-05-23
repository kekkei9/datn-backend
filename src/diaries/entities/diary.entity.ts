import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('diary')
export class DiaryEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  data: object;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.createdDiaries)
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.diaries)
  belongTo: UserEntity;
}
