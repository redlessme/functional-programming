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

// function lazyNaturalNumbers(v) {
//     return selector=> selector(v, lazyNaturalNumbers(v + 1));
// }
// const value = (v, f) => v, head = s => s(value);
// const next = (v, f) => f, rest = s => s(next);

// const fromThree = lazyNaturalNumbers(3);
// const getNth = (n, s) => n === 0 ? head(s) : getNth(n - 1, rest(s));
// function map(f, s) {
//     return selector => selector(f(head(s)), map(f, rest(s)))
// }
// console.log(head(fromThree))
// console.log(head(rest(fromThree)))
// console.log(getNth(9,map(x=>2*x,fromThree)))



