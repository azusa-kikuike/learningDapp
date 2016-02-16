observeTransactions = function() {

	var checkTransactionConfirmations = function(tx) {
		if (!tx.confirmed) {
			var filter = web3.eth.filter("latest").watch(function(e, blockHash) {
				console.log("watching...");
				console.log(tx._id);

				web3.eth.getTransaction(tx.transactionHash, function(e, transaction) {
					web3.eth.getTransactionReceipt(tx.transactionHash, function(e, receipt) {
						if (e || !receipt || !transaction) return;

					var txId = Helpers.makeId('tx', tx.transactionHash);
						if (receipt) {
							console.log("receipt");
							console.log(receipt);
							console.log(receipt.contractAddress);
							Transactions.upsert(txId, { $set: {
								transactionHash: tx.transactionHash,
								address: receipt.contractAddress
							} });

							updateValue(receipt.contractAddress);
							filter.stopWatching();
						}

					});
				});

			});
		} else {
			console.log("confirmed");
		}
	};

	var updateValue = function(address) {
		console.log("updateValue");
		var contractInstance = PurchaseContract.at(address);
		Session.setDefault('contractValue', contractInstance.value().toNumber(10));
	}


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


/*
observeTransactions = function() {
	console.log("observeTransactions");

	var checkTransactionConfirmations = function(tx) {
		console.log(tx);
		if (!tx.confirmed) {
			var filter = web3.eth.filter('latest');
			filter.watch(function(e, blockHash){
				console.log("watching..");
				console.log(tx._id);
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
*/
