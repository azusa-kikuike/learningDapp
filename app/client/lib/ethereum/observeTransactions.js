observeTransactions = function() {
	console.log("observeTransactions");

	var checkTransactionConfirmations = function(tx) {
		var confCount = 0;
		if (!tx.confirmed) {
			var filter = web3.eth.filter('latest');
			filter.watch(function(e, blockHash){
				console.log("watching..");
			});
		}
	};

	collectionObservers[collectionObservers.length] = Transactions.find({}).observe({
		added: function(newDocument) {
			console.log("added");
		},
		changed: function(newDocument) {
			console.log("changed");
		},
		removed: function(document) {
			console.log("removed");
		}
	});

}
