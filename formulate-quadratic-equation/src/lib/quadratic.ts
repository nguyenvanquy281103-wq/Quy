export type Complex = { re: number; im: number };

export type QuadraticResult = {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  kind: "two-real" | "one-real" | "complex";
  roots: [Complex, Complex];
  vertex: { x: number; y: number };
  axisOfSymmetry: number;
  sum: number;
  product: number;
};

/**
 * Solve ax^2 + bx + c = 0
 * Requires a !== 0.
 */
export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  const discriminant = b * b - 4 * a * c;
  const axis = -b / (2 * a);
  const vy = c - (b * b) / (4 * a);

  let kind: QuadraticResult["kind"];
  let roots: [Complex, Complex];

  if (Math.abs(discriminant) < 1e-12) {
    kind = "one-real";
    const x = -b / (2 * a);
    roots = [
      { re: x, im: 0 },
      { re: x, im: 0 },
    ];
  } else if (discriminant > 0) {
    kind = "two-real";
    const sq = Math.sqrt(discriminant);
    // Numerically stable form
    const q = -0.5 * (b + Math.sign(b || 1) * sq);
    const x1 = q / a;
    const x2 = c / q;
    // Sort: x1 <= x2
    const [lo, hi] = x1 <= x2 ? [x1, x2] : [x2, x1];
    roots = [
      { re: lo, im: 0 },
      { re: hi, im: 0 },
    ];
  } else {
    kind = "complex";
    const re = -b / (2 * a);
    const im = Math.sqrt(-discriminant) / (2 * a);
    roots = [
      { re, im: -Math.abs(im) },
      { re, im: Math.abs(im) },
    ];
  }

  return {
    a,
    b,
    c,
    discriminant,
    kind,
    roots,
    vertex: { x: axis, y: vy },
    axisOfSymmetry: axis,
    sum: -b / a,
    product: c / a,
  };
}
