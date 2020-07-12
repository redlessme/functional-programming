"use strict";
class SafeObserver {
    constructor(destination) {
        this.isUnsubscribed = false;
        this.destination = destination;
        if (destination.unsub) {
            this.unsub = destination.unsub;
        }
    }
    next(value) {
        if (!this.isUnsubscribed) {
            this.destination.next(value);
        }
    }
    complete() {
        if (!this.isUnsubscribed) {
            this.destination.complete();
            this.unsubscribe();
        }
    }
    unsubscribe() {
        if (!this.isUnsubscribed) {
            this.isUnsubscribed = true;
            if (this.unsub)
                this.unsub();
        }
    }
}
class Observable {
    constructor(_subscribe) {
        this._subscribe = _subscribe;
    }
    subscribe(next, complete) {
        const safeObserver = new SafeObserver({
            next: next,
            complete: complete ? complete : () => console.log('complete')
        });
        safeObserver.unsub = this._subscribe(safeObserver);
        return safeObserver.unsubscribe.bind(safeObserver);
    }
    static fromEvent(el, name) {
        return new Observable((observer) => {
            const listener = ((e) => observer.next(e));
            el.addEventListener(name, listener);
            return () => el.removeEventListener(name, listener);
        });
    }
    static fromArray(arr) {
        return new Observable((observer) => {
            arr.forEach(el => observer.next(el));
            observer.complete();
            return () => { };
        });
    }
    static interval(milliseconds) {
        return new Observable(observer => {
            let elapsed = 0;
            const handle = setInterval(() => observer.next(elapsed += milliseconds), milliseconds);
            return () => clearInterval(handle);
        });
    }
    map(transform) {
        return new Observable(observer => this.subscribe(e => observer.next(transform(e)), () => observer.complete()));
    }
    forEach(f) {
        return new Observable(observer => this.subscribe(e => {
            f(e);
            return observer.next(e);
        }, () => observer.complete()));
    }
    filter(condition) {
        return new Observable(observer => this.subscribe(e => {
            if (condition(e))
                observer.next(e);
        }, () => observer.complete()));
    }
    takeUntil(o) {
        return new Observable(observer => {
            const oUnsub = o.subscribe(_ => {
                observer.complete();
                oUnsub();
            });
            return this.subscribe(e => observer.next(e), () => {
                observer.complete();
                oUnsub();
            });
        });
    }
    flatMap(streamCreator) {
        return new Observable((observer) => {
            return this.subscribe(t => streamCreator(t).subscribe(o => observer.next(o)), () => observer.complete());
        });
    }
    scan(initialVal, fun) {
        return new Observable((observer) => {
            let accumulator = initialVal;
            return this.subscribe(v => {
                accumulator = fun(accumulator, v);
                observer.next(accumulator);
            }, () => observer.complete());
        });
    }
}
//# sourceMappingURL=observable.js.map