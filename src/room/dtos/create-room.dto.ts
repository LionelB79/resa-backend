import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

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
  @Min(5)
  capacity?: number;

  @IsOptional()
  @IsString({ each: true })
  equipements?: string[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
