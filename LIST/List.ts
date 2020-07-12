module List1a{
    const myList={
        data:1,
        next:{
            data:2,
            next:{
                data:3,
                next:undefined
            }
        }
    }
    interface IListNode<T>{
        data: T,
        next:ListPtr<T>
    }
    type ListPtr<T>=IListNode<T> | undefined

    class ListNode<T> implements IListNode<T>{
        constructor(public data:T,public next:ListPtr<T>){}
    }

    function length<T>(l:ListPtr<T>):number{
        return l? 1 + length(l.next) : 0
    }
    //console.log("length is ",length(myList))

    function forEach<T>(f:(_:T)=>void,l:ListPtr<T>):void{
        if(l){
            f(l.data);
            forEach(f,l.next);
        }
    }
   // forEach(console.log,myList)

    function map<T,V>(f:(_:T)=>V,l:ListPtr<T>): ListPtr<V>{
        return l?new ListNode<V>(f(l.data),map(f,l.next)):undefined;
    }
    //forEach(console.log,map(x=>x*2,myList))

    function concat<T>(a:ListPtr<T>, b?:ListPtr<T>):ListPtr<T>{
        return a? new ListNode(a.data,concat(a.next,b))
            :(
                b?concat(b)
                :undefined
        )
    }
    forEach(console.log,concat(myList,map(x=>x+3,myList)))//123456
    
    function reduce<T,V>(f:(t:V,v:T)=>V, init:V,l:ListPtr<T>):V{
        return l? reduce(f,f(init,l.data),l.next):init;
    }
    const oneToSix=concat(myList,map(x=>x+3,myList));
    console.log(reduce((t,v)=>t-v,0,myList))




}