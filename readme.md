# Oriens Omni

> **Recursive Epistemological Claim Analysis for Deno**
> *Automate first‑principles thinking, boolean validation, and analogy generation with a single CLI command.*

[![Deno >=1.44](https://img.shields.io/badge/deno-%E2%89%A51.44-green?logo=deno)](https://deno.land/) 
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license) 
![Status Beta](https://img.shields.io/badge/status-beta-orange)

---

## Why Oriens Omni?

Conventional LLM wrappers excel at summarising text or answering direct questions, but they seldom **interrogate** an idea. Oriens Omni adds a missing layer: it treats a proposition as a living system, decomposes it into "conceptual particles", stress‑tests every assumption with boolean logic, and recursively digs until uncertainty collapses or new insights emerge. The result is a **self‑navigable knowledge map** (JSON + Markdown) you can query, quote, or feed to other tools.

---

## Table of Contents

1. [Features](#features)
2. [Quick Start](#quick-start)
3. [Installation](#installation)
4. [Usage Patterns](#usage-patterns)
5. [Configuration](#configuration)
6. [Project Layout](#project-layout)
7. [Method Under the Hood](#method-under-the-hood)
8. [Extending Oriens Omni](#extending-oriens-omni)
9. [Troubleshooting & Limitations](#troubleshooting--limitations)
10. [Roadmap](#roadmap)
11. [Contributing](#contributing)
12. [License](#license)

---

## Features

| Capability                   | What It Delivers                                              |
| ---------------------------- | ------------------------------------------------------------- |
| **Recursive claim analysis** | Depth‑first exploration of every uncertain sub‑claim.         |
| **Typed JSON schema**        | Predictable keys for programmatic post‑processing.            |
| **Automatic Markdown**       | Human‑readable docs hyperlinked across recursion levels.      |
| **Resume workflow**          | Pick up an interrupted analysis without repetition.           |
| **Shell helper**             | One‑click rerun via `claim.sh` inside each output folder.     |
| **Provider‑agnostic**        | Works with OpenAI **or** Azure OpenAI (just set env vars).    |
| **LLM‑aware rate limiting**  | Exponential back‑off and jitter to survive quota spikes.      |
| **Defensive prompting**      | Injected guard rails to reduce jailbreaks and hallucinations. |

---

## Quick Start

```bash
# analyse a claim
$ deno run -A main.ts "Entropy decreases in isolated quantum systems."

# resume an unfinished job
$ deno run -A main.ts resume "entropy_decreases_in_isolated_quantum_systems"
```

> ℹ️ `-A` is shorthand for `--allow-read --allow-write --allow-env --allow-net`.

The first run creates a folder under `proposiciones/` containing:

```text
entropy_decreases_in_isolated_quantum_systems/
  ├─ 0_entropy_decreases....json
  ├─ 0_entropy_decreases....md
  ├─ claim.sh
  └─ …sub‑analyses
```

Open the `.md` in any viewer or pipe the JSON into your own pipelines.

---

## Installation

1. **Install Deno ≥1.44**

   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```
2. **Clone the repo**

   ```bash
   git clone https://github.com/<your‑org>/oriens‑omni.git && cd oriens‑omni
   ```
3. **Environment variables**
   Create `.env`:

   ```env
   OPENAI_API_KEY=sk‑...
   # Azure (OpenAI) optional
   AZURE_OPENAI_ENDPOINT=https://<res>.openai.azure.com/
   AZURE_OPENAI_DEPLOYMENT=gpt‑4o
   AZURE_OPENAI_API_VERSION=2024‑05‑01
   ```

   `scientia.ts` autoloads the file via `std/dotenv`.

---

## Usage Patterns

### Analyse & Export only JSON

```bash
deno run -A main.ts --json-only "Democracy is inevitable." > result.json
```

### Custom output directory

```bash
deno run -A main.ts --out ./analysis "General AI will end scarcity."
```

### Override max recursion depth

```bash
deno run -A main.ts --depth 3 "Time travel violates causality."
```

Run `deno run main.ts --help` for a full CLI reference.

---

## Configuration

| Variable         | Required | Default       | Description                            |
| ---------------- | -------- | ------------- | -------------------------------------- |
| `OPENAI_API_KEY` | ✔        | –             | API key for OpenAI GPT‑4, GPT‑4o, etc. |
| `AZURE_OPENAI_*` | ✖        | –             | Azure OpenAI settings (if used).       |
| `MODEL`          | ✖        | `gpt‑4o‑mini` | Model name passed to the provider.     |
| `MAX_TOKENS`     | ✖        | `4096`        | Response length ceiling.               |
| `TEMPERATURE`    | ✖        | `0.2`         | Creativity vs. determinism.            |

These can be placed in `.env` or exported in your shell.

---

## Project Layout

```
oriens‑omni/
  ├─ main.ts               # CLI orchestrator
  ├─ scientia.ts           # Core "Oriens Omni" prompt engine
  ├─ jsontomarkdown.ts     # JSON ➜ Markdown converter
  ├─ helper/
  │    ├─ callChatGPT4.ts  # Provider adapter (OpenAI / Azure)
  │    └─ log.ts           # Minimal logger
  ├─ proposiciones/        # All analyses live here
  ├─ test/                 # Unit + integration tests (TBD)
  └─ README.md
```

> 📂 The tool never writes outside `proposiciones/`, keeping your repo clean.

---

## Method Under the Hood

The JSON schema encodes a multi‑stage epistemic pipeline:

1. **Ontological fingerprint** ➜ What is the claim, really?
2. **Conceptual disaggregation** ➜ Break buzzwords into plain terms.
3. **Pre‑conceptual story** ➜ Explain it to a six‑year‑old.
4. **Truth‑table slicing** ➜ Mark what is known, false, or undefined.
5. **Boolean formula** ➜ Minimal logical core.
6. **Recursive descent** ➜ Dive into every `undefined`.
7. **Emergent theory** ➜ Capture surprises & transform them into action.

The process is formally specified inside `scientia.ts` so you can fork and modify it.

---

## Extending Oriens Omni

* **Plug a different provider** — add a `helper/callAnthropic.ts`, then pass `--provider anthropic`.
* **Swap the schema** — edit `scientia.ts` or inject your own prompt via `--prompt-file`.
* **Integrate with CI** — use the JSON output to gate PRs on the logical soundness of new design docs.
* **Visualise the tree** — feed the JSON into D3, Mermaid, or Obsidian for graph navigation.

---

## Troubleshooting & Limitations

| Symptom                 | Likely Cause            | Mitigation                                                         |
| ----------------------- | ----------------------- | ------------------------------------------------------------------ |
| `429 Too Many Requests` | Provider quota spike    | Adjust `RATE_LIMIT_BACKOFF_MS` (env), or slow the recursion depth. |
| Infinite recursion      | Self‑referential claims | Pass `--depth` or refactor the claim.                              |
| Gibberish JSON          | Model hallucination     | Increase `TEMPERATURE` **↓** or pin to GPT‑4o.                     |

Known gaps:

* No unit tests yet — see #12 on the roadmap.
* Schema changes are breaking; version lock planned.
* Does not anonymise sensitive data automatically.

---

## Roadmap

* [ ] **v0.5** CLI refactor with sub‑commands (`analyse`, `resume`, `schema`).
* [ ] **v0.6** Structured logging + verbose flag.
* [ ] **v0.7** Mermaid diagram generation from JSON.
* [ ] **v1.0** Stable schema, test coverage ≥ 80%.

Contributions and issue reports are welcome.

---

## Contributing

1. Fork the repo & create a feature branch.
2. Run `deno test` (tests coming soon).
3. Open a pull request following the template.

We follow conventional commits and require CI to pass before merge.

---

## License

MIT © 2025 Oriens (Automation to Business LLC). See [LICENSE](LICENSE) for details.

---

## Acknowledgements

* The Deno community for a modern, secure runtime.
* OpenAI / Azure OpenAI teams for GPT‑4o.
* Philosophers from Aristotle to Popper for reminding us that asking the right question matters more than the answer.
