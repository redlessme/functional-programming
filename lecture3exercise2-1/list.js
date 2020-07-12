"use strict";
var consList;
(function (consList) {
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
    var firstPart = cons('T', cons('h', cons('e', cons(' ', cons('a', cons('n', cons('s', cons('w', cons('e', cons('r', cons(' ', cons('t', cons('o', cons(' ', cons('t', cons('h', cons('e', cons(' ', cons('q', cons('u', cons('e', cons('s', undefined))))))))))))))))))))));
    var secondPart = cons('t', cons('i', cons('o', cons('n', cons(' ', cons('i', cons('s', cons(' ', cons('s', cons('e', cons('v', cons('e', cons('n', cons('t', cons('y', cons(' ', cons('n', cons('i', cons('n', cons('e', undefined))))))))))))))))))));
    // example of how to recurse over the list:
    function forEach(f, list) {
        if (list) {
            f(head(list));
            forEach(f, rest(list));
        }
    }
    /**
     * return the number of elements in the ConsList
     * @param list a list
     */
    function len(list) {
        return list ? 1 + len(rest(list)) : 0;
    }
    /**
     * return the concatenation of two lists
     * @param list1 the first list
        * @param list2 the second list
        */
    function concat(list1, list2) {
        return list1 ? cons(head(list1), concat(rest(list1), list2))
            : (list2 ? concat(list2, undefined) : undefined);
    }
    var twoPartsTogether = concat(firstPart, secondPart);
    // Look at the console to see if it worked:
    forEach(console.log, twoPartsTogether);
    var solution = len(twoPartsTogether);
    console.log("The answer is: " + solution);
})(consList || (consList = {}));
