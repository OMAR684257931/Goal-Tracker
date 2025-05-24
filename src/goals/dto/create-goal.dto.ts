import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({ example: 'Learn NestJS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Finish the NestJS tutorial by end of month' })
  @IsString()
  description: string;

  @ApiProperty({
    example: '2025-06-30T23:59:59Z',
    description: 'ISO 8601 format',
  })
  @IsDateString()
  deadline: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isPublic: boolean;

  @ApiPropertyOptional({ example: 'fa3a4b79-7742-4c3f-8f6b-3bdbb221c978' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;
}
