var express = require('express');
var router = express.Router();
const GoogleSpreadsheet = require('google-spreadsheet');

//1yBUc2IP7qUAPaSgA6h4309ePg1DSlz_XPRM6QmtsSLk/edit?usp=sharing
//1yBUc2IP7qUAPaSgA6h4309ePg1DSlz_XPRM6QmtsSLk/edit?usp=sharing
//1yBUc2IP7qUAPaSgA6h4309ePg1DSlz_XPRM6QmtsSLk
//https://docs.google.com/spreadsheets/d/e/2PACX-1vS7PNYbJO7kwBMsW3QSW14pozld-RnRorsaOZAkquTDlHLaFMkusaO0uHAfkpvYZEQeze3QYR1TZkQW/pubhtml


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/getShips', function(req, res){
  let ships = {};

  let userCards = [];
  let enemyCards = [];
  let UserShip = {};
  let EnemyShip = {};


  let sheet = new GoogleSpreadsheet('1yBUc2IP7qUAPaSgA6h4309ePg1DSlz_XPRM6QmtsSLk');

  sheet.getInfo(function(err, object){
    let worksheet = object.worksheets[0];

    //console.log(worksheet);
    worksheet.getCells({'min-row': 14, 'max-row': 100, 'min-col': 2, 'max-col': 9}, function(err, cells){
      for(let i = 0; i < (cells.length); i += 8){
        let obj = {};
        obj.name = cells[i].value;
        obj.manacost = cells[i+1].value;
        obj.delay = cells[i+2].value;
        obj.duration = cells[i+3].value;
        obj.effect = cells[i+4].value;
        obj.effectedSystem = '';
        obj.effectAmount = cells[i+5].value;
        obj.cardOwner = cells[i+6].value;
        let quantity = cells[i+7].value;

        for(let j = 0; j < quantity; j++){
          if(obj.cardOwner === 'user')
            userCards.push(obj);
          else
            enemyCards.push(obj);
        }
      }


      worksheet.getCells({'min-row': 1, 'max-row': 10, 'min-col': 3, 'max-col': 3}, function(err, cells){
        UserShip.name = 'User';
        UserShip.deck = userCards;
        UserShip.hp = cells[7].value;
        UserShip.chp = cells[8].value;
        UserShip.mana = cells[5].value;
        UserShip.manaCharge = cells[6].value;
        UserShip.handsize = cells[9].value;
        UserShip.currentHand = [];
        UserShip.currentMana = 0;
        UserShip.graveyard = [];

        EnemyShip.name = 'EnemyShip: ' + Math.floor((Math.random() * 100) + 1);
        EnemyShip.deck = enemyCards;
        EnemyShip.hp = cells[2].value;
        EnemyShip.chp = cells[3].value;
        EnemyShip.mana = cells[0].value;
        EnemyShip.manaCharge = cells[1].value;
        EnemyShip.handsize = cells[4].value;
        EnemyShip.currentHand = [];
        EnemyShip.currentMana = 0;
        EnemyShip.graveyard = [];
        EnemyShip.nextMove = null;

        ships.U = UserShip;
        ships.E = EnemyShip;

        res.send(ships)
      });
    });
  });

});


router.get('/combat', function(req, res){
  res.render('combat');
});

module.exports = router;
