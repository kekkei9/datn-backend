import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { DefaultEntity } from '../../utils/entities/default.entity';

@Entity('report')
export class ReportEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason: string;

  @ManyToOne(() => UserEntity, (user) => user.createdReports)
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.reports)
  belongTo: UserEntity;
}
