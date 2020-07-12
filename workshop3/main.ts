/**
 * Week 3 Workshop
 * 
 * Setting up TypeScript:
 * https://docs.google.com/document/d/1cUGRjx9ep3MzmRgB_0H_3bHD704GmmwTwMPqQVZCPdw/edit#bookmark=id.o0u0pzst6egn
 * 
 * WorkSheet:
 * https://docs.google.com/document/d/1cUGRjx9ep3MzmRgB_0H_3bHD704GmmwTwMPqQVZCPdw/edit#bookmark=id.f94vpvhu1job
 */

// Exercise 1: 
// in tsconfig.json set: 
//        "noImplicitAny": true,
// and add types to the following until there are no more typescript compile errors


let someNum = 10;
let aString = "Hello!!!!!!! :)";

function addStuff(a:number, b:number):number {
    return a + b;
}
function numberToString(input:number):String {
    return JSON.stringify(input);
}
// Use the any type and void type.
function myLog<T>(anything:T):void{
    console.log("log: " + anything);
}

// 
// Exercise 2: implement the map function for the cons list below
// 
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

function pow(x:number){
    return function(y:number){
        return Math.pow(x,y)
    }
}

makeSequence(a=>a<0?-a+1:-a,1)
makeSequence(l=>l.map(a=>a+1),[1,2,3])




/**
 * rest selector, everything but the head
 * @param list is a Cons (note, not an empty ConsList)
 */
function rest<T>(list:Cons<T>):ConsList<T> {
    return <Cons<T>>list((head, rest?) => rest);
}

function forEach<T>(f: (_:T)=>void, list:ConsList<T>): void {
    if (list) {
        f(head(list));
        forEach(f,rest(list));
    }
}

function map<T,V>(f: (_:T)=>V, l: ConsList<T>): ConsList<V> {
    return l?cons(f(head(l) ), map(f,rest(l) )):undefined
}

//
// Exercise 3: Implement the following functions over cons lists
// 
// You'll need to add type annotations.  
// Look at the type annotations given for the functions above for ideas.

function fromArray<T>(arr:Array<T>) :ConsList<T>{
    // Hint: You can do this recursively - use arr.slice(1) to get a copy of
    // the array excluding the first element:
    // > ([1, 2, 3]).slice(1)
    // [2, 3]
    // Alternatively, you can use an array reduce method (arr.reduce, arr.reduceRight)
    // to do it without recursion.
    return arr.length==0?undefined:cons(arr[0],fromArray(arr.slice(1)))
}

function filter<T>(f: (_:T)=>boolean, list:ConsList<T>):ConsList<T> {

    return list?( f(head(list))?cons(head(list),filter(f,rest(list))):filter(f,rest(list))) :undefined  

}

function reduce<T,V>(f:(a:V,b:T)=>V
, initial:V, list:ConsList<T>):V {
  
    return list? reduce(f,f(initial,head(list)),rest(list)) : initial
}
function concat<T>(list1:ConsList<T>, list2:ConsList<T>): ConsList<T> {
    return list1?cons(head(list1),concat(rest(list1),list2))
        :(
            list2?concat(list2,undefined):undefined
        )
    }







//
// Exercise 4: complete the constructor and add methods as per the worksheet
// the List is backed by a Cons list, so use the functions you have 
// already implemented above to do the actual work.
/**
 * A linked list backed by a ConsList
 */


class List<T> {
    private head: ConsList<T>;

    constructor(list: T[] | ConsList<T>) {
        if (list instanceof Array) {        
            this.head=fromArray(list)
        } else {
            this.head = list;
            
        }
    }

    /**
     * create an array containing all the elements of this List
     */
    toArray(): T[] {
        // Getting type errors here?
        // Make sure your type annotation for reduce()
        // in Exercise 3 is correct!
        return reduce((a,t)=> [...a, t], <T[]>[], this.head).reverse();
    }

    // Add methods here:

    map<V>(f:(_:T)=>V):List<V>{
        return new List(map(f,this.head))
    }
    forEach(f:(_:T)=>void):List<T>{
        forEach(f,this.head)
        return new List( this.head )
    }
    filter(f:(_:T)=>boolean):List<T>{
        return new List(filter(f,this.head))
    }
    reduce<V>(f: (accumulator:V, t:T) => V, initialValue: V): V{
        return reduce(f,initialValue,this.head)
    }
    concat(list1:List<T>):List<T>{
       
        return new List(concat(list1.head,this.head))
    }
    }



/**
 * Exercise 5:
 * define types for and implement the function line
 * and complete lineToList
 */


//function line ... what?
function line(aString:string):[number,string]{
    return [0,aString]


}

function lineToList(line: [number, string]): List<[number, string]> {
    return new List([line])
}


/**
 * Exercise 6: uncomment the code below which uses the nest function,
 * which you need to implement
 */

// function nest (indent: number, layout: List<[number, string]>): List<[number, string]> {
    
//     return new List<[number,string]>(layout.map(a=>[a+1,x]));
    
// }


type BinaryTree<T> = BinaryTreeNode<T> | undefined

class BinaryTreeNode<T> {
    constructor(
        public data: T,
        public leftChild?: BinaryTree<T>,
        public rightChild?: BinaryTree<T>,
    ){}
}


// example tree:
const myTree = new BinaryTreeNode(
    1,
    new BinaryTreeNode(
        2,
        new BinaryTreeNode(3)
    ),
    new BinaryTreeNode(4)
);
function nest (indent: number, layout: List<[number, string]>): List<[number, string]>{
    return 
}

// *** uncomment the following code once you have implemented List and nest function (above) ***
//
// function prettyPrintBinaryTree<T>(node: BinaryTree<T>): List<[number, string]> {
//     if (!node) {
//         return new List<[number, string]>([])
//     } 
//     return lineToList(line(node.data.toString()))
//             .concat(nest(1, prettyPrintBinaryTree(node.leftChild)
//             .concat(prettyPrintBinaryTree(node.rightChild))))
// }

// const output = prettyPrintBinaryTree(myTree)
//                     .map(aLine => new Array(aLine[0] + 1).join('-') + aLine[1])
//                     .reduce((a,b) => a + '\n' + b, '').trim();
// console.log(output);

/**
 * Exercise 7:
 *  implement prettyPrintNaryTree, which takes a NaryTree as input
 *  and returns a list of the type expected by your nest function
 */

class NaryTree<T> {
   constructor(
       public data: T,
       public children: List<NaryTree<T>> = new List(undefined),
   ){}
}

// Example tree for you to print:
let naryTree = new NaryTree(1,
   new List([
       new NaryTree(2),
       new NaryTree(3,
       new List([
           new NaryTree(4),
       ])),
       new NaryTree(5)
   ])
)

// implement: function prettyPrintNaryTree(...)

/**
  ___  _   _    __    __    __    ____  _  _  ___  ____ 
 / __)( )_( )  /__\  (  )  (  )  ( ___)( \( )/ __)( ___)
( (__  ) _ (  /(__)\  )(__  )(__  )__)  )  (( (_-. )__) 
 \___)(_) (_)(__)(__)(____)(____)(____)(_)\_)\___/(____)

 */
const jsonPrettyToDoc: (json: any | string | boolean | number | null) => List<[number, string]> = json => {
    if (Array.isArray(json)) {
        // Handle the Array case.
    } else if (typeof json === 'object' && json !== null) {
        // Handle the object case.
        // Hint: use Object.keys(json) to get a list of
        // keys that the object has.
    } else if (typeof json === 'string') {
        // Handle string case.
    } else if (typeof json === 'number') {
        // Handle number
    } else if (typeof json === 'boolean') {
        // Handle the boolean case
    } else {
        // Handle the null case
    }

    // Default case to fall back on.
    return new List<[number, string]>([]);
};




