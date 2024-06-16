import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  CreateAppointmentRequestDto,
  ResponseAppointmentRequestDto,
} from '../dto/create-appointment.dto';
import { AppointmentsService } from '../services/appointments.service';
import { Role } from '../../users/entities/user.entity';

@ApiTags('appointments') // put the name of the controller in swagger
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routs as private by default
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Get('/')
  getAppointmentRequests() {
    return this.appointmentsService.getAppointmentRequests();
  }

  @ApiBearerAuth('access-token')
  @Get('/me/received-requests')
  getMyAppointmentRequests(@Request() req) {
    return this.appointmentsService.getAppointmentRequestsByUser(req.user);
  }

  @ApiBearerAuth('access-token')
  @Get('/me')
  getMyIncomingAppointments(@Request() req) {
    return this.appointmentsService.getIncomingAppointmentsByUser(req.user);
  }

  @ApiBearerAuth('access-token')
  @Get('/history/:userId')
  getUserAppointmentHistory(@Param('userId') userIdString: string) {
    return this.appointmentsService.getAppointmentHistoryByUser(
      parseInt(userIdString),
    );
  }

  @ApiBearerAuth('access-token')
  @Post('/send/:userId')
  sendAppointmentRequest(
    @Request() req,
    @Param('userId') userIdString: string,
    @Body() createAppointmentRequestDto: CreateAppointmentRequestDto,
  ) {
    return this.appointmentsService.sendAppointmentRequest(
      req.user,
      parseInt(userIdString),
      createAppointmentRequestDto,
    );
  }

  @ApiBearerAuth('access-token')
  @Patch('/response/:apppointmentId')
  updateAppointmentRequest(
    @Request() req,
    @Param('apppointmentId') apppointmentStringId: string,
    @Body() responseAppointmentRequestDto: ResponseAppointmentRequestDto,
  ) {
    return this.appointmentsService.updateAppointmentRequestById(
      req.user,
      parseInt(apppointmentStringId),
      responseAppointmentRequestDto,
    );
  }
}
