import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BarberServiceDocument = HydratedDocument<BarberService>;

@Schema({
  timestamps: true,
})
export class BarberService {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    required: true,
    min: 1,
  })
  durationInMinutes: number;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    required: false,
    default: '',
  })
  imageUrl: string;
}

export const BarberServiceSchema = SchemaFactory.createForClass(BarberService);