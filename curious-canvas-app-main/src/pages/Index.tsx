import { useState } from "react";
import { useSTEMSolver } from "@/hooks/useSTEMSolver";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SolutionTab } from "@/components/SolutionTab";
import { FormulasTab } from "@/components/FormulasTab";
import { DiagramTab } from "@/components/DiagramTab";
import { AnimationTab } from "@/components/AnimationTab";
import { ThreeDTab } from "@/components/ThreeDTab";
import { FIELD_COLORS, FIELD_LABELS, FIELD_ICONS } from "@/types/stem";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLES = [
  "What is the magnetic field around a solenoid?",
  "Find the angle between two vectors (3,4,0) and (1,0,1)",
  "Explain Snell's law for light refraction with n₁=1.0 and n₂=1.5 at 30°",
  "Calculate projectile motion with v₀=20 m/s at 45°",
  "What is Ohm's law and how does a simple circuit work?",
  "Find the derivative of x³ + 2x² - 5x + 3",
];

const Index = () => {
  const [question, setQuestion] = useState("");
  const { solution, isLoading, solve } = useSTEMSolver();
  const [history, setHistory] = useState<string[]>([]);

  const handleSolve = async () => {
    if (!question.trim()) return;
    setHistory((prev) => [question, ...prev.filter((q) => q !== question)].slice(0, 10));
    await solve(question);
  };

  const fieldColor = solution ? FIELD_COLORS[solution.field] : "hsl(var(--primary))";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl">
            🔬
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">STEM Visual Solver</h1>
            <p className="text-xs text-muted-foreground">AI-powered solutions with rich visualizations</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-6 order-2 lg:order-1">
            {/* Examples */}
            <div>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Try an example
              </h2>
              <div className="space-y-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuestion(ex); }}
                    className="w-full text-left text-sm px-3 py-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-foreground leading-snug"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                  Recent
                </h2>
                <div className="space-y-1">
                  {history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => setQuestion(h)}
                      className="w-full text-left text-xs px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground truncate"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main content */}
          <div className="space-y-6 order-1 lg:order-2">
            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type any STEM question... (physics, math, chemistry, engineering, technology)"
                className="min-h-[100px] text-base resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSolve();
                  }
                }}
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSolve}
                  disabled={isLoading || !question.trim()}
                  className="px-8"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Solving...
                    </span>
                  ) : (
                    "🚀 Solve"
                  )}
                </Button>
                <span className="text-xs text-muted-foreground">
                  Press Enter to solve • Shift+Enter for new line
                </span>
              </div>
            </motion.div>

            {/* Solution */}
            <AnimatePresence>
              {solution && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Field badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className="text-sm px-4 py-1.5 font-semibold"
                      style={{ backgroundColor: fieldColor, color: "#fff" }}
                    >
                      {FIELD_ICONS[solution.field]} {FIELD_LABELS[solution.field]}
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {solution.subTopic}
                    </Badge>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="solution" className="w-full">
                    <TabsList className="w-full grid grid-cols-5 h-auto p-1">
                      <TabsTrigger value="solution" className="text-xs sm:text-sm py-2">📝 Solution</TabsTrigger>
                      <TabsTrigger value="diagram" className="text-xs sm:text-sm py-2">📊 2D Diagram</TabsTrigger>
                      <TabsTrigger value="animation" className="text-xs sm:text-sm py-2">🎬 Animation</TabsTrigger>
                      <TabsTrigger value="3d" className="text-xs sm:text-sm py-2">🧊 3D Model</TabsTrigger>
                      <TabsTrigger value="formulas" className="text-xs sm:text-sm py-2">📐 Formulas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="solution" className="mt-4">
                      <SolutionTab
                        steps={solution.solution.steps}
                        finalAnswer={solution.solution.finalAnswer}
                        summary={solution.solution.summary}
                        fieldColor={fieldColor}
                      />
                    </TabsContent>

                    <TabsContent value="diagram" className="mt-4">
                      <DiagramTab diagram={solution.diagram} fieldColor={fieldColor} />
                    </TabsContent>

                    <TabsContent value="animation" className="mt-4">
                      <AnimationTab animation={solution.animation} fieldColor={fieldColor} />
                    </TabsContent>

                    <TabsContent value="3d" className="mt-4">
                      <ThreeDTab model={solution.threeDModel} fieldColor={fieldColor} />
                    </TabsContent>

                    <TabsContent value="formulas" className="mt-4">
                      <FormulasTab formulas={solution.formulas} fieldColor={fieldColor} />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {!solution && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 space-y-4"
              >
                <div className="text-6xl">🔬</div>
                <h2 className="text-2xl font-bold text-foreground">Ask any STEM question</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Get step-by-step solutions with LaTeX formulas, 2D diagrams, animations, and interactive 3D models
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {(["physics", "mathematics", "chemistry", "engineering", "technology"] as const).map((f) => (
                    <Badge
                      key={f}
                      variant="outline"
                      className="px-3 py-1.5 text-sm"
                      style={{ borderColor: FIELD_COLORS[f], color: FIELD_COLORS[f] }}
                    >
                      {FIELD_ICONS[f]} {FIELD_LABELS[f]}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
