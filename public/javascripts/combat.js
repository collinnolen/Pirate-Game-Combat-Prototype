$(document).ready(function() {

  shipSetUp = function(usership, enemyship, callback){

    Promise.all([shuffleDeck(usership.deck), shuffleDeck(enemyship.deck)])
      .then(function(decks){
        usership.deck = decks[0];
        enemyship.deck = decks[1];

        let userDrawing = true,
          enemyDrawing = true;
          counter = 0;

        while(userDrawing || enemyDrawing){

          //check if user is drawing cards
          if(usership.handsize > counter)
            drawCard(usership);
          else
            userDrawing = false;

          //check if enemy is drawing cards
          if(enemyship.handsize > counter)
            drawCard(enemyship);
          else
            enemyDrawing = false;

          counter ++;
        }

        callback();
      });

  }

  drawCard = function(ship){

    if(ship.deck.length > 0){
      //draws the first card from deck and adds to hand
      ship.currentHand.push(ship.deck.shift());
    }
    else{
      reshuffleDeck(ship)
        .then(function(deck){
          ship.currentHand.push(ship.deck.shift());
        });
    }
  }

  shuffleDeck = function(array){
    return new Promise(function(resolve, reject){
      var m = array.length, t, i;

      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return resolve(array);
    });
  }

  reshuffleDeck = function(ship){
      return new Promise(function(resolve, reject){

        //Move graveyard to deck and clear graveyard
        ship.deck = ship.graveyard;
        ship.graveyard = [];

        //shuffleDeck
        shuffleDeck(ship.deck)
          .then(function(deck){
            ship.deck = deck;
          });

        resolve();
      });

  }

  useCardFromHand = function(index, ship){
    let usedCard = (ship.currentHand.splice(index, 1))[0];
    ship.currentMana -= parseInt(usedCard.manacost);
    ship.graveyard.push(usedCard);
    drawCard(ship);
    //Call effect of the card


    addMoveToList(usedCard, ship);
  }


  cardEffect = function(card, ship, otherShip){
    //applies effect of a card
  }

  enemyAI = function(enemyShip){
    if(enemyShip.nextMove === null){
      enemyShip.nextMove = Math.floor((Math.random() * enemyShip.handsize));
      console.log(enemyShip.nextMove);
    }
    else{
      if(enemyShip.currentHand[enemyShip.nextMove] != undefined){
        if(enemyShip.currentMana > enemyShip.currentHand[enemyShip.nextMove].manacost){
          useCardFromHand(enemyShip.nextMove, enemyShip);
          enemyShip.nextMove = null;
        }
      }
    }

  }


  addMoveToList = function(card, ship){
    let $list = $('ul');
    let $li = $('<li>'+ ship.name + ' used '+ card.name + '. Effect: ' + card.effect + ': ' + card.effectAmount +'</li>');
    $list.prepend($li);
  }


});
