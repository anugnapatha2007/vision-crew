import { Formula } from "@/types/stem";
import { LatexRenderer } from "./LatexRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface FormulasTabProps {
  formulas: Formula[];
  fieldColor: string;
}

export function FormulasTab({ formulas, fieldColor }: FormulasTabProps) {
  return (
    <div className="space-y-4">
      {formulas.map((formula, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-3" style={{ color: fieldColor }}>
                {formula.name}
              </h3>
              <div className="bg-muted/50 rounded-lg p-6 mb-4 flex items-center justify-center overflow-x-auto">
                <LatexRenderer latex={formula.latex} displayMode />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Variables
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formula.variables.map((v, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 text-sm rounded-md bg-muted/30 px-3 py-2"
                    >
                      <span className="font-mono font-bold text-foreground">
                        <LatexRenderer latex={v.symbol} />
                      </span>
                      <span className="text-muted-foreground">— {v.description}</span>
                      <span className="ml-auto text-xs font-mono text-muted-foreground">
                        {v.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
