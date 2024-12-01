import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('Booking')
export class BookingEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  roomId: ObjectId;

  @Column()
  bookingTitle: string;

  @Column()
  userEmail: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
