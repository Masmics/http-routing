const request = require('supertest');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const app = require('../lib/app');

const createPerson = () => {
  return request(app)
    .post('/people')
    .send({
      name: 'Bob',
      age: 100,
      favoriteColor: 'blue'
    });
  //.then(res = res.body);
};

describe('app tests', () => {

  beforeEach(done => {
    rimraf('./data/people', err => {
      done(err);
    });
  });
  beforeEach(done => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });
  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Bob',
        age: 100,
        favoriteColor: 'blue'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Bob',
          age: 100,
          favoriteColor: 'blue'
        });
      });
  });
  it('gets a list of people from our db', () => {
    const namesToCreate = ['ryan, ryan1, ryan 2'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  it('gets a person by id', () => {
    return createPerson('ryan')
      .then(() => {
        return request(app)
          .get('/people/id');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(1);
      });
  });
});

