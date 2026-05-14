import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({
    required: true,
  })
  password!: string;

  @Prop({
    required: true,
    trim: true,
  })
  phone!: string;

  @Prop({
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);