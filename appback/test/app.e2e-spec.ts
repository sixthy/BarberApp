import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model, Types } from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/schemas/user.schema';
import { BarberService } from '../src/services/schemas/service.schema';
import { Booking, BookingStatus, } from '../src/bookings/schemas/booking.schema';

describe('Barbearia E2E', () => {
  let app: INestApplication;

  let connection: Connection;
  let userModel: Model<User>;
  let serviceModel: Model<BarberService>;
  let bookingModel: Model<Booking>;

  let clientToken: string;
  let adminToken: string;
  let serviceId: string;
  let bookingId: string;
  let blockedTimeId: string;
  let pastBookingId: string;
  let blacklistEntryId: string;

  const clientEmail = `cliente-teste-${Date.now()}@email.com`;
  const clientPassword = '123456';

  const adminEmail = `admin-teste-${Date.now()}@email.com`;
  const adminPassword = '123456';

  beforeAll(async () => {
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/barbearia_e2e';
    process.env.JWT_SECRET = 'jwt_secret_e2e_seguro';
    process.env.FRONTEND_URLS = 'http://localhost:3000';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    connection = app.get<Connection>(getConnectionToken());
    userModel = app.get<Model<User>>(getModelToken(User.name));
    serviceModel = app.get<Model<BarberService>>(
      getModelToken(BarberService.name),
    );

    bookingModel = app.get<Model<Booking>>(getModelToken(Booking.name));
    await connection.dropDatabase();

    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    await userModel.create({
      name: 'Gabriel Ferreira',
      email: adminEmail,
      password: hashedAdminPassword,
      phone: '+351999999998',
      role: 'admin',
    });

    const service = await serviceModel.create({
      name: 'Corte Tesoura',
      price: 20,
      durationInMinutes: 40,
      isActive: true,
      imageUrl: '/corte1.jpg',
    });

    serviceId = service._id.toString();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await app.close();
  });

  it('cliente cadastra', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Cliente Teste',
        email: clientEmail,
        password: clientPassword,
        phone: '+351999999999',
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user.email).toBe(clientEmail);

    clientToken = response.body.accessToken;
  });

  it('cliente faz login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: clientEmail,
        password: clientPassword,
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user.role).toBe('client');

    clientToken = response.body.accessToken;
  });

  it('cliente vê horários disponíveis', async () => {
    const response = await request(app.getHttpServer())
      .get(`/schedules/available?date=2026-05-20&serviceIds=${serviceId}`)
      .expect(200);

    expect(response.body.isClosed).toBe(false);
    expect(response.body.availableTimes.length).toBeGreaterThan(0);
  });

  it('cliente agenda serviço', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        serviceIds: [serviceId],
        date: '2026-05-20',
        startTime: '10:00',
        customerPhone: '+351999999999',
      })
      .expect(201);

    expect(response.body.customerEmail).toBe(clientEmail);
    expect(response.body.serviceNames).toContain('Corte Tesoura');
    expect(response.body.startTime).toBe('10:00');
    expect(response.body.endTime).toBe('10:40');
    expect(response.body.status).toBe('confirmed');

    bookingId = response.body._id;
  });

  it('mesmo horário some da lista', async () => {
    const response = await request(app.getHttpServer())
      .get(`/schedules/available?date=2026-05-20&serviceIds=${serviceId}`)
      .expect(200);

    const hasTenOClock = response.body.availableTimes.some(
      (time: { startTime: string }) => time.startTime === '10:00',
    );

    expect(hasTenOClock).toBe(false);
  });

  it('admin faz login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword,
      })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.role).toBe('admin');

    adminToken = response.body.accessToken;
  });

  it('admin vê próprio nome no dashboard via auth/me', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.email).toBe(adminEmail);
    expect(response.body.name).toBe('Gabriel Ferreira');
    expect(response.body.role).toBe('admin');
  });

  it('admin lista agendamentos', async () => {
    const response = await request(app.getHttpServer())
      .get('/bookings')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    bookingId = response.body[0]._id;
  });

  it('admin edita agendamento', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        serviceIds: [serviceId],
        date: '2026-05-20',
        startTime: '11:00',
        customerPhone: '+351911111111',
      })
      .expect(200);

    expect(response.body._id).toBe(bookingId);
    expect(response.body.startTime).toBe('11:00');
    expect(response.body.endTime).toBe('11:40');
    expect(response.body.customerPhone).toBe('+351911111111');
    expect(response.body.status).toBe('confirmed');
  });

  it('admin cancela agendamento', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body._id).toBe(bookingId);
    expect(response.body.status).toBe('cancelled');
  });

  it('horário cancelado volta a aparecer', async () => {
    const response = await request(app.getHttpServer())
      .get(`/schedules/available?date=2026-05-20&serviceIds=${serviceId}`)
      .expect(200);

    const hasElevenOClock = response.body.availableTimes.some(
      (time: { startTime: string }) => time.startTime === '11:00',
    );

    expect(hasElevenOClock).toBe(true);
  });

  it('admin bloqueia um horário', async () => {
    const response = await request(app.getHttpServer())
      .post('/schedule-blocks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        date: '2026-05-20',
        type: 'time',
        startTime: '12:00',
        endTime: '12:40',
        reason: 'Bloqueio E2E',
      })
      .expect(201);

    expect(response.body._id).toBeDefined();
    expect(response.body.date).toBe('2026-05-20');
    expect(response.body.type).toBe('time');
    expect(response.body.startTime).toBe('12:00');
    expect(response.body.endTime).toBe('12:40');
    expect(response.body.isActive).toBe(true);

    blockedTimeId = response.body._id;
  });

  it('horário bloqueado some da agenda', async () => {
    const response = await request(app.getHttpServer())
      .get(`/schedules/available?date=2026-05-20&serviceIds=${serviceId}`)
      .expect(200);

    const hasTwelveOClock = response.body.availableTimes.some(
      (time: { startTime: string }) => time.startTime === '12:00',
    );

    expect(hasTwelveOClock).toBe(false);
  });

  it('admin reabre horário', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/schedule-blocks/${blockedTimeId}/reopen`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body._id).toBe(blockedTimeId);
    expect(response.body.isActive).toBe(false);
  });

  it('horário reaberto volta a aparecer', async () => {
    const response = await request(app.getHttpServer())
      .get(`/schedules/available?date=2026-05-20&serviceIds=${serviceId}`)
      .expect(200);

    const hasTwelveOClock = response.body.availableTimes.some(
      (time: { startTime: string }) => time.startTime === '12:00',
    );

    expect(hasTwelveOClock).toBe(true);
  });

  it('prepara um agendamento passado para marcar falta', async () => {
    const pastBooking = await bookingModel.create({
      customerName: 'Cliente Teste',
      customerEmail: clientEmail,
      customerPhone: '+351999999999',
      serviceIds: [new Types.ObjectId(serviceId)],
      serviceNames: ['Corte Tesoura'],
      totalPrice: 20,
      totalDurationInMinutes: 40,
      date: '2020-05-20',
      startTime: '10:00',
      endTime: '10:40',
      status: BookingStatus.CONFIRMED,
    });

    pastBookingId = pastBooking._id.toString();

    expect(pastBookingId).toBeDefined();
  });

  it('admin marca falta', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/bookings/${pastBookingId}/no-show`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.booking._id).toBe(pastBookingId);
    expect(response.body.booking.status).toBe('no_show');
    expect(response.body.blacklistEntry).toBeDefined();
    expect(response.body.blacklistEntry.customerEmail).toBe(clientEmail);
  });

  it('cliente entra na blacklist', async () => {
    const response = await request(app.getHttpServer())
      .get('/blacklist')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    const entry = response.body.find(
      (item: { customerEmail: string }) => item.customerEmail === clientEmail,
    );

    expect(entry).toBeDefined();
    expect(entry.customerEmail).toBe(clientEmail);
    expect(entry.customerPhone).toBe('+351999999999');
    expect(entry.noShowCount).toBeGreaterThanOrEqual(1);

    blacklistEntryId = entry._id;
  });

  it('admin remove cliente da blacklist', async () => {
    await request(app.getHttpServer())
      .delete(`/blacklist/${blacklistEntryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/blacklist')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const entry = response.body.find(
      (item: { customerEmail: string }) => item.customerEmail === clientEmail,
    );

    expect(entry).toBeUndefined();
  });

  it("não deixa listar agendamentos sem token", async () => {
    await request(app.getHttpServer())
      .get("/bookings")
      .expect(401);
  });

  it("não deixa cliente listar agendamentos do admin", async () => {
    await request(app.getHttpServer())
      .get("/bookings")
      .set("Authorization", `Bearer ${clientToken}`)
      .expect(403);
  });

  it("não deixa cancelar agendamento sem token", async () => {
    await request(app.getHttpServer())
      .patch(`/bookings/${bookingId}/cancel`)
      .expect(401);
  });

  it("não deixa cliente acessar blacklist", async () => {
    await request(app.getHttpServer())
      .get("/blacklist")
      .set("Authorization", `Bearer ${clientToken}`)
      .expect(403);
  });

  it("não deixa acessar blacklist sem token", async () => {
    await request(app.getHttpServer())
      .get("/blacklist")
      .expect(401);
  });

  it("não deixa cliente criar bloqueio de horário", async () => {
    await request(app.getHttpServer())
      .post("/schedule-blocks")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        type: "time",
        date: "2026-05-22",
        startTime: "15:00",
        endTime: "16:00",
        reason: "Tentativa cliente",
      })
      .expect(403);
  });

  it("não deixa criar bloqueio sem token", async () => {
    await request(app.getHttpServer())
      .post("/schedule-blocks")
      .send({
        type: "time",
        date: "2026-05-22",
        startTime: "15:00",
        endTime: "16:00",
        reason: "Sem token",
      })
      .expect(401);
  });

});