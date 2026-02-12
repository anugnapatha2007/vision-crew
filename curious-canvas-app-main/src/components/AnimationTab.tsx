import { useRef, useEffect, useState } from "react";
import { AnimationData } from "@/types/stem";
import { motion } from "framer-motion";

interface AnimationTabProps {
  animation: AnimationData;
  fieldColor: string;
}

export function AnimationTab({ animation, fieldColor }: AnimationTabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const animationFrame = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 600;
    const H = 400;
    canvas.width = W;
    canvas.height = H;

    const p = animation.parameters;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = timeRef.current;

      switch (animation.type) {
        case "wave_propagation": {
          const amp = p.amplitude ?? 60;
          const freq = p.frequency ?? 1;
          const wl = p.wavelength ?? 120;
          ctx.strokeStyle = fieldColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let x = 0; x < W; x++) {
            const y = H / 2 + amp * Math.sin((2 * Math.PI * x) / wl - t * freq * 3);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
          // Axis
          ctx.strokeStyle = "#888";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, H / 2);
          ctx.lineTo(W, H / 2);
          ctx.stroke();
          ctx.setLineDash([]);
          // Labels
          ctx.fillStyle = fieldColor;
          ctx.font = "14px Space Grotesk";
          ctx.fillText(`λ = ${wl}`, 20, 30);
          ctx.fillText(`A = ${amp}`, 20, 50);
          ctx.fillText(`f = ${freq} Hz`, 20, 70);
          break;
        }
        case "field_lines": {
          const strength = p.fieldStrength ?? 1;
          const lines = 8;
          for (let i = 0; i < lines; i++) {
            const startAngle = (i / lines) * Math.PI * 2;
            ctx.strokeStyle = fieldColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let r = 20; r < 180; r += 2) {
              const angle = startAngle + Math.sin(t * 2 + r * 0.02) * 0.1 * strength;
              const x = W / 2 + r * Math.cos(angle);
              const y = H / 2 + r * Math.sin(angle);
              r === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          // Center
          ctx.fillStyle = fieldColor;
          ctx.beginPath();
          ctx.arc(W / 2, H / 2, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.font = "bold 14px Space Grotesk";
          ctx.textAlign = "center";
          ctx.fillText("+", W / 2, H / 2 + 5);
          ctx.textAlign = "start";
          break;
        }
        case "projectile": {
          const v0 = p.initialVelocity ?? 50;
          const ang = ((p.angle ?? 45) * Math.PI) / 180;
          const g = p.gravity ?? 9.8;
          const scale = 3;
          ctx.strokeStyle = "#888";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(50, H - 50);
          ctx.lineTo(W - 20, H - 50);
          ctx.stroke();
          ctx.strokeStyle = fieldColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          const totalT = (2 * v0 * Math.sin(ang)) / g;
          const steps = 200;
          for (let i = 0; i <= steps; i++) {
            const tt = (i / steps) * totalT;
            const x = 50 + v0 * Math.cos(ang) * tt * scale;
            const y = H - 50 - (v0 * Math.sin(ang) * tt - 0.5 * g * tt * tt) * scale;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
          // Moving dot
          const curT = ((t * (p.speed ?? 1)) % totalT);
          const dotX = 50 + v0 * Math.cos(ang) * curT * scale;
          const dotY = H - 50 - (v0 * Math.sin(ang) * curT - 0.5 * g * curT * curT) * scale;
          ctx.fillStyle = fieldColor;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = fieldColor;
          ctx.font = "13px Space Grotesk";
          ctx.fillText(`v₀ = ${v0} m/s`, 20, 30);
          ctx.fillText(`θ = ${p.angle ?? 45}°`, 20, 50);
          ctx.fillText(`g = ${g} m/s²`, 20, 70);
          break;
        }
        case "oscillation": {
          const amp2 = p.amplitude ?? 80;
          const freq2 = p.frequency ?? 1;
          const yPos = H / 2 + amp2 * Math.sin(t * freq2 * 4);
          // Spring
          ctx.strokeStyle = "#888";
          ctx.lineWidth = 2;
          const segments = 20;
          ctx.beginPath();
          ctx.moveTo(W / 2, 40);
          for (let i = 1; i <= segments; i++) {
            const sy = 40 + (yPos - 60) * (i / segments);
            const sx = W / 2 + (i % 2 === 0 ? 20 : -20);
            ctx.lineTo(sx, sy);
          }
          ctx.lineTo(W / 2, yPos);
          ctx.stroke();
          // Mass
          ctx.fillStyle = fieldColor;
          ctx.fillRect(W / 2 - 25, yPos, 50, 40);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 14px Space Grotesk";
          ctx.textAlign = "center";
          ctx.fillText("m", W / 2, yPos + 25);
          ctx.textAlign = "start";
          break;
        }
        case "current_flow": {
          // Simple circuit loop with moving charges
          const cx = W / 2;
          const cy = H / 2;
          const rw = 180;
          const rh = 120;
          ctx.strokeStyle = "#888";
          ctx.lineWidth = 3;
          ctx.strokeRect(cx - rw, cy - rh, rw * 2, rh * 2);
          // Battery
          ctx.fillStyle = fieldColor;
          ctx.fillRect(cx - rw - 3, cy - 15, 6, 30);
          ctx.font = "13px Space Grotesk";
          ctx.fillText("V", cx - rw - 20, cy + 5);
          // Resistor
          ctx.fillStyle = "#888";
          ctx.fillRect(cx + rw - 3, cy - 10, 6, 20);
          ctx.fillText("R", cx + rw + 10, cy + 5);
          // Moving charges
          const numCharges = 12;
          const perimeter = 2 * (rw * 2 + rh * 2);
          for (let i = 0; i < numCharges; i++) {
            const pos = ((i / numCharges) * perimeter + t * 80 * (p.speed ?? 1)) % perimeter;
            let px, py;
            if (pos < rw * 2) {
              px = cx - rw + pos; py = cy - rh;
            } else if (pos < rw * 2 + rh * 2) {
              px = cx + rw; py = cy - rh + (pos - rw * 2);
            } else if (pos < rw * 4 + rh * 2) {
              px = cx + rw - (pos - rw * 2 - rh * 2); py = cy + rh;
            } else {
              px = cx - rw; py = cy + rh - (pos - rw * 4 - rh * 2);
            }
            ctx.fillStyle = fieldColor;
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
        case "refraction": {
          const n = p.refractiveIndex ?? 1.5;
          const incAngle = ((p.angle ?? 30) * Math.PI) / 180;
          const refrAngle = Math.asin(Math.sin(incAngle) / n);
          // Interface
          ctx.fillStyle = "rgba(100,150,255,0.15)";
          ctx.fillRect(0, H / 2, W, H / 2);
          ctx.strokeStyle = "#888";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, H / 2);
          ctx.lineTo(W, H / 2);
          ctx.stroke();
          // Normal
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = "#aaa";
          ctx.beginPath();
          ctx.moveTo(W / 2, 30);
          ctx.lineTo(W / 2, H - 30);
          ctx.stroke();
          ctx.setLineDash([]);
          // Incident ray
          const rayLen = 160;
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(W / 2 - rayLen * Math.sin(incAngle), H / 2 - rayLen * Math.cos(incAngle));
          ctx.lineTo(W / 2, H / 2);
          ctx.stroke();
          // Refracted ray
          ctx.strokeStyle = fieldColor;
          ctx.beginPath();
          ctx.moveTo(W / 2, H / 2);
          ctx.lineTo(W / 2 + rayLen * Math.sin(refrAngle), H / 2 + rayLen * Math.cos(refrAngle));
          ctx.stroke();
          // Angle labels
          ctx.fillStyle = "#f59e0b";
          ctx.font = "13px Space Grotesk";
          ctx.fillText(`θ₁ = ${p.angle ?? 30}°`, W / 2 + 10, H / 2 - 60);
          ctx.fillStyle = fieldColor;
          ctx.fillText(`θ₂ = ${((refrAngle * 180) / Math.PI).toFixed(1)}°`, W / 2 + 10, H / 2 + 70);
          ctx.fillStyle = "#888";
          ctx.fillText(`n₁ = 1.0`, 20, H / 2 - 20);
          ctx.fillText(`n₂ = ${n}`, 20, H / 2 + 30);
          break;
        }
        default: {
          // Generic rotation
          const cx2 = W / 2;
          const cy2 = H / 2;
          const r = 80;
          ctx.strokeStyle = fieldColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = fieldColor;
          const bx = cx2 + r * Math.cos(t * 2);
          const by = cy2 + r * Math.sin(t * 2);
          ctx.beginPath();
          ctx.arc(bx, by, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = "14px Space Grotesk";
          ctx.fillText(animation.description, 20, 30);
        }
      }

      if (isPlaying) {
        timeRef.current += 0.016 * (p.speed ?? 1);
        animationFrame.current = requestAnimationFrame(draw);
      }
    };

    if (isPlaying) {
      animationFrame.current = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => cancelAnimationFrame(animationFrame.current);
  }, [animation, fieldColor, isPlaying]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{animation.description}</h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-sm px-3 py-1 rounded-md border border-border hover:bg-muted transition-colors"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
      <div className="rounded-xl border border-border bg-card p-2 overflow-hidden">
        <canvas ref={canvasRef} className="w-full" style={{ maxHeight: 400 }} />
      </div>
      <p className="text-xs text-muted-foreground italic">
        Animation: {animation.type.replace(/_/g, " ")}
      </p>
    </motion.div>
  );
}
