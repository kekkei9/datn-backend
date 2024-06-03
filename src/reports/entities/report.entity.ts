import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { DefaultEntity } from '../../utils/entities/default.entity';

@Entity('report')
export class ReportEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason: string;

  @ManyToOne(() => UserEntity, (user) => user.createdReports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.reports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'belong_to_id' })
  belongTo: UserEntity;
}
