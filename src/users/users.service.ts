import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Verificar se o plano existe (se planId foi fornecido)
    if (createUserDto.planId) {
      const plan = await this.prisma.plan.findUnique({
        where: { id: createUserDto.planId },
      });

      if (!plan) {
        throw new NotFoundException(`Plan with ID ${createUserDto.planId} not found`);
      }
    }

    return this.prisma.user.create({
      data: createUserDto,
      include: {
        plan: true,
      },
    });
  }

  async findAll(email?: string) {
    if (email) {
      const users = await this.prisma.user.findMany({
        where: {
          email: email,
        },
        include: {
          plan: true,
        },
      });

      if (users.length === 0) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return users;
    }

    return this.prisma.user.findMany({
      include: {
        plan: true,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        plan: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        plan: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Verificar se o plano existe (se planId foi fornecido)
    if (updateUserDto.planId) {
      const plan = await this.prisma.plan.findUnique({
        where: { id: updateUserDto.planId },
      });

      if (!plan) {
        throw new NotFoundException(`Plan with ID ${updateUserDto.planId} not found`);
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        plan: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async assignPlan(userId: string, planId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { planId },
      include: {
        plan: true,
      },
    });
  }

  async removePlan(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { planId: null },
      include: {
        plan: true,
      },
    });
  }
}
