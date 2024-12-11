import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { BookingEntity } from './booking.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../room/room.entity';

describe('BookingService', () => {
  let service: BookingService;
  let fakeBookingRepository: Partial<Repository<BookingEntity>>;
  let fakeRoomRepository: Partial<Repository<RoomEntity>>;

  beforeEach(async () => {
    fakeBookingRepository = {};
    fakeRoomRepository = {};
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
});
