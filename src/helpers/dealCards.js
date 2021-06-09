
export const bg = {

  removeExplode: function(cardDeck, numOfPlayers){
    let explodingCards = cardDeck.filter(c => c.cardType === "explode");
    while(explodingCards.length >= numOfPlayers){
      let indexOfCard = cardDeck.indexOf(explodingCards.shift());
      cardDeck = cardDeck.slice(0, indexOfCard).concat(cardDeck.slice(indexOfCard + 1));
    }
    return cardDeck;
  },

  removeDefuse: function(cardDeck, numOfPlayers){
    let defuseCards = cardDeck.filter(c => c.cardType === "defuse");
    while(defuseCards.length > numOfPlayers + 1){
      let indexOfCard = cardDeck.indexOf(defuseCards.shift());
      cardDeck =  cardDeck.slice(0, indexOfCard).concat(cardDeck.slice(indexOfCard + 1));
    }
    return cardDeck;
  },

  distributeDefuse: function(cardDeck, players){
    let defuse = cardDeck.filter(c => c.cardType === "defuse");
    players.forEach( p => {
      p.hand.shift();
      p.hand.push(defuse[0]);
      let indexOfCard = cardDeck.indexOf(defuse.shift());
      cardDeck = cardDeck.slice(0, indexOfCard).concat(cardDeck.slice(indexOfCard + 1));
    });
    return [players, cardDeck];
  },

  shuffleCards: function(cardDeck){
    return cardDeck.sort(() => Math.random() - 0.5);
  },

  dealCards: function(cardDeck, players){
    let cardsToDeal = cardDeck.filter(c => c.cardType !== 'explode');
    let explodingCards = cardDeck.filter(c => c.cardType === 'explode');

    // for testing favor cards only
    let combo1Cards = cardDeck.filter(c => c.cardType === 'combo1');
    let combo2Cards = cardDeck.filter(c => c.cardType === 'combo2');
    for(let i = 0; i < 4; i++){
      if(i < 2){ // if statement and dealing favor cards only for testing favor
        players.forEach(p => {
          p.hand.push(combo1Cards.shift());
        });
      }else {
        // players.forEach(p => {
        //   p.hand.push(cardsToDeal.shift());
        // });
        players.forEach(p => {
          p.hand.push(combo2Cards.shift());
        });
      }

    }
    cardDeck = cardsToDeal.concat(explodingCards).sort(() => Math.random() - 0.5);
    return [players, cardDeck];
  }
}
