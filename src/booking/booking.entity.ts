import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Booking')
export class BookingEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  _roomId: ObjectId;

  @Column()
  bookingTitle: string;

  @Column()
  userEmail: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
