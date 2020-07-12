/* Simple hash function from https://gist.github.com/iperelivskiy/4110988
   Not meant to be particularly secure, just easier for you to solve the problem than reverse the hash
   */
function hash(v) {
  let a = 1, c = 0, h, o;
  let s = '' + Math.round(v);
  if (s) {
      a = 0;
      for (h = s.length - 1; h >= 0; h--) {
          o = s.charCodeAt(h);
          a = (a<<6&268435455) + o + (o<<14);
          c = a & 266338304;
          a = c!==0?a^c>>21:a;
      }
  }
  return a;
}

describe("Lecture 3 Exercise 2: what is the length of the two lists concated together?", function() {
  it("Generated code exists", function() {
    try {
      expect(cons).is.a('function')
    } catch(e) {
      throw new Error("Generated code doesn't seem to exist!  Did you run tsc?");
    }
  });
  it("solution correct", function() {    
    try {
      expect(hash(solution)).to.equal(53284013)
      const solutionText = document.getElementById("SolutionText");
      if (solutionText) solutionText.innerHTML = "The answer is: " + solution
    } catch(e) {
      throw new Error("Generated code doesn't seem to exist!  Did you run tsc?");
    }
  });
})


mocha.run()

