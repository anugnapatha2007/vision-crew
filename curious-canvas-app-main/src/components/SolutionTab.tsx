import { SolutionStep } from "@/types/stem";
import { LatexRenderer } from "./LatexRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface SolutionTabProps {
  steps: SolutionStep[];
  finalAnswer: string;
  summary: string;
  fieldColor: string;
}

export function SolutionTab({ steps, finalAnswer, summary, fieldColor }: SolutionTabProps) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <p className="text-sm text-muted-foreground mb-2 font-medium">Summary</p>
        <p className="text-foreground leading-relaxed">{summary}</p>
      </motion.div>

      {steps.map((step, i) => (
        <motion.div
          key={step.stepNumber}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Badge
                  className="text-xs font-bold px-3 py-1"
                  style={{ backgroundColor: fieldColor, color: "#fff" }}
                >
                  Step {step.stepNumber}
                </Badge>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">{step.explanation}</p>
              {step.formula && (
                <div className="bg-muted/50 rounded-lg p-4 my-3 overflow-x-auto">
                  <LatexRenderer latex={step.formula} displayMode />
                </div>
              )}
              {step.result && (
                <div className="mt-2 text-sm font-medium text-foreground">
                  Result: <span className="font-mono">{step.result}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: steps.length * 0.1 }}
        className="rounded-xl p-5 border-2"
        style={{ borderColor: fieldColor, background: `${fieldColor}10` }}
      >
        <p className="text-sm font-bold mb-2" style={{ color: fieldColor }}>
          ✅ Final Answer
        </p>
        <p className="text-lg font-semibold text-foreground">{finalAnswer}</p>
      </motion.div>
    </div>
  );
}
