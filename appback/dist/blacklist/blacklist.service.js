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
exports.BlacklistService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const blacklist_schema_1 = require("./schemas/blacklist.schema");
let BlacklistService = class BlacklistService {
    blacklistModel;
    maxNoShows = 2;
    blockDays = 7;
    constructor(blacklistModel) {
        this.blacklistModel = blacklistModel;
    }
    async checkClientCanBook(customerEmail, customerPhone) {
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
                throw new common_1.BadRequestException(`Cliente bloqueado até ${entry.blockedUntil.toLocaleDateString('pt-PT')}.`);
            }
            entry.isBlocked = false;
            entry.blockedUntil = undefined;
            await entry.save();
        }
        return true;
    }
    async registerNoShow(data) {
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
    async unblock(id) {
        const entry = await this.blacklistModel
            .findByIdAndUpdate(id, {
            isBlocked: false,
            blockedUntil: null,
            reason: 'Cliente desbloqueado manualmente.',
        }, {
            new: true,
        })
            .exec();
        if (!entry) {
            throw new common_1.NotFoundException('Registro de blacklist não encontrado.');
        }
        return entry;
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID da blacklist inválido.');
        }
        const entry = await this.blacklistModel.findByIdAndDelete(id).exec();
        if (!entry) {
            throw new common_1.NotFoundException('Registro da blacklist não encontrado.');
        }
        return {
            message: 'Cliente removido da blacklist com sucesso.',
        };
    }
    addDays(date, days) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }
};
exports.BlacklistService = BlacklistService;
exports.BlacklistService = BlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blacklist_schema_1.BlacklistEntry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlacklistService);
//# sourceMappingURL=blacklist.service.js.map