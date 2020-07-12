describe("Lecture 3 Exercise 1", function() {
  it("Generated code exists", function() {
    try {
      expect(curry).is.a('function')
    } catch(e) {
      throw new Error("Generated code doesn't seem to exist!  Did you run tsc?");
    }
  });
  it("flip works as expected", function() {
    const f = x=>y=>x/y;
    expect(flip(f)(2)(6)).to.equal(3)
  });
  it("map numbers in an array to an array of their cubes", function() {
    const expectedCubes = [1, 8, 27, 64, 125, 216, 343, 512]
    expect(cubes).to.deep.equal(expectedCubes)
  });
})

mocha.run()
