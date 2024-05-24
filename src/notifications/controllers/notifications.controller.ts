import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { NotificationsService } from './../services/notifications.service';

@ApiTags('notifications') // put the name of the controller in swagger
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routes as private by default
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
}
