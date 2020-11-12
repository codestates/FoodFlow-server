const express = require('express')
const app = express()
const port = 3000
const { user } = require('./models');
 
app.get('/', (req, res) => {
  user
    .findAll()
    .then(result => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.sendStatus(204);
      }
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500); // Server error
    });
})               

  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/서버연결완료`)
})
