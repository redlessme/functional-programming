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
var someNum = 10;
var aString = "Hello!!!!!!! :)";
function addStuff(a, b) {
    return a + b;
}
function numberToString(input) {
    return JSON.stringify(input);
}
// Use the any type and void type.
function myLog(anything) {
    console.log("log: " + anything);
}
/**
 * cons "constructs" a list node, if no second argument is specified it is the last node in the list
 */
function cons(head, rest) {
    return function (selector) { return selector(head, rest); };
}
/**
 * head selector, returns the first element in the list
 * @param list is a Cons (note, not an empty ConsList)
 */
function head(list) {
    return list(function (head, rest) { return head; });
}
/**
 * rest selector, everything but the head
 * @param list is a Cons (note, not an empty ConsList)
 */
function rest(list) {
    return list(function (head, rest) { return rest; });
}
// const map=f=>l=>l?cons (f(head(l)),map(f,rest(l))):undefined
const filter=f=>l=>l? ( f(head(l))? cons(head(l),filter(f,rest(l))):filter(f,rest(l)) )
                    :undefined

function uncurry<T,U,V> (f: (x:T)=>(y:U)=>V){
    return function(x,y){
        return f(x)(y)
    }
}


function forEach(f, list) {
    if (list) {
        f(head(list));
        forEach(f, rest(list));
    }
}
function map(f, l) {
    return l ? cons(f(head(l)), map(f, rest(l))) : undefined;
}





//
// Exercise 3: Implement the following functions over cons lists
// 
// You'll need to add type annotations.  
// Look at the type annotations given for the functions above for ideas.
function fromArray(arr) {
    // Hint: You can do this recursively - use arr.slice(1) to get a copy of
    // the array excluding the first element:
    // > ([1, 2, 3]).slice(1)
    // [2, 3]
    // Alternatively, you can use an array reduce method (arr.reduce, arr.reduceRight)
    // to do it without recursion.
    return arr.length == 0 ? undefined : cons(arr[0], fromArray(arr.slice(1)));
}
// function filter(f, list) {
//     return list ? (f(head(list)) ? cons(head(list), filter(f, rest(list))) : filter(f, rest(list))) : undefined;
// }
function reduce(f, initial, list) {
    return list ? reduce(f, f(initial, head(list)), rest(list)) : initial;
}




const concat=l1=>l2=>l1? cons(head(l1),concat(rest(l1),l2)
                        ):l2?(concat(l2,undefined)):undefined
function concat(list1, list2) {
    return list1 ? cons(head(list1), concat(rest(list1), list2))
        : (list2 ? concat(list2, undefined) : undefined);
}
//
// Exercise 4: complete the constructor and add methods as per the worksheet
// the List is backed by a Cons list, so use the functions you have 
// already implemented above to do the actual work.

const filter=f=>l=>l? (f(head(l))? cons(head(l)) (filter (f)(rest(l))):filter (f)(rest(l)) ):undefined

const forEach=f=>l=>{
    if(l){
        f(head(l))
        forEach(f)(rest(l))
    }
}

const map=f=>l=>l? cons(f(head(l)))(map(f)(rest(l))):undefined
const reduce=f=>i=>l=>l? reduce(f,f(i,head(l)),rest(l)):undefined


makeSequence(a=>a>0?-a:-a+1,1)
makeSequence(l=>l.map(x=>x+1),l)

function square(x){
    return x*x
}
function sumTo(f,n){
    return n?f(n)+sumTo(f,n-1):0
}
/**
 * A linked list backed by a ConsList
 */
var List = /** @class */ (function () {
    function List(list) {
        if (list instanceof Array) {
            this.head = fromArray(list);
        }
        else {
            this.head = list;
        }
    }
    /**
     * create an array containing all the elements of this List
     */
    List.prototype.toArray = function () {
        // Getting type errors here?
        // Make sure your type annotation for reduce()
        // in Exercise 3 is correct!
        return reduce(function (a, t) { return a.concat([t]); }, [], this.head).reverse();
    };
    // Add methods here:
    List.prototype.map = function (f) {
        return new List(map(f, this.head));
    };
    List.prototype.forEach = function (f) {
        forEach(f, this.head);
        return new List(this.head);
    };
    List.prototype.filter = function (f) {
        return new List(filter(f, this.head));
    };
    List.prototype.reduce = function (f, initialValue) {
        return reduce(f, initialValue, this.head);
    };
    List.prototype.concat = function (list1) {
        return new List(concat(list1.head, this.head));
    };
    return List;
}());
/**
 * Exercise 5:
 * define types for and implement the function line
 * and complete lineToList
 */
//function line ... what?
function line(aString) {
    return [0, aString];
}
function lineToList(line) {
    return new List([line]);
}
var BinaryTreeNode = /** @class */ (function () {
    function BinaryTreeNode(data, leftChild, rightChild) {
        this.data = data;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
    return BinaryTreeNode;
}());
// example tree:
var myTree = new BinaryTreeNode(1, new BinaryTreeNode(2, new BinaryTreeNode(3)), new BinaryTreeNode(4));
function nest(indent, layout) {
    return;
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
var NaryTree = /** @class */ (function () {
    function NaryTree(data, children) {
        if (children === void 0) { children = new List(undefined); }
        this.data = data;
        this.children = children;
    }
    return NaryTree;
}());
// Example tree for you to print:
var naryTree = new NaryTree(1, new List([
    new NaryTree(2),
    new NaryTree(3, new List([
        new NaryTree(4),
    ])),
    new NaryTree(5)
]));
// implement: function prettyPrintNaryTree(...)
/**
  ___  _   _    __    __    __    ____  _  _  ___  ____
 / __)( )_( )  /__\  (  )  (  )  ( ___)( \( )/ __)( ___)
( (__  ) _ (  /(__)\  )(__  )(__  )__)  )  (( (_-. )__)
 \___)(_) (_)(__)(__)(____)(____)(____)(_)\_)\___/(____)

 */
var jsonPrettyToDoc = function (json) {
    if (Array.isArray(json)) {
        // Handle the Array case.
    }
    else if (typeof json === 'object' && json !== null) {
        // Handle the object case.
        // Hint: use Object.keys(json) to get a list of
        // keys that the object has.
    }
    else if (typeof json === 'string') {
        // Handle string case.
    }
    else if (typeof json === 'number') {
        // Handle number
    }
    else if (typeof json === 'boolean') {
        // Handle the boolean case
    }
    else {
        // Handle the null case
    }
    // Default case to fall back on.
    return new List([]);
};
