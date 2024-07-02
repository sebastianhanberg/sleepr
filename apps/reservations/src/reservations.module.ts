import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import {
  AUTH_SERVICE,
  DatabaseModule,
  HealthModule,
  LoggerModule,
  PAYMENTS_SERVICE,
} from '@app/common';
import { ReservationsRepositary } from './reservations.repositary';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservations.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        PAYMENTS_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HealthModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepositary],
})
export class ReservationsModule {}
