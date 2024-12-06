import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '@booking/booking.entity';
import { Repository } from 'typeorm';
import { RoomEntity } from '@app/room/room.entity';
import { ObjectId } from 'mongodb';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}

  async createBooking(
    @Body() createRoomDto: CreateBookingDto,
  ): Promise<BookingEntity> {
    const { roomId, bookingTitle, userEmail, startTime, endTime } =
      createRoomDto;
    console.log('roomId', roomId);
    const objectIdRoom = new ObjectId(roomId);
    console.log('roomId (ObjectId):', objectIdRoom);
    console.log('Vérification des conflits :');
    console.log('startTime <= endTime:', endTime);
    console.log('endTime >= startTime:', startTime);

    //On vérifier si la salle existe
    const room = await this.roomRepository.findOne({
      where: { _id: new ObjectId(roomId) },
    });
    if (!room) throw new NotFoundException('Salle non trouvée');

    //TODO fonctionnel pour des crenaux correspondants mais le chevauchement des crenaux devra être géré
    //On vérifier si le créneau est déjà réservé

    const existingBooking = await this.bookingRepository.findOne({
      where: {
        _roomId: objectIdRoom,
        startTime: startTime,
        endTime: endTime,
      },
    });

    if (existingBooking) {
      throw new BadRequestException('Ce créneau est déjà réservé');
    }
    console.log('existingBooking : ', existingBooking);

    const booking = this.bookingRepository.create({
      _roomId: objectIdRoom,
      bookingTitle,
      userEmail,
      startTime,
      endTime,
    });

    return await this.bookingRepository.save(booking);
  }

  async getRoomBookingsForWeek(
    roomId: string,
    weekStart: Date,
  ): Promise<BookingEntity[]> {
    const objectIdRoom = new ObjectId(roomId);

    // Mise en place du crenaux duquel on recupere les bookings ( sur une semaine )
    // Clonage de la date de début de semaine pour éviter de modifier l'objet `weekStart`
    const startDate = new Date(weekStart);
    startDate.setHours(0, 0, 0, 0); // Définit l'heure de début à minuit, marquant le début de la journée

    // Création de la date de fin de semaine en ajoutant 5 jours (lundi au vendredi)
    const endDate = new Date(weekStart);
    endDate.setDate(endDate.getDate() + 5); // Fixe le jour au vendredi de la même semaine
    endDate.setHours(18, 0, 0, 0); // Définit l'heure de fin à 18:00 (fin de journée)

    try {
      // Accès au repository MongoDB via le gestionnaire de transactions pour gérer les opérations Mongo
      const managerBookingRepo = this.bookingRepository.manager;

      // Utilisation de `getMongoRepository` pour accéder à MongoDB de manière native avec `BookingEntity`
      const bookings = await managerBookingRepo
        .getMongoRepository(BookingEntity)
        .find({
          where: {
            _roomId: objectIdRoom,

            // Filtrage des réservations avec `startTime` entre `startDate` et `endDate`
            startTime: {
              $gte: startDate, // `startTime` doit être supérieur ou égal à `startDate` (début de la semaine)
              $lte: endDate, // `startTime` doit être inférieur ou égal à `endDate` (fin de la semaine)
            },
          },
          order: { startTime: 1 },
        });
      console.log('bookings', bookings);
      return bookings;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error); // Log en cas d'erreur
      throw new Error('Erreur lors de la récupération des réservations'); // Lève une erreur en cas d'échec
    }
  }
}
