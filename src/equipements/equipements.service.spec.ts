import { Test, TestingModule } from '@nestjs/testing';
import { EquipementsService } from './equipements.service';
import { EquipementsEntity } from './equipements.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EquipementsService', () => {
  let service: EquipementsService;
  let fakeRepository: Partial<Repository<EquipementsEntity>>;

  beforeEach(async () => {
    const equipementsList: EquipementsEntity[] = [
      {
        id: new ObjectId(),
        name: 'Babyfoot',
      },
      { id: new ObjectId(), name: 'Playstation 5' },
    ];

    fakeRepository = {
      find: () => Promise.resolve(equipementsList),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipementsService,
        {
          provide: getRepositoryToken(EquipementsEntity),
          useValue: fakeRepository,
        },
      ],
    }).compile();

    service = module.get<EquipementsService>(EquipementsService);
  });

  it('INSTANCE - OK | should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll - OK | should return all equipements', async () => {
    const equipements = await service.getAllEquipment();

    expect(equipements.length).toBe(2);
    expect(equipements[0].name).toBe('Babyfoot');
    expect(equipements[1].name).toBe('Playstation 5');
  });
});
