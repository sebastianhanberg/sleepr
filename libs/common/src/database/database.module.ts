import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}

// import { Module } from '@nestjs/common';
// import {
//   ConfigModule as NestConfigModule,
//   ConfigService,
// } from '@nestjs/config';
// import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
// import * as Joi from 'joi';

// @Module({
//   imports: [
//     MongooseModule.forRootAsync({
//       imports: [
//         NestConfigModule.forRoot({
//           isGlobal: true,
//           validationSchema: Joi.object({
//             MONGODB_URI: Joi.string().required,
//           }),
//         }),
//       ],
//       useFactory: (configService: ConfigService) => ({
//         uri: configService.get('MONGODB_URI'),
//       }),
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class DatabaseModule {
//   static forFeature(models: ModelDefinition[]) {
//     return MongooseModule.forFeature(models);
//   }
// }
