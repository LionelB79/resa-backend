import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoomDto } from '@room/dtos/create-room.dto';
import { RoomEntity } from '@room/room.entity';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/createroom')
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    return this.roomService.createRoom(createRoomDto);
  }
}
