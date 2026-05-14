import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BarberService, BarberServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';



@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(BarberService.name) private readonly serviceModel: Model<BarberServiceDocument>,
  ) { }

  async create(createServiceDto: CreateServiceDto) {
    return this.serviceModel.create(createServiceDto);
  }

  async findAll() {
    return this.serviceModel.find().sort({ createdAt: -1 }).exec();
  }

  async findActive() {
    return this.serviceModel.find({ isActive: true }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const service = await this.serviceModel.findById(id).exec();

    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, {
        new: true,
      })
      .exec();

    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    return service;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID de serviço inválido.");
    }

    const service = await this.serviceModel
      .findByIdAndUpdate(
        id,
        {
          isActive: false,
        },
        {
          new: true,
        },
      )
      .exec();

    if (!service) {
      throw new NotFoundException("Serviço não encontrado.");
    }

    return {
      message: "Serviço desativado com sucesso.",
      service,
    };
  }
}
