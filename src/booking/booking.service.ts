import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '@booking/booking.entity';
import { Repository } from 'typeorm';
import { RoomEntity } from '@app/room/room.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}
  //TODO gestion d'erreur si le creneau existe dejà
  async createBooking(
    bookingTitle: string,
    userEmail: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<BookingEntity> {
    //TODO l'erreur Salle non trouvée est levée alors que la salle existe, à corriger
    console.log(roomId);
    // const room = await this.roomRepository.findOne({
    //   where: { id: new ObjectId(roomId) },
    // });
    // if (!room) throw new NotFoundException('Salle non trouvée');

    //TODO fonctionnel pour des crenaux correspondants mais le chevauchement des crenaux devra être géré
    //On vérifier si le créneau est déjà réservé
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        roomId,
        userEmail,
        startTime,
        endTime,
      },
    });

    if (existingBooking) {
      throw new BadRequestException('Ce créneau est déjà réservé');
    }

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
