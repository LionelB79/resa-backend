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

  async createBooking(
    bookingTitle: string,
    userEmail: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<BookingEntity> {
    console.log(roomId);

    //On vérifier si la salle existe
    const room = await this.roomRepository.findOne({
      where: { id: new ObjectId(roomId) },
    });
    if (!room) throw new NotFoundException('Salle non trouvée');

    //TODO fonctionnel pour des crenaux correspondants mais le chevauchement des crenaux devra être géré
    //On vérifier si le créneau est déjà réservé
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        roomId: new ObjectId(),
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

  async getRoomBookingsForWeek(
    roomId: string,
    weekStart: Date,
  ): Promise<BookingEntity[]> {
    //Mise en place du crenaux duquel on recupere les bookings ( sur une semaine )
    // Clonage de la date de début de semaine pour éviter de modifier l'objet `weekStart`
    const startDate = new Date(weekStart);
    startDate.setHours(0, 0, 0, 0); // Définit l'heure de début à minuit, marquant le début de la journée

    // Création de la date de fin de semaine en ajoutant 5 jours (lundi au vendredi)
    const endDate = new Date(weekStart);
    endDate.setDate(endDate.getDate() + 5); // Fixe le jour au vendredi de la même semaine
    endDate.setHours(18, 0, 0, 0); // Définit l'heure de fin à 18:00 (fin de journée)

    //TODO récupération des booking pour le crenaux définit
    const bookings = null;
    return bookings;
  }
}
