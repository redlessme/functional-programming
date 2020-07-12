interface Observer<Input> {
  next(value: Input): void;
  complete(): void;
  unsub?: ()=>void;
}

/**
 * A simple Observer implementation used by Observable.
 * Observers are instantiated by an Observable subscribe call.
 * A chain of observers is created as each Observable subscribes to its upstream
 * predecessor.  Each Observer is connected to its downstream neighbour via the
 * destination property.
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

  /**
   * Notifications stream through the Observer chain via successive next calls.
   * @param value notification payload
   */
  next(value: T): void {
    if(!this.isUnsubscribed) {
      this.destination.next(value);
    }
  }

  /**
   * terminates the stream.
   */
  complete(): void {
    if(!this.isUnsubscribed) {
      this.destination.complete();
      this.unsubscribe();
    }
  }

  /**
   * clean up at completion
   */
  unsubscribe(): void {
    if(!this.isUnsubscribed) {
      this.isUnsubscribed = true;
      if(this.unsub) this.unsub();
    }
  }

  unsub?: ()=>void;
}

/**
 * Implementation of a simple Observable stream, to present a basic
 * Functional Reactive Programming interface.
 * Course notes:
 * https://docs.google.com/document/d/1V6maVGJX0J4ySdbkzVtIogC5pX3dh5fxKpBAsDIf4FU/edit#bookmark=id.1bu517452per
 */
class Observable<Input> {
  /**
   * @param _subscribe subscription function applied to the associated Observer (Observer is created by Observable constructor)
   */
  constructor(private _subscribe: (_:Observer<Input>)=>()=>void) {}

  /**
   * Subscribes an observer to this observable
   * @param next action to perform on Observer firing
   * @param complete action to perform when Observer is completed
   * @return the unsubscribe function
   */
  subscribe(next:(_:Input)=>void, complete?: ()=>void): ()=>void {
    const safeObserver = new SafeObserver(<Observer<Input>>{
        next: next,
        complete: complete ? complete : ()=>console.log('complete')
      });
    safeObserver.unsub = this._subscribe(safeObserver);
    return safeObserver.unsubscribe.bind(safeObserver);
  }

  /**
   * create an Observable from a DOM Event
   * @param el HTML Element
   * @param name of event to observe
   * @return Observable with payload of Event objects
   */
  static fromEvent<E extends Event>(el: Node, name: string): Observable<E> {
    return new Observable<E>((observer: Observer<E>) => {
      const listener = <EventListener>((e:E) => observer.next(e));
      el.addEventListener(name, listener);
      return () => el.removeEventListener(name, listener);
    })
  }

  /**
   * create an Observable sequence from an Array
   * @param arr array of elements to be passed through Observable
   * @return Observable of the array elements
   */
  static fromArray<V>(arr: V[]):Observable<V> {
      return new Observable<V>((observer: Observer<V>) => {
        arr.forEach(el => observer.next(el));
        observer.complete();
        return () => {};
      });
  }

  /**
   * The observable notifies repeatedly with the specified delay
   * @param milliseconds interval between observable notifications
   * @return Observable payload is total elapsed time
   */
  static interval(milliseconds: number): Observable<number> {
      return new Observable<number>(observer => {
        let elapsed = 0;
        const handle = setInterval(() => observer.next(elapsed += milliseconds), milliseconds)
        return () => clearInterval(handle);
      })
  }

  /**
   * create a new observable that observes this observable and applies the transform function on next
   * @param transform function applied to each input from the upstream Observable
   * @return Observable of the result of transform
   */
  map<R>(transform: (_:Input)=>R): Observable<R> {
      return new Observable<R>(observer=> 
        this.subscribe(e=>observer.next(transform(e)), ()=>observer.complete())
      );
  }

  /** basically a ``tap'' function applies f to the input and passes that input (unchanged) downstream
   * @param f function applied to each input
   * @return Observable of the unchanged input
   */
  forEach(f: (_:Input)=>void): Observable<Input> {
      return new Observable<Input>(observer=>
        this.subscribe(e=>{
            f(e);
            return observer.next(e);
          }, 
          () => observer.complete()))
  }

  /** 
   * create a new observable that observes this observable but only conditionally notifies next
   * @param condition filter predicate
   * @return child Observable of only notifications that satisfy the condition
   */
  filter(condition: (_:Input)=>boolean): Observable<Input> {
      // Your code here ...
      return new Observable<Input>(observer => 
        this.subscribe(e=>{
            if(condition(e)) observer.next(e)
          },
          ()=>observer.complete()));
  }

  /**
   * creates a child Observable that is detached when the given Observable fires
   * @param o Observable whose notification will complete this Observable
   * @return child Observable of notifications up until o fires
   */
  takeUntil<V>(o: Observable<V>): Observable<Input> {
    return new Observable<Input>(observer => {
      const oUnsub = o.subscribe(_=>{
        observer.complete();
        oUnsub();
      });
      return this.subscribe(e=>observer.next(e), () => {
        observer.complete();
        oUnsub();
      });
    }); 
  }

  /**
   * every time this Observable is notified, create an Observable using the specified stream creator 
   * output is "flattened" into the original stream
   * @param streamCreator function to create the incoming Observable stream
   * @return single ``flattened'' stream from all the created observables
   */
  flatMap<Output>(streamCreator: (_: Input) => Observable<Output>): Observable<Output> {
    return new Observable<Output>((observer: Observer<Output>)=>{
      return this.subscribe(t=>streamCreator(t).subscribe(o=>observer.next(o)),()=>observer.complete())
    })
  }
   
  /**
   * Similar to Fold or Reduce, but notifies with cumulative result of every input.
   * http://reactivex.io/documentation/operators/scan.html
   * @param initialVal starting value for accumulation
   * @param param binary accumulator function
   * @return Observable stream of V accumulated using the specified fun
   */
  scan<V>(initialVal:V, fun: (a:V, el:Input) => V): Observable<V> {
    return new Observable<V>((observer: Observer<V>) => {
        let accumulator = initialVal;
        return this.subscribe(
            v => {
                accumulator = fun(accumulator, v);
                observer.next(accumulator);
            },
            () => observer.complete()
        )
    })
  }
}
