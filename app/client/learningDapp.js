if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
	Session.setDefault('contractTxHash', "contractTxHash");
	Session.setDefault('contractAddress', "contractAddress");
	Session.setDefault('currentTxHash', "");

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.purchase.helpers({
    counter: function() {
      return Session.get('counter');
    },
		contractTxHash: function() {
			return Session.get('contractTxHash');
		},
		contractAddress: function() {
			return Session.get('contractAddress');
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
			var txObject = {
				value: 20,
				gas: 300000,
				from: web3.eth.accounts[0]
			};
			var contractInstance = PurchaseContract.at(Session.get("contractAddress"));
			contractInstance.Purchase(null, txObject, function(err, result){
				if (!err) {
					console.log("tx submitted!" + result);
				}
			});
		},
  });

	Template.wallets.helpers({
		accounts: function() {
			var accounts = EthAccounts.find({name: {$exists: true}}, {sort: {name: 1}}).fetch();
			accounts.sort(Helpers.sortByBalance);
			return accounts;
		},
	});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
