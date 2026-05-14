import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  BlacklistDocument,
  BlacklistEntry,
} from './schemas/blacklist.schema';

type RegisterNoShowData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

@Injectable()
export class BlacklistService {
  private readonly maxNoShows = 2;
  private readonly blockDays = 7;

  constructor(
    @InjectModel(BlacklistEntry.name)
    private readonly blacklistModel: Model<BlacklistDocument>,
  ) { }

  async checkClientCanBook(customerEmail: string, customerPhone: string) {
    const entry = await this.blacklistModel
      .findOne({
        $or: [
          { customerEmail: customerEmail.toLowerCase() },
          { customerPhone },
        ],
      })
      .exec();

    if (!entry) {
      return true;
    }

    if (entry.isBlocked && entry.blockedUntil) {
      const now = new Date();

      if (entry.blockedUntil > now) {
        throw new BadRequestException(
          `Cliente bloqueado até ${entry.blockedUntil.toLocaleDateString('pt-PT')}.`,
        );
      }

      entry.isBlocked = false;
      entry.blockedUntil = undefined;
      await entry.save();
    }

    return true;
  }

  async registerNoShow(data: RegisterNoShowData) {
    const existingEntry = await this.blacklistModel
      .findOne({
        $or: [
          { customerEmail: data.customerEmail.toLowerCase() },
          { customerPhone: data.customerPhone },
        ],
      })
      .exec();

    const newNoShowCount = existingEntry
      ? existingEntry.noShowCount + 1
      : 1;

    const shouldBlock = newNoShowCount >= this.maxNoShows;

    const blockedUntil = shouldBlock
      ? this.addDays(new Date(), this.blockDays)
      : undefined;

    if (existingEntry) {
      existingEntry.customerName = data.customerName;
      existingEntry.customerEmail = data.customerEmail.toLowerCase();
      existingEntry.customerPhone = data.customerPhone;
      existingEntry.noShowCount = newNoShowCount;
      existingEntry.lastNoShowAt = new Date();
      existingEntry.isBlocked = shouldBlock;
      existingEntry.blockedUntil = blockedUntil;
      existingEntry.reason = shouldBlock
        ? 'Cliente bloqueado por excesso de faltas.'
        : 'Cliente possui falta registrada.';

      return existingEntry.save();
    }

    return this.blacklistModel.create({
      customerName: data.customerName,
      customerEmail: data.customerEmail.toLowerCase(),
      customerPhone: data.customerPhone,
      noShowCount: newNoShowCount,
      lastNoShowAt: new Date(),
      isBlocked: shouldBlock,
      blockedUntil,
      reason: shouldBlock
        ? 'Cliente bloqueado por excesso de faltas.'
        : 'Cliente possui falta registrada.',
    });
  }

  async findAll() {
    return this.blacklistModel.find().sort({ updatedAt: -1 }).exec();
  }

  async findBlocked() {
    return this.blacklistModel
      .find({
        isBlocked: true,
      })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async unblock(id: string) {
    const entry = await this.blacklistModel
      .findByIdAndUpdate(
        id,
        {
          isBlocked: false,
          blockedUntil: null,
          reason: 'Cliente desbloqueado manualmente.',
        },
        {
          new: true,
        },
      )
      .exec();

    if (!entry) {
      throw new NotFoundException('Registro de blacklist não encontrado.');
    }

    return entry;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID da blacklist inválido.');
    }

    const entry = await this.blacklistModel.findByIdAndDelete(id).exec();

    if (!entry) {
      throw new NotFoundException('Registro da blacklist não encontrado.');
    }

    return {
      message: 'Cliente removido da blacklist com sucesso.',
    };
  }

  private addDays(date: Date, days: number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }
}