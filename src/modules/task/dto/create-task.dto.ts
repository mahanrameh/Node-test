import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsInt } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish backend test project' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'some valid cool caption', nullable: true })
  @IsOptional()
  @IsString()
  @Length(5, 200)
  caption?: string;

  @ApiPropertyOptional({ example: 'https://github.com/mahanrameh', nullable: true })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ example: 42 })
  @IsInt()
  userId: number;
}