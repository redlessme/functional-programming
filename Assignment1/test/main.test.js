// Extra tests added by: Michael Cui (lines 234 - 308)


// feel free to add further tests at the *end* of this file

describe("takeuntil, flatMap and scan on Observable", function () {
  it("expect observable to be interrupted by takeUntil", function (done) {
    const nextSpy = sinon.spy(),
      firstFive = Observable.interval(10)
        .takeUntil(Observable.interval(100))
        .subscribe(e=>nextSpy(e), ()=> {
          expect(nextSpy.callCount).is.gt(5);
          expect(nextSpy.callCount).is.lt(20);
          done();
        });
  });
  it("expect cartesian product of arrays", function () {
    const nextSpy = sinon.spy(),
      inputArray = [1, 2, 3, 4, 5],
      cartesianProd = Observable.fromArray(inputArray)
        .flatMap(u =>
          Observable.fromArray(inputArray)
            .map(v => [u, v]));

    cartesianProd.subscribe(e => nextSpy(e))
    expect(nextSpy.callCount).to.equal(25);

    let prod;
    cartesianProd.scan(0, (a, [u, v]) => a + u * v)
      .subscribe(r => prod = r);
    expect(prod).to.equal(225);
  });
});

describe("Week 4 Tutorial Worksheet Tests", function () {
  describe("Exercise 6 - SafeObserver", function () {
    it("SafeObserver exists", function () {
      expect(() => new SafeObserver({
        next: (e) => console.log(e),
        complete: () => undefined,
      })).to.not.throw();
    });

    it("SafeObserver allows next to be called on the passed in Observer", function () {
      const nextSpy = sinon.spy();
      const completeSpy = sinon.spy();
      const testObs = {
        next: e => nextSpy(e),
        complete: () => { completeSpy() }
      }

      let safeObs = new SafeObserver(testObs);
      expect(nextSpy.callCount).to.equal(0);
      safeObs.next(10);
      expect(nextSpy.calledOnce).is.true;
      expect(nextSpy.args.length).is.equal(1);
      expect(nextSpy.args[0][0]).is.equal(10);
    });
    it("SafeObserver doesn't call next after unsubscribe is called", function () {
      const nextSpy = sinon.spy();
      const completeSpy = sinon.spy();
      const testObs = {
        next: e => nextSpy(e),
        complete: () => { completeSpy() }
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

    it("SafeObserver doesn't call next after complete method is called", function () {
      const nextSpy = sinon.spy();
      const completeSpy = sinon.spy();
      const testObs = {
        next: e => nextSpy(e),
        complete: () => { completeSpy() }
      }

      let safeObs = new SafeObserver(testObs);

      safeObs.complete();
      expect(nextSpy.callCount).to.equal(0);
      expect(completeSpy.callCount).to.equal(1);
      safeObs.next(10);
      expect(nextSpy.callCount).to.equal(0);
      expect(nextSpy.args.length).is.equal(0);
    });

    describe("unsub method called on unsub or complete", function () {
      it("When SafeObserver is unsubscribed the Observer's unsub method is called as cleanup", function () {
        const unsubSpy = sinon.spy();
        const testObs = {
          next: e => { },
          complete: () => { },
          unsub: () => { unsubSpy() }
        }

        let safeObs = new SafeObserver(testObs);
        safeObs.next(311231);
        expect(unsubSpy.callCount).to.equal(0);
        safeObs.unsubscribe();
        expect(unsubSpy.callCount, "unsub wasn't called as cleanup after the unsubscribe method triggered.").to.equal(1);
      });

      it("When SafeObeserver.complete() is called, the Observer's unsub method is called as cleanup", function () {
        const unsubSpy = sinon.spy();
        const testObs = {
          next: e => { },
          complete: () => { },
          unsub: () => { unsubSpy() }
        }

        let safeObs = new SafeObserver(testObs);
        safeObs.next(311231);
        expect(unsubSpy.callCount).to.equal(0);
        safeObs.complete();
        expect(unsubSpy.callCount, "unsub wasn't called as cleanup after the complete method triggered.").to.equal(1);
      });
    });
  });

  describe("Exercise 7 - Map and Filter", function () {
    describe("forEach on the Observable", function () {
      it("Observable.forEach exists", function () {
        expect(new Observable(() => { }).forEach).is.a("function");
      });
      it("Observable.forEach calls function with each element in stream", function () {
        const forEachSPY = sinon.spy();
        const outputSPY = sinon.spy();
        const inputArray = [1, 2, 3, 4, 5]
        Observable.fromArray(inputArray)
          .forEach(e => forEachSPY(e))
          .subscribe(e => outputSPY(e))

        expect(forEachSPY.callCount, `forEach was only called ${forEachSPY.callCount} instead of expected 5 times`).to.equal(5);
        expect(forEachSPY.args.map(x => x[0]), `forEach was called with (list of args): ${forEachSPY.args.map(x => x[0])}, should have been called with: ${inputArray}`).to.deep.equal(inputArray);
        expect(outputSPY.args.map(x => x[0]), `${outputSPY.args.map(x => x[0])} should equal ${inputArray}`).to.deep.equal(inputArray);
      });
    });
    describe("map on the Observable", function () {
      it("Observable.map exists", function () {
        expect(new Observable(() => { }).map).is.a("function");
      });
      it("Observable.map with identity function has no effect", function () {
        const nextSpy = sinon.spy();
        const inputArray = [1, 2, 3, 4, 5]
        Observable.fromArray(inputArray)
          .map(x => x)
          .subscribe(e => nextSpy(e))

        expect(nextSpy.callCount).to.equal(5);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray);
      });
      it("Observable.map with increment function increments results", function () {
        const nextSpy = sinon.spy();
        const inputArray = [1, 2, 3, 4, 5]
        Observable.fromArray(inputArray)
          .map(x => x + 1)
          .subscribe(e => nextSpy(e))

        expect(nextSpy.callCount).to.equal(5);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.map(x => x + 1));
      });
    });
    describe("filter on Observable", function () {
      it("Observable.filter exists and is a function", function () {
        expect(new Observable(() => { }).filter).is.a("function");
      });
      it("Observable with simple filter that always returns true is unchanged", function () {
        const nextSpy = sinon.spy();
        const inputArray = [1, 2, 3, 4, 5]
        Observable.fromArray(inputArray)
          .filter(_ => true)
          .subscribe(e => nextSpy(e))

        expect(nextSpy.callCount).to.equal(5);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.filter(_ => true));
      });
      it("Observable with simple filter that always returns false is empty", function () {
        const nextSpy = sinon.spy();
        const inputArray = [1, 2, 3, 4, 5]
        Observable.fromArray(inputArray)
          .filter(_ => false)
          .subscribe(e => nextSpy(e))

        expect(nextSpy.callCount).to.equal(0);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.filter(_ => false));
      });
      it("Observable with simple isEven filter returns evens", function () {
        const nextSpy = sinon.spy();
        const inputArray = [1, 2, 3, 4, 5]
        Observable.fromArray(inputArray)
          .filter(x => x % 2 == 0)
          .subscribe(e => nextSpy(e))

        expect(nextSpy.callCount).to.equal(2);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.filter(x => x % 2 == 0));
      });
    });
    describe("mixing map and filter", function () {
      it("filter for evens and then halve them", function () {
        const nextSpy = sinon.spy();
        const inputArray = [1, 2, 3, 4, 5]
        Observable.fromArray(inputArray)
          .filter(x => x % 2 == 0)
          .map(x => x / 2)
          .subscribe(e => nextSpy(e))

        expect(nextSpy.callCount).to.equal(2);
        expect(nextSpy.args.map(x => x[0])).to.deep.equal(inputArray.filter(x => x % 2 == 0).map(x => x / 2));
      });
    });
  });

  describe("Exercise 8 - Observable.interval", function () {
    it("Observable.interval exists and is a function", function () {
      expect(Observable.interval).is.a("function");
    });
    it("Observable.interval returns a stream of times", function (done) {
      const nextSpy = sinon.spy();
      const completeSpy = sinon.spy();
      let unsub = Observable.interval(1)
        .subscribe(e => nextSpy(e))

      setTimeout(() => {
        unsub();
        try {
          expect(nextSpy.callCount).is.gt(5);
        } catch (error) {
          done(error);
          return;
        }
        let result = [];
        for (let i = 1; i <= nextSpy.callCount; i++) {
          result.push(i);
        }
        try {
          expect(nextSpy.args[0][0], `First item should be 1 instead of ${nextSpy.args[0][0]}`).to.equal(1);
          expect(nextSpy.args.map(x => x[0]), `${nextSpy.args.map(x => x[0])}`).is.deep.equal(result);
        } catch (error) {
          done(error);
          return;
        }
        done();
      }, 100);
    });
    it("Observable.interval returns a stream of times that are cut short by an early unsubscribe call", function (done) {
      const nextSpy = sinon.spy();
      const completeSpy = sinon.spy();
      let unsub = Observable.interval(1)
        .subscribe(e => nextSpy(e))

      setTimeout(unsub, 10)
      setTimeout(() => {
        expect(nextSpy.callCount, "Make sure you're calling `clearInterval` to stop the interval timer.").is.lt(30);
        let result = [];
        for (let i = 1; i <= nextSpy.callCount; i++) {
          result.push(i);
        }
        try {
          expect(nextSpy.args[0][0], `First item should be 1 instead of ${nextSpy.args[0][0]}`).to.equal(1);
          expect(nextSpy.args.map(x => x[0]), `${nextSpy.args.map(x => x[0])}`).is.deep.equal(result)
        } catch (error) {
          done(error);
          return;
        }
        done();
      }, 100);
    });
  });
});

it("mixing takeUntil and flatMap with Observable.interval", function (done) {
  let i = [];
  Observable.interval(75)
    .flatMap(offset =>
      Observable.interval(10)
        .takeUntil(Observable.interval(55)))
    .takeUntil(Observable.interval(75*3+45))
    .subscribe(v => i.push(v), () => {
      const expected = [10, 20, 30, 40, 50, 10, 20, 30, 40, 50, 10, 20, 30, 40];
      try {
        expect(i[0]).to.not.equal(0,
          "the first emitted thing from Observable.interval is 0 - did you follow the spec?");
        expect(i).to.not.deep.equal([10, 20, 30, 40, 50],
          "when an observer generated by flatMap is completed, the parent is also incorrectly completed");
        expect(i).to.not.deep.equal([10, 20, 30, 40, 50, 10, 20, 30, 40, 50, 10, 20, 30, 40, 50],
          "takeUntil is not terminating the data stream correctly");
        expect(i).to.deep.equal(expected,
          "something weird is going wrong with takeUntil, flatMap and interval.\n" +
          "try refreshing and running the tests again?\n" +
          `the list is ${i},\n` +
          `should be   ${expected}`
        );
      } catch (error) {
        done(error);
        return;
      }
      done();
    });
});
