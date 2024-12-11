import { Test, TestingModule } from '@nestjs/testing';
import { EquipementsController } from './equipements.controller';
import { EquipementsService } from './equipements.service';
import { EquipementsEntity } from './equipements.entity';
import { ObjectId } from 'mongodb';

describe('EquipementsController', () => {
  let controller: EquipementsController;
  let fakeEquipementsService: Partial<EquipementsService>;

  beforeEach(async () => {
    const equipements: EquipementsEntity[] = [
      { id: new ObjectId(), name: 'Chauffage' },
      {
        id: new ObjectId(),
        name: 'Climatisation',
      },
    ];

    fakeEquipementsService = {
      getAllEquipment: () => {
        return Promise.resolve(equipements);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipementsController],
      providers: [
        {
          provide: EquipementsService,
          useValue: fakeEquipementsService,
        },
      ],
    }).compile();

    controller = module.get<EquipementsController>(EquipementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllEquipment - OK | returns a list of Equipment', async () => {
    const equipement = await controller.getAllEquipment();

    expect(equipement.length).toEqual(2);
    expect(equipement[0].name).toEqual('Chauffage');
  });
});
