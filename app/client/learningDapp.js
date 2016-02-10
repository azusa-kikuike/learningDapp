if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

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
    }
  });

  Template.purchase.events({
    'click button': function () {
      Session.set('counter', Session.get('counter') + 1);
    }
  });

	Template.wallets.helpers({
		accounts: function() {
			var accounts = EthAccounts.find({name: {$exists: true}}, {sort: {name: 1}}).fetch();
			accounts.sort(Helpers.sortByBalance);
			console.log(accounts);

			return accounts;
		},
	});



}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
