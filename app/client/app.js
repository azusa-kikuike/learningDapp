Session.setDefault('contractTxHash', "");
Session.setDefault('contractAddress', "");
Session.setDefault('contractBalance', 0);
Session.setDefault('contractState', 2);
Session.setDefault('currentEvent', "");

Template.purchase.helpers({
	contractTxHash: function() {
		return Session.get('contractTxHash');
	},
	contractAddress: function() {
		return Session.get('contractAddress');
	},
	contractBalance: function() {
		return Session.get('contractBalance');
	},
	contractState: function() {
		return Session.get('contractState');
	},
	currentEvent: function() {
		return Session.get('currentEvent');
	},
	transactions: function() {
		return Transactions.find({});
	}
});

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.purchase.events({
  'click .create-contract': function () {

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
					Session.set('contractTxHash', contract.transactionHash);
				} else {
					Session.set('contractAddress', contract.address);
				}
			}
		});

  },
	'click .purchase': function() {
		var txObject = {
			value: 20,
			gas: 300000,
			from: web3.eth.accounts[0]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.Purchase(null, txObject, function(err, result){
			if (!err) {
				var txId = Helpers.makeId('tx', result);
				Transactions.upsert(txId, { $set: {
					transactionHash: result
				} });
			}
		});
	},
  'click .abort' : function() {
		var txObject = {
			value: 0,
			gas: 300000,
			from: web3.eth.accounts[0]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.abort(null, txObject, function(err, result){
			if (!err) {
				var txId = Helpers.makeId('tx', result);
				Transactions.upsert(txId, { $set: {
					transactionHash: result
				} });
			}
		});
  },
  'click .confirmPurchase' : function() {
		var txObject = {
			value: 20,
			gas: 300000,
			from: web3.eth.accounts[1]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.confirmPurchase(null, txObject, function(err, result){
			if (!err) {
				var txId = Helpers.makeId('tx', result);
				Transactions.upsert(txId, { $set: {
					transactionHash: result
				} });
			}
		});
  },
  'click .confirmReceived' : function() {
		var txObject = {
			value: 0,
			gas: 300000,
			from: web3.eth.accounts[1]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.confirmReceived(null, txObject, function(err, result){
			if (!err) {
				var txId = Helpers.makeId('tx', result);
				Transactions.upsert(txId, { $set: {
					transactionHash: result
				} });
			}
		});
  },
  'click .refundBuyer' : function() {
		var txObject = {
			value: 0,
			gas: 300000,
			from: web3.eth.accounts[0]
		};
		var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
		contractInstance.refundBuyer(null, txObject, function(err, result){
			if (!err) {
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
