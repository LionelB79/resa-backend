import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '@booking/booking.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
  ) {}

  async createBooking(
    bookingTitle: string,
    userEmail: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<BookingEntity> {
    const booking = this.bookingRepository.create({
      roomId: roomId,
      bookingTitle: bookingTitle,
      userEmail: userEmail,
      startTime,
      endTime,
    });

    return await this.bookingRepository.save(booking);
  }
}
