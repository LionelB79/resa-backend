import { Injectable } from '@nestjs/common';
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

  async createRoom(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    try {
      const { name, description, capacity, equipements } = createRoomDto;

      const room = this.roomRepository.create({
        name,
        description,
        capacity,
        equipements,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.roomRepository.save(room);
      return room;
    } catch (error) {
      throw new Error(
        `Erreur lors de la création de la salle : ${error.message}`,
      );
    }
  }
}
