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

  describe('happy path', () => {
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
  });

  describe('error paths', () => {
    it('rejects an invalid body with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'ab', priority: 9, projectId: 1 })
        .expect(400);

      expect(JSON.stringify(res.body.message)).toContain('title');
    });

    it('returns 404 for an unknown task id', () => {
      return request(app.getHttpServer()).get('/tasks/999999').expect(404);
    });

    it('returns 400 for a missing required field', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ priority: 3, projectId: 1 })
        .expect(400);
    });

    it('returns 400 for an unrecognized extra field', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Valid title',
          priority: 3,
          projectId: 1,
          junkField: 'x',
        })
        .expect(400);
    });

    it('returns 204 on delete, then 404 on a follow-up read', async () => {
      const created = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'To be deleted', priority: 2, projectId: 1 })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/tasks/${created.body.id}`)
        .expect(204);

      return request(app.getHttpServer())
        .get(`/tasks/${created.body.id}`)
        .expect(404);
    });

    it('returns 404 when creating a task against a nonexistent project', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Orphan task', priority: 1, projectId: 999999 })
        .expect(404);
    });
  });
});
