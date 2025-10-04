import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';
import { ConflictMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity) private taskRepository: Repository<TaskEntity>
  ){}

  async create(createTaskDto: CreateTaskDto) {
    const { caption, title, link } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      caption,
      link
    });
    await this.taskRepository.save(task);

    return {
      messsage: PublicMessage.Created
    };
  }

  async checkExistByTitle(title: string) {
    title = title.trim()?.toLowerCase();
    const task = await this.taskRepository.findOneBy({ title });
    if (task) throw new ConflictException(ConflictMessage.TaskTitle); 

    return title;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);

    const [tasks, count] = await this.taskRepository.findAndCount({
      where: {},
      skip,
      take: limit,
    });

    return {
      pagination: paginationGenerator(count, page, limit),
      tasks
    };
  }

async findOne(id: number, userId: number) {
  const task = await this.taskRepository.findOneBy({ id, userId });
  if (!task) throw new NotFoundException(NotFoundMessage.NotFoundTask);
  return task;
}

async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
  const task = await this.taskRepository.findOneBy({ id, userId });
  if (!task) throw new NotFoundException(NotFoundMessage.NotFoundTask);

  const { caption, title } = updateTaskDto;
  if (title) task.title = title;
  if (caption) task.caption = caption;

  await this.taskRepository.save(task);
  return { message: PublicMessage.Updated };
}

async remove(id: number, userId: number) {
  const task = await this.taskRepository.findOneBy({ id, userId });
  if (!task) throw new NotFoundException(NotFoundMessage.NotFoundTask);

  await this.taskRepository.delete({ id });
  return { message: PublicMessage.Deleted };
}

}
