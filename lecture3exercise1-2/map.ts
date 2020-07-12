type BinaryFunction<T,U,V> = (x:T, y:U) => V
type CurriedFunction<T,U,V> = (x:T) => (y:U) => V

const curry: <T,U,V>(f:BinaryFunction<T,U,V>) => CurriedFunction<T,U,V> 
= f=>x=>y=>f(x,y)

const power = curry(Math.pow)
const a = [1,2,3,4,5,6,7,8]

const powersOfTwo = a.map(power(2));
// const powersOfTwo = a.map(curry(Math.pow)(2));
console.log(powersOfTwo)
// [2, 4, 8, 16, 32, 64 , 128, 256]

const flip: <T,U,V>(f:CurriedFunction<T,U,V>) => CurriedFunction<U,T,V> =f=>x=>y=>f(y)(x)

/* do something with flip and power and the number 3 here */
const cubes=a.map(flip(power)(3))
console.log(cubes)
// [1, 8, 27, 64, 125, 216, 343, 512]
















