Helpers = {};

Helpers.sortByBalance = function(a, b) {
  return !b.disabled && new BigNumber(b.balance, 10).gt(new BigNumber(a.balance, 10)) ? 1 : -1;
}
