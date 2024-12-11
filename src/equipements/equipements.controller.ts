import { Controller, Get } from '@nestjs/common';
import { EquipementsEntity } from '@equipements/equipements.entity';
import { EquipementsService } from '../equipements/equipements.service';

@Controller('equipements')
export class EquipementsController {
  constructor(private equipementsService: EquipementsService) {}

  @Get()
  async getAllEquipment(): Promise<EquipementsEntity[]> {
    return this.equipementsService.findAll();
  }
}
