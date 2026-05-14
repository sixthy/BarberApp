import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BarberServiceSchema } from './schemas/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([

      {
        name: 'BarberService',
        schema: BarberServiceSchema,
      },

    ]),
  ],

  controllers: [ServicesController],
  providers: [ServicesService]
})

export class ServicesModule { }
