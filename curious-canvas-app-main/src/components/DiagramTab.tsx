import { Diagram, DiagramElement } from "@/types/stem";
import { motion } from "framer-motion";

interface DiagramTabProps {
  diagram: Diagram;
  fieldColor: string;
}

function renderElement(el: DiagramElement, i: number) {
  const color = el.color || "#3b82f6";

  switch (el.type) {
    case "vector":
    case "arrow": {
      const x1 = el.x ?? 0;
      const y1 = el.y ?? 0;
      const x2 = el.x2 ?? x1 + 60;
      const y2 = el.y2 ?? y1;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLen = 12;
      return (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} markerEnd="url(#arrowhead)" />
          <polygon
            points={`${x2},${y2} ${x2 - headLen * Math.cos(angle - 0.4)},${y2 - headLen * Math.sin(angle - 0.4)} ${x2 - headLen * Math.cos(angle + 0.4)},${y2 - headLen * Math.sin(angle + 0.4)}`}
            fill={color}
          />
          {el.label && (
            <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10} fill={color} fontSize={13} fontWeight="600" textAnchor="middle">
              {el.label}
            </text>
          )}
        </g>
      );
    }
    case "line": {
      return (
        <g key={i}>
          <line x1={el.x ?? 0} y1={el.y ?? 0} x2={el.x2 ?? 100} y2={el.y2 ?? 100} stroke={color} strokeWidth={2} />
          {el.label && (
            <text x={((el.x ?? 0) + (el.x2 ?? 100)) / 2} y={((el.y ?? 0) + (el.y2 ?? 100)) / 2 - 8} fill={color} fontSize={12} textAnchor="middle">
              {el.label}
            </text>
          )}
        </g>
      );
    }
    case "circle": {
      return (
        <g key={i}>
          <circle cx={el.x ?? 0} cy={el.y ?? 0} r={el.radius ?? 30} fill="none" stroke={color} strokeWidth={2} />
          {el.label && (
            <text x={el.x ?? 0} y={(el.y ?? 0) + (el.radius ?? 30) + 18} fill={color} fontSize={12} textAnchor="middle">
              {el.label}
            </text>
          )}
        </g>
      );
    }
    case "angle":
    case "arc": {
      const cx = el.x ?? 0;
      const cy = el.y ?? 0;
      const r = el.radius ?? 25;
      const startAngle = 0;
      const endAngle = ((el.angle ?? 45) * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy - r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy - r * Math.sin(endAngle);
      const largeArc = (el.angle ?? 45) > 180 ? 1 : 0;
      return (
        <g key={i}>
          <path
            d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`}
            fill="none" stroke={color} strokeWidth={2} strokeDasharray="4 2"
          />
          {el.label && (
            <text
              x={cx + (r + 15) * Math.cos(endAngle / 2)}
              y={cy - (r + 15) * Math.sin(endAngle / 2)}
              fill={color} fontSize={13} fontWeight="600" textAnchor="middle"
            >
              {el.label}
            </text>
          )}
        </g>
      );
    }
    case "point": {
      return (
        <g key={i}>
          <circle cx={el.x ?? 0} cy={el.y ?? 0} r={4} fill={color} />
          {el.label && (
            <text x={(el.x ?? 0) + 10} y={(el.y ?? 0) - 10} fill={color} fontSize={13} fontWeight="600">
              {el.label}
            </text>
          )}
        </g>
      );
    }
    case "label": {
      return (
        <text key={i} x={el.x ?? 0} y={el.y ?? 0} fill={color} fontSize={13} fontWeight="500">
          {el.label ?? ""}
        </text>
      );
    }
    case "ray": {
      return (
        <g key={i}>
          <line x1={el.x ?? 0} y1={el.y ?? 0} x2={el.x2 ?? 200} y2={el.y2 ?? 0} stroke={color} strokeWidth={2} strokeDasharray="6 3" />
          {el.label && (
            <text x={((el.x ?? 0) + (el.x2 ?? 200)) / 2} y={((el.y ?? 0) + (el.y2 ?? 0)) / 2 - 8} fill={color} fontSize={12} textAnchor="middle">
              {el.label}
            </text>
          )}
        </g>
      );
    }
    case "shape": {
      const w = el.properties?.width ?? 80;
      const h = el.properties?.height ?? 60;
      return (
        <g key={i}>
          <rect x={(el.x ?? 0) - w / 2} y={(el.y ?? 0) - h / 2} width={w} height={h} fill="none" stroke={color} strokeWidth={2} rx={4} />
          {el.label && (
            <text x={el.x ?? 0} y={(el.y ?? 0) + h / 2 + 16} fill={color} fontSize={12} textAnchor="middle">
              {el.label}
            </text>
          )}
        </g>
      );
    }
    default: {
      if (el.x !== undefined && el.y !== undefined) {
        return (
          <g key={i}>
            <circle cx={el.x} cy={el.y} r={5} fill={color} />
            {el.label && (
              <text x={el.x + 8} y={el.y - 8} fill={color} fontSize={12}>{el.label}</text>
            )}
          </g>
        );
      }
      return null;
    }
  }
}

export function DiagramTab({ diagram, fieldColor }: DiagramTabProps) {
  const w = diagram.width || 600;
  const h = diagram.height || 400;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <h3 className="font-semibold text-foreground">{diagram.title}</h3>
      <div className="rounded-xl border border-border bg-card p-4 overflow-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-[500px]" style={{ minHeight: 250 }}>
          <rect width={w} height={h} fill="transparent" />
          {diagram.elements.map((el, i) => renderElement(el, i))}
        </svg>
      </div>
      <p className="text-xs text-muted-foreground italic">
        Type: {diagram.type.replace(/_/g, " ")}
      </p>
    </motion.div>
  );
}
