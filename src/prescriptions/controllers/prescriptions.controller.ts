import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../auth/models/roles.model';
import {
  CreatePrescriptionDto,
  PatchPrescriptionDto,
} from '../dto/create-prescription.dto';
import { PrescriptionsService } from '../services/prescriptions.service';

@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  getAll() {
    return this.prescriptionsService.findAll();
  }

  @Delete('/:prescriptionId')
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  deleteAPrescription(@Param('prescriptionId') prescriptionStringId: string) {
    return this.prescriptionsService.delete(Number(prescriptionStringId));
  }

  @Get('/my-prescriptions')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  getMyPrescriptions(@Request() req) {
    return this.prescriptionsService.getMyPrescriptions(req.user);
  }

  @Get('/user-prescriptions/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  getUserMyPrescriptions(
    @Request() req,
    @Param('userId') userStringId: string,
  ) {
    return this.prescriptionsService.getUserPrescriptions(
      req.user,
      Number(userStringId),
    );
  }

  @Post()
  @ApiBody({ type: CreatePrescriptionDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  createAPrescription(@Request() req, @Body() body) {
    return this.prescriptionsService.create(body, req.user);
  }

  @Patch('/:prescriptionId')
  @ApiBody({ type: PatchPrescriptionDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  patchPrescription(
    @Request() req,
    @Body() body,
    @Param('prescriptionId') prescriptionStringId: string,
  ) {
    return this.prescriptionsService.patch(
      body,
      Number(prescriptionStringId),
      req.user,
    );
  }
}
