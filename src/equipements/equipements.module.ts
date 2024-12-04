import { Module } from '@nestjs/common';
import { EquipementsController } from '@equipements/equipements.controller';
import { EquipementsService } from '@equipements/equipements.service';
import { EquipementsEntity } from '@equipements/equipements.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EquipementsEntity])],

  controllers: [EquipementsController],
  providers: [EquipementsService],
})
export class EquipementsModule {}
