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


/*

    // Construct Multiply Contract Object and contract instance
    var contractInstance,
        transactionObject = {
            data: MultiplyContract.bytecode, 
            gasPrice: web3.eth.gasPrice,
            gas: 500000,
            from: web3.eth.accounts[0]
        };

    describe("MultiplyContract unit tests", function(){
        it("should deploy a new MultiplyContract", function(done){
            this.timeout(timeout);
            
            MultiplyContract.new(transactionObject, 
                                 function(err, contract){
                chai.assert.isNull(err);

                if(contract.address) {
                    contractInstance = contract;
                    done();
                }
            });
        });
            
        it("should multiply 0 * 7 to equal 0", function(done){
            this.timeout(timeout);
            
            contractInstance.multiply.call(0, function(err, result){
                chai.assert.isNull(err);
                chai.assert.equal(result.toNumber(10), 0);
                done();
            });
        });
        
        it("should multiply 7 * 7 to equal 49", function(done){
            this.timeout(timeout);
            
            contractInstance.multiply.call(7, function(err, result){
                chai.assert.isNull(err);
                chai.assert.equal(result.toNumber(10), (7 * 7));
                done();
            });
        });
        
        it("should multiply 4 * 7 to equal 28", function(done){
            this.timeout(timeout);
            
            contractInstance.multiply.call(4, function(err, result){
                chai.assert.isNull(err);
                chai.assert.equal(result.toNumber(10), (4 * 7));
                done();
            });
        });
    });
*/

});
