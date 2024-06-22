import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';

@Entity('doctor_specialties')
export class DoctorSpecialtyEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;
}
