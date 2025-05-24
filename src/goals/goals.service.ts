import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal/goal';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalsRepository: Repository<Goal>,
  ) {}

  async create(userId: string, dto: CreateGoalDto): Promise<Goal> {
    // Validate 2-level nesting
    if (dto.parentId) {
      const parent = await this.goalsRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) throw new BadRequestException('Parent goal not found');
      if (parent.parentId)
        throw new BadRequestException('Max depth is 2 levels');
    }
    const goal = this.goalsRepository.create({
      ...dto,
      ownerId: userId,
      publicId: dto.isPublic ? uuidv4() : null,
    });

    return this.goalsRepository.save(goal);
  }

  async findAllByUser(userId: string): Promise<Goal[]> {
    return this.goalsRepository.find({
      where: { ownerId: userId },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findPublicGoals(): Promise<Goal[]> {
    return this.goalsRepository.find({
      where: { isPublic: true, parentId: null },
      order: { createdAt: 'DESC' },
    });
  }

  async findPublicGoalById(publicId: string): Promise<Goal | null> {
    return this.goalsRepository.findOne({
      where: { publicId, isPublic: true },
      relations: ['children'],
    });
  }

  async update(userId: string, id: string, dto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.goalsRepository.findOne({ where: { id } });
    if (!goal) throw new NotFoundException();
    if (goal.ownerId !== userId) throw new ForbiddenException();

    // Handle change to public
    if (dto.isPublic && !goal.publicId) {
      goal.publicId = uuidv4();
    }

    Object.assign(goal, dto);
    return this.goalsRepository.save(goal);
  }

  async delete(userId: string, id: string): Promise<void> {
    const goal = await this.goalsRepository.findOne({ where: { id } });
    if (!goal) throw new NotFoundException();
    if (goal.ownerId !== userId) throw new ForbiddenException();

    await this.goalsRepository.delete(id);
  }
}
