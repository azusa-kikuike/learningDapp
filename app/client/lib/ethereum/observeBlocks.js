var peerCountIntervalId = null;

var getPeerCount = function() {
  web3.net.getPeerCount(function(e, res) {
    if (!e) Session.set('peerCount', res);
  });
};

updateBalances = function() {

};

observeLatestBlocks = function() {
  updateBalances();

  web3.eth.filter('latest').watch(function(e, res){
    if (!e) {
      console.log('Here comes blocks!');
      updateBalances();
    }
  });

  Session.setDefault('peerCount', 0);
  getPeerCount();

  clearInterval(peerCountIntervalId);
  peerCountIntervalId = setInterval(function() {
    getPeerCount()
  }, 1000);

}
