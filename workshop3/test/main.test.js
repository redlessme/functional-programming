it("Generated code exists", function() {
  try {
    expect(addStuff).is.a('function')
  } catch(e) {
    throw new Error("Generated code doesn't seem to exist!  Did you run tsc?");
  }
});

describe("Testing cons, head and rest", function() {
  describe("cons", function() {
    it("Your cons works as expected", function() {
      expect(cons).is.a('function');
      expect(cons(1, undefined), "expected cons(1, undefined) to return a selector function").is.a('function');
      cons(1, 2)((head, rest) => {
        expect(head, "cons isn't properly storing the head in the closure").to.equal(1);
        expect(rest, "cons isn't properly storing the rest in the closure").to.equal(2);
      });
    });
  });

  it("head", function() {
    let list123 = cons(1, cons(2, cons(3, undefined)));
    expect(head).is.a('function');
    expect(head(list123)).to.equal(1);
    expect(head(cons(2, 3))).to.equal(2);
  });

  it("rest", function() {
    let list123 = cons(1, cons(2, cons(3, undefined)));
    expect(rest).is.a('function');
    rest(list123)((head, r) => {
      expect(head, "Expected head of list returned by rest to be 2").to.equal(2);
      expect(r).is.a('function');
      expect(rest(r)).is.equal(undefined);
    });
  });
});

describe("Exercise 2", function(){
  describe("map(function, list)", function() {
    it("map exists and is a function", function() {
      expect(map).is.a('function');
    });
    it("map with id function or I-Combinator", function() {
      let list123 = cons(1, cons(2, cons(3, undefined)));
      let idList = map(v => v, list123);
      expect(head(list123)).to.equal(head(idList));
      expect(head(rest(list123))).to.equal(head(rest(idList)));
      expect(head(rest(rest(list123)))).to.equal(head(rest(rest(idList))));
    });
    it("map with inc function", function() {
      let list123 = cons(1, cons(2, cons(3, undefined)));
      const inc = n => n + 1;
      let newList = map(inc, list123)
      const predicate = (before, after) => before === (after - 1);
      expect(predicate(head(list123), head(newList))).is.true;
      expect(predicate(head(rest(list123)), head(rest(newList))));
      expect(predicate(head(rest(rest(list123))), head(rest(rest(newList)))));
      expect(rest(rest(rest(newList)))).is.equal(undefined);
    });
  });
})

describe("Exercise 3", function() {
  describe("fromArray", function() {
    it("fromArray exists", function() {
      expect(fromArray).is.a('function');
    });
    it("fromArray turns [1,2,3] into cons(1, cons(2, cons(3, undefined)))", function() {
      let list = [1,2,3];
      let list123 = fromArray(list);
      expect(head(list123), "If you're getting a 3 you might be reversing the list by mistake.").to.equal(1);
      expect(head(rest(list123))).to.equal(2);
      expect(head(rest(rest(list123)))).to.equal(3);
      expect(rest(rest(rest(list123)))).to.equal(undefined);
    });
  });
  describe("filter(function, list)", function() {
    it("Simple filter works for evens", function() {
      let list123 = cons(1, cons(2, cons(3, undefined)));
      let newList = filter(n => n % 2 == 0, list123);
      expect(head(newList)).to.equal(2);
      expect(rest(newList)).to.equal(undefined);
    });
    it("Filter returns undefined if returning an empty list", function() {
      let list123 = cons(1, cons(2, cons(3, undefined)));
      let newList = filter(n => n > 10, list123);
      expect(newList, "expected an empty list to be represented as undefined").to.equal(undefined);
    });
  });
  describe("reduce(function, initialValue, list)", function() {
    it("reduce((x, y) => x + y, 0, cons(1, cons(2, cons(3, undefined))) === 6", function() {
      let list123 = cons(1, cons(2, cons(3, undefined)));
      expect(reduce(((x, y) => {console.log(x,y); return x + y}), 0, list123)).to.equal(6);
    });
    it("Changed initial: reduce((x, y) => x + y, 1, cons(1, cons(2, cons(3, undefined))) === 7", function() {
      let list123 = cons(1, cons(2, cons(3, undefined)));
      expect(reduce((x, y) => x + y, 1, list123)).to.equal(7);
    });
    it("The order of reduce is important. The initial value should be combined with head first!", function() {
      let list123 = cons(1, cons(2, cons(3, undefined)));
      expect(reduce((x, y) => x - y, 0, list123), "Order should be: ((0 - 1) - 2) - 3 = 6").to.equal(-6)
    });
  });
});
describe("Exercise 4", function() {
  describe("List<T> class constructor", function(){
    it("List constructor exists", function(){
      //expect(List).to.not.throw(ReferenceError);
      // expect(List).is.a("function");
    });
    it("List stores a cons list in this.head property on List", function(){
      expect(new List([]).head, "Empty list should set this.head to undefined").to.equal(undefined);
      expect(new List([2]).head, "Checking that head is a cons function").is.a('function');
      expect(head(new List([2]).head), "Checking that head has a value").to.equal(2);
      expect(head(rest(new List([2, 3]).head))).to.equal(3);
    });
  });

  describe("List<T> methods", function() {
    describe("map method", function(){
      it("map method exists on List class", function(){
        expect(new List([]), "map doesn't exist as a method on the List class").property('map');
      });
      it("Identity tests", function(){
        expect(new List([]).map(x => x).toArray()).to.deep.equal(new List([]).toArray());
        expect(new List([1,2,3]).map(x => x).toArray(), "Expect mapping identity to do nothing").to.deep.equal(new List([1,2,3]).toArray());
      })
      it("Transforming number -> string", function(){
        expect(new List([1,2]).map(x => x.toString()).toArray()).to.deep.equal(new List(["1", "2"]).toArray());
      });
    });
    describe("forEach method", function(){
      it("forEach method exists on List class", function(){
        expect(new List([]), "forEach doesn't exist as a method on the List class").property('forEach');
      });
      it("Visits elements and doesn't change list", function(){
        let visited = [];
        let yourList = new List([1,2,3,4]).forEach(el => { visited.push(el); return false });
        expect(visited, "Each element wasn't visited").to.deep.equal([1,2,3,4]);
        expect(yourList.toArray(), "Values returned from the function should be ignored.").to.deep.equal(new List([1,2,3,4]).toArray())
      });
    });
    describe("filter method", function(){
      it("filter method exists on List class", function(){
        expect(new List([]), "filter doesn't exist as a method on the List class").property('filter');
      });
      it("Filters out elements that don't pass the test", function(){
        expect(new List([1,2,3,4]).filter(v => v % 2 == 0).toArray()).to.deep.equal(new List([2, 4]).toArray());
      });
      it("Empty list after filter must be equal to `new List([])`", function(){
        expect(new List([1,2,3]).filter(() => false)).to.deep.equal(new List([]));
      });
    });
    describe("reduce method", function(){
      it("reduce method exists on List class", function(){
        expect(new List([]), "reduce doesn't exist as a method on the List class").property('reduce');
      });
      it("new List([1,2,3]).reduce((x, y) => x + y, 0) == 6", function() {
        expect(new List([1,2,3]).reduce((x, y) => x + y, 0)).to.equal(6);
      });
      it("Initial value changes output", function() {
        expect(new List([1,2,3]).reduce((x, y) => x + y, 1)).to.equal(7);
      });
      it("The order of reduce is important. The initial value should be combined with head first!", function() {
        expect(new List([1,2,3]).reduce((x, y) => x - y, 0), "Order should be: ((0 - 1) - 2) - 3 = 6").to.equal(-6)
      });
      it("Chaining!", function() {
        expect(new List([1,2,3,4,5]).filter(x=>x%2>0).reduce((x,y)=>x+y,0)).to.equal(9);
      });
    });
  });
});





describe("Exercise 5", function() {

  describe("a) line(text: string): [number, string]", function() {
    it("Empty string", function() {
      expect(line("")).to.deep.equal([0, ""]);
    });
    it("Small string", function() {
      expect(line("Hey!")).to.deep.equal([0, "Hey!"]);
    });
    it("Other string", function() {
      const s = "asdaduias dasd ad asd a"
      expect(line(s)).to.deep.equal([0, s]);
    });
  });

  describe("b) lineToList(line: [number, string]): List<[number, string]>", function() {
    it("Simple line to list", function() {
      const s = "hey!";
      expect(lineToList(line(s)).toArray()).to.deep.equal(new List([[0, s]]).toArray());
    });
  });

  describe("c) concat method on List<T> class", function() {
    it("concat method exists on List class", function(){
        expect(new List([]), "concat doesn't exist as a method on the List class").property('concat');
      });
    it("new List([1]).concat(new List([2])) equals new List([1,2])", function() {
      expect(new List([1]).concat(new List([2])).toArray()).to.deep.equal(new List([1,2]).toArray());
    });
    describe("Handling empty list cases", function() {
      it("First list is empty: new List([]).concat(new List([1])) equal to new List([1])", function(){
        expect(new List([]).concat(new List([1])).toArray()).to.deep.equal(new List([1]).toArray());
      });
      it("Second list empty: return first list", function(){
        expect(new List([1]).concat(new List([])).toArray()).to.deep.equal(new List([1]).toArray());
      });
      it("Both empty lists returns an empty list", function(){
        expect(new List([]).concat(new List([])).toArray()).to.deep.equal(new List([]).toArray());
      });
    });
  });
});

describe("Exercise 6 - Pretty Binary Trees", function(){
  describe("nest (indent: number, layout: List<[number, string]>): List<[number, string]>",function() {
    it("exists", function(){
      expect(nest).is.a('function');
    });
    it("simple indent", function() {
      expect(nest(1, new List([[0, "a"], [2, "b"]])).toArray()).is.deep.equal(new List([[1, "a"], [3, "b"]]).toArray());
    });
    it("no indent doesn't change anything", function() {
      let someList = new List([[0, "a"], [1, "b"]]);
      expect(nest(0, someList).toArray()).is.deep.equal(someList.toArray());
    });
    it("handles empty list", function(){
      expect(nest(10, new List([]))).to.deep.equal(new List([]));
    });
  });
  describe("Check that binary tree draws", function() {
    it("Case from worksheet", function(){
      const myTree = new BinaryTreeNode(
          1,
          new BinaryTreeNode(
              2,
              new BinaryTreeNode(3)
          ),
          new BinaryTreeNode(4)
      );
      const output = prettyPrintBinaryTree(myTree);
      const result = new List([
        [0, '1'],
        [1, '2'],
        [2, '3'],
        [1, '4']
      ]);
      expect(head(output.head), "First element isn't right").to.deep.equal(head(result.head));
      expect(output.toArray(), "indentation doesn't match what's expected").to.deep.equal(result.toArray());
    });
  });
});

describe("Exercise 7", function(){
  describe("prettyPrintNaryTree", function() {
    it("Expect a function", function() {
      expect(prettyPrintNaryTree).is.a('function');
    });
  });
  it("Prints the Nary tree in the worksheet", function() {
    const naryTree = new NaryTree(1,
      [
          new NaryTree(2),
          new NaryTree(3,
          [
              new NaryTree(4),
          ]),
          new NaryTree(5)
      ]
    )

    const output = prettyPrintNaryTree(naryTree);
    // Draw the tree
    let result = new List([
      [0, '1'],
      [1, '2'],
      [1, '3'],
      [2, '4'],
      [1, '5']
    ]);

    expect(head(output.head), "First element isn't right").to.deep.equal(head(result.head));
    // This output is horrible. Yuck.
    expect(output.toArray(), `${JSON.stringify(output)} to equal ${JSON.stringify(result)}`).to.deep.equal(result.toArray());
  });
});
