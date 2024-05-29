import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import SmsService from '../services/sms.service';
import {
  CheckVerificationDto,
  InitVerificationDto,
} from './../dto/check-verification.dto';

@ApiTags('sms')
@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
export default class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('phone-verification')
  initiatePhoneNumberVerification(
    @Body() initVerificationDto: InitVerificationDto,
  ) {
    return this.smsService.initiatePhoneNumberVerification(
      initVerificationDto.phoneNumber,
    );
  }

  @Post('check-verification-code')
  checkVerificationCode(@Body() verificationData: CheckVerificationDto) {
    return this.smsService.confirmPhoneNumber(
      verificationData.pinId,
      verificationData.code,
    );
  }
}
