const peopleRoutes = require('./routes/people');

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
  
  //then POST
};
