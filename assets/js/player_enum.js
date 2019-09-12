var PlayerEnum = {
  BLACK: 1,
  WHITE: 2,

  fromString: function(playerString) {
    return playerString === 'black' ?
      PlayerEnum.BLACK :
      (
        playerString === 'white' ?
        PlayerEnum.WHITE :
        null
      )
    ;
  },

  getOtherPlayer: function(player) {
    return player === PlayerEnum.BLACK ? PlayerEnum.WHITE : PlayerEnum.BLACK;
  }
};