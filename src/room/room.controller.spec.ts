import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomEntity } from './room.entity';
import { ObjectId } from 'mongodb';

describe('RoomController', () => {
  let controller: RoomController;
  let fakeRoomService: Partial<RoomService>;

  beforeEach(async () => {
    const predefinedRooms: RoomEntity[] = [
      {
        _id: new ObjectId('507f1f77bcf86cd799439012'),
        name: 'Salle de Réunion 1',
        description: 'Salle de réunion principale',
        capacity: 10,
        equipements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId('507f1f77bcf86cd799439013'),
        name: 'Salle de Conférence',
        description: 'Grande salle pour conférences',
        capacity: 50,
        equipements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId('507f1f77bcf86cd799439014'),
        name: 'Salle de Ouf',
        description: 'Grande salle pour les oufs',
        capacity: 20,
        equipements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    fakeRoomService = {
      findAll: () => {
        return Promise.resolve(predefinedRooms);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: RoomService,
          useValue: fakeRoomService,
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllRooms - OK | returns a list of rooms', async () => {
    const rooms = await controller.getAllRooms();

    expect(rooms.length).toEqual(3);
    expect(rooms[0].name).toEqual('Salle de Réunion 1');
    expect(rooms[2].name).toEqual('Salle de Ouf');
  });
});
