import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadToken } from '../../auth/models/token.model';
import { ReportEntity } from '../entities/report.entity';
import { CreateReportDto } from '../dto/create-report.dto';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';

export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
  ) {}

  create({ reason, userId }: CreateReportDto, createdBy?: PayloadToken) {
    return this.reportRepository.save({
      reason,
      belongTo: { id: userId },
      createdBy,
    });
  }

  getUserReports(userId: number) {
    return this.reportRepository.find({
      where: { belongTo: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  getAllReports({ page, pageSize }: DefaultPaginationDto) {
    return this.reportRepository.find({
      relations: ['belongTo', 'createdBy'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}
