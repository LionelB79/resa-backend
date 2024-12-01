import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoomDto } from '@room/dtos/create-room.dto';
import { RoomEntity } from '@room/room.entity';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/createroom')
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    return this.roomService.createRoom(createRoomDto);
  }

  @Get()
  async getAllRooms(): Promise<RoomEntity[]> {
    return this.roomService.findAll();
  }
  //TODO à revoir
  @Get(':id')
  async getRoomById(@Param('id') id: string): Promise<RoomEntity> {
    return this.roomService.findById(id);
  }
}
