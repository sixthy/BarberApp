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
exports.BlacklistSchema = exports.BlacklistEntry = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let BlacklistEntry = class BlacklistEntry {
    customerName;
    customerEmail;
    customerPhone;
    noShowCount;
    isBlocked;
    blockedUntil;
    lastNoShowAt;
    reason;
};
exports.BlacklistEntry = BlacklistEntry;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], BlacklistEntry.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    }),
    __metadata("design:type", String)
], BlacklistEntry.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        index: true,
    }),
    __metadata("design:type", String)
], BlacklistEntry.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 0,
    }),
    __metadata("design:type", Number)
], BlacklistEntry.prototype, "noShowCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], BlacklistEntry.prototype, "isBlocked", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: null,
    }),
    __metadata("design:type", Date)
], BlacklistEntry.prototype, "blockedUntil", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: null,
    }),
    __metadata("design:type", Date)
], BlacklistEntry.prototype, "lastNoShowAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: '',
    }),
    __metadata("design:type", String)
], BlacklistEntry.prototype, "reason", void 0);
exports.BlacklistEntry = BlacklistEntry = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], BlacklistEntry);
exports.BlacklistSchema = mongoose_1.SchemaFactory.createForClass(BlacklistEntry);
//# sourceMappingURL=blacklist.schema.js.map