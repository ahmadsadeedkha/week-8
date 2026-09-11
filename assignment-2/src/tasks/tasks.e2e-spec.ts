import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module.js';

describe('Tasks (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a task then reads it back (happy path)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Write tests', priority: 3, projectId: 1 })
      .expect(201);

    expect(createRes.body).toHaveProperty('id');
    expect(createRes.body.title).toBe('Write tests');

    const getRes = await request(app.getHttpServer())
      .get(`/tasks/${createRes.body.id}`)
      .expect(200);

    expect(getRes.body.title).toBe('Write tests');
    expect(getRes.body).toHaveProperty('project');
  });

  it('rejects an invalid body with 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'ab', priority: 9, projectId: 1 })
      .expect(400);

    expect(JSON.stringify(res.body.message)).toContain('title');
  });
});
