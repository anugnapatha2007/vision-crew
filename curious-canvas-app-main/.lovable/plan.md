
# STEM Visual Problem Solver

An AI-powered learning tool where students type any STEM question and get **accurate answers with rich graphical visualizations** tailored to the subject field.

## How It Works
1. **Single Input** — User types any STEM question (physics, chemistry, math, engineering, technology)
2. **AI Auto-Detects** the field and sub-topic (e.g., Magnetism, Optics, Geometry, Circuits)
3. **Multi-View Output** — Shows the answer with:
   - Beautiful **LaTeX-rendered formulas** with step-by-step derivations
   - **Field-specific graphical visualizations** (diagrams, animations, 3D models)
   - Clear explanations in simple language

## Pages & Features

### 1. Home / Problem Input Page
- Clean, prominent text input area with example prompts ("What is the magnetic field around a solenoid?", "Find the angle between two vectors", "Snell's law for light refraction")
- Category chips showing detected field (Physics → Magnetism, Math → Geometry, etc.)
- History of recent questions in a sidebar

### 2. Solution View (Main Output)
- **Tabs for different representations:**
  - **📝 Solution** — Step-by-step text answer with rendered LaTeX formulas (using KaTeX)
  - **📊 2D Diagram** — Labeled diagrams: force vectors with angles, circuit diagrams, ray diagrams for optics, geometric shapes with marked angles/sides
  - **🎬 Animation** — Animated visualizations: magnetic field lines flowing, wave propagation, projectile motion, current flow in circuits
  - **🧊 3D Model** — Interactive 3D views (using React Three Fiber): magnetic fields around conductors, 3D vector spaces, optical setups, molecular structures
  - **📐 Formulas** — All relevant formulas rendered beautifully with variable explanations and units

### 3. Field-Specific Visualizations
- **Physics (Mechanics)** — Force diagrams, projectile trajectories, energy bar charts, labeled angles
- **Physics (Electricity/Magnetism)** — Field line visualizations (2D & 3D), circuit diagrams, magnetic field around wires/solenoids
- **Physics (Optics)** — Ray diagrams with reflection/refraction angles, lens/mirror diagrams, wave interference patterns
- **Mathematics** — Geometric shapes with labeled angles/sides, function graphs, coordinate planes, calculus visualizations
- **Engineering** — Stress/strain diagrams, structural load diagrams, thermal flow
- **Chemistry/Technology** — Molecular structures, process flow diagrams

### 4. Key Improvements Over Previous Version
- **Angles are always clearly labeled** with degree/radian markers
- **Formulas displayed in beautiful LaTeX** (not plain text), with each variable explained
- **Correct, accurate answers** powered by AI with physics/math validation
- **Auto-detection** of the problem domain — no need to manually select a category
- **Responsive design** that works on desktop and mobile

## Backend
- **Lovable Cloud + Lovable AI** — AI processes the question, identifies the field, generates the solution text, formulas, and visualization data
- Edge function handles prompt engineering for accurate STEM answers

## Design
- Clean, modern educational interface
- Dark/light mode support
- Color-coded by field (blue for physics, green for math, orange for engineering, purple for chemistry)
