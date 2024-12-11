import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../room/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '@room/dtos/create-room.dto';
import { EquipementsService } from '../equipements/equipements.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    private equipementsService: EquipementsService,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    const { name, description, capacity, equipements } = createRoomDto;

    const existingRoom = await this.find(name);
    if (existingRoom.length) {
      throw new BadRequestException(`La salle "${name}" existe déjà.`);
    }
    try {
      const room = this.roomRepository.create({
        name,
        description,
        capacity,
        equipements,
      });

      //Persistance des nouveau equipements

      await Promise.all(
        equipements.map(async (equipement) => {
          await this.equipementsService.createEquipment(equipement.name);
        }),
      ),
        await this.roomRepository.save(room);
      return room;
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de la création de la salle: ${error.message}`,
      );
    }
  }

  async find(name: string): Promise<RoomEntity[]> {
    return this.roomRepository.find({ where: { name } });
  }

  async findAll(): Promise<RoomEntity[]> {
    return this.roomRepository.find();
  }
  async findById(id: string): Promise<RoomEntity> {
    const objectId = new ObjectId(id);

    const room = await this.roomRepository.findOne({
      where: { _id: objectId },
    });

    if (!room) {
      throw new NotFoundException(`Salle avec l'ID ${id} non trouvée`);
    }

    return room;
  }
}
