import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { BookingService } from '@booking/booking.service';
import { BookingEntity } from '@booking/booking.entity';

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
    try {
      return await this.bookingService.createBooking(
        bookingTitle,
        userEmail,
        roomId,
        new Date(startTime),
        new Date(endTime),
      );
    } catch (error) {
      console.error('Erreur lors de la création de la réservation :', error);
      throw new Error('Erreur lors de la réservation');
    }
  }

  @Get('room/:roomId/week')
  async getRoomBookingsForWeek(
    @Param('roomId') roomId: string,
    @Query('weekStart') weekStart: string,
  ) {
    return await this.bookingService.getRoomBookingsForWeek(
      roomId,
      new Date(weekStart),
    );
  }
}
