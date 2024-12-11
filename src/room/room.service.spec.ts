import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { Repository } from 'typeorm';
import { RoomEntity } from './room.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RoomService', () => {
  let service: RoomService;
  let fakeRepository: Partial<Repository<RoomEntity>>;

  beforeEach(async () => {
    fakeRepository = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: getRepositoryToken(RoomEntity),
          useValue: fakeRepository,
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
