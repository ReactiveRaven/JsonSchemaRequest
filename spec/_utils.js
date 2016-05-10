function PromiseSync(cb) {
    var resolve = function resolve(value) {
        if (value instanceof PromiseSync) {
            handleBeingPassedAnotherPromise(value);
        } else {
            this._then = value;
        }
    }.bind(this);
    var reject = function reject(value) {
        if (value instanceof PromiseSync) {
            handleBeingPassedAnotherPromise(value);
        } else {
            this._catch = value;
        }
    }.bind(this);
    var handleBeingPassedAnotherPromise = function(anotherPromise) {
        anotherPromise.then(function(value) { resolve(value); });
        anotherPromise.catch(function(value) { reject(value); });
    }
    try {
        cb(
            resolve,
            reject
        );
    } catch (e) {
        reject(e);
    }
}

PromiseSync.prototype.then = function(cb) {
    if (this._then) {
        return new PromiseSync(function(resolve, reject) { resolve(cb(this._then)); }.bind(this));
    } else {
        return this;
    }
};

PromiseSync.prototype.catch = function(cb) {
    if (this._catch) {
        return new PromiseSync(function(resolve, reject) { resolve(cb(this._then)); }.bind(this));
    } else {
        return this;
    }
};

PromiseSync.all = function(inputs) {
    return new PromiseSync(function(resolve, reject) {
        var mapped = inputs.map(function(input) {
            if (input instanceof PromiseSync) {
                if (input._then) {
                    return input._then;
                } else {
                    throw new Error(input._catch);
                }
            } else {
                return input;
            }
        });
        resolve(mapped);
    });
};

PromiseSync.resolve = function(value) {
    return new PromiseSync(function(resolve, reject) {
        resolve(value);
    });
}

PromiseSync.reject = function(value) {
    return new PromiseSync(function(resolve, reject) {
        reject(value);
    });
}

module.exports = {
    PromiseSync: PromiseSync
};
