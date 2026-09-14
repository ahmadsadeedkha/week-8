import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/Comment.js';
import { Task } from '../entities/Task.js';
import { User } from '../entities/User.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAllForTask(taskId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { task: { id: taskId } },
    });
  }

  async createForTask(dto: CreateCommentDto, task: Task): Promise<Comment> {
    const author = await this.userRepo.findOneBy({ id: dto.authorId });
    if (!author) {
      throw new NotFoundException(`User ${dto.authorId} not found`);
    }

    const comment = this.commentRepo.create({
      body: dto.body,
      task,
      author,
    });
    return this.commentRepo.save(comment);
  }
}
