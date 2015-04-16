class Point extends Base {
  constructor(x,y) {
    super();
    this[px] = x, this[py] = y;
    this.r = function() { return Math.sqrt(x*x + y*y); }
  }
  get x() { return this[px]; }
  get y() { return this[py]; }
  proto_r() { return Math.sqrt(this[px] * this[px] +
      this[py] * this[py]); }
  equals(p) { return this[px] === p[px] &&
      this[py] === p[py]; }
}

