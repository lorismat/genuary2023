// class testing
class TestClass {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  test() {
    return 1;
  }
}

export class Extension extends TestClass {
  constructor(width, height) {
    super(width, height); 
  }
  perimeter() {
    console.log('computing perimeter');
    return this.width*this.height;
  }
}