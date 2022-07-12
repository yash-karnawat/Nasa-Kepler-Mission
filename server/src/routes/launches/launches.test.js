const app = require('../../app');
const request = require('supertest');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Testing GET /launches', () => {
    test('It should respond with status 200', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('Testing POST /launches', () => {
    const launchData = {
      mission: 'Misiunea vietii',
      target: 'Milmoi',
      launchDate: '04 September, 2000',
      rocket: 'Racheta vietii',
    };
    test('It should respond with status 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchData)
        .expect(201)
        .expect('Content-Type', /json/);

      const responseDate = new Date(response.body.launchDate).valueOf();
      const requestDate = new Date(launchData.launchDate).valueOf();

      expect(requestDate).toBe(responseDate);
    });

    test('It should check the required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send({ ...launchData, launchDate: '' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toStrictEqual({
        error: 'Invalid input property',
      });
    });

    test('It should return invalid date', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send({ ...launchData, launchDate: 'sraihreuw' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });

      expect(new Date(response.body.launchDate).toString()).toBe(
        'Invalid Date'
      );
    });
  });
});
