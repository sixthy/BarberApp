"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleBlocksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_block_schema_1 = require("./schemas/schedule-block.schema");
let ScheduleBlocksService = class ScheduleBlocksService {
    scheduleBlockModel;
    constructor(scheduleBlockModel) {
        this.scheduleBlockModel = scheduleBlockModel;
    }
    async create(createScheduleBlockDto) {
        if (createScheduleBlockDto.type === 'time') {
            if (!createScheduleBlockDto.startTime ||
                !createScheduleBlockDto.endTime) {
                throw new common_1.BadRequestException('Para bloquear horário, informe startTime e endTime.');
            }
            if (createScheduleBlockDto.startTime >= createScheduleBlockDto.endTime) {
                throw new common_1.BadRequestException('O horário inicial deve ser menor que o horário final.');
            }
        }
        const block = await this.scheduleBlockModel.create(createScheduleBlockDto);
        return block;
    }
    async findAll() {
        return this.scheduleBlockModel
            .find()
            .sort({
            date: 1,
            startTime: 1,
        })
            .exec();
    }
    async findActiveByDate(date) {
        return this.scheduleBlockModel
            .find({
            date,
            isActive: true,
        })
            .exec();
    }
    async reopen(id) {
        const block = await this.scheduleBlockModel
            .findByIdAndUpdate(id, {
            isActive: false,
        }, {
            new: true,
        })
            .exec();
        if (!block) {
            throw new common_1.NotFoundException('Bloqueio não encontrado.');
        }
        return block;
    }
};
exports.ScheduleBlocksService = ScheduleBlocksService;
exports.ScheduleBlocksService = ScheduleBlocksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schedule_block_schema_1.ScheduleBlock.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ScheduleBlocksService);
//# sourceMappingURL=schedule-blocks.service.js.map