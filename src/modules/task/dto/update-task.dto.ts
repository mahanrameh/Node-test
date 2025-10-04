import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Update task title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated caption', nullable: true })
  @IsOptional()
  @IsString()
  @Length(5, 200)
  caption?: string;

  @ApiPropertyOptional({ example: 'https://github.com/mahanrameh', nullable: true })
  @IsOptional()
  @IsString()
  link?: string;
}