
export const gr = {
  findNextPlayer: function(currentPlayer, players){
    let currentPlayerIndex = players.map(function(p) { return p.name; }).indexOf(currentPlayer);
    if(currentPlayerIndex + 1 > players.length -1 ){
      return players[0].name;
    } else {
      return players[currentPlayerIndex + 1].name;
    }

  }
}
