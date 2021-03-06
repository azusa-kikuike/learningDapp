// test timeout
var timeout = 50000;

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
    });

    describe.skip("transaction", function(){
        var primary   = web3.eth.accounts[0];
        var secondary = web3.eth.accounts[1];
        var primaryBalance, secondaryBalance = 0;

        beforeEach(function(done) {
            primaryBalance    = web3.eth.getBalance(primary);
            secondaryBalance  = web3.eth.getBalance(secondary);
            done();
        });

        it("the balance is valid", function(done) {
            this.timeout(timeout);

            console.log(web3.fromWei(primaryBalance,   "ether").toNumber(10));
            console.log(web3.fromWei(secondaryBalance, "ether").toNumber(10));
            chai.assert.isNumber(primaryBalance.toNumber(10));
            chai.assert.isNumber(secondaryBalance.toNumber(10));
            done();
        });

        it("can send transaction", function(done) {
            this.timeout(timeout);

            if (primaryBalance.minus(web3.toWei('5', 'ether')) < 0) {
              console.log("SKIP THE TEST");
              done();
            } else {
              var txObj = {
                from: primary,
                to:    secondary,
                value: web3.toWei('0.5', 'ether')
              };

              web3.eth.sendTransaction(txObj, function(err, res){
                if (!err) {
                  var timer;
                  clearInterval(timer);
                  timer = setInterval(function(){
                    var receipt = web3.eth.getTransactionReceipt(res);
                    if (receipt) {
                      clearInterval(timer);
                      console.log(web3.fromWei(web3.eth.getBalance(primary),   "ether").toNumber(10));
                      console.log(web3.fromWei(web3.eth.getBalance(secondary), "ether").toNumber(10));
                      done();
                      var expected = secondaryBalance.plus(web3.toWei('0.5', 'ether')).toNumber(10);

                      chai.assert.equal(expected, web3.eth.getBalance(secondary).toNumber(10), "the result = balance + 0.5 eth");
                    }
                  }, 1000);
                } else {
                  console.error(err);
                  done();
                }
              });
            }
        });
    });
});
