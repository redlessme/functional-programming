var List1a;
(function (List1a) {
    var myList = {
        data: 1,
        next: {
            data: 2,
            next: {
                data: 3,
                next: undefined
            }
        }
    };
    var ListNode = /** @class */ (function () {
        function ListNode(data, next) {
            this.data = data;
            this.next = next;
        }
        return ListNode;
    }());
    function length(l) {
        return l ? 1 + length(l.next) : 0;
    }
    //console.log("length is ",length(myList))
    function forEach(f, l) {
        if (l) {
            f(l.data);
            forEach(f, l.next);
        }
    }
    // forEach(console.log,myList)
    function map(f, l) {
        return l ? new ListNode(f(l.data), map(f, l.next)) : undefined;
    }
    //forEach(console.log,map(x=>x*2,myList))
    function concat(a, b) {
        return a ? new ListNode(a.data, concat(a.next, b))
            : (b ? concat(b)
                : undefined);
    }
    forEach(console.log, concat(myList, map(function (x) { return x + 3; }, myList))); //123456
    function reduce(f, init, l) {
        return l ? reduce(f, f(init, l.data), l.next) : init;
    }
    var oneToSix = concat(myList, map(function (x) { return x + 3; }, myList));
    console.log(reduce(function (t, v) { return t - v; }, 0, myList));
})(List1a || (List1a = {}));
