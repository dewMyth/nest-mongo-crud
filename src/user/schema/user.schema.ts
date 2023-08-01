/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type } from 'os';

@Schema({ collection: 'users' })
export class User {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ type: {} })
  address: object;

  @Prop()
  phone: string;

  @Prop()
  website: string;

  @Prop({ type: {} })
  company: object;
}
export const UserSchema = SchemaFactory.createForClass(User);
