import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { ReportEntity } from './entities/report.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity, UserEntity])],
  controllers: [ReportsController],
  providers: [ReportsService, JwtStrategy],
  exports: [ReportsService],
})
export class ReportsModule {}
