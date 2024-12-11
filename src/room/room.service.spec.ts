import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../room/room.service';
import { Repository } from 'typeorm';
import { RoomEntity } from '../room/room.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { CreateRoomDto } from '@room/dtos/create-room.dto';
import { EquipementsService } from '../equipements/equipements.service';
import { EquipementsEntity } from '../equipements/equipements.entity';
import { NotFoundException } from '@nestjs/common';
describe('RoomService', () => {
  let service: RoomService;
  let fakeRepository: Partial<Repository<RoomEntity>>;
  let fakeEquipementsService: Partial<EquipementsService>;

  beforeEach(async () => {
    const existingRoom: RoomEntity = {
      _id: new ObjectId('507f1f77bcf86cd799439011'),
      name: 'Test Room',
      description: 'A test room',
      capacity: 10,
      equipements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    fakeRepository = {
      findOne: (options) => {
        const id = (options.where as any)._id;

        if (id.toString() === existingRoom._id.toString()) {
          return Promise.resolve(existingRoom);
        }

        return Promise.resolve(null);
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

  it('findById - OK | should return a room', async () => {
    const existingId = '507f1f77bcf86cd799439011';
    const room = await service.findById(existingId);

    expect(room).toBeDefined();
    expect(room._id.toString()).toBe(existingId);
    expect(room.name).toBe('Test Room');
  });

  it('findById - KO | should return a NotFoundException', async () => {
    const nonExistingId = '507f1f77bcf86cd799439012';

    await expect(service.findById(nonExistingId)).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.findById(nonExistingId)).rejects.toThrow(
      `Salle avec l'ID ${nonExistingId} non trouvée`,
    );
  });
});
