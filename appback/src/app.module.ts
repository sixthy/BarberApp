import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { SchedulesModule } from './schedules/schedules.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleBlocksModule } from './schedule-blocks/schedule-blocks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),


    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URI');

        return {
          uri: mongoUri,
        };
      },
    }),


    ServicesModule,


    BookingsModule,


    SchedulesModule,


    BlacklistModule,


    UsersModule,


    AuthModule,


    ScheduleBlocksModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
