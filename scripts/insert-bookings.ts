import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module'; // Assurez-vous que le chemin correspond à votre structure
import { BookingService } from '../src/booking/booking.service'; // Importez le service Booking
import { RoomService } from '../src/room/room.service'; // Importez le service Room
import { CreateBookingDto } from '../src/booking/dtos/create-booking.dto'; // DTO pour créer une réservation
import { ObjectId } from 'mongodb';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const bookingService = app.get(BookingService);
  const roomService = app.get(RoomService);

  // Récupérez la salle "Salle #1"
  const room = await roomService.find('Salle #1');
  if (!room.length) {
    console.error('Salle #1 introuvable.');
    await app.close();
    return;
  }

  const roomId = room[0]._id.toString(); // ID de la salle "Salle #1"

  const bookings: CreateBookingDto[] = [
    {
      bookingTitle: 'Réservation 1',
      userEmail: 'user1@example.com',
      startTime: new Date('2024-12-16T08:00:00.000Z'),
      endTime: new Date('2024-12-16T09:30:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Daily meeting',
      userEmail: 'user2@example.com',
      startTime: new Date('2024-12-17T08:00:00.000Z'),
      endTime: new Date('2024-12-17T09:45:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Program Increment (PI)',
      userEmail: 'user3@example.com',
      startTime: new Date('2024-12-18T09:00:00.000Z'),
      endTime: new Date('2024-12-18T09:30:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 4',
      userEmail: 'user4@example.com',
      startTime: new Date('2024-12-20T08:00:00.000Z'),
      endTime: new Date('2024-12-20T09:30:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 5',
      userEmail: 'user5@example.com',
      startTime: new Date('2024-12-23T14:00:00.000Z'),
      endTime: new Date('2024-12-23T15:30:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 6',
      userEmail: 'user6@example.com',
      startTime: new Date('2024-12-24T10:00:00.000Z'),
      endTime: new Date('2024-12-24T10:30:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 7',
      userEmail: 'user7@example.com',
      startTime: new Date('2024-12-26T08:00:00.000Z'),
      endTime: new Date('2024-12-26T09:30:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 8',
      userEmail: 'user8@example.com',
      startTime: new Date('2024-12-26T14:00:00.000Z'),
      endTime: new Date('2024-12-26T15:30:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 9',
      userEmail: 'user9@example.com',
      startTime: new Date('2024-12-26T16:00:00.000Z'),
      endTime: new Date('2024-12-26T18:00:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 10',
      userEmail: 'user10@example.com',
      startTime: new Date('2024-12-27T08:00:00.000Z'),
      endTime: new Date('2024-12-27T09:30:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 11',
      userEmail: 'user11@example.com',
      startTime: new Date('2024-12-27T10:00:00.000Z'),
      endTime: new Date('2024-12-27T10:30:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 12',
      userEmail: 'user12@example.com',
      startTime: new Date('2024-12-27T11:00:00.000Z'),
      endTime: new Date('2024-12-27T12:00:00.000Z'),
      roomId,
    },
    {
      bookingTitle: 'Réservation 13',
      userEmail: 'user13@example.com',
      startTime: new Date('2024-12-27T14:00:00.000Z'),
      endTime: new Date('2024-12-27T15:30:00.000Z'),
      roomId,
    },
  ];

  for (const booking of bookings) {
    try {
      const createdBooking = await bookingService.createBooking(booking);
      console.log(`Booking "${createdBooking.bookingTitle}" créé avec succès.`);
    } catch (error) {
      console.error(
        `Erreur lors de la création de la réservation "${booking.bookingTitle}":`,
        error.message,
      );
    }
  }

  await app.close();
}

bootstrap();
