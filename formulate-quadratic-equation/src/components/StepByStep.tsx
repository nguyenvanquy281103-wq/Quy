import type { QuadraticResult } from "../lib/quadratic";

function fmt(n: number, digits = 4): string {
  if (!isFinite(n)) return "∞";
  if (Math.abs(n) < 1e-10) return "0";
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  return r.toString();
}

export default function StepByStep({
  a,
  b,
  c,
  result,
}: {
  a: number;
  b: number;
  c: number;
  result: QuadraticResult;
}) {
  const D = result.discriminant;

  return (
    <ol className="space-y-4">
      <Step n={1} title="Xác định các hệ số">
        <div className="font-mono text-sm text-slate-200">
          a = <span className="text-indigo-300">{fmt(a)}</span>, b ={" "}
          <span className="text-fuchsia-300">{fmt(b)}</span>, c ={" "}
          <span className="text-cyan-300">{fmt(c)}</span>
        </div>
      </Step>

      <Step n={2} title="Tính biệt thức Δ = b² − 4ac">
        <div className="space-y-1 font-mono text-sm text-slate-200">
          <div>
            Δ = ({fmt(b)})² − 4·({fmt(a)})·({fmt(c)})
          </div>
          <div>
            Δ = {fmt(b * b)} − {fmt(4 * a * c)}
          </div>
          <div className="text-base font-semibold text-white">
            Δ = {fmt(D)}
          </div>
        </div>
      </Step>

      <Step n={3} title="Biện luận theo dấu của Δ">
        {result.kind === "two-real" && (
          <div className="space-y-2 text-sm text-slate-200">
            <p>
              Vì <span className="font-mono text-emerald-300">Δ &gt; 0</span>,
              phương trình có{" "}
              <span className="font-semibold text-emerald-300">
                hai nghiệm thực phân biệt
              </span>{" "}
              theo công thức:
            </p>
            <div className="rounded-lg bg-slate-950/60 p-3 text-center font-mono">
              x = (−b ± √Δ) / (2a)
            </div>
          </div>
        )}
        {result.kind === "one-real" && (
          <div className="space-y-2 text-sm text-slate-200">
            <p>
              Vì <span className="font-mono text-amber-300">Δ = 0</span>, phương
              trình có{" "}
              <span className="font-semibold text-amber-300">nghiệm kép</span>:
            </p>
            <div className="rounded-lg bg-slate-950/60 p-3 text-center font-mono">
              x₁ = x₂ = −b / (2a)
            </div>
          </div>
        )}
        {result.kind === "complex" && (
          <div className="space-y-2 text-sm text-slate-200">
            <p>
              Vì <span className="font-mono text-fuchsia-300">Δ &lt; 0</span>,
              phương trình{" "}
              <span className="font-semibold text-fuchsia-300">
                không có nghiệm thực
              </span>
              . Trên trường số phức, nghiệm có dạng:
            </p>
            <div className="rounded-lg bg-slate-950/60 p-3 text-center font-mono">
              x = (−b ± i√|Δ|) / (2a)
            </div>
          </div>
        )}
      </Step>

      <Step n={4} title="Tính nghiệm">
        {result.kind === "two-real" && (
          <div className="space-y-1 font-mono text-sm text-slate-200">
            <div>
              √Δ = √{fmt(D)} = {fmt(Math.sqrt(D))}
            </div>
            <div>
              x₁ = (−({fmt(b)}) − {fmt(Math.sqrt(D))}) / (2·{fmt(a)}) ={" "}
              <span className="font-semibold text-white">
                {fmt(result.roots[0].re)}
              </span>
            </div>
            <div>
              x₂ = (−({fmt(b)}) + {fmt(Math.sqrt(D))}) / (2·{fmt(a)}) ={" "}
              <span className="font-semibold text-white">
                {fmt(result.roots[1].re)}
              </span>
            </div>
          </div>
        )}
        {result.kind === "one-real" && (
          <div className="space-y-1 font-mono text-sm text-slate-200">
            <div>
              x = −({fmt(b)}) / (2·{fmt(a)}) ={" "}
              <span className="font-semibold text-white">
                {fmt(result.roots[0].re)}
              </span>
            </div>
          </div>
        )}
        {result.kind === "complex" && (
          <div className="space-y-1 font-mono text-sm text-slate-200">
            <div>
              √|Δ| = √{fmt(-D)} = {fmt(Math.sqrt(-D))}
            </div>
            <div>
              Phần thực: −b/(2a) ={" "}
              <span className="text-white">{fmt(result.roots[0].re)}</span>
            </div>
            <div>
              Phần ảo: ±√|Δ|/(2a) = ±
              <span className="text-white">
                {fmt(Math.abs(result.roots[0].im))}
              </span>
            </div>
            <div className="pt-1">
              x₁ ={" "}
              <span className="font-semibold text-white">
                {fmt(result.roots[0].re)} − {fmt(Math.abs(result.roots[0].im))}i
              </span>
            </div>
            <div>
              x₂ ={" "}
              <span className="font-semibold text-white">
                {fmt(result.roots[1].re)} + {fmt(Math.abs(result.roots[1].im))}i
              </span>
            </div>
          </div>
        )}
      </Step>

      <Step n={5} title="Kiểm tra bằng định lý Viète">
        <div className="space-y-1 font-mono text-sm text-slate-200">
          <div>
            S = x₁ + x₂ = −b/a ={" "}
            <span className="font-semibold text-white">{fmt(result.sum)}</span>
          </div>
          <div>
            P = x₁ · x₂ = c/a ={" "}
            <span className="font-semibold text-white">
              {fmt(result.product)}
            </span>
          </div>
        </div>
      </Step>
    </ol>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative rounded-xl border border-white/10 bg-slate-950/30 p-4 pl-14">
      <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg">
        {n}
      </div>
      <h4 className="mb-2 font-semibold text-white">{title}</h4>
      <div>{children}</div>
    </li>
  );
}
