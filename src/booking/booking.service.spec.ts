import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { BookingEntity } from './booking.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../room/room.entity';
import { ObjectId } from 'mongodb';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Constantes de test
const ROOM_ID = new ObjectId('64b8f26f1c4f8c3a2e8c1eab');
const ANOTHER_ROOM_ID = new ObjectId('64b8f26f1c4f8c3a2e8c1eac');

const createTestBooking = (overrides = {}): BookingEntity => ({
  _id: ROOM_ID,
  _roomId: ROOM_ID,
  startTime: new Date('2024-12-12T09:00:00.000Z'),
  endTime: new Date('2024-12-12T11:00:00.000Z'),
  bookingTitle: 'Existing Meeting',
  userEmail: 'existing@example.com',
  createdAt: new Date('2024-12-10T08:00:00.000Z'),
  updatedAt: new Date('2024-12-10T08:00:00.000Z'),
  ...overrides,
});

describe('BookingService', () => {
  let service: BookingService;
  let fakeBookingRepository: Partial<Repository<BookingEntity>>;
  let fakeRoomRepository: Partial<Repository<RoomEntity>>;

  beforeEach(async () => {
    fakeBookingRepository = {
      find: async (query: any): Promise<BookingEntity[]> =>
        query.where._roomId.equals(ROOM_ID) ? [createTestBooking()] : [],

      create: (booking: BookingEntity): BookingEntity => booking,

      save: async (booking: BookingEntity): Promise<BookingEntity> => booking,
      manager: {
        getMongoRepository: () => ({
          find: async (query: any): Promise<BookingEntity[]> =>
            query.where._roomId.equals(ROOM_ID) ? [createTestBooking()] : [],
        }),
      },
    } as unknown as Partial<Repository<BookingEntity>>;

    fakeRoomRepository = {
      findOne: async (query: any): Promise<RoomEntity | undefined> =>
        query.where._id.equals(ROOM_ID)
          ? ({ _id: ROOM_ID, name: 'Conference Room' } as RoomEntity)
          : undefined,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: fakeBookingRepository,
        },
        {
          provide: getRepositoryToken(RoomEntity),
          useValue: fakeRoomRepository,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getRoomBookingsForWeek | should return bookings for a room and a week', async () => {
    const weekStart = new Date('2024-12-11T00:00:00.000Z');
    const bookings = await service.getRoomBookingsForWeek(
      ROOM_ID.toString(),
      weekStart,
    );

    expect(bookings).toEqual([createTestBooking()]);
  });

  it('getRoomBookingsForWeek | should return no bookings for a room and a week', async () => {
    const weekStart = new Date('2025-12-18T00:00:00.000Z');
    const bookings = await service.getRoomBookingsForWeek(
      ANOTHER_ROOM_ID.toString(),
      weekStart,
    );

    expect(bookings).toEqual([]);
  });

  it('createBooking | should create a booking successfully', async () => {
    const createBookingDto: CreateBookingDto = {
      roomId: ROOM_ID.toString(),
      bookingTitle: 'New Meeting',
      userEmail: 'test@example.com',
      startTime: new Date('2024-12-13T09:00:00.000Z'),
      endTime: new Date('2024-12-13T10:00:00.000Z'),
    };

    const result = await service.createBooking(createBookingDto);

    expect(result).toEqual(
      expect.objectContaining({
        _roomId: ROOM_ID,
        bookingTitle: 'New Meeting',
        userEmail: 'test@example.com',
        startTime: new Date('2024-12-13T09:00:00.000Z'),
        endTime: new Date('2024-12-13T10:00:00.000Z'),
      }),
    );
  });

  it('createBooking | should throw NotFoundException if room does not exist', async () => {
    const createBookingDto: CreateBookingDto = {
      roomId: ANOTHER_ROOM_ID.toString(),
      bookingTitle: 'Nonexistent Room Meeting',
      userEmail: 'test@example.com',
      startTime: new Date('2024-12-13T09:00:00.000Z'),
      endTime: new Date('2024-12-13T10:00:00.000Z'),
    };

    await expect(service.createBooking(createBookingDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('createBooking | should throw BadRequestException if booking conflicts', async () => {
    const createBookingDto: CreateBookingDto = {
      roomId: ROOM_ID.toString(),
      bookingTitle: 'Conflicting Meeting',
      userEmail: 'test@example.com',
      startTime: new Date('2024-12-12T10:00:00.000Z'),
      endTime: new Date('2024-12-12T12:00:00.000Z'),
    };

    await expect(service.createBooking(createBookingDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
