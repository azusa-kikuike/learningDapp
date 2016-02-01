// test timeout
var timeout = 20000;

MochaWeb.testOnly(function(){    
    describe("web3 connectivity", function(){
        it("should connect to web3", function(done){
            web3.setProvider(new web3.providers.HttpProvider("http://localhost:8102"));
            done();
        });

        it("should provide valid gas price", function(done){
						console.log(web3.eth.accounts);
            web3.eth.getGasPrice(function(err, result){
                chai.assert.isNull(err, null);
                chai.assert.property(result, 'toNumber');
                chai.assert.isNumber(result.toNumber(10));
                done();
            });
        });

				it("can send transaction", function(done) { 
						this.timeout(timeout);
						var primary		= web3.eth.accounts[0];
						var secondary = web3.eth.accounts[1];
						console.log(web3.fromWei(web3.eth.getBalance(primary),   "ether").toNumber(10));
						console.log(web3.fromWei(web3.eth.getBalance(secondary), "ether").toNumber(10));

						var txObj = {
							from: web3.eth.accounts[0],
							to: web3.eth.accounts[1],
							value: web3.toWei('0.5', 'ether')
						};

						web3.eth.sendTransaction(txObj, function(err, res){
							if (!err) {
								console.log(res);

								var timer;
								clearInterval(timer);
								timer = setInterval(function(){ 
									console.log("Hi"); 
									var receipt = web3.eth.getTransactionReceipt(res);
									if (receipt) {
										console.log(receipt);
										clearInterval(timer) 
										console.log(web3.fromWei(web3.eth.getBalance(primary),   "ether").toNumber(10));
										console.log(web3.fromWei(web3.eth.getBalance(secondary), "ether").toNumber(10));
										done();
									}
								}, 1000);
							} else {
								console.error(err);
						    done();
							}
						});
				});

    });

});
