import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { BookingService } from '@booking/booking.service';
import { BookingEntity } from '@booking/booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(
    @Body() createBooking: CreateBookingDto,
  ): Promise<BookingEntity> {
    try {
      return await this.bookingService.createBooking(createBooking);
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
    console.log('roomId', roomId);
    console.log('weekStart', weekStart);
    return await this.bookingService.getRoomBookingsForWeek(
      roomId,
      new Date(weekStart),
    );
  }
}
