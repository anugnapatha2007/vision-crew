import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexRendererProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export function LatexRenderer({ latex, displayMode = false, className = "" }: LatexRendererProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && latex) {
      try {
        katex.render(latex, ref.current, {
          displayMode,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch {
        if (ref.current) ref.current.textContent = latex;
      }
    }
  }, [latex, displayMode]);

  return <span ref={ref} className={className} />;
}
