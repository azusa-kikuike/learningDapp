contract PurchaseContract
{
    uint public value;
    address public seller;
    address public buyer;
    enum State { Inactive, Created, Locked }
    State public state;
    function Purchase()
    {
        seller = msg.sender;
        value = msg.value / 2;
        if (2 * value != msg.value) throw;
        state = State.Created;
				created();
    }
    modifier require(bool _condition)
    {
        if (!_condition) throw;
        _
    }
    modifier onlyBuyer()
    {
        if (msg.sender != buyer) throw;
        _
    }
    modifier onlySeller()
    {
        if (msg.sender != seller) throw;
        _
    }
    modifier inState(State _state)
    {
        if (state != _state) throw;
        _
    }
		event created();
    event aborted();
    event purchaseConfirmed();
    event itemReceived();
    event refunded();

    /// Abort the purchase and reclaim the ether.
    /// Can only be called by the seller before
    /// the contract is locked.
    function abort()
        onlySeller
        inState(State.Created)
    {
        seller.send(this.balance);
        state = State.Inactive;
        aborted();
    }
    /// Confirm the purchase as buyer.
    /// Transaction has to include `2 * value` ether.
    /// The ether will be locked until confirmReceived
    /// is called.
    function confirmPurchase()
        inState(State.Created)
        require(msg.value == 2 * value)
    {
        buyer = msg.sender;
        state = State.Locked;
        purchaseConfirmed();
    }
    /// Confirm that you (the buyer) received the item.
    /// This will release the locked ether.
    function confirmReceived()
        onlyBuyer
        inState(State.Locked)
    {
        buyer.send(value); // We ignore the return value on purpose
        seller.send(this.balance);
        state = State.Inactive;
        itemReceived();
    }
    function refundBuyer()
        onlySeller
        inState(State.Locked)
    {
        buyer.send(2 * value);
        seller.send(this.balance);
        state = State.Inactive;
        refunded();
    }
    function getBalance() returns (uint balance) {
        return this.balance;
    }

    function() { throw; }
}
