const People = require('./models/People');
const bodyParser = require('./bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        People.create({ 
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, createdPerson) => {
          res.sendWithError(res, err, createdPerson);
        });
      });
  } else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, listOfPeople) => {
      res.sendWithError(err, listOfPeople);
    });
  } else if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = url.slice(0).split('/')[1]; //.pathname?
    People.findById(id, (err, person) => {
      res.sendWithError(err, person);
    });
  }
};
