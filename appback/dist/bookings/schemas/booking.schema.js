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
exports.BookingSchema = exports.Booking = exports.BookingStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["NO_SHOW"] = "no_show";
    BookingStatus["COMPLETED"] = "completed";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
let Booking = class Booking {
    customerName;
    customerEmail;
    customerPhone;
    serviceIds;
    serviceNames;
    totalPrice;
    totalDurationInMinutes;
    date;
    startTime;
    endTime;
    status;
};
exports.Booking = Booking;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], Booking.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], Booking.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], Booking.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'BarberService' }],
        required: true,
    }),
    __metadata("design:type", Array)
], Booking.prototype, "serviceIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], Booking.prototype, "serviceNames", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        min: 0,
    }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        min: 1,
    }),
    __metadata("design:type", Number)
], Booking.prototype, "totalDurationInMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Booking.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Booking.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Booking.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: BookingStatus,
        default: BookingStatus.CONFIRMED,
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
exports.Booking = Booking = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Booking);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
//# sourceMappingURL=booking.schema.js.map