import { Body, Controller, Post } from '@nestjs/common';
import { BookingService } from '@booking/booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(
    @Body()
    body: {
      bookingTitle: string;
      userEmail: string;
      roomId: string;
      startTime: string;
      endTime: string;
    },
  ) {
    const { bookingTitle, userEmail, roomId, startTime, endTime } = body;

    return await this.bookingService.createBooking(
      bookingTitle,
      userEmail,
      roomId,
      new Date(startTime),
      new Date(endTime),
    );
  }
}
