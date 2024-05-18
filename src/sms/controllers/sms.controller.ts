import {
  CheckVerificationDto,
  InitVerificationDto,
} from './../dto/check-verification.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import SmsService from '../services/sms.service';

@ApiTags('sms')
@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
export default class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @ApiBody({
    type: InitVerificationDto,
  })
  @Post('phone-verification')
  initiatePhoneNumberVerification(
    @Body() verificationData: { phoneNumber: string },
  ) {
    return this.smsService.initiatePhoneNumberVerification(
      verificationData.phoneNumber,
    );
  }

  @ApiBody({
    type: CheckVerificationDto,
  })
  @Post('check-verification-code')
  checkVerificationCode(
    @Body() verificationData: { pinId: string; code: string },
  ) {
    return this.smsService.confirmPhoneNumber(
      verificationData.pinId,
      verificationData.code,
    );
  }
}
