import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '@room/room.entity';
import { EquipementsEntity } from '@equipements/equipements.entity';
import { EquipementsService } from '@equipements/equipements.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, EquipementsEntity])],
  providers: [RoomService, EquipementsService],
  controllers: [RoomController],
})
export class RoomModule {}
