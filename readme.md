# Scientia: Oriens Omni

## A Groundbreaking Framework for Deterministic Epistemological Reduction

Deep reasoning demands more than stochastic token prediction. By embedding the inferential capabilities of Large Language Models (LLMs) within a deterministic, recursive thought framework, we can algorithmically distill natural language propositions into rigorous boolean algebraic claims. **Scientia: Oriens Omni** operationalizes this approach, collapsing complex truth tables into unambiguous states of truth, falsehood, or structurally identifiable contradictions.

> **Recursive Epistemological Claim Analysis for Deno**  
> **Automate first‑principles thinking, logical validation, and isomorphic analogy generation via a single, academically robust CLI command.**

[![Deno >=1.44](https://img.shields.io/badge/deno-%E2%89%A51.44-green?logo=deno)](https://deno.land/) 
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license) 
[![Status Beta](https://img.shields.io/badge/status-beta-orange)](Beta)

---

## Why Oriens Omni?

Contemporary LLM architectures excel at semantic synthesis but falter at sustained, rigorous interrogation of philosophical or structural premises. Oriens Omni bridges this gap by treating a proposition not as a static text string, but as a living epistemic system. It algorithmically decomposes claims into foundational "conceptual particles," stress‑tests every assumption through strict boolean logic, and recursively navigates unresolved dependencies until uncertainty deterministically collapses. 

The resulting artifact is a **self‑navigable, mathematically grounded knowledge map** (rendered in JSON + Markdown) capable of backpropagating truth values from fundamental axioms up to complex theoretical assertions.

---

## Table of Contents

1. [Architectural Features](#architectural-features)
2. [Quick Start](#quick-start)
3. [Installation](#installation)
4. [Usage Patterns](#usage-patterns)
5. [Configuration](#configuration)
6. [Project Layout](#project-layout)
7. [The Epistemological Pipeline](#the-epistemological-pipeline)
8. [Extensibility](#extensibility)
9. [Troubleshooting & Limitations](#troubleshooting--limitations)
10. [Roadmap](#roadmap)
11. [Contributing](#contributing)
12. [License](#license)

---

## Architectural Features

| Capability | Academic Implication |
| :--- | :--- |
| **Recursive Epistemological Descent** | Executes depth‑first exploration of every uncertain sub‑claim, isolating ambiguities. |
| **Deterministic Backpropagation** | Bubbles localized truth resolutions up the epistemic tree via in-memory JavaScript logic evaluation. |
| **Typed JSON Schema** | Yields predictable, standardized semantic and logical keys for programmatic analysis. |
| **Provider‑Agnostic (OpenRouter)** | Natively interfaces with OpenRouter (`google/gemini-3-flash-preview`), ensuring API fungibility. |
| **LLM‑Aware Rate Limiting** | Employs asynchronous queuing and exponential back‑off to preserve session integrity during high-throughput reduction. |
| **Robust Prompt Defense** | Injects strict contextual guardrails to mitigate semantic drift and logical hallucination. |

---

## Quick Start

```bash
# Execute an epistemological reduction on a root claim
$ deno run -A main.ts "Entropy decreases in isolated quantum systems."

# Resume a previously interrupted analytical state
$ deno run -A main.ts resume "entropy_decreases_in_isolated_quantum_systems"
```

> ℹ️ `-A` encapsulates all required Deno permissions (`--allow-read --allow-write --allow-env --allow-net`).

The initial execution constructs an epistemic map within the `proposiciones/` directory:

```text
entropy_decreases_in_isolated_quantum_systems/
  ├─ 0_entropy_decreases....json
  ├─ 0_entropy_decreases....md
  ├─ claim.sh
  ├─ resolution.md          <-- Deterministic backpropagation log
  └─ …recursive sub‑analyses
```

---

## Installation

1. **Install Deno ≥1.44**

   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```

2. **Clone the Repository**

   ```bash
   git clone https://github.com/<your‑org>/scientia.git && cd scientia
   ```

3. **Install Dependencies**

   ```bash
   npm install @openrouter/sdk
   ```

4. **Environment Variables**
   Initialize your environment via `.env`:

   ```env
   OPENROUTER_API_KEY=sk-or-v1-...
   ```

   *The framework natively imports `.env` settings to authenticate with OpenRouter.*

---

## Usage Patterns

### Output Redirection

Isolate the analytical context to a distinct directory for isolated philosophical validation:

```bash
deno run -A main.ts --out ./analysis "General AI will functionally eliminate economic scarcity."
```

---

## Configuration

| Variable | Status | Default | Description |
| :--- | :--- | :--- | :--- |
| `OPENROUTER_API_KEY` | **Required** | – | Authentication token for the OpenRouter SDK. |

Configure these constraints within `.env` prior to executing root operations.

---

## Project Layout

```text
scientia/
  ├─ main.ts               # Core execution orchestrator & deterministic backpropagation engine
  ├─ scientia.ts           # The "Oriens Omni" metaontological prompt architecture
  ├─ jsontomarkdown.ts     # JSON ➜ Markdown serialization utility
  ├─ scan.ts               # Structural project scanner
  ├─ helper/
  │    ├─ callChatGPT4.ts  # OpenRouter SDK integration & rate-limiting logic
  │    └─ log.ts           # Execution diagnostics
  ├─ proposiciones/        # Output directory for materialized epistemic graphs
  └─ README.md
```

---

## The Epistemological Pipeline

Scientia operates via a rigorously defined metaontological prompt mapped to a deterministic JS evaluator. The JSON schema enforces this multi-stage epistemic pipeline:

1. **Ontological Fingerprint:** Isolates the intrinsic metaphysical nature of the claim.
2. **Conceptual Disaggregation:** Fractures abstract taxonomy into foundational principles.
3. **Pre-conceptual Transduction:** Distills the premise into elementary vernacular (6th-grade baseline).
4. **Truth-Table Slicing:** Binds the logical domain into True (1), False (0), or Undefined (null) vectors.
5. **Boolean Formulation:** Translates the argument into a rigorous JavaScript-parsable equation.
6. **Recursive Descent:** Spawns a parallel investigation for every `Undefined` component.
7. **Deterministic Backpropagation:** Collapses the truth table from the conceptual leaves back to the root, resolving the initial formula.
8. **Emergent Theory:** Synthesizes the surviving conceptual structure into a paradigm-shifting conclusion.

---

## Extensibility

- **Alternate Cognitive Models:** The system currently leverages `google/gemini-3-flash-preview` via OpenRouter. You can dynamically adjust the payload inside `helper/callChatGPT4.ts` to accommodate arbitrary state-of-the-art models.
- **Continuous Integration Pipeline:** Hook `main.ts` into a CI/CD process to logically parse and validate system architecture definitions before code merges.
- **Graph Traversal:** The structured JSON outputs allow seamless migration into Neo4j, D3.js, or Obsidian for 3D ontological graphing.

---

## Troubleshooting & Limitations

| Anomaly | Diagnostic Origin | Resolution Strategy |
| :--- | :--- | :--- |
| `429 Too Many Requests` | Provider concurrency cap exceeded | The internal exponential back-off handles most spikes automatically. |
| **Cyclical Epistemology** | The claim asserts a self-referential axiom | Ensure `MAX_RETRIES` and depth constraints act as safety breaks. |

**Current Boundaries:**
- Semantic restructuring is permanent for a given execution run; version lock for prompts is advised.
- Requires consistent markdown formatting for optimal readability of the `resolution.md` backpropagation logger.

---

## Roadmap

- [ ] **v0.5** CLI architecture refactoring (decoupled commands for `analyse`, `resume`, `schema`).
- [ ] **v0.6** Structured runtime diagnostics and real-time observability flags.
- [ ] **v0.7** Automated Mermaid flowchart synthesis directly from truth-table schemas.
- [ ] **v1.0** Stabilized schema configurations and 80%+ test suite coverage.

---

## Contributing

Rigorous scientific advancement requires peer review. 
1. Fork the repository and initiate a feature branch.
2. Ensure any modifications to the prompt architecture strictly preserve the expected JSON shape.
3. Submit a pull request aligning with conventional commit semantics.

---

## License

MIT © 2025 Oriens (Automation to Business LLC). Consult the [LICENSE](LICENSE) file for stipulations.

---

## Acknowledgements

- The OpenRouter ecosystem for federating access to apex-level LLM reasoning.
- Theoretical foundations built upon Aristotle, Gödel, and Popper—proving that formalizing the question is the sole prerequisite for deducing the answer.