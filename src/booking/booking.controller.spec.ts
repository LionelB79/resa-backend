import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from '../booking/booking.service';
import { BookingEntity } from '../booking/booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { ObjectId } from 'mongodb';

describe('BookingController', () => {
  let controller: BookingController;
  let fakeBookingService: Partial<BookingService>;

  const EXISTING_BOOKING_ID = new ObjectId('65b8f26f1c4f8c3a2e8c1eab');
  const NON_EXISTING_BOOKING_ID = new ObjectId('65b8f26f1c4f8c3a2e8c1eac');
  beforeEach(async () => {
    const predefinedBookings: BookingEntity[] = [
      {
        _id: new ObjectId('60d5ecb8b3b3a3001f3e1234'),
        _roomId: new ObjectId('507f1f77bcf86cd799439012'),
        bookingTitle: 'Réunion Équipe Projet',
        userEmail: 'user1@example.com',
        startTime: new Date('2024-01-15T10:00:00'),
        endTime: new Date('2024-01-15T12:00:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId('60d5ecb8b3b3a3001f3e1235'),
        _roomId: new ObjectId('507f1f77bcf86cd799439012'),
        bookingTitle: 'Formation',
        userEmail: 'user2@example.com',
        startTime: new Date('2024-01-16T14:00:00'),
        endTime: new Date('2024-01-16T16:00:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    fakeBookingService = {
      createBooking: (dto: CreateBookingDto) => {
        const newBooking: BookingEntity = {
          _id: new ObjectId(),
          _roomId: new ObjectId(dto.roomId),
          bookingTitle: dto.bookingTitle || 'Nouvelle Réservation',
          userEmail: dto.userEmail,
          startTime: dto.startTime,
          endTime: dto.endTime,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return Promise.resolve(newBooking);
      },
      getRoomBookingsForWeek: (roomId: string, weekStart: Date) => {
        return Promise.resolve(
          predefinedBookings.filter(
            (booking) => booking._roomId.toString() === roomId,
          ),
        );
      },
      cancelBooking: async (bookingId: string) => {
        if (bookingId === EXISTING_BOOKING_ID.toString()) {
          return { message: 'Réservation annulée avec succès' };
        }
        throw new Error('Réservation non trouvée');
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: fakeBookingService,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
  });

  it('INSTANCE OK | should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(' createBooking OK | should create a new booking successfully', async () => {
    const createBookingDto: CreateBookingDto = {
      roomId: '507f1f77bcf86cd799439012',
      userEmail: 'newuser@example.com',
      startTime: new Date('2024-01-17T10:00:00'),
      endTime: new Date('2024-01-17T12:00:00'),
      bookingTitle: 'Nouvelle Réunion',
    };

    const createdBooking = await controller.createBooking(createBookingDto);

    expect(createdBooking).toBeDefined();
    expect(createdBooking.userEmail).toBe(createBookingDto.userEmail);
    expect(createdBooking.startTime).toEqual(createBookingDto.startTime);
    expect(createdBooking.endTime).toEqual(createBookingDto.endTime);
    expect(createdBooking._id).toBeDefined();
  });

  it(' createBooking KO | should throw an error if booking creation fails', async () => {
    const invalidBookingDto: CreateBookingDto = {
      roomId: '507f1f77bcf86cd799439012',
      bookingTitle: '',
      userEmail: 'invalid-email',
      startTime: new Date('2024-01-17T10:00:00'),
      endTime: new Date('2024-01-17T12:00:00'),
    };

    fakeBookingService.createBooking = () => {
      throw new Error('Erreur lors de la réservation');
    };

    await expect(controller.createBooking(invalidBookingDto)).rejects.toThrow(
      'Erreur lors de la réservation',
    );
  });

  it('getRoomBookingsForWeek OK | should return bookings for a specific room and week', async () => {
    const roomId = '507f1f77bcf86cd799439012';
    const weekStart = new Date('2024-01-15');

    const bookings = await controller.getRoomBookingsForWeek(
      roomId,
      weekStart.toISOString(),
    );

    expect(bookings).toBeDefined();
    expect(bookings.length).toBe(2);
    expect(bookings[0]._roomId.toString()).toBe(roomId);
    expect(bookings[1]._roomId.toString()).toBe(roomId);
  });

  it('getRoomBookingsForWeek OK | should return an EMPTY array for a room with no bookings', async () => {
    const roomId = '507f1f77bcf86cd799439999';
    const weekStart = new Date('2024-01-15');

    const bookings = await controller.getRoomBookingsForWeek(
      roomId,
      weekStart.toISOString(),
    );

    expect(bookings).toBeDefined();
    expect(bookings.length).toBe(0);
  });

  it('cancelBooking OK | should successfully cancel an existing booking', async () => {
    const result = await controller.cancelBooking(
      EXISTING_BOOKING_ID.toString(),
    );

    expect(result).toEqual({
      message: 'Réservation annulée avec succès',
    });
  });

  it('cancelBooking KO | should handle errors when canceling a non-existing booking', async () => {
    await expect(
      controller.cancelBooking(NON_EXISTING_BOOKING_ID.toString()),
    ).rejects.toThrow('Réservation non trouvée');
  });
});
