import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlacklistDocument = HydratedDocument<BlacklistEntry>;

@Schema({
  timestamps: true,
})
export class BlacklistEntry {
  @Prop({
    required: true,
    trim: true,
  })
  customerName: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  })
  customerEmail: string;

  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  customerPhone: string;

  @Prop({
    default: 0,
  })
  noShowCount: number;

  @Prop({
    default: false,
  })
  isBlocked: boolean;

  @Prop({
    default: null,
  })
  blockedUntil?: Date;

  @Prop({
    default: null,
  })
  lastNoShowAt?: Date;

  @Prop({
    default: '',
  })
  reason: string;
}

export const BlacklistSchema = SchemaFactory.createForClass(BlacklistEntry);