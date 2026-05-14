import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';
import {
  BlacklistEntry,
  BlacklistSchema,
} from './schemas/blacklist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlacklistEntry.name,
        schema: BlacklistSchema,
      },
    ]),
  ],
  controllers: [BlacklistController],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule { }