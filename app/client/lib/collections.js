Transactions = new Mongo.Collection('transactions', {connection: null});
new PersistentMinimongo2(Transactions, 'ethereum_wallet');
