const mkdirp = require('mkdirp');  //mkdir plus parent rm rf
const rimraf = require('rimraf');
const Store = require('../../lib/models/index');

describe('Store',  () => {
  let store = null;
  beforeEach(done => {
    rimraf('./testData/store', err => {
      done(err);
    });
  });

  beforeEach(done => {
    mkdirp('./testData/store', err => {
      done(err);
    });
  });

  beforeEach(() => {
    store = new Store('./testData/store');
  });

  it('creates an object in my store', done => {
    store.create({ name: 'ryan' }, (err, createdPerson) => {
      expect(err).toBeFalsy();
      expect(createdPerson).toEqual({ name: 'ryan', _id: expect.any(String) });
      done();
    });
  });

  it('finds an object by id', done => {
    store.create({ name: 'ryan' }, (err, createdPerson) => {
      store.findById(createdPerson._id, (err, foundPerson) => {
        expect(err).toBeFalsy(); //
        expect(foundPerson).toEqual({ name: 'ryan', _id: createdPerson._id });
        done();
      });
    });
  });

  it('finds all objects tracked by the store', done => {
    store.create({ item: 1 }, (err, item1) => {
      store.create({ item: 2 }, (err, item2) => {
        store.create({ item: 3 }, (err, item3) => {
          store.create({ item: 4 }, (err, item4) => {
            store.create({ item: 5 }, (err, item5) => {
              store.find((err, listOfItems) => {
                expect(err).toBeFalsy();
                expect(listOfItems).toHaveLength(5);
                expect(listOfItems).toContainEqual(item1);
                expect(listOfItems).toContainEqual(item2);
                expect(listOfItems).toContainEqual(item3);
                expect(listOfItems).toContainEqual(item4);
                expect(listOfItems).toContainEqual(item5);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('finds an object by id and deletes it', done => {
    store.create({ name: 'ryan' }, (err, createdPerson) => {
      store.findByIdAndDelete(createdPerson._id, (err, result) => {
        expect(err).toBeFalsy();
        expect(result).toEqual({ deleted: 1 });
        store.findById(createdPerson._id, (err, foundPerson) => {
          expect(err).toBeTruthy();
          expect(foundPerson).toBeFalsy();
          done();
        });      
      });
    });
  });

  it('updates an existing object', () => {
    store.create({ name: 'objetc1' }, (err, typoCreated) => {
      store.findByIdAndUpdate(typoCreated._id, { name: 'object1' }, (err, updatedWithoutTypo) => {
        expect(err).toBeFalsy();
        expect(updatedWithoutTypo).toEqual({ name: 'object1', _id: typoCreated._id });
        store.findById(typoCreated._id, (err, foundObj) => {
          expect(foundObj).toEqual(updatedWithoutTypo);
        });
      });
    });
  });
});


//   it('updates an existing object', () => {
//     store.create({ name: 'object1' }, (err, createdPerson) => {
//       store.findByIdAndUpdate(_id, { name: 'object2' }, (err, updatedPerson) => {
//         //expect(updatedPerson).toReturn(createdPerson({ name: 'object2'}));
//         store.findById(createdPerson._id, (err, foundPerson) => {
//           expect(updatedPerson).toEqual({ name: 'object2'});
//         });
//       });
//     });
//   });
// });

// STRETCH GOAL: .findByIdAndUpdate(_id, objectToUpdate, callback(error, updatedObject))
// Write the new object to file, replacing existing object
// Takes a callback which takes an error and the deserialized (JSON.parse) updated object};
