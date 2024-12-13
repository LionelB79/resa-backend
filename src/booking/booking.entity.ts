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
  //TODO a corriger : createdAt et updatedAt décalés d'une heure en bdd
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
