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
import { CreateDiaryDto, PatchDiaryDto } from '../dto/create-diary.dto';
import { DiariesService } from '../services/diaries.service';

@ApiTags('diaries')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get()
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  getAll() {
    return this.diariesService.findAll();
  }

  @Delete('/:diaryId')
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  deleteADiary(@Param('diaryId') diaryStringId: string) {
    return this.diariesService.delete(Number(diaryStringId));
  }

  @Get('/my-diaries')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  getMyDiaries(@Request() req) {
    return this.diariesService.getMyDiaries(req.user);
  }

  @Get('/user-diaries/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  getUserMyDiaries(@Request() req, @Param('userId') userStringId: string) {
    return this.diariesService.getUserDiaries(req.user, Number(userStringId));
  }

  @Post()
  @ApiBody({ type: CreateDiaryDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  createADiary(@Request() req, @Body() body) {
    return this.diariesService.create(body, req.user);
  }

  @Patch('/:diaryId')
  @ApiBody({ type: PatchDiaryDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  patchDiary(
    @Request() req,
    @Body() body,
    @Param('diaryId') diaryStringId: string,
  ) {
    return this.diariesService.patch(body, Number(diaryStringId), req.user);
  }
}
