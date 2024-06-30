import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ReportsService } from '../services/reports.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateReportDto } from '../dto/create-report.dto';
import { Role } from '../../users/entities/user.entity';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';

@ApiTags('reports') // put the name of the controller in swagger
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routes as private by default
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  getAllReports(@Query() query: DefaultPaginationDto) {
    return this.reportsService.getAllReports(query);
  }

  @Get('/:userId')
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  getUserReports(@Param('userId') userStringId: string) {
    return this.reportsService.getUserReports(Number(userStringId));
  }

  @Post()
  @ApiBearerAuth('access-token')
  createReport(@Request() req, @Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto, req.user);
  }
}
