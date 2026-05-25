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
exports.BlacklistController = void 0;
const common_1 = require("@nestjs/common");
const blacklist_service_1 = require("./blacklist.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let BlacklistController = class BlacklistController {
    blacklistService;
    constructor(blacklistService) {
        this.blacklistService = blacklistService;
    }
    findAll() {
        return this.blacklistService.findAll();
    }
    findBlocked() {
        return this.blacklistService.findBlocked();
    }
    unblock(id) {
        return this.blacklistService.unblock(id);
    }
    remove(id) {
        return this.blacklistService.remove(id);
    }
};
exports.BlacklistController = BlacklistController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlacklistController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('blocked'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlacklistController.prototype, "findBlocked", null);
__decorate([
    (0, common_1.Patch)(':id/unblock'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlacklistController.prototype, "unblock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlacklistController.prototype, "remove", null);
exports.BlacklistController = BlacklistController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('blacklist'),
    __metadata("design:paramtypes", [blacklist_service_1.BlacklistService])
], BlacklistController);
//# sourceMappingURL=blacklist.controller.js.map