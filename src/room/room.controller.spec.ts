import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomEntity } from './room.entity';
import { ObjectId } from 'mongodb';
import { CreateRoomDto } from './dtos/create-room.dto';

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
      createRoom: (dto: CreateRoomDto) => {
        const newRoom: RoomEntity = {
          _id: new ObjectId(),
          ...dto,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return Promise.resolve(newRoom);
      },
      findById: (id: string) => {
        const room = predefinedRooms.find((r) => r._id.toString() === id);
        return Promise.resolve(room);
      },
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

  it('INSTANCE OK | should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createRoom OK | should create a new room successfully', async () => {
    const createRoomDto: CreateRoomDto = {
      name: 'Nouvelle Salle',
      description: 'Une nouvelle salle de réunion',
      capacity: 15,
      equipements: [{ name: 'Projecteur' }],
    };

    const createdRoom = await controller.createRoom(createRoomDto);

    expect(createdRoom).toBeDefined();
    expect(createdRoom.name).toBe(createRoomDto.name);
    expect(createdRoom.description).toBe(createRoomDto.description);
    expect(createdRoom.capacity).toBe(createRoomDto.capacity);
    expect(createdRoom._id).toBeDefined();
  });

  it('createRoom OK | should return a room when a valid ID is provided', async () => {
    const roomId = '507f1f77bcf86cd799439012';

    const room = await controller.getRoomById(roomId);

    expect(room).toBeDefined();
    expect(room.name).toBe('Salle de Réunion 1');
    expect(room._id.toString()).toBe(roomId);
  });

  it('createRoom KO | should return undefined for a non-existent room ID', async () => {
    const nonExistentId = '507f1f77bcf86cd799439999';
    const room = await controller.getRoomById(nonExistentId);
    expect(room).toBeUndefined();
  });
  it('getAllRooms - OK | returns a list of rooms', async () => {
    const rooms = await controller.getAllRooms();

    expect(rooms.length).toEqual(3);
    expect(rooms[0].name).toEqual('Salle de Réunion 1');
    expect(rooms[2].name).toEqual('Salle de Ouf');
  });
});
