import { useMemo, useState } from "react";
import QuadraticPlot from "./components/QuadraticPlot";
import StepByStep from "./components/StepByStep";
import { solveQuadratic } from "./lib/quadratic";

type Complex = { re: number; im: number };

function fmt(n: number, digits = 4): string {
  if (!isFinite(n)) return "∞";
  if (Math.abs(n) < 1e-10) return "0";
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  return r.toString();
}

function fmtComplex(c: Complex): string {
  if (Math.abs(c.im) < 1e-10) return fmt(c.re);
  const sign = c.im >= 0 ? "+" : "−";
  return `${fmt(c.re)} ${sign} ${fmt(Math.abs(c.im))}i`;
}

export default function App() {
  const [a, setA] = useState<string>("1");
  const [b, setB] = useState<string>("-3");
  const [c, setC] = useState<string>("2");

  const numA = parseFloat(a);
  const numB = parseFloat(b);
  const numC = parseFloat(c);

  const validA = !isNaN(numA) && numA !== 0;
  const validB = !isNaN(numB);
  const validC = !isNaN(numC);
  const allValid = validA && validB && validC;

  const result = useMemo(() => {
    if (!allValid) return null;
    return solveQuadratic(numA, numB, numC);
  }, [numA, numB, numC, allValid]);

  const examples = [
    { a: "1", b: "-3", c: "2", label: "x² − 3x + 2" },
    { a: "1", b: "2", c: "1", label: "x² + 2x + 1" },
    { a: "1", b: "0", c: "1", label: "x² + 1" },
    { a: "2", b: "-4", c: "-6", label: "2x² − 4x − 6" },
    { a: "1", b: "-5", c: "6", label: "x² − 5x + 6" },
  ];

  const equationStr = useMemo(() => {
    if (!allValid) return "";
    const parts: string[] = [];
    // a·x²
    if (numA === 1) parts.push("x²");
    else if (numA === -1) parts.push("−x²");
    else parts.push(`${fmt(numA)}x²`);
    // b·x
    if (numB !== 0) {
      if (numB > 0) parts.push("+");
      else parts.push("−");
      const absB = Math.abs(numB);
      parts.push(absB === 1 ? "x" : `${fmt(absB)}x`);
    }
    // c
    if (numC !== 0) {
      if (numC > 0) parts.push("+");
      else parts.push("−");
      parts.push(fmt(Math.abs(numC)));
    }
    parts.push("= 0");
    return parts.join(" ");
  }, [numA, numB, numC, allValid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-200 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Công cụ toán học chuyên nghiệp
          </div>
          <h1 className="bg-gradient-to-r from-indigo-200 via-white to-fuchsia-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Giải Phương Trình Bậc 2
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Lập và giải phương trình dạng{" "}
            <span className="font-mono font-semibold text-indigo-300">
              ax² + bx + c = 0
            </span>{" "}
            — kèm các bước giải chi tiết, đồ thị parabol và phân tích đầy đủ.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Input panel */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="mb-1 text-xl font-semibold text-white">
                Nhập hệ số
              </h2>
              <p className="mb-6 text-sm text-slate-400">
                Phương trình: <span className="font-mono">ax² + bx + c = 0</span>{" "}
                (a ≠ 0)
              </p>

              <div className="space-y-4">
                <CoefInput
                  label="a"
                  description="Hệ số của x²"
                  value={a}
                  onChange={setA}
                  invalid={!validA}
                  errorMsg={
                    !validA
                      ? isNaN(numA)
                        ? "Vui lòng nhập số hợp lệ"
                        : "a phải khác 0"
                      : ""
                  }
                  color="indigo"
                />
                <CoefInput
                  label="b"
                  description="Hệ số của x"
                  value={b}
                  onChange={setB}
                  invalid={!validB}
                  errorMsg={!validB ? "Vui lòng nhập số hợp lệ" : ""}
                  color="fuchsia"
                />
                <CoefInput
                  label="c"
                  description="Hằng số"
                  value={c}
                  onChange={setC}
                  invalid={!validC}
                  errorMsg={!validC ? "Vui lòng nhập số hợp lệ" : ""}
                  color="cyan"
                />
              </div>

              {/* Equation preview */}
              <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                <div className="mb-1 text-xs uppercase tracking-wider text-slate-400">
                  Phương trình
                </div>
                <div className="font-mono text-lg text-white sm:text-xl">
                  {allValid ? equationStr : "—"}
                </div>
              </div>

              {/* Examples */}
              <div className="mt-6">
                <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
                  Ví dụ nhanh
                </div>
                <div className="flex flex-wrap gap-2">
                  {examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setA(ex.a);
                        setB(ex.b);
                        setC(ex.c);
                      }}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-200 transition hover:border-indigo-400/50 hover:bg-indigo-500/20"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result summary */}
            {result && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Kết quả
                </h3>
                <div className="space-y-3">
                  <ResultRow
                    label="Δ (Delta)"
                    value={fmt(result.discriminant)}
                    sub={`= b² − 4ac = (${fmt(numB)})² − 4·${fmt(numA)}·${fmt(numC)}`}
                  />
                  <div
                    className={`rounded-xl border p-4 ${
                      result.kind === "two-real"
                        ? "border-emerald-400/30 bg-emerald-500/10"
                        : result.kind === "one-real"
                        ? "border-amber-400/30 bg-amber-500/10"
                        : "border-fuchsia-400/30 bg-fuchsia-500/10"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wider text-slate-300">
                      {result.kind === "two-real"
                        ? "Hai nghiệm thực phân biệt"
                        : result.kind === "one-real"
                        ? "Nghiệm kép"
                        : "Hai nghiệm phức liên hợp"}
                    </div>
                    <div className="mt-2 space-y-1 font-mono text-base">
                      <div>
                        <span className="text-slate-400">x₁ = </span>
                        <span className="font-semibold text-white">
                          {fmtComplex(result.roots[0])}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">x₂ = </span>
                        <span className="font-semibold text-white">
                          {fmtComplex(result.roots[1])}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <MiniStat
                      label="Tổng nghiệm"
                      value={fmt(-numB / numA)}
                      formula="−b/a"
                    />
                    <MiniStat
                      label="Tích nghiệm"
                      value={fmt(numC / numA)}
                      formula="c/a"
                    />
                    <MiniStat
                      label="Đỉnh parabol"
                      value={`(${fmt(-numB / (2 * numA))}, ${fmt(
                        numC - (numB * numB) / (4 * numA)
                      )})`}
                      formula="(−b/2a, ...)"
                    />
                    <MiniStat
                      label="Trục đối xứng"
                      value={`x = ${fmt(-numB / (2 * numA))}`}
                      formula="x = −b/2a"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Steps + Plot */}
          <div className="space-y-6 lg:col-span-3">
            {result && (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm">
                      📐
                    </span>
                    Lời giải chi tiết
                  </h3>
                  <StepByStep a={numA} b={numB} c={numC} result={result} />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 text-sm">
                      📈
                    </span>
                    Đồ thị parabol y = {equationStr.replace(" = 0", "")}
                  </h3>
                  <QuadraticPlot a={numA} b={numB} c={numC} result={result} />
                </div>
              </>
            )}

            {!result && (
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
                <div>
                  <div className="text-5xl">⚠️</div>
                  <p className="mt-3 text-slate-300">
                    Vui lòng nhập đầy đủ các hệ số hợp lệ với{" "}
                    <span className="font-mono">a ≠ 0</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-slate-500">
          Made with ❤️ for mathematicians • Phương trình bậc 2 ·{" "}
          <span className="font-mono">ax² + bx + c = 0</span>
        </footer>
      </div>
    </div>
  );
}

function CoefInput({
  label,
  description,
  value,
  onChange,
  invalid,
  errorMsg,
  color,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
  errorMsg: string;
  color: "indigo" | "fuchsia" | "cyan";
}) {
  const colorMap = {
    indigo: "from-indigo-500 to-violet-500",
    fuchsia: "from-fuchsia-500 to-pink-500",
    cyan: "from-cyan-500 to-blue-500",
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${colorMap[color]} font-mono text-sm font-bold text-white shadow-lg`}
          >
            {label}
          </span>
          <span className="text-slate-400">{description}</span>
        </label>
      </div>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-xl border bg-slate-950/50 px-4 py-2.5 font-mono text-lg text-white placeholder-slate-500 transition focus:outline-none focus:ring-2 ${
          invalid
            ? "border-red-400/50 focus:ring-red-400/30"
            : "border-white/10 focus:border-indigo-400/50 focus:ring-indigo-400/30"
        }`}
        placeholder="0"
      />
      {invalid && errorMsg && (
        <p className="mt-1 text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}

function ResultRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="font-mono text-lg font-semibold text-white">
          {value}
        </span>
      </div>
      {sub && <div className="mt-1 font-mono text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function MiniStat({
  label,
  value,
  formula,
}: {
  label: string;
  value: string;
  formula: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="mt-1 truncate font-mono text-sm font-semibold text-white">
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[10px] text-slate-500">
        {formula}
      </div>
    </div>
  );
}
