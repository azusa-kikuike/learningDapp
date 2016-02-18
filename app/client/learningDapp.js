Session.setDefault('contractTxHash', "");
Session.setDefault('contractAddress', "");
Session.setDefault('contractValue', 0);
Session.setDefault('contractState', 0);
Session.setDefault('currentTxHash', "");

Template.purchase.helpers({
	contractTxHash: function() {
		return Session.get('contractTxHash');
	},
	contractAddress: function() {
		return Session.get('contractAddress');
	},
	contractValue: function() {
		return Session.get('contractValue');
	},
	contractState: function() {
		return Session.get('contractState');
	},
	transactions: function() {
		return Transactions.find({});
	}
});

Template.purchase.events({
  'click .create-contract': function () {
		console.log("コントラクトボタンを押したよ!");

		var transactionObject = {
			data: PurchaseContract.bytecode,
			gasPrice: web3.eth.gasPrice,
			gas: 300000,
			from: web3.eth.accounts[0],
		};

		PurchaseContract.new(transactionObject, function(err, contract) {
			if (!err) {
				var txId = Helpers.makeId('tx', contract.transactionHash);
				Transactions.upsert(txId, { $set: {
					transactionHash: contract.transactionHash,
					address: contract.address
				} });

				if (!contract.address) {
					console.log("txHash: " + contract.transactionHash);
					Session.set('contractTxHash', contract.transactionHash);
				} else {
					console.log("address: " + contract.address);
					Session.set('contractAddress', contract.address);
				}
			}
		});

  },
	'click .purchase': function() {
		console.log("出品ボタンを押したよ!");
		var txObject = {
			value: 20,
			gas: 300000,
			from: web3.eth.accounts[0]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.Purchase(null, txObject, function(err, result){
			if (!err) {
				console.log("tx submitted!" + result);
				var txId = Helpers.makeId('tx', result);
				Transactions.upsert(txId, { $set: {
					transactionHash: result
				} });
			}
		});
	},
  'click .abort' : function() {
		console.log("取り下げボタンを押したよ!");
		var txObject = {
			value: 0,
			gas: 300000,
			from: web3.eth.accounts[0]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.abort(null, txObject, function(err, result){
			if (!err) {
				console.log("tx submitted!" + result);
				var txId = Helpers.makeId('tx', result);
				Transactions.upsert(txId, { $set: {
					transactionHash: result
				} });
			}
		});
  },
  'click .confirmPurchase' : function() {
		console.log("購入ボタンを押したよ!");
		var txObject = {
			value: 20,
			gas: 300000,
			from: web3.eth.accounts[1]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.confirmPurchase(null, txObject, function(err, result){
			if (!err) {
				console.log("tx submitted!" + result);
				var txId = Helpers.makeId('tx', result);
				Transactions.upsert(txId, { $set: {
					transactionHash: result
				} });
			}
		});
  },
  'click .confirmReceived' : function() {
		console.log("受け取りボタンを押したよ!");
		var txObject = {
			value: 0,
			gas: 300000,
			from: web3.eth.accounts[1]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.confirmReceived(null, txObject, function(err, result){
			if (!err) {
				console.log("tx submitted!" + result);
				var txId = Helpers.makeId('tx', result);
				Transactions.upsert(txId, { $set: {
					transactionHash: result
				} });
			}
		});
  },
  'click .refundBuyer' : function() {
		console.log("返品ボタンを押したよ!");
		var txObject = {
			value: 0,
			gas: 300000,
			from: web3.eth.accounts[0]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.refundBuyer(null, txObject, function(err, result){
			if (!err) {
				console.log("tx submitted!" + result);
				var txId = Helpers.makeId('tx', result);
				Transactions.upsert(txId, { $set: {
					transactionHash: result
				} });
			}
		});
  },
	'click .clear' : function() {
		Session.set('contractTxHash', "");
		Session.set('contractAddress', "");
		Session.set('contractValue', 0);
		Session.set('contractState', 0);
		Session.set('currentTxHash', "");
		return Transactions.remove({});
	}
});

Template.wallets.helpers({
	accounts: function() {
		var accounts = EthAccounts.find({name: {$exists: true}}, {sort: {name: 1}}).fetch();
		accounts.sort(Helpers.sortByBalance);
		return accounts;
	},
});
