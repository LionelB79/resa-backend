import { Module } from '@nestjs/common';
import { BookingService } from '@booking/booking.service';
import { BookingController } from '@booking/booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '@booking/booking.entity';
import { RoomEntity } from '@room/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, BookingEntity])],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
