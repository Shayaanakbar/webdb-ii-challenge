const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

server.use(express.json());
server.use(helmet());

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true,
};

const db = knex(knexConfig);

// endpoints here

server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

server.get('/api/zoos/:id', (req,res) => {
  db('zoos')
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      if(zoo) {

      } else {
        res.status(404).json({ message: 'Roll not found ' });
      }
      res.status(200).json(zoo)
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post('/api/zoos', (req, res) => {
  db('zoos')
    .insert(req.body, 'id')
    .then(ids => {
      db('zoos')
        .where({id: ids[0] })
        .first()
        .then(zoo => {
          res.status(200).json(zoo);
        })
        .catch(err => {
          res.status(500).json(err);
        })
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.put('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({message: `${count} ${count > 1 ? 'records' : 'record'} updated`,});
      } else {
        res.status(404).json({message: 'zoo does not exist '})
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({message: `${count} ${count > 1 ? 'records' : 'record'} updated`,});
      } else {
        res.status(404).json({message: 'Role does not exist '})
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

module.exports = server;