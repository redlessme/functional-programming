// naturalNumbers function from the course notes.
const naturalNumbers = (initialValue) => {
    return function _next(v) {
        return {
            value: v,
            next: _ => _next(v + 1),
        }
    }(initialValue)
  };

describe("Exercise 1", function() {
  describe("Implement: `function initSequence(transform: (value: T) => T): (initialValue: T) => LazySequence<T>`", function() {
    it("initSequence is a function", function() {
      expect(initSequence).is.a('function');
    });
    it("initSequence(v => v + 1) returns a function", function() {
      expect(initSequence(v => v + 1)).is.a("function");
    });
    it("initSequence(v => v + 1)(0) returns LazySequence<number>", function(){
      expect(initSequence(v => v + 1)(0), "Should have value property set at 0").to.have.property("value", 0);
      expect(initSequence(v => v + 1)(0)).to.have.property("next");
    });
    it("initSequence(v => v + 1) returns a function identical to naturalNumbers function in the course notes.", function () {
      const yourNaturals = initSequence(v => v + 1);

      let gen1 = naturalNumbers(0);
      let gen2 = yourNaturals(0);
      
      let val1 = 0;
      for (let i = 0; i < 500; i++) {
        val1 += 1;
        gen1 = gen1.next();
        gen2 = gen2.next();
        expect(gen1.value).to.equal(val1);
        expect(gen1.value).to.equal(gen2.value);
      }
    });
  });
});


describe("Exercise 2", function(){
  describe("Implement: function map<T>(func: (v: T)=>T, seq: LazySequence<T>): LazySequence<T>", function() {
    it("map is a function", function(){
      expect(map).is.a("function");
    });
    it("simple map test", function() {
      const gen1 = naturalNumbers(1);
      let evenNums = map(v => v * 2, gen1);

      let i = 2;
      let count = 0;
      while (i < 200) {
        count ++;
        expect(evenNums.value, `Failed at iteration: ${count}. ${evenNums.value} should be ${i}`).to.equal(i);
        evenNums = evenNums.next();
        i += 2;
      }
    });

    it("checking nesting maps", function() {
      const gen1 = naturalNumbers(1);
      let evenNums = map(v => v * 2, gen1);
      let oddNums = map(v => v + 1, evenNums);

      let i = 2;
      while (i < 200) {
        expect(evenNums.value).to.equal(i);
        expect(oddNums.value).to.equal(i + 1);
        evenNums = evenNums.next();
        oddNums = oddNums.next();
        i += 2;
      }
    });
  });

  describe("Implement: function filter<T>(func: (v: T)=>boolean, seq: LazySequence<T>): LazySequence<T> {", function() {
    it("filter is a function", function() {
      expect(filter).is.a("function");
    });
    it("filter(v => v % 2 == 0, naturalNumbers(1)) gets expected result (only even numbers)", function() {
      let gen1 = naturalNumbers(1);
      let filtered = filter(v => v % 2 == 0, gen1);

      let i = 2;
      let count = 0;
      while (i < 200) {
        count ++;
        expect(filtered.value, `Failed at iteration: ${count}. ${filtered.value} should be ${i}`).to.equal(i);
        filtered = filtered.next();
        i += 2;
      }
    });
  });
  describe("Implement: function take", function() {
    it("take is a function", function(){
      expect(take).is.a("function");
    });
    it("take(10, naturalNumbers(1)) yields 10 elements", function() {
      let naturals = naturalNumbers(1);
      let generated = take(10, naturals);

      let returnedNumbers = [];
      let safeGuard = 0;
      // while loop stops when .next property is undefined or
      // loop counter exceeds 15.
      while (generated !== undefined && safeGuard < 150) {
        safeGuard ++;
        returnedNumbers.push(generated.value);
        generated = generated.next && generated.next() || generated.next;
      }

      if (safeGuard >= 130) expect(safeGuard, `Infinite loop safeguard kicked in at element ${safeGuard}.`).to.equal(10);
      else expect(returnedNumbers.length, `Expected 10 numbers to be yielded from the lazy iterator, got ${returnedNumbers.length}`).to.equal(10);
    });
  });

  describe("Implement: reduce", function() {
    it("reduce exists and is a function", function(){
      expect(reduce).is.a("function");
    });
    it("reduce((acc, e)=>acc + e, take(10, naturalNumbers(0)), 0)", function() {
      expect(reduce((acc, e)=>acc + e, take(10, naturalNumbers(0)), 0)).to.equal([0,1,2,3,4,5,6,7,8,9].reduce((a,b) => a + b, 0));
    });
    it("reduce order matters", function(){
      expect(reduce((acc, e)=>{acc.push(e); return acc; }, take(3, naturalNumbers(0)), [])).to.deep.equal([0,1,2]);
    });
  });
});


describe("Exercise 3", function() {
  describe("maxNumber", function() {
    it("maxNumber returns a single number", function(){
      expect(maxNumber(take(1, naturalNumbers(0)))).is.a("number");
    });
    it("maxNumber returns the maximum number in a sequence", function() {
      let result = maxNumber(take(3, naturalNumbers(0)));
      expect(result, `Expect max of [0, 1, 2] to equal 2, instead got ${result}`).to.equal(2);
    });
  });
  describe("lengthOfSequence", function() {
    it("lengthOfSequence returns a number", function() {
      expect(lengthOfSequence(take(1, naturalNumbers(0)))).is.a("number");
    });
    it("lengthOfSequence returns correct results for a bunch of random cases", function() {
      for (let i = 0; i < 40; i++) {
        let length = Math.floor(Math.random() * 10) + 1;
        let result = lengthOfSequence(take(length, naturalNumbers(0)));
        expect(result, `Expected ${length} to equal ${result}.`).to.equal(length);
      }
    });
  });
});

describe("Exercise 4", function() {
  describe("pi / 4 = 1 - 1 / 3 + 1 / 5 - 1 / 7 .......", function(){
    it("exercise4Solution is a function", function() {
      expect(exercise4Solution).is.a("function");
    });
    it("exercise4Solution(1) returns 1", function() {
      expect(exercise4Solution(1), "exercise4Solution must return a number").is.a("number");
      expect(exercise4Solution(1), "exercise4Solution(1) returns the pi approximation of `1/1`").is.equal(1);
    });
    it("exercise4Solution(2) returns ((1/1) - (1/3)) which is 0.66666", function() {
      expect(exercise4Solution(2)).is.closeTo(0.6666666, 0.00001);
    });
    it("exercise4Solution(3) returns (1/1) - (1/3) + (1/5)) which is 0.8666", function() {
      expect(exercise4Solution(3)).is.closeTo(0.86666, 0.00001);
    });
    it("Approximating Pi/4 using a series", function(){
      let accumulator = 1;
      let toggle = false;
      for (let i = 3; i < 1000; i += 2) {
          expect(exercise4Solution(Math.floor(i/2)), `Failed on iteration ${Math.floor(i/2)}.`).is.closeTo(accumulator, 0.00001);
          
          accumulator = toggle ? accumulator + (1 / i) : accumulator - (1 / i);
          toggle = !toggle;
      }
      // Check that pi has been gotten to 2 decimal places.
      expect(exercise4Solution(999) * 4).is.closeTo(3.14, 0.01);
    });
  });
});


describe("Exercise 6 - SafeObserver", function(){
  it("SafeObserver exists", function(){
    expect(() => new SafeObserver({
      next: (e) => console.log(e),
      complete: () => undefined,
    })).to.not.throw();
  });

  it("SafeObserver allows next to be called on the passed in Observer", function(){
    const nextSpy = sinon.spy();
    const completeSpy = sinon.spy();
    const testObs = {
      next: e => nextSpy(e),
      complete: () => {completeSpy()}
    }

    let safeObs = new SafeObserver(testObs);
    expect(nextSpy.callCount).to.equal(0);
    safeObs.next(10);
    expect(nextSpy.calledOnce).is.true;
    expect(nextSpy.args.length).is.equal(1);
    expect(nextSpy.args[0][0]).is.equal(10);
  });
  it("SafeObserver doesn't call next after unsubscribe is called", function(){
    const nextSpy = sinon.spy();
    const completeSpy = sinon.spy();
    const testObs = {
      next: e => nextSpy(e),
      complete: () => {completeSpy()}
    }

    let safeObs = new SafeObserver(testObs);
    expect(nextSpy.callCount, 'next method should not have been called!').to.equal(0);
    safeObs.next(10)

    safeObs.unsubscribe();
    expect(nextSpy.callCount).to.equal(1);
    safeObs.next(10);
    expect(nextSpy.callCount).to.equal(1);
    expect(nextSpy.args.length).is.equal(1);
  });

  it("SafeObserver doesn't call next after complete method is called", function(){
    const nextSpy = sinon.spy();
    const completeSpy = sinon.spy();
    const testObs = {
      next: e => nextSpy(e),
      complete: () => {completeSpy()}
    }

    let safeObs = new SafeObserver(testObs);

    safeObs.complete();
    expect(nextSpy.callCount).to.equal(0);
    expect(completeSpy.callCount).to.equal(1);
    safeObs.next(10);
    expect(nextSpy.callCount).to.equal(0);
    expect(nextSpy.args.length).is.equal(0);
  });

  describe("unsub method called on unsub or complete", function() {
    it("When SafeObserver is unsubscribed the Observer's unsub method is called as cleanup", function() {
      const unsubSpy = sinon.spy();
      const testObs = {
        next: e => {},
        complete: () => {},
        unsub: () => {unsubSpy()}
      }

      let safeObs = new SafeObserver(testObs);
      safeObs.next(311231);
      expect(unsubSpy.callCount).to.equal(0);
      safeObs.unsubscribe();
      expect(unsubSpy.callCount, "unsub wasn't called as cleanup after the unsubscribe method triggered.").to.equal(1);
    });

    it("When SafeObeserver.complete() is called, the Observer's unsub method is called as cleanup", function() {
      const unsubSpy = sinon.spy();
      const testObs = {
        next: e => {},
        complete: () => {},
        unsub: () => {unsubSpy()}
      }

      let safeObs = new SafeObserver(testObs);
      safeObs.next(311231);
      expect(unsubSpy.callCount).to.equal(0);
      safeObs.complete();
      expect(unsubSpy.callCount, "unsub wasn't called as cleanup after the complete method triggered.").to.equal(1);
    });
  });
});


describe("Exercise 7 - Map and Filter", function() {
  describe("forEach on the Observable", function() {
    it("Observable.forEach exists", function() {
      expect(new Observable(() => {}).forEach).is.a("function");
    });
    it("Observable.forEach calls function with each element in stream", function() {
      const forEachSPY = sinon.spy();
      const outputSPY = sinon.spy();
      const inputArray = [1,2,3,4,5]
      Observable.fromArray(inputArray)
        .forEach(e => forEachSPY(e))
        .subscribe(e => outputSPY(e))
      
        expect(forEachSPY.callCount, `forEach was only called ${forEachSPY.callCount} instead of expected 5 times`).to.equal(5);
        expect(forEachSPY.args.map(x => x[0]), `forEach was called with (list of args): ${forEachSPY.args.map(x => x[0])}, should have been called with: ${inputArray}`).to.deep.equal(inputArray);
        expect(outputSPY.args.map(x => x[0]), `${outputSPY.args.map(x => x[0])} should equal ${inputArray}`).to.deep.equal(inputArray);
    });
    it("Observable.forEach returns an observerable which completes correctly", function() {
      let nextFunc;
      let completeFunc;
      const evilObservable = new Observable(observer => {
        nextFunc = (val) => observer.next(val);
        completeFunc = () => observer.complete();
        return () => {};
      });
      const outputSpy = sinon.spy();
      const forEachSpy = sinon.spy();
      const completeSpy = sinon.spy();
      const unsub = evilObservable.forEach(x => forEachSpy(x))
        .subscribe(e => outputSpy(e), () => completeSpy());

      expect(nextFunc).to.be.a("function");

      nextFunc(1);
      nextFunc(2);
      nextFunc(3);

      expect(outputSpy.callCount).to.equal(3);
      expect(outputSpy.args.map(x => x[0])).to.deep.equal([1, 2, 3]);
      expect(forEachSpy.callCount).to.equal(3);
      expect(forEachSpy.args.map(x => x[0])).to.deep.equal([1, 2, 3]);
      completeFunc();
      nextFunc(1);
      nextFunc(2);
      nextFunc(3);
      expect(outputSpy.callCount).to.equal(3, "forEach doesn't unsubscribe properly! this should NEVER happen");
      expect(outputSpy.args.map(x => x[0])).to.deep.equal([1, 2, 3]);
      expect(forEachSpy.callCount).to.equal(3);
      expect(forEachSpy.args.map(x => x[0])).to.deep.equal([1, 2, 3]);
      expect(completeSpy.callCount).to.equal(1, "forEach doesn't complete properly - are you calling observer.complete?");
    });
  });
  describe("map on the Observable", function(){
    it("Observable.map exists", function() {
      expect(new Observable(() => {}).map).is.a("function");
    });
    it("Observable.map with identity function has no effect", function() {
      const nextSpy = sinon.spy();
      const inputArray = [1,2,3,4,5]
      Observable.fromArray(inputArray)
        .map(x => x)
        .subscribe(e => nextSpy(e))
      
        expect(nextSpy.callCount).to.equal(5);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray);
    });
    it("Observable.map with increment function increments results", function() {
      const nextSpy = sinon.spy();
      const inputArray = [1,2,3,4,5]
      Observable.fromArray(inputArray)
        .map(x => x + 1)
        .subscribe(e => nextSpy(e))
      
        expect(nextSpy.callCount).to.equal(5);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.map(x => x + 1));
    });
    it("Observable.map returns an observerable which completes correctly", function() {
      let nextFunc;
      let completeFunc;
      const evilObservable = new Observable(observer => {
        nextFunc = (val) => observer.next(val);
        completeFunc = () => observer.complete();
        return () => {};
      });
      const nextSpy = sinon.spy();
      const completeSpy = sinon.spy();
      const unsub = evilObservable.map(x => x + 1)
        .subscribe(e => nextSpy(e), () => completeSpy());

      expect(nextFunc).to.be.a("function");

      nextFunc(1);
      nextFunc(2);
      nextFunc(3);

      expect(nextSpy.callCount).to.equal(3);
      expect(nextSpy.args.map(x => x[0])).to.deep.equal([1, 2, 3].map(x => x + 1));
      completeFunc();
      nextFunc(1);
      nextFunc(2);
      nextFunc(3);
      expect(nextSpy.callCount).to.equal(3, "map doesn't unsubscribe properly! this should NEVER happen");
      expect(completeSpy.callCount).to.equal(1, "map doesn't complete properly - are you calling observer.complete?");
    });
  });
  describe("filter on Observable", function() {
    it("Observable.filter exists and is a function", function() {
      expect(new Observable(() => {}).filter).is.a("function");
    });
    it("Observable with simple filter that always returns true is unchanged", function() {
      const nextSpy = sinon.spy();
      const inputArray = [1,2,3,4,5]
      Observable.fromArray(inputArray)
        .filter(_ => true)
        .subscribe(e => nextSpy(e))
      
        expect(nextSpy.callCount).to.equal(5);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.filter(_ => true));
    });
    it("Observable with simple filter that always returns false is empty", function() {
      const nextSpy = sinon.spy();
      const inputArray = [1,2,3,4,5]
      Observable.fromArray(inputArray)
        .filter(_ => false)
        .subscribe(e => nextSpy(e))
      
        expect(nextSpy.callCount).to.equal(0);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.filter(_ => false));
    });
    it("Observable with simple isEven filter returns evens", function() {
      const nextSpy = sinon.spy();
      const inputArray = [1,2,3,4,5]
      Observable.fromArray(inputArray)
        .filter(x => x % 2 == 0)
        .subscribe(e => nextSpy(e))
      
        expect(nextSpy.callCount).to.equal(2);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.filter(x => x % 2 == 0));
    });
    it("Observable.filter returns an observerable which completes correctly", function() {
      let nextFunc;
      let completeFunc;
      const evilObservable = new Observable(observer => {
        nextFunc = (val) => observer.next(val);
        completeFunc = () => observer.complete();
        return () => {};
      });
      const nextSpy = sinon.spy();
      const completeSpy = sinon.spy();
      const unsub = evilObservable.filter(x => x % 2 === 0)
        .subscribe(e => nextSpy(e), () => completeSpy());

      expect(nextFunc).to.be.a("function");

      nextFunc(1);
      nextFunc(2);
      nextFunc(3);
      nextFunc(4);

      expect(nextSpy.callCount).to.equal(2);
      expect(nextSpy.args.map(x => x[0])).to.deep.equal([2, 4]);
      completeFunc();
      nextFunc(1);
      nextFunc(2);
      nextFunc(3);
      nextFunc(4);
      expect(nextSpy.callCount).to.equal(2, "filter doesn't unsubscribe properly! this should NEVER happen");
      expect(completeSpy.callCount).to.equal(1, "filter doesn't complete properly - are you calling observer.complete?");
    });
  });
  describe("mixing map and filter", function() {
    it("filter for evens and then halve them", function() {
      const nextSpy = sinon.spy();
      const inputArray = [1,2,3,4,5]
      Observable.fromArray(inputArray)
        .filter(x => x % 2 == 0)
        .map(x => x / 2)
        .subscribe(e => nextSpy(e))
      
        expect(nextSpy.callCount).to.equal(2);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.filter(x => x % 2 == 0).map(x => x / 2));
    });
  });
});


describe("Exercise 8 - Observable.interval", function() {
  it("Observable.interval exists and is a function", function() {
    expect(Observable.interval).is.a("function");
  });
  it("Observable.interval returns a stream of times", function(done) {
    const nextSpy = sinon.spy();
    const completeSpy = sinon.spy();
    let unsub = Observable.interval(1)
                    .subscribe(e => nextSpy(e))
    
    setTimeout(() => {
      try {
        unsub();
        expect(nextSpy.callCount).is.gt(40, "next was called too few times - try refreshing?");
        let result = [];
        for (let i = 1; i <= nextSpy.callCount; i++) {
          result.push(i);
        }
        expect(nextSpy.args[0][0], `First item should be 1 instead of ${nextSpy.args[0][0]}`).to.equal(1);
        expect(nextSpy.args.map(x => x[0]), `${nextSpy.args.map(x => x[0])}`).is.deep.equal(result)
        done();
      } catch (error) {
        done(error);
      }
    }, 300);
  });
  it("Observable.interval returns a stream of times that are cut short by an early unsubscribe call", function(done) {
    const nextSpy = sinon.spy();
    const completeSpy = sinon.spy();
    let unsub = Observable.interval(1)
                    .subscribe(e => nextSpy(e))
    
    setTimeout(unsub, 10)
    setTimeout(() => {
      try {
        expect(nextSpy.callCount, "Make sure you're calling `clearInterval` to stop the interval timer.").is.lt(30);
        let result = [];
        for (let i = 1; i <= nextSpy.callCount; i++) {
          result.push(i);
        }
        expect(nextSpy.args[0][0], `First item should be 1 instead of ${nextSpy.args[0][0]}`).to.equal(1);
        expect(nextSpy.args.map(x => x[0]), `${nextSpy.args.map(x => x[0])}`).is.deep.equal(result)
        done();
      } catch (error) {
        done(error);
      }
    }, 300);
  });
});