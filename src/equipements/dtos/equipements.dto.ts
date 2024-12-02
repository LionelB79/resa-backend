import { IsNotEmpty, IsString } from 'class-validator';

export class EquipementsDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
