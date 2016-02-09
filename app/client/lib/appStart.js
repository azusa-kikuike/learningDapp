// disconnect any meteor server
if(location.hostname !== 'localhost' && location.hostname !== '127.0.0.1')
    Meteor.disconnect();

web3.eth.isSyncing(function(error, sync){
    if(!error) {
        // stop all app activity
        if(sync === true) {
           // we use `true`, so it stops all filters, but not the web3.eth.syncing polling
          console.log('Node started syncing, stopping app operation');
          web3.reset(true);

        // show sync info
        } else if(sync) {
           console.log(sync.currentBlock);

        // re-gain app operation
        } else {
            // run your app init function...
            console.log('Restart app operation again');
        }
    }
});

var connect = function(){
  if (web3.isConnected()) {
    console.log('connected');
    web3.eth.getSyncing(function(e, sync) {
        if(e || !sync) connectToNode();
    });

  } else {
    // TODO when it is not connected
    console.log('not connected');

  }
}

Meteor.startup(function(){
    Meteor.setTimeout(function() {
        connect();
    }, 3000);
});
