Helpers = {};

Helpers.sortByBalance = function(a, b) {
  return !b.disabled && new BigNumber(b.balance, 10).gt(new BigNumber(a.balance, 10)) ? 1 : -1;
}

Helpers.makeId = function(prefix, hash) {
	return _.isString(hash) ? prefix + '_' + hash.replace('0x','').substr(0,10) : null;
}
