// create 2 accounts
for (i = 0; i < 2; i++) { 
  if (eth.accounts.length < 2) {
    personal.newAccount("");
  }
}

// unlock the first account
personal.unlockAccount(eth.accounts[0]);
