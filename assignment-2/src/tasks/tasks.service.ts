import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/Task.js';
import { Project } from '../entities/Project.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

interface TaskFilters {
  status?: string;
  projectId?: number;
  assigneeId?: number;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const project = await this.projectRepository.findOneBy({
      id: dto.projectId,
    });
    if (!project) {
      throw new NotFoundException(`Project ${dto.projectId} not found`);
    }

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      project,
    });

    return this.taskRepo.save(task);
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: {
        project: true,
        assignee: true,
        tags: true,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async findAll(filters: TaskFilters): Promise<Task[]> {
    const qb = this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignee', 'assignee');

    if (filters.status) {
      qb.andWhere('task.status = :status', { status: filters.status });
    }
    if (filters.projectId !== undefined) {
      qb.andWhere('project.id = :projectId', { projectId: filters.projectId });
    }
    if (filters.assigneeId !== undefined) {
      qb.andWhere('assignee.id = :assigneeId', {
        assigneeId: filters.assigneeId,
      });
    }

    return qb.getMany();
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, {
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      status: dto.status ?? task.status,
      priority: dto.priority ?? task.priority,
    });
    return this.taskRepo.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
  }
}
