import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../users/entities/user.entity';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';
import { CreateDoctorSpecialtyDto } from '../dto/create-doctor-specialty.dto';
import { DoctorSpecialtiesService } from '../services/doctorSpecialties.service';

@ApiTags('doctor-specialties')
@Controller('doctor-specialties')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class DoctorSpecialtiesController {
  constructor(
    private readonly doctorSpecialtiesService: DoctorSpecialtiesService,
  ) {}

  @Get()
  @ApiBearerAuth('access-token')
  @Public()
  findAll(@Query() query: DefaultPaginationDto) {
    return this.doctorSpecialtiesService.findAll({ ...query });
  }

  @Delete('/:doctorSpecialtyId')
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  deleteDoctorSpecialty(
    @Param('doctorSpecialtyId') doctorSpecialtyStringId: string,
  ) {
    return this.doctorSpecialtiesService.delete(
      Number(doctorSpecialtyStringId),
    );
  }

  @Post()
  @ApiBearerAuth('access-token')
  createDoctorSpecialty(@Body() body: CreateDoctorSpecialtyDto) {
    return this.doctorSpecialtiesService.create(body);
  }

  @Patch('/:doctorSpecialtyId')
  @ApiBearerAuth('access-token')
  @Roles(Role.DOCTOR, Role.ADMIN)
  patchDiary(
    @Body() body,
    @Param('doctorSpecialtyId') doctorSpecialtyStringId: string,
  ) {
    return this.doctorSpecialtiesService.patch(
      body,
      Number(doctorSpecialtyStringId),
    );
  }
}
