import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

import { getConnection, getManager } from 'typeorm';
import { Movie } from '../src/movies/movie.entity';

const movieMock1 = {
  uuid: "127acb6f-8ada-435c-91c3-50a77f2bd342",
  title: 'Guardians of the Galaxy Vol. 2',
  year: 2017,
  metadata: {
    dummy: "value"
  }
}

const movieMock2 = {
  uuid: "127acb6f-8ada-435c-91c3-50a77f2bd383",
  title: 'No Country for Old Man',
  year: 2007,
  metadata: {
    dummy: "value"
  }
}

const movieMock3 = {
  title: 'Matrix',
  year: 1999
}

const badMovieMock2 = {
  uuid: "127acb6f-8ada-435c-91c3-50a77f2bd111",
  title: 'No Country for Old Dog',
  year: 2077,
  metadata: {
    dummy: "value"
  }
}

describe('Movies (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // await getConnection().close();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe());

    await app.init();


    // clear db
    await getManager().createQueryBuilder()
      .delete()
      .from('movie')
      .execute();

    // fixtures
    await getManager().createQueryBuilder()
        .insert()
        .into('movie')
        .values([movieMock1, movieMock2])
        .execute();
  });

  afterEach(async () => {
    await getConnection().close();
  });

  describe('/movies (GET)', () => {
    it('should get all movies', async () => {
      const result = await request(app.getHttpServer())
        .get('/movies')
  
      expect(result.status).toBe(200);
      expect(result.body).not.toBeUndefined();
      expect(Array.isArray(result.body)).toBe(true);
      expect(result.body.length).toBe(2);
    });
  })

  describe('/movies/:uuid (GET)', () => {
    it('should return bad request error if uuid is not passed', async () => {
      const result = await request(app.getHttpServer())
        .get('/movies/asdad')
  
      expect(result.status).toBe(400);
      expect(result.body).not.toBeUndefined();

      expect(result.body).toHaveProperty('error');
      expect(result.body.error).toBe('Bad Request');

      expect(result.body).toHaveProperty('message');
      expect(result.body.message).toBe('Validation failed (uuid  is expected)');
    });

    it('should return not found error for non existing movie', async () => {
      const result = await request(app.getHttpServer())
        .get(`/movies/${badMovieMock2.uuid}`)
  
      expect(result.status).toBe(404);
      expect(result.body).not.toBeUndefined();

      expect(result.body).toHaveProperty('error');
      expect(result.body.error).toBe('Not Found');

      expect(result.body).toHaveProperty('message');
      expect(result.body.message).toBe(`Movie with uuid "${badMovieMock2.uuid}" not found`);
    });

    it('should return existing movie', async () => {
      const result = await request(app.getHttpServer())
        .get(`/movies/${movieMock1.uuid}`)
  
      expect(result.status).toBe(200);
      expect(result.body).not.toBeUndefined();

      expect(result.body).toHaveProperty('title');
      expect(result.body.title).toBe(movieMock1.title);

      expect(result.body).toHaveProperty('year');
      expect(result.body.year).toBe(movieMock1.year);

      expect(result.body).toHaveProperty('uuid');
      expect(result.body.uuid).toBe(movieMock1.uuid);
    });
  }) // end '/:uuid (GET)'

  describe('/movies (POST)', () => {
    it('should return bad request for empty body', async () => {
      const result = await request(app.getHttpServer())
        .post(`/movies`)
        // .send({})
          
      expect(result.status).toBe(400);
      expect(result.body).not.toBeUndefined();

      expect(result.body).toHaveProperty('error');
      expect(result.body.error).toBe('Bad Request');

      expect(result.body).toHaveProperty('message');
      expect(Array.isArray(result.body.message)).toBe(true);
      expect(result.body.message.length).toBe(2);
    });

    it('should return bad request for empty object body', async () => {
      const result = await request(app.getHttpServer())
        .post(`/movies`)
        .send({})
          
      expect(result.status).toBe(400);
      expect(result.body).not.toBeUndefined();

      expect(result.body).toHaveProperty('error');
      expect(result.body.error).toBe('Bad Request');

      expect(result.body).toHaveProperty('message');
      expect(Array.isArray(result.body.message)).toBe(true);
      expect(result.body.message.length).toBe(2);
    });

    it('should return bad request for body without title', async () => {
      const result = await request(app.getHttpServer())
        .post(`/movies`)
        .send({
          year: 1000
        })
          
      expect(result.status).toBe(400);
      expect(result.body).not.toBeUndefined();

      expect(result.body).toHaveProperty('error');
      expect(result.body.error).toBe('Bad Request');

      expect(result.body).toHaveProperty('message');
      expect(Array.isArray(result.body.message)).toBe(true);
      expect(result.body.message.length).toBe(1);
    });

    
    it('should return bad request for body without year', async () => {
      const result = await request(app.getHttpServer())
        .post(`/movies`)
        .send({
          title: 'Dooo'
        })
          
      expect(result.status).toBe(400);
      expect(result.body).not.toBeUndefined();

      expect(result.body).toHaveProperty('error');
      expect(result.body.error).toBe('Bad Request');

      expect(result.body).toHaveProperty('message');
      expect(Array.isArray(result.body.message)).toBe(true);
      expect(result.body.message.length).toBe(1);
    });

    it('should return bad request for movie non existing in database', async () => {
      const result = await request(app.getHttpServer())
        .post(`/movies`)
        .send(badMovieMock2)
          
      expect(result.status).toBe(400);
      expect(result.body).not.toBeUndefined();

      expect(result.body).toHaveProperty('error');
      expect(result.body.error).toBe('Bad Request');

      expect(result.body).toHaveProperty('message');
      expect(result.body.message).toBe('Cannot fetch movie data from omdbapi');
    });

    it('should create new movie', async () => {
      const result = await request(app.getHttpServer())
        .post(`/movies`)
        .send(movieMock3)
          
      expect(result.status).toBe(201);
      expect(result.body).not.toBeUndefined();

      // check response
      expect(result.body).not.toHaveProperty('error');

      expect(result.body).toHaveProperty('title');
      expect(result.body.title).toBe(movieMock3.title);

      expect(result.body).toHaveProperty('year');
      expect(result.body.year).toBe(movieMock3.year);

      expect(result.body).toHaveProperty('metadata');

      // check database
      const dbResult = await getManager().find(Movie);

      expect(dbResult.length).toBe(3);
    });
  });
});
