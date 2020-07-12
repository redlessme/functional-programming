// interface LazySequence<T>{
//     value:T;
//     next():LazySequence<T>;
// }
// function naturalNumbers():LazySequence<number>{
//     return function _next(v:number){
//         return {
//             value: v,
//             next: ()=>_next(v+1)
//         }
//     }(1)
// }   
// const n=naturalNumbers();
// console.log(n.value)
// console.log(n.next().value) 
// console.log(n.next().next().value)
function lazyNaturalNumbers(v) {
    return function (selector) { return selector(v, lazyNaturalNumbers(v + 1)); };
}
var value = function (v, f) { return v; }, head = function (s) { return s(value); };
var next = function (v, f) { return f; }, rest = function (s) { return s(next); };
var fromThree = lazyNaturalNumbers(3);
var getNth = function (n, s) { return n === 0 ? head(s) : getNth(n - 1, rest(s)); };
function map(f, s) {
    return function (selector) { return selector(f(head(s)), map(f, rest(s))); };
}
console.log(head(fromThree));
console.log(head(rest(fromThree)));
console.log(getNth(9, map(function (x) { return 2 * x; }, fromThree)));
