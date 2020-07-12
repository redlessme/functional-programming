"use strict";
var curry = function (f) { return function (x) { return function (y) { return f(x, y); }; }; };
var power = curry(Math.pow);
var a = [1, 2, 3, 4, 5, 6, 7, 8];
var powersOfTwo = a.map(power(2));
// const powersOfTwo = a.map(curry(Math.pow)(2));
console.log(powersOfTwo);
// [2, 4, 8, 16, 32, 64 , 128, 256]
var flip = function (f) { return function (x) { return function (y) { return f(y)(x); }; }; };
/* do something with flip and power and the number 3 here */
var cubes = a.map(flip(power)(3));
console.log(cubes);
// [1, 8, 27, 64, 125, 216, 343, 512]
