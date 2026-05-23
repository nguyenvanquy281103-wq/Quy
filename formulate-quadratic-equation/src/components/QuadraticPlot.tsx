import { useMemo } from "react";
import type { QuadraticResult } from "../lib/quadratic";

export default function QuadraticPlot({
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
  const W = 600;
  const H = 380;
  const padding = 30;

  // Determine domain: center on vertex, include real roots if any.
  const { xMin, xMax, yMin, yMax, points } = useMemo(() => {
    const vx = result.vertex.x;
    let span = 6;
    if (result.kind === "two-real") {
      const r1 = result.roots[0].re;
      const r2 = result.roots[1].re;
      span = Math.max(6, Math.abs(r2 - r1) * 2.2);
    }
    const xMin = vx - span / 2;
    const xMax = vx + span / 2;

    // Sample
    const N = 200;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const x = xMin + (i / N) * (xMax - xMin);
      const y = a * x * x + b * x + c;
      points.push({ x, y });
    }
    let yMinRaw = Math.min(...points.map((p) => p.y), 0);
    let yMaxRaw = Math.max(...points.map((p) => p.y), 0);
    // Add padding
    const yPad = (yMaxRaw - yMinRaw) * 0.15 || 1;
    return {
      xMin,
      xMax,
      yMin: yMinRaw - yPad,
      yMax: yMaxRaw + yPad,
      points,
    };
  }, [a, b, c, result]);

  const sx = (x: number) =>
    padding + ((x - xMin) / (xMax - xMin)) * (W - 2 * padding);
  const sy = (y: number) =>
    H - padding - ((y - yMin) / (yMax - yMin)) * (H - 2 * padding);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`)
    .join(" ");

  // Grid ticks
  const xTicks = niceTicks(xMin, xMax, 8);
  const yTicks = niceTicks(yMin, yMax, 6);

  const x0Visible = xMin <= 0 && xMax >= 0;
  const y0Visible = yMin <= 0 && yMax >= 0;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 480 }}
      >
        {/* Background */}
        <rect
          x={0}
          y={0}
          width={W}
          height={H}
          fill="url(#plotBg)"
          rx={12}
        />
        <defs>
          <linearGradient id="plotBg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0b1024" />
            <stop offset="100%" stopColor="#070a1a" />
          </linearGradient>
          <linearGradient id="parabola" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {xTicks.map((t, i) => (
          <line
            key={`vx${i}`}
            x1={sx(t)}
            x2={sx(t)}
            y1={padding}
            y2={H - padding}
            stroke="#1f2747"
            strokeWidth={1}
          />
        ))}
        {yTicks.map((t, i) => (
          <line
            key={`hy${i}`}
            x1={padding}
            x2={W - padding}
            y1={sy(t)}
            y2={sy(t)}
            stroke="#1f2747"
            strokeWidth={1}
          />
        ))}

        {/* Axes */}
        {y0Visible && (
          <line
            x1={padding}
            x2={W - padding}
            y1={sy(0)}
            y2={sy(0)}
            stroke="#64748b"
            strokeWidth={1.5}
          />
        )}
        {x0Visible && (
          <line
            x1={sx(0)}
            x2={sx(0)}
            y1={padding}
            y2={H - padding}
            stroke="#64748b"
            strokeWidth={1.5}
          />
        )}

        {/* Tick labels */}
        {xTicks.map((t, i) => (
          <text
            key={`tx${i}`}
            x={sx(t)}
            y={H - padding + 14}
            fontSize={10}
            textAnchor="middle"
            fill="#94a3b8"
            fontFamily="monospace"
          >
            {fmtTick(t)}
          </text>
        ))}
        {yTicks.map((t, i) => (
          <text
            key={`ty${i}`}
            x={padding - 6}
            y={sy(t) + 3}
            fontSize={10}
            textAnchor="end"
            fill="#94a3b8"
            fontFamily="monospace"
          >
            {fmtTick(t)}
          </text>
        ))}

        {/* Axis of symmetry */}
        <line
          x1={sx(result.axisOfSymmetry)}
          x2={sx(result.axisOfSymmetry)}
          y1={padding}
          y2={H - padding}
          stroke="#22d3ee"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.6}
        />

        {/* Parabola */}
        <path
          d={path}
          stroke="url(#parabola)"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Roots */}
        {result.kind !== "complex" &&
          result.roots.map((r, i) => {
            // Avoid double-drawing one-real (same point)
            if (result.kind === "one-real" && i === 1) return null;
            return (
              <g key={i}>
                <circle
                  cx={sx(r.re)}
                  cy={sy(0)}
                  r={6}
                  fill="#10b981"
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text
                  x={sx(r.re)}
                  y={sy(0) - 12}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#a7f3d0"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  x{result.kind === "one-real" ? "₁,₂" : i === 0 ? "₁" : "₂"} ={" "}
                  {fmtTick(r.re)}
                </text>
              </g>
            );
          })}

        {/* Vertex */}
        <g>
          <circle
            cx={sx(result.vertex.x)}
            cy={sy(result.vertex.y)}
            r={5}
            fill="#fbbf24"
            stroke="#fff"
            strokeWidth={2}
          />
          <text
            x={sx(result.vertex.x) + 8}
            y={sy(result.vertex.y) - 8}
            fontSize={10}
            fill="#fde68a"
            fontFamily="monospace"
          >
            Đỉnh ({fmtTick(result.vertex.x)}, {fmtTick(result.vertex.y)})
          </text>
        </g>

        {/* Legend */}
        <g transform={`translate(${W - 175}, ${padding + 6})`}>
          <rect width={165} height={62} rx={6} fill="#0f172a" opacity={0.7} />
          <circle cx={12} cy={14} r={4} fill="#10b981" />
          <text x={22} y={17} fontSize={10} fill="#cbd5e1">
            Nghiệm (giao trục Ox)
          </text>
          <circle cx={12} cy={30} r={4} fill="#fbbf24" />
          <text x={22} y={33} fontSize={10} fill="#cbd5e1">
            Đỉnh parabol
          </text>
          <line
            x1={6}
            x2={18}
            y1={46}
            y2={46}
            stroke="#22d3ee"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <text x={22} y={49} fontSize={10} fill="#cbd5e1">
            Trục đối xứng
          </text>
        </g>
      </svg>

      {result.kind === "complex" && (
        <p className="mt-2 text-center text-xs text-slate-400">
          ⓘ Parabol không cắt trục Ox vì phương trình không có nghiệm thực.
        </p>
      )}
    </div>
  );
}

function fmtTick(n: number): string {
  if (Math.abs(n) < 1e-9) return "0";
  const r = Math.round(n * 100) / 100;
  return r.toString();
}

function niceTicks(min: number, max: number, count: number): number[] {
  const range = max - min;
  if (range <= 0) return [];
  const step = niceStep(range / count);
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-9; v += step) {
    ticks.push(Math.round(v / step) * step);
  }
  return ticks;
}

function niceStep(s: number): number {
  const exp = Math.floor(Math.log10(s));
  const f = s / Math.pow(10, exp);
  let nf: number;
  if (f < 1.5) nf = 1;
  else if (f < 3) nf = 2;
  else if (f < 7) nf = 5;
  else nf = 10;
  return nf * Math.pow(10, exp);
}
