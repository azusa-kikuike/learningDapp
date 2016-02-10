contracts = {};
collectionObservers = [];

connectToNode = function() {
  console.log('Connect to node...');
  EthAccounts.init();
  EthBlocks.init();

  if (EthAccounts.find().count() > 0) {
    console.log("Go checkForOriginalWallet");
  }

  observeLatestBlocks();
  observeTransactions();

}
