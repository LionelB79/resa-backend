import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsOptional()
  @IsString()
  bookingTitle: string;

  @IsNotEmpty()
  @IsEmail()
  userEmail: string;

  @IsDate()
  @Transform(({ value }) => new Date(value)) // Transform string to Date
  startTime: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value)) // Transform string to Date
  endTime: Date;
}
