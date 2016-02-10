// test timeout
var timeout = 100000;

MochaWeb.testOnly(function(){
    var contractInstance,
        transactionObject = {
            data: PurchaseContract.bytecode,
            gasPrice: web3.eth.gasPrice,
            gas: 300000,
            from: web3.eth.accounts[0]
        };

    describe("PurchaseContract Unit test", function(){
        it("should deploy a new PurchaseContract", function(done){
            this.timeout(timeout);

            PurchaseContract.new(transactionObject, function(err, contract){
              chai.assert.isNull(err);
              if (!err) {
                if (!contract.address) {
                  console.log("txHash: " + contract.transactionHash);
                } else {
                  console.log("address: " + contract.address);
                  contractInstance = contract;
                  done();
                }
              }
            });
        });

        var txObject = {
          value: 20,
          gas: 300000,
          from: web3.eth.accounts[0]
        };
        it("should purchase", function(done) {
          this.timeout(timeout);
          contractInstance.Purchase(null, txObject, function(err, result) {
            if (!err) {
              var timer;
              clearInterval(timer);
              timer = setInterval(function(){
                var receipt = web3.eth.getTransactionReceipt(result);
                if (receipt) {
                  clearInterval(timer);
                  chai.assert.equal(contractInstance.seller(), web3.eth.accounts[0], "seller == sender");
                  chai.assert.equal(contractInstance.value().toNumber(10), 10, "value == sendValue / 2");
                  console.log(contractInstance.seller());
                  console.log(contractInstance.value().toNumber(10));
                  done();
                }
              }, 1000);
            }
          });
        });

    });

});
