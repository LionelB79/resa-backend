import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EquipementsEntity } from '@equipements/equipements.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EquipementsService {
  constructor(
    @InjectRepository(EquipementsEntity)
    private equipementsRepository: Repository<EquipementsEntity>,
  ) {}

  async createEquipment(name: string): Promise<EquipementsEntity> {
    // Vérifie si l'équipement existe déjà
    let equipment = await this.equipementsRepository.findOne({
      where: { name },
    });
    if (!equipment) {
      // Crée un nouvel équipement s'il n'existe pas
      equipment = this.equipementsRepository.create({ name });
      await this.equipementsRepository.save(equipment);
    }
    return equipment;
  }
}
