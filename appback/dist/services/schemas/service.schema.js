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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarberServiceSchema = exports.BarberService = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let BarberService = class BarberService {
    name;
    price;
    durationInMinutes;
    isActive;
    imageUrl;
};
exports.BarberService = BarberService;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], BarberService.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        min: 0,
    }),
    __metadata("design:type", Number)
], BarberService.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        min: 1,
    }),
    __metadata("design:type", Number)
], BarberService.prototype, "durationInMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: true,
    }),
    __metadata("design:type", Boolean)
], BarberService.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: false,
        default: '',
    }),
    __metadata("design:type", String)
], BarberService.prototype, "imageUrl", void 0);
exports.BarberService = BarberService = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], BarberService);
exports.BarberServiceSchema = mongoose_1.SchemaFactory.createForClass(BarberService);
//# sourceMappingURL=service.schema.js.map