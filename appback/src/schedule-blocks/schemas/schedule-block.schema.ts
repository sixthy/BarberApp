import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScheduleBlockDocument = HydratedDocument<ScheduleBlock>;

@Schema({
  timestamps: true,
})
export class ScheduleBlock {
  @Prop({
    required: true,
  })
  date: string;

  @Prop({
    required: true,
    enum: ['day', 'time'],
  })
  type: string;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;

  @Prop({
    required: true,
  })
  reason: string;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const ScheduleBlockSchema =
  SchemaFactory.createForClass(ScheduleBlock);