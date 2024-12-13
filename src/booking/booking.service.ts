import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../booking/booking.entity';
import { Repository } from 'typeorm';
import { RoomEntity } from '../room/room.entity';
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

  //On vérifier si le créneau est déjà réservéo u si il chevauche un booking deja existant
  async createBooking(
    @Body() createRoomDto: CreateBookingDto,
  ): Promise<BookingEntity> {
    const { roomId, bookingTitle, userEmail, startTime, endTime } =
      createRoomDto;
    const objectIdRoom = new ObjectId(roomId);

    // On vérifie si la salle existe
    const room = await this.roomRepository.findOne({
      where: { _id: objectIdRoom },
    });
    if (!room) throw new NotFoundException('Salle non trouvée');

    // On vérifie si il y a des chevauchements
    const conflictingBookings = await this.bookingRepository.find({
      where: {
        _roomId: objectIdRoom,
      },
    });

    const hasConflict = conflictingBookings.some(
      (existingBooking) =>
        // Le nouveau booking commence pendant un booking existant
        (startTime > existingBooking.startTime &&
          startTime < existingBooking.endTime) ||
        // Le nouveau booking se termine pendant un booking existant
        (endTime > existingBooking.startTime &&
          endTime < existingBooking.endTime) ||
        // Le nouveau booking englobe complètement un booking existant
        (startTime <= existingBooking.startTime &&
          endTime >= existingBooking.endTime) ||
        // Un booking existant englobe complètement le nouveau booking
        (startTime >= existingBooking.startTime &&
          endTime <= existingBooking.endTime),
    );

    // Si des bookings en conflit sont trouvés, on renvoie une erreur
    if (hasConflict) {
      throw new BadRequestException(
        'Ce créneau chevauche des réservations existantes',
      );
    }

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

  // Annuler une réservation
  async cancelBooking(bookingId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { _id: new ObjectId(bookingId) },
    });

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    await this.bookingRepository.remove(booking);
    return { message: 'Réservation annulée avec succès' };
  }
}
