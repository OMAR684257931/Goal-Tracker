import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from './goals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goal } from './entities/goal/goal';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

const mockGoalRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

describe('GoalsService', () => {
  let service: GoalsService;
  let repo: jest.Mocked<Repository<Goal>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        {
          provide: getRepositoryToken(Goal),
          useValue: mockGoalRepo,
        },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
    repo = module.get(getRepositoryToken(Goal));
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a goal without parent', async () => {
      const dto = {
        title: 'Test',
        deadline: '2025-06-01',
        isPublic: false,
        order: 1,
      };
      const goal = { ...dto, ownerId: 'user1' };

      repo.create.mockReturnValue(goal as unknown as Goal);
      repo.save.mockResolvedValue(goal as unknown as Goal);

      const result = await service.create('user1', dto as any);
      expect(repo.create).toHaveBeenCalledWith({
        ...dto,
        ownerId: 'user1',
        publicId: null,
      });
      expect(result).toEqual(goal);
    });

    it('should throw if parent goal has a parent', async () => {
      repo.findOne.mockResolvedValue({ id: 'g1', parentId: 'pp1' } as Goal);
      await expect(
        service.create('user1', {
          title: 'Nested',
          deadline: '2025-06-01',
          isPublic: false,
          order: 1,
          parentId: 'g1',
          description: '',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllByUser', () => {
    it('should return goals for a user', async () => {
      repo.find.mockResolvedValue([{ title: 'T1' }] as Goal[]);
      const result = await service.findAllByUser('user1');
      expect(result).toHaveLength(1);
      expect(repo.find).toHaveBeenCalledWith({
        where: { ownerId: 'user1' },
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    });
  });

  describe('update', () => {
    it('should update goal if user is owner', async () => {
      const goal = { id: 'g1', ownerId: 'user1' };
      repo.findOne.mockResolvedValue(goal as Goal);
      repo.save.mockResolvedValue({ ...goal, title: 'Updated' } as Goal);

      const result = await service.update('user1', 'g1', { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });

    it('should throw if goal not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(
        service.update('user1', 'bad-id', { title: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if not owner', async () => {
      repo.findOne.mockResolvedValue({ id: 'g1', ownerId: 'user2' } as Goal);
      await expect(
        service.update('user1', 'g1', { title: 'X' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete goal if user is owner', async () => {
      repo.findOne.mockResolvedValue({ id: 'g1', ownerId: 'user1' } as Goal);

      await service.delete('user1', 'g1');
      expect(repo.delete).toHaveBeenCalledWith('g1');
    });
  });
});
