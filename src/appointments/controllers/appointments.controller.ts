import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/roles.model';
import { AppointmentsService } from '../services/appointments.service';

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
  getMyAppointments(@Request() req) {
    return this.appointmentsService.getAppointmentsByUser(req.user);
  }

  @ApiBearerAuth('access-token')
  @Post('/accept/:apppointmentRequestId')
  acceptAppointmentRequest(
    @Request() req,
    // @Param('apppointmentRequestId') apppointmentRequestStringId,
  ) {
    return this.appointmentsService.getAppointmentsByUser(req.user);
  }
}
