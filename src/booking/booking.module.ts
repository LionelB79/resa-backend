import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '@booking/booking.entity';
import { RoomEntity } from '@room/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, BookingEntity])],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
