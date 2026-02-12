import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STEMSolution } from "@/types/stem";
import { toast } from "@/hooks/use-toast";

export function useSTEMSolver() {
  const [solution, setSolution] = useState<STEMSolution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solve = async (question: string) => {
    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("solve-stem", {
        body: { question },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setSolution(data as STEMSolution);
    } catch (e: any) {
      const msg = e?.message || "Failed to solve. Please try again.";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return { solution, isLoading, error, solve, setSolution };
}
