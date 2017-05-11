// *** DECLARATIVE TIMES()
// Adapted from https://stackoverflow.com/questions/10993824/do-something-n-times-declarative-syntax
// I know full well that monkey-patching Javascript natives is a terrible idea
// (But mostly when you're writing code for actual production and not teaching)

var timesFunction = function(callback) {
  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function")
  } else if (isNaN(parseInt(Number(this.valueOf()), 10))) {
    throw new TypeError("Object must be a valid number")
  }
  for (var i = 0; i < Number(this.valueOf()); i++) {
    callback(i)
  }
};

String.prototype.times = timesFunction;
Number.prototype.times = timesFunction;

// *** FUNCTIONAL TIMES()
var functionalTimes = function(times, callback) {
  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function")
  } else if (isNaN(parseInt(Number(times.valueOf()), 10))) {
    throw new TypeError("Times must be a valid number")
  }
  for (let i = 0; i < Number(times.valueOf()); ++i) {
    callback(i)
  }
}

Object.assign(window, {'times': functionalTimes})

// *** ARRAY.LAST
// Define a helper method, last(), on Array.prototype;
// Returns the last element of an array
// (If we're already monkey patching, why not?)
Array.prototype.last = function() { return this[this.length - 1] }
