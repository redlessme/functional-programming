// FIT2102: Week 4 Workshop
// https://docs.google.com/document/d/1cUGRjx9ep3MzmRgB_0H_3bHD704GmmwTwMPqQVZCPdw/edit#bookmark=id.1sjmldlsj2d9

/*
    Exercise 1 - General Purpose infinite sequence function
 */

interface LazySequence<T> {
    value: T;
    next?(): LazySequence<T>;
}
    // return function(initialValue){
    //     return{
    //         value:initialValue,
    //         next:()=>initSequence(transform)(transform(initialValue))
    //     }
    // }

// Implement the function:  transform(5)=5
function initSequence<T>(transform: (value: T) => T) : (initialValue: T) => LazySequence<T> {
    // Your code here ...
    return function _next(initialValue:T){
        return {
            value: initialValue,
            next: ()=>_next(transform(initialValue))
        }
    }

} 

/*
    Exercise 2 - map, filter, take, reduce
 */
//return l?cons(f(head(l) ), map(f,rest(l) )):undefined
function map<T,V>(func: (v: T)=>V, seq: LazySequence<T>): LazySequence<V> {
    // Your code here ...
    return {
        value: func(seq.value),
        next: ()=>map(func,seq.next())
    }
}

function filter<T>(func: (v: T)=>boolean, seq: LazySequence<T>): LazySequence<T> {
    // Your code here ...
    return func(seq.value)?{
        value:seq.value,
        next:()=>filter(func,seq.next())
    }:filter(func,seq.next())
}

function take<T>(amount: number, seq: LazySequence<T>): LazySequence<T> {
    // Your code here ...
    return amount!=1?{
        value:seq.value,
        next:()=>take(amount-1,seq.next())
    }:{
        value:seq.value,
        next:undefined
    }
}

function reduce<T,V>(func: (_:V, x: T)=>V, seq: LazySequence<T>, start?:V): V {
    // Your code here ...
    return seq.next ? reduce(func,seq.next(),func(start,seq.value)):func(start,seq.value)
}
    

/*
    Exercise 3 - Reduce Practice
 */

function maxNumber(lazyList: LazySequence<number>): number {
    // ******** YOUR CODE HERE ********
    // Use __only__ reduce on the
    // lazyList passed in. The lazyList
    // will terminate so don't use `take`
    // inside this function body.
    return reduce(function(x,y){
        return x>y?x:y
    },lazyList)
}


function lengthOfSequence(lazyList: LazySequence<any>): number {
    // ******** YOUR CODE HERE ********
    // Again only use reduce and don't
    // use `take` inside this function.
//    return reduce(function(a,b){
       return reduce((x,y)=>x+1,lazyList,0)

       }
//    },lazyList)
 


/*
    Exercise 4 - Lazy Pi Approximations
 */


function exercise4Solution(seriesLength: number): number {
    // Your solution using lazy lists.
    // Use `take` to only take the right amount of the infinite list.
    return 
}

/*
    Exercise 5 - Simple implementation of an
    observable and observer.
 */

interface Observer<T> {
    next(e: T): void;
    complete(): void;
    unsub?: ()=>void;
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
function observableNumberStream_simple_subscribe(milliseconds: number, o: Observer<number>){
    // Sets a timer to emit random integers every milliseconds period.
    let handle = setInterval(() => {
        o.next(Math.floor(Math.random()*100));
    }, milliseconds);

    setTimeout(() => {
        // This function kills the interval above and
        // calls complete on the observer.
        clearInterval(handle);
        o.complete();
    }, 1000);
}

const loggingObserver = {
    next: (e: number) => console.log(e),
    complete: () => console.log("logging complete - data stream closed")
}

observableNumberStream_simple_subscribe(50, loggingObserver);


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////////////// END NAIVE EXAMPLE ////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////


/*
    Exercise 6 - SafeObserver
 */

class SafeObserver<T> implements Observer<T> {
    // constructor enforces that we are always subscribed to destination
    private isUnsubscribed = false;
    private destination: Observer<T>;

    constructor(destination: Observer<T>) {
        this.destination = destination;
        if (destination.unsub) {
            this.unsub = destination.unsub;
        }
    }

    next(value: T) {
        if (!this.isUnsubscribed) this.destination.next(value)
    }

    complete() {
        if(!this.isUnsubscribed) {
            this.destination.complete();
            this.unsubscribe();
        }


    }

    unsubscribe(): void {//退订，如果订阅了，退订
        if(!this.isUnsubscribed){
            this.isUnsubscribed=true;
            if(this.unsub)
                this.unsub() 
    }

    }

    
  
    
    unsub?: ()=>void;  //remove event listener

    
}



/*
    Exercise 7 - map, filter and forEach on
    an Observable.
    Exercise 8 - interval method.
 */
class Observable<T>{
    constructor(private _subscribe: (_:Observer<T>)=>()=>void) {}

    // subscribes an observer to this observable and returns the unsubscribe function
    subscribe(next:(_:T)=>void, complete?: ()=>void): ()=>void {
        const safeObserver = new SafeObserver(<Observer<T>>{
            next: next,
            complete: complete ? complete : ()=>console.log('complete')
        });
        safeObserver.unsub = this._subscribe(safeObserver);
        return safeObserver.unsubscribe.bind(safeObserver);
    }

    static fromArray<V>(arr: V[]):Observable<V> {
        return new Observable<V>((observer: Observer<V>) => {
            arr.forEach(el => observer.next(el));
            return () => {};
        });
    }
    static interval(milliseconds: number): Observable<number> {
        return new Observable<number>((observer: Observer<number>)=> {
          let elapsed = 0;
          const handle = setInterval(()=>observer.next(elapsed+=milliseconds), milliseconds);
          return ()=> clearInterval(handle);
        });
      }

    // create a new observable that observes this observable and applies the project function on next
    map<R>(project: (_:T)=>R): Observable<R> {
        // Your code here ...
        return new Observable<R>((observable:Observer<R>)=>
            this.subscribe(
                e=>observable.next(project(e)),
                ()=>observable.complete()
            )

        );
    }
  
    forEach(f: (_:T)=>void): Observable<T> {
        // Your code here ...
        return this.map((e)=>{
            f(e);
            return e;
        }
        )
    }

    // create a new observable that observes this observable but only conditionally notifies next
    filter(condition: (_:T)=>boolean): Observable<T> {
        // Your code here ...
        return new Observable<T>( (observable:Observer<T>)=>
            this.subscribe(
                e=>{if(condition(e)) observable.next(e)

                },
                ()=>observable.complete()
            )

        )
        
        
    }



    // http://reactivex.io/documentation/operators/scan.html
    scan<V>(initialVal:V, f: (a:V, el:T) => V): Observable<V> {
        return new Observable<V>((observer: Observer<V>) => {
            let accumulator = initialVal;
            return this.subscribe(
                v => {
                    accumulator = f(accumulator, v);
                    observer.next(accumulator);
                },
                () => observer.complete()
            )
        });
    }

}


Observable.fromArray([1,2,3,5,12,3,1])
    .subscribe(e => console.log(e));


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
    } catch (e) {
        console.log("Not in browser - run challenge in challenge.html");
        return;
    }
    if (document.getElementById("value_piApproximation") === null) {
        console.log("Not on the challenge.html page")
        return;
    }

    const pseudoRandomNum = seed => (prime1, prime2) => v => ((((prime1 * v) + seed) % prime2) - (prime2 / 2)) / (prime2 / 2);
    const randomNum1 = pseudoRandomNum(1)(1262099, 77237);
    const randomNum2 = pseudoRandomNum(1)(1246499, 77237);
    const inCircle = ([x, y]: [number, number]) => (x * x) + (y * y) <= 1;

    function createDot(x, y, color) {
        const canvas = document.getElementById("canvas");
        const dot = document.createElementNS(canvas.namespaceURI, "circle");
        // Set circle properties
        dot.setAttribute("cx", "30");   // Hardcoded x point
        dot.setAttribute("cy", "50");   // Hardcoded y point
        dot.setAttribute("r", "10");
        dot.setAttribute("fill", "red");// All points red

        // Add the dot to the canvas
        canvas.appendChild(dot);
    }

    Observable.interval(100)
        .map(v => Math.floor(v/100))                // Turn the timer into a stream of incrementing integers.
        .map(v => [randomNum1(v), randomNum2(v)] as [number, number])   // Create two random numbers, the x and y coordinates
        .map(inCircle)                              // Check if the point is inside the circle
        .scan([0, 0], ([i, t], e) => e ? [i+1, t+1] : [i, t+1]) // Tally up points within circle against total points
        .map(([inside, total]) => inside / total)   // points inside / total points
        .map(e => e * 4)                            // multiply by 4 to get to pi
        .subscribe(e => {
            // Update the value of pi on the html page.
            document.getElementById("value_piApproximation").textContent = e.toString();
        });
})();