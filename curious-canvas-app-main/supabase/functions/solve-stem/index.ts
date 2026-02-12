import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a world-class STEM tutor and problem solver. When given a question, you MUST:

1. Auto-detect the field (physics, mathematics, chemistry, engineering, technology) and sub-topic.
2. Provide a complete, accurate solution with step-by-step reasoning.
3. Return your response as a JSON object with this EXACT structure:

{
  "field": "physics" | "mathematics" | "chemistry" | "engineering" | "technology",
  "subTopic": "string (e.g., Magnetism, Optics, Geometry, Circuits, Thermodynamics)",
  "solution": {
    "steps": [
      {
        "stepNumber": 1,
        "title": "Step title",
        "explanation": "Clear explanation in simple language",
        "formula": "LaTeX formula if applicable (e.g., F = ma, \\\\vec{B} = \\\\frac{\\\\mu_0 I}{2\\\\pi r})",
        "result": "numerical or symbolic result if applicable"
      }
    ],
    "finalAnswer": "The complete final answer with units",
    "summary": "A brief 1-2 sentence summary"
  },
  "formulas": [
    {
      "name": "Formula name",
      "latex": "LaTeX expression",
      "variables": [
        { "symbol": "F", "description": "Force", "unit": "N (Newtons)" }
      ]
    }
  ],
  "diagram": {
    "type": "force_diagram" | "circuit" | "ray_optics" | "geometry" | "field_lines" | "wave" | "graph" | "molecular" | "projectile" | "energy_bar" | "stress_strain" | "thermal_flow",
    "elements": [
      {
        "type": "vector" | "line" | "circle" | "arc" | "point" | "label" | "angle" | "ray" | "wave" | "field_line" | "charge" | "resistor" | "battery" | "lens" | "mirror" | "shape",
        "x": 0, "y": 0,
        "x2": 100, "y2": 100,
        "label": "string",
        "color": "#hex",
        "angle": 45,
        "radius": 50,
        "magnitude": 10,
        "direction": "up" | "down" | "left" | "right",
        "properties": {}
      }
    ],
    "width": 600,
    "height": 400,
    "title": "Diagram title"
  },
  "animation": {
    "type": "field_lines" | "wave_propagation" | "projectile" | "current_flow" | "particle_motion" | "rotation" | "oscillation" | "refraction",
    "parameters": {
      "speed": 1,
      "amplitude": 50,
      "frequency": 1,
      "angle": 45,
      "initialVelocity": 10,
      "gravity": 9.8,
      "fieldStrength": 1,
      "wavelength": 100,
      "refractiveIndex": 1.5
    },
    "description": "What this animation shows"
  },
  "threeDModel": {
    "type": "magnetic_field" | "vector_space" | "optics_setup" | "molecular" | "geometric_3d" | "wave_3d" | "electric_field",
    "objects": [
      {
        "shape": "sphere" | "cylinder" | "arrow" | "plane" | "torus" | "line" | "cone" | "box",
        "position": [0, 0, 0],
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1],
        "color": "#hex",
        "label": "string",
        "properties": {}
      }
    ],
    "camera": { "position": [5, 5, 5], "lookAt": [0, 0, 0] },
    "description": "What this 3D model represents"
  }
}

IMPORTANT RULES:
- All formulas MUST be valid LaTeX. Use double backslashes for LaTeX commands.
- Angles MUST be clearly labeled with degree symbols (°) or radian markers.
- Provide accurate, physically/mathematically correct answers.
- Include units in all numerical results.
- The diagram elements should be positioned to create a clear, educational visualization.
- For the 3D model, include enough objects to represent the concept clearly.
- ALWAYS include ALL sections (solution, formulas, diagram, animation, threeDModel).
- Return ONLY the JSON object, no markdown code blocks or extra text.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    if (!question) {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Parse JSON from the response, handling potential markdown wrapping
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("solve-stem error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
