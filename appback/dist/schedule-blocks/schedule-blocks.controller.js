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
exports.ScheduleBlocksController = void 0;
const common_1 = require("@nestjs/common");
const schedule_blocks_service_1 = require("./schedule-blocks.service");
const create_schedule_block_dto_1 = require("./dto/create-schedule-block.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let ScheduleBlocksController = class ScheduleBlocksController {
    scheduleBlocksService;
    constructor(scheduleBlocksService) {
        this.scheduleBlocksService = scheduleBlocksService;
    }
    create(createScheduleBlockDto) {
        return this.scheduleBlocksService.create(createScheduleBlockDto);
    }
    findAll() {
        return this.scheduleBlocksService.findAll();
    }
    reopen(id) {
        return this.scheduleBlocksService.reopen(id);
    }
};
exports.ScheduleBlocksController = ScheduleBlocksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_block_dto_1.CreateScheduleBlockDto]),
    __metadata("design:returntype", void 0)
], ScheduleBlocksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScheduleBlocksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/reopen'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleBlocksController.prototype, "reopen", null);
exports.ScheduleBlocksController = ScheduleBlocksController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('schedule-blocks'),
    __metadata("design:paramtypes", [schedule_blocks_service_1.ScheduleBlocksService])
], ScheduleBlocksController);
//# sourceMappingURL=schedule-blocks.controller.js.map