const express     = require('express');
const bodyParser  = require('body-parser');
const mongo       = require('mongodb');
const monk        = require('monk');

const db = monk('localhost:27017/TetrisScores');
const tetris = express();
tetris.use(bodyParser.json());
tetris.use(bodyParser.urlencoded({ extended: true }));

tetris.get('/', (req, res, next) => {
  console.log('Tetris request.');
  next();
});

tetris.get('/scores', (req, res) => {
  console.log('Fetching scores.');

  getScoreboard().then(scoresArr => {
    res.status(200).send(scoresArr);
  });
});

tetris.post('/scores', (req, res) => {
  console.log('Submitting new score');
  if ((req.body.player && req.body.score)
  && (typeof(req.body.player) === 'string')
  && (req.body.player.length !== 0)
  && (!isNaN(req.body.score))) {
    console.log('creating new scoreboard entry.');
    console.log(req.body.player, req.body.player.length);
    var entry = {
      'player': req.body.player,
      'score': req.body.score
    }

    db.get('usercollection').insert(entry, (err, result) => {
      res.redirect('/');
    }); 
  } else {
    console.log('bad scoreboard submission.');
    res.redirect('/');
  }
});

tetris.use(express.static('static'));

tetris.listen(3003);

function getScoreboard() {
  return db.get('usercollection').find({},{},(e, docs) => {
    return docs;
  });
}