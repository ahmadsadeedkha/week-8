import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/Comment.js';
import { Task } from '../entities/Task.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async findAllForTask(taskId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { task: { id: taskId } },
    });
  }

  async createForTask(
    dto: CreateCommentDto,
    task: Task,
  ): Promise<Comment> {
    const comment = this.commentRepo.create({
      body: dto.body,
      task,
    });
    return this.commentRepo.save(comment);
  }
}
