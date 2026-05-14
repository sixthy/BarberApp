import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  COMPLETED = 'completed',
}



@Schema({
  timestamps: true,
})

export class Booking {
  @Prop({
    required: true,
    trim: true,
  })
  customerName: string;

  @Prop({
    required: true,
    trim: true,
  })
  customerEmail: string;

  @Prop({
    required: true,
    trim: true,
  })
  customerPhone: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'BarberService' }],
    required: true,
  })
  serviceIds: Types.ObjectId[];

  @Prop({ type: [String], required: true })
  serviceNames: string[];

  @Prop({
    required: true,
    min: 0,
  })
  totalPrice: number;

  @Prop({
    required: true,
    min: 1,
  })
  totalDurationInMinutes: number;

  @Prop({
    required: true,
  })
  date: string;

  @Prop({
    required: true,
  })
  startTime: string;

  @Prop({
    required: true,
  })
  endTime: string;

  @Prop({
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);