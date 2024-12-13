import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../room/room.service';
import { DeepPartial, Repository } from 'typeorm';
import { RoomEntity } from '../room/room.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { CreateRoomDto } from '../room/dtos/create-room.dto';
import { EquipementsService } from '../equipements/equipements.service';
import { EquipementsEntity } from '../equipements/equipements.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RoomService', () => {
  let service: RoomService;
  let fakeRoomRepository: Partial<Repository<RoomEntity>>;
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
    ];

    fakeRoomRepository = {
      find: () => Promise.resolve(predefinedRooms),
      findOne: (options) => {
        const id = (options.where as any)._id;

        if (id.toString() === existingRoom._id.toString()) {
          return Promise.resolve(existingRoom);
        }

        return Promise.resolve(null);
      },
      save: (room) => Promise.resolve(room),
    };

    fakeEquipementsService = {
      createEquipment: (name: string) =>
        Promise.resolve({ name } as EquipementsEntity),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        EquipementsService,
        {
          provide: getRepositoryToken(RoomEntity),
          useValue: fakeRoomRepository,
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

  it('findAll - OK | should return all rooms', async () => {
    const rooms = await service.findAll();

    // Vérification du nombre de salles
    expect(rooms.length).toBe(2);

    // Vérification des détails de la première salle
    expect(rooms[0].name).toBe('Salle de Réunion 1');
    expect(rooms[0].capacity).toBe(10);

    // Vérification des détails de la deuxième salle
    expect(rooms[1].name).toBe('Salle de Conférence');
    expect(rooms[1].capacity).toBe(50);
  });

  // it('createRoom - OK | should create a new room successfully', async () => {
  //   const createRoomDto: CreateRoomDto = {
  //     name: 'New Room',
  //     description: 'A brand new room',
  //     capacity: 15,
  //     equipements: [{ name: 'Projector' }, { name: 'Whiteboard' }],
  //   };

  //   const createdRoom = await service.createRoom(createRoomDto);

  //   expect(createdRoom).toEqual(
  //     expect.objectContaining({
  //       name: 'New Room',
  //       description: 'A brand new room',
  //       capacity: 15,
  //       equipements: [{ name: 'Projector' }, { name: 'Whiteboard' }],
  //     }),
  //   );
  // });

  // it('createRoom - KO | should throw BadRequestException when room already exists', async () => {
  //   const createRoomDto: CreateRoomDto = {
  //     name: 'Existing Room',
  //     description: 'Trying to create a duplicate room',
  //     capacity: 10,
  //     equipements: [],
  //   };

  //   await expect(service.createRoom(createRoomDto)).rejects.toThrow(
  //     BadRequestException,
  //   );
  //   await expect(service.createRoom(createRoomDto)).rejects.toThrow(
  //     `La salle "Existing Room" existe déjà.`,
  //   );
  // });

  // it('createRoom - OK | should create room and equipment', async () => {
  //   const createRoomDto: CreateRoomDto = {
  //     name: 'Multimedia Room',
  //     description: 'Room with advanced equipment',
  //     capacity: 20,
  //     equipements: [{ name: 'Camera' }, { name: 'Microphone' }],
  //   };

  //   const createEquipmentSpy = jest.spyOn(
  //     fakeEquipementsService,
  //     'createEquipment',
  //   );

  //   const createdRoom = await service.createRoom(createRoomDto);

  //   expect(createEquipmentSpy).toHaveBeenCalledTimes(2);
  //   expect(createEquipmentSpy).toHaveBeenCalledWith('Camera');
  //   expect(createEquipmentSpy).toHaveBeenCalledWith('Microphone');

  //   expect(createdRoom).toEqual(
  //     expect.objectContaining({
  //       name: 'Multimedia Room',
  //       equipements: [{ name: 'Camera' }, { name: 'Microphone' }],
  //     }),
  //   );
  // });
});
