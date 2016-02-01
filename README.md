# Learning DApp Using Meteor

## How to use

`./console.sh`

## Before running tests

Confirm the number of the accounts using 
```
> eth.accounts
```

If the number is less than 2, please create account:
```
> personal.newAccount("passphrase")
```

And then, unlock the primary account
```
> personal.unlockAccount(address, "password")
```
