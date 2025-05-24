import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Goal } from './entities/goal/goal';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Goals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goal' })
  @ApiOkResponse({ description: 'Goal created successfully' })
  create(@Request() req, @Body() dto: CreateGoalDto) {
    return this.goalsService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all goals for authenticated user' })
  findAll(@Request() req) {
    return this.goalsService.findAllByUser(req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a goal by ID' })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goal by ID' })
  remove(@Request() req, @Param('id') id: string) {
    return this.goalsService.delete(req.user.userId, id);
  }

  @Get('public-goals')
  // @ApiBearerAuth(false)
  @ApiOperation({ summary: 'Get all public goals' })
  findPublic() {
    return this.goalsService.findPublicGoals();
  }

  @Get('public-goals/:publicId')
  // @ApiBearerAuth(false)
  @ApiOperation({ summary: 'Get public goal by ID' })
  findPublicById(@Param('publicId') publicId: string): Promise<Goal> {
    return this.goalsService.findPublicGoalById(publicId);
  }
}
