import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EquipementsDto } from '@equipements/dtos/equipements.dto';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipements: EquipementsDto[];
}
