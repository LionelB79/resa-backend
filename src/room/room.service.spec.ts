import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../room/room.service';
import { Repository } from 'typeorm';
import { RoomEntity } from '../room/room.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { CreateRoomDto } from '@room/dtos/create-room.dto';
import { EquipementsService } from '../equipements/equipements.service';
import { EquipementsEntity } from '../equipements/equipements.entity';
describe('RoomService', () => {
  let service: RoomService;
  let fakeRepository: Partial<Repository<RoomEntity>>;
  let fakeEquipementsService: Partial<EquipementsService>;

  beforeEach(async () => {
    fakeRepository = {
      find: (options) => {
        const name = (options.where as any).name;
        if (name === 'Existing Room') {
          return Promise.resolve([{ name: 'Existing Room' } as RoomEntity]);
        }
        return Promise.resolve([]);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        EquipementsService,
        {
          provide: getRepositoryToken(RoomEntity),
          useValue: fakeRepository,
        },
        {
          provide: EquipementsService,
          useValue: fakeEquipementsService,
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('INSTANCE - OK | should be defined', () => {
    expect(service).toBeDefined();
  });
});
