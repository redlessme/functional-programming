"use strict";
var curry = function (f) { return function (x) { return function (y) { return f(x, y); }; }; };
var twoToThe = curry(Math.pow)(2)(8);
console.log(twoToThe);
var curriedConcat = curry(Array.prototype.concat.bind([]));
var arr = [[1, 2], [1, 2], [1, 2]];
console.log(arr.map(curriedConcat([0])));
// type BinaryFunction<T,U,V> = (x:T, y:U) => V
// type CurriedFunction<T,U,V> = (x:T) => (y:U) => V
// const curry: <T,U,V>(f:BinaryFunction<T,U,V>)=>CurriedFunction<T,U,V>
//     = f=>x=>y=>f(x,y);
// const twoToThe = curry(Math.pow)(2)
// twoToThe(8)
// const repeat = (n: number, s: string) => s.repeat(n)
// console.log(['a','b','c'].map(curry(repeat)(3)))
