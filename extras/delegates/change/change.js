//##Change Delegate

// Delegates, if present, can override or extend the behavior
// of objects. The change delegate is specifically designed to
// filter change records from an Observable instance and only forward
// the ones matching a given `filters` criteria (key or path).
// The forwarded messages will be sent to the specified method
// on the delegates `delegator` (bound to the _delegator_ scope)
//
// `param` {Object} data
sudo.delegates.Change = function(data) {
	this.construct(data);
};
// Delegates inherit from Model
sudo.delegates.Change.prototype = Object.create(sudo.Model.prototype);
// Change records are delivered here and filtered, calling any matching
// methods specified in `this.get('filters').
//
// `returns` {Object} a call to the specified _delegator_ method, passing
// a hash containing:
// 1. the `type` of Change
// 2. the value located at the key/path
// 3. the `oldValue` of the key if present
sudo.delegates.Change.prototype.filter = function(change) {
	var filters = this.data.filters, name = change.name, obj = {};
	// does my delegator care about this?
	if(name in filters && filters.hasOwnProperty(name)) {
		// assemble the object to return to the method
		obj.type = change.type;
		obj.value = name.indexOf('.') === -1 ? change.object[change.name] :
			sudo.getPath(name, change.object);
		obj.oldValue = change.oldValue;
		return this.delegator[filters[name]].call(this.delegator, obj);
	}
};
// `private`
sudo.delegates.Change.prototype.role = 'change';