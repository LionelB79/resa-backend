import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '@room/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '@room/dtos/create-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}

  //TODO creer une table equipement et l'alimenter à la creation d'une salle
  //TODO la creation de la salle enregistrée en base à unse heure de decalage -> à gérer
  async createRoom(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    const { name, description, capacity, equipements } = createRoomDto;

    const existingRoom = await this.find(name);
    if (existingRoom.length) {
      throw new BadRequestException(`La salle "${name}" existe déjà.`);
    }
    try {
      const room = this.roomRepository.create({
        ...createRoomDto,
      });

      await this.roomRepository.save(room);
      return room;
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de la création de la salle: ${error.message}`,
      );
    }
  }

  find(name: string) {
    return this.roomRepository.find({ where: { name } });
  }
}
