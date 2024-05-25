import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { NotificationsService } from './../services/notifications.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';

@ApiTags('notifications') // put the name of the controller in swagger
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routes as private by default
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  getAllNotifications() {
    return this.notificationsService.getAllNotifications();
  }

  @Get('/my')
  @ApiBearerAuth('access-token')
  getUserNotifications(@Request() req) {
    return this.notificationsService.getUserNotifications(req.user);
  }

  @Post('/:notificationId/mark-as-read')
  @ApiBearerAuth('access-token')
  markNotificationAsRead(
    @Param('notificationId') notificationStringId: string,
  ) {
    return this.notificationsService.markNotificationAsRead(
      Number(notificationStringId),
    );
  }
}