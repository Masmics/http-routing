const fs = require('fs');
const shortid = require('shortid');

class Store {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  create(obj, callback) {
    // create _id and put it into obj
    const _id = shortid.generate();
    const objWithId = { ...obj, _id };
    // JSON.stringify my obj with id
    const objWithIdStr = JSON.stringify(objWithId);
    // fs.writeFile to save object on disk
    //    this.rootDir + / + ${_id}.json
    fs.writeFile(this.storedFilePath(_id), objWithIdStr, err => {
      // invoke callback(err, obj with id)
      // if(err) return callback(err)
      callback(err, objWithId);
    });
  }

  findById(_id, callback) {
    fs.readFile(this.storedFilePath(_id), { encoding: 'utf8' }, (err, data) => {
      try {
        const obj = JSON.parse(data);
        callback(err, obj);
      } catch(e) {
        callback(e);  
      }
    });
  }

  find(callback) {
    fs.readdir(this.rootDir, (err, listOfIds) => {
      let count = listOfIds.length;
      if(count < 1) return callback(err, []);

      const items = [];
      listOfIds.forEach(_id => {
        this.findById(_id, (err, item) => {
          count--; //decrement
          items.push(item);
          if(count === 0) callback(null, items);
        });
      });
    });
  }

  findByIdAndDelete(_id, callback) {
    fs.unlink(this.storedFilePath(_id), err => {
      callback(err, { deleted: 1 });
      if(this.storedFilePath(_id) === undefined) {
        throw `No object with _id ${_id}`;
      }
    });

    // BONUS: what if the file doesn't exist?????
    // -> return callback(err, { deleted: 0 })
  }

  findByIdAndUpdate(_id, updatedObject, callback) {
    this.findById(_id, err => {
      if(err) return callback(err);
      const objToWrite = { ...updatedObject, _id };
      const objToWriteStr = JSON.stringify(objToWrite);
      fs.writeFile(this.storedFilePath(_id), objToWriteStr, err => {
        callback(err, objToWrite);
      });
    });
  }

  storedFilePath(_id) {
    return `${this.rootDir}/${_id}`;
  }
}

module.exports = Store;
