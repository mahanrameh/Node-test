import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator'; // ✅ your custom decorator

@Controller('Task')
@ApiTags('Task')
export class TaskController {
  constructor(private readonly TaskService: TaskService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.TaskService.create({ ...createTaskDto, userId: user.id });
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.TaskService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.TaskService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any
  ) {
    return this.TaskService.update(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.TaskService.remove(id, user.id);
  }
}
