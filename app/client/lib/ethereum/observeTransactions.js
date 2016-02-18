observeTransactions = function() {

	var checkTransactionConfirmations = function(tx) {
		if (!tx.confirmed) {
			var filter = web3.eth.filter("latest").watch(function(e, blockHash) {
				web3.eth.getTransaction(tx.transactionHash, function(e, transaction) {
					web3.eth.getTransactionReceipt(tx.transactionHash, function(e, receipt) {
						if (e || !receipt || !transaction) return;

					var txId = Helpers.makeId('tx', tx.transactionHash);
						if (receipt) {
							var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
							Session.set('contractValue', contractInstance.getBalance.call().toNumber(10));
							filter.stopWatching();
						}

					});
				});

			});

			if (Session.get("contractAddress") != "") {
				var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
				var events = contractInstance.allEvents();
				events.watch(function(error, event) {
					if (!error) {
						Session.set("contractState", event.event);
					}
				});

			}
		}
	};

	collectionObservers[collectionObservers.length] = Transactions.find({}).observe({
		added: function(newDocument) {
			console.log("added");
			checkTransactionConfirmations(newDocument);
		},
		changed: function(newDocument) {
			console.log("changed");
			checkTransactionConfirmations(newDocument);
		},
		removed: function(document) {
			console.log("removed");
		}
	});

}
