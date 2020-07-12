/**
 * A ConsList is either a function created by cons, or empty (undefined)
 */
type ConsList<T> = Cons<T>|undefined; 

/** 
 * The return type of the cons function, is itself a function 
 * which can be given a selector function to pull out either the head or rest
 */
type Cons<T> = (selector: Selector<T>) => T|ConsList<T>;

/**
 * a selector will return either the head or rest
 */
type Selector<T> = (head:T, rest:ConsList<T>)=> T|ConsList<T>;

/**
 * cons "constructs" a list node, if no second argument is specified it is the last node in the list
 */
function cons<T>(head:T, rest: ConsList<T>): Cons<T> {
    return (selector: Selector<T>) => selector(head, rest);
}

/**
 * head selector, returns the first element in the list
 * @param list is a Cons (note, not an empty ConsList)
 */
function head<T>(list:Cons<T>):T {
    return <T>list((head, rest?) => head);
}

/**
 * rest selector, everything but the head
 * @param list is a Cons (note, not an empty ConsList)
 */
function rest<T>(list:Cons<T>):ConsList<T> {
    return <Cons<T>>list((head, rest?) => rest);
}

const firstPart = cons('T',cons('h',cons('e',cons(' ',cons('a',cons('n',cons('s',cons('w',cons('e',cons('r',cons(' ',cons('t',cons('o',cons(' ',cons('t',cons('h',cons('e',cons(' ',cons('q',cons('u',cons('e',cons('s',undefined))))))))))))))))))))));
const secondPart = cons('t',cons('i',cons('o',cons('n',cons(' ',cons('i',cons('s',cons(' ',cons('s',cons('e',cons('v',cons('e',cons('n',cons('t',cons('y',cons(' ',cons('n',cons('i',cons('n',cons('e',undefined))))))))))))))))))));

// example of how to recurse over the list:
function forEach<T>(f: (_:T)=>void, list:ConsList<T>): void {
    if (list) {
        f(head(list));
        forEach(f,rest(list));
    }
}

/**
 * return the number of elements in the ConsList
 * @param list a list
 */
function len<T>(list:ConsList<T>):number {
    return 0 // ???
}

/**
 * return the concatenation of two lists
 * @param list1 the first list
 * @param list2 the second list
 */
function concat<T>(list1:ConsList<T>, list2:ConsList<T>): ConsList<T> {
    return undefined// ???
}

const twoPartsTogether = concat(firstPart, secondPart)

// Look at the console to see if it worked:
forEach(console.log, twoPartsTogether);

const solution = len(twoPartsTogether);

console.log("The answer is: " + solution);
