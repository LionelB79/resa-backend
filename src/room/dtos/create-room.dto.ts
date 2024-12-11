import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { EquipementsDto } from '@equipements/dtos/equipements.dto';
import { Type } from 'class-transformer';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipementsDto)
  equipements: EquipementsDto[];
}
