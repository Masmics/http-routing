const peopleRoutes = require('./routes/people');
const { parse } = require('url');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  
  res.sendWithError = (err, json) => {
    if(err) {
      res.statusCode = 400;
      res.send(err);
    } else {
      res.send(json);
    }
  };
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');
  
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

    //then POST
  }
};
