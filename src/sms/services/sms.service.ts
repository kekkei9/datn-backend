import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class SmsService {
  constructor(
    private readonly configService: ConfigService,

    private jwtService: JwtService,

    private httpService: HttpService,
  ) {}

  async initiatePhoneNumberVerification(phoneNumber: string) {
    const sendResult = await this.httpService.axiosRef.post(
      this.configService.get('INFOBIP_BASE_URL') + '/2fa/2/pin',
      {
        applicationId: this.configService.get('INFOBIP_APPLICATION_ID'),
        messageId: this.configService.get('INFOBIP_MESSAGE_ID'),
        from: 'DATN',
        to: phoneNumber,
      },
      {
        headers: {
          Authorization: `App ${this.configService.get('INFOBIP_API_KEY')}`,
        },
      },
    );
    return sendResult.data;
  }

  async confirmPhoneNumber(pinId: string, verificationCode: string) {
    const result = await this.httpService.axiosRef.post<{
      pinId: string;
      msisdn: string;
      verified: boolean;
      attemptsRemaining: number;
    }>(
      `${this.configService.get('INFOBIP_BASE_URL')}/2fa/2/pin/${pinId}/verify`,
      {
        pin: verificationCode,
      },
      {
        headers: {
          Authorization: `App ${this.configService.get('INFOBIP_API_KEY')}`,
        },
      },
    );
    if (!result.data.verified) {
      throw new BadRequestException('Wrong code provided');
    }

    // generate a JWT token and return it
    return {
      token: this.jwtService.sign({ phoneNumber: result.data.msisdn }),
    };
  }
}
