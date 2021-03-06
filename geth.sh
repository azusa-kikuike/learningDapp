#!/bin/sh
geth --datadir="/tmp/blockchain" --logfile="/tmp/blockchain.log" --port 30304 --rpc --rpcport 8102 --rpcaddr localhost --networkid 43380 --rpccorsdomain "*" --genesis="config/genesis/dev_genesis.json" --rpcapi "eth,web3" --ipcpath="/tmp/geth.ipc" --maxpeers 4 --natspec
