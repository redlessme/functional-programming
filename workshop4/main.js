// FIT2102: Week 4 Workshop
// https://docs.google.com/document/d/1cUGRjx9ep3MzmRgB_0H_3bHD704GmmwTwMPqQVZCPdw/edit#bookmark=id.1sjmldlsj2d9
// return function(initialValue){
//     return{
//         value:initialValue,
//         next:()=>initSequence(transform)(transform(initialValue))
//     }
// }
// Implement the function:  transform(5)=5
function initSequence(transform) {
    // Your code here ...
    return function _next(initialValue) {
        return {
            value: initialValue,
            next: function () { return _next(transform(initialValue)); }
        };
    };
}




/*
    Exercise 2 - map, filter, take, reduce
 */
//return l?cons(f(head(l) ), map(f,rest(l) )):undefined
function map(func, seq) {
    // Your code here ...
    return {
        value: func(seq.value),
        next: function () { return map(func, seq.next()); }
    };
}
function filter(func, seq) {
    // Your code here ...
    return func(seq.value) ? {
        value: seq.value,
        next: function () { return filter(func, seq.next()); }
    } : filter(func, seq.next());
}
function take(amount, seq) {
    // Your code here ...
    return amount != 1 ? {
        value: seq.value,
        next: function () { return take(amount - 1, seq.next()); }
    } : {
        value: seq.value,
        next: undefined
    };
}
function reduce(func, seq, start) {
    // Your code here ...
    return seq.next ? reduce(func, seq.next(), func(start, seq.value)) : func(start, seq.value);
}
/*
    Exercise 3 - Reduce Practice
 */
function maxNumber(lazyList) {
    // ******** YOUR CODE HERE ********
    // Use __only__ reduce on the
    // lazyList passed in. The lazyList
    // will terminate so don't use `take`
    // inside this function body.
    return reduce(function (x, y) {
        return x > y ? x : y;
    }, lazyList);
}
function lengthOfSequence(lazyList) {
    // ******** YOUR CODE HERE ********
    // Again only use reduce and don't
    // use `take` inside this function.
    //    return reduce(function(a,b){
    return reduce(function (x, y) { return x + 1; }, lazyList, 0);
}
//    },lazyList)
/*
    Exercise 4 - Lazy Pi Approximations
 */
function exercise4Solution(seriesLength) {
    // Your solution using lazy lists.
    // Use `take` to only take the right amount of the infinite list.
    return;
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////// NAIVE EXAMPLE FOR DEMONSTRATION /////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// Answer the questions from the worksheet here:
// a) ...
// b) ...
// c) ...
// d) ...
// e) ...
// // This is the very simple "Observable" which subscribes
// // a data source to the Observer.
function observableNumberStream_simple_subscribe(milliseconds, o) {
    // Sets a timer to emit random integers every milliseconds period.
    var handle = setInterval(function () {
        o.next(Math.floor(Math.random() * 100));
    }, milliseconds);
    setTimeout(function () {
        // This function kills the interval above and
        // calls complete on the observer.
        clearInterval(handle);
        o.complete();
    }, 1000);
}
var loggingObserver = {
    next: function (e) { return console.log(e); },
    complete: function () { return console.log("logging complete - data stream closed"); }
};
observableNumberStream_simple_subscribe(50, loggingObserver);
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////////////// END NAIVE EXAMPLE ////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/*
    Exercise 6 - SafeObserver
 */
var SafeObserver = /** @class */ (function () {
    function SafeObserver(destination) {
        // constructor enforces that we are always subscribed to destination
        this.isUnsubscribed = false;
        this.destination = destination;
        if (destination.unsub) {
            this.unsub = destination.unsub;
        }
    }
    SafeObserver.prototype.next = function (value) {
        if (!this.isUnsubscribed)
            this.destination.next(value);
    };
    SafeObserver.prototype.complete = function () {
        if (!this.isUnsubscribed) {
            this.destination.complete();
            this.unsubscribe();
        }
    };
    SafeObserver.prototype.unsubscribe = function () {
        if (!this.isUnsubscribed) {
            this.isUnsubscribed = true;
            if (this.unsub)
                this.unsub();
        }
    };
    return SafeObserver;
}());
/*
    Exercise 7 - map, filter and forEach on
    an Observable.
    Exercise 8 - interval method.
 */
var Observable = /** @class */ (function () {
    function Observable(_subscribe) {
        this._subscribe = _subscribe;
    }
    // subscribes an observer to this observable and returns the unsubscribe function
    Observable.prototype.subscribe = function (next, complete) {
        var safeObserver = new SafeObserver({
            next: next,
            complete: complete ? complete : function () { return console.log('complete'); }
        });
        safeObserver.unsub = this._subscribe(safeObserver);
        return safeObserver.unsubscribe.bind(safeObserver);
    };
    Observable.fromArray = function (arr) {
        return new Observable(function (observer) {
            arr.forEach(function (el) { return observer.next(el); });
            return function () { };
        });
    };
    Observable.interval = function (milliseconds) {
        return new Observable(function (observer) {
            var elapsed = 0;
            var handle = setInterval(function () { return observer.next(elapsed += milliseconds); }, milliseconds);
            return function () { return clearInterval(handle); };
        });
    };
    // create a new observable that observes this observable and applies the project function on next
    Observable.prototype.map = function (project) {
        var _this = this;
        // Your code here ...
        return new Observable(function (observable) {
            return _this.subscribe(function (e) { return observable.next(project(e)); }, function () { return observable.complete(); });
        });
    };
    Observable.prototype.forEach = function (f) {
        // Your code here ...
        return this.map(function (e) {
            f(e);
            return e;
        });
    };
    // create a new observable that observes this observable but only conditionally notifies next
    Observable.prototype.filter = function (condition) {
        var _this = this;
        // Your code here ...
        return new Observable(function (observable) {
            return _this.subscribe(function (e) {
                if (condition(e))
                    observable.next(e);
            }, function () { return observable.complete(); });
        });
    };
    // http://reactivex.io/documentation/operators/scan.html
    Observable.prototype.scan = function (initialVal, f) {
        var _this = this;
        return new Observable(function (observer) {
            var accumulator = initialVal;
            return _this.subscribe(function (v) {
                accumulator = f(accumulator, v);
                observer.next(accumulator);
            }, function () { return observer.complete(); });
        });
    };
    return Observable;
}());
Observable.fromArray([1, 2, 3, 5, 12, 3, 1])
    .subscribe(function (e) { return console.log(e); });
/*
  ___  _   _    __    __    __    ____  _  _  ___  ____
 / __)( )_( )  /__\  (  )  (  )  ( ___)( \( )/ __)( ___)
( (__  ) _ (  /(__)\  )(__  )(__  )__)  )  (( (_-. )__)
 \___)(_) (_)(__)(__)(____)(____)(____)(_)\_)\___/(____)
 
 *
 * Open challenge.html in the browser.
 * Fix createDot, and add it to the Observable
 * chain so that dots are drawn onto the canvas.
 * Make the dots within the circle a different colour
 * to the dots outside the circle.
 */
(function challenge() {
    try {
        document;
    }
    catch (e) {
        console.log("Not in browser - run challenge in challenge.html");
        return;
    }
    if (document.getElementById("value_piApproximation") === null) {
        console.log("Not on the challenge.html page");
        return;
    }
    var pseudoRandomNum = function (seed) { return function (prime1, prime2) { return function (v) { return ((((prime1 * v) + seed) % prime2) - (prime2 / 2)) / (prime2 / 2); }; }; };
    var randomNum1 = pseudoRandomNum(1)(1262099, 77237);
    var randomNum2 = pseudoRandomNum(1)(1246499, 77237);
    var inCircle = function (_a) {
        var x = _a[0], y = _a[1];
        return (x * x) + (y * y) <= 1;
    };
    function createDot(x, y, color) {
        var canvas = document.getElementById("canvas");
        var dot = document.createElementNS(canvas.namespaceURI, "circle");
        // Set circle properties
        dot.setAttribute("cx", "30"); // Hardcoded x point
        dot.setAttribute("cy", "50"); // Hardcoded y point
        dot.setAttribute("r", "10");
        dot.setAttribute("fill", "red"); // All points red
        // Add the dot to the canvas
        canvas.appendChild(dot);
    }
    Observable.interval(100)
        .map(function (v) { return Math.floor(v / 100); }) // Turn the timer into a stream of incrementing integers.
        .map(function (v) { return [randomNum1(v), randomNum2(v)]; }) // Create two random numbers, the x and y coordinates
        .map(inCircle) // Check if the point is inside the circle
        .scan([0, 0], function (_a, e) {
        var i = _a[0], t = _a[1];
        return e ? [i + 1, t + 1] : [i, t + 1];
    }) // Tally up points within circle against total points
        .map(function (_a) {
        var inside = _a[0], total = _a[1];
        return inside / total;
    }) // points inside / total points
        .map(function (e) { return e * 4; }) // multiply by 4 to get to pi
        .subscribe(function (e) {
        // Update the value of pi on the html page.
        document.getElementById("value_piApproximation").textContent = e.toString();
    });
})();
