# CALIBRE — Personal Science Lab

**Team POWERHOUSE · wHACKiest 2026 · Track 3: Know Thyself: Your Data. Your Intelligence.**  
East Point College of Engineering & Technology

> **Don't just track yourself. Test yourself.**

CALIBRE is a privacy-first personal science lab concept. It helps a person turn a belief about their routine into a small, low-risk self-experiment, then compare that belief with an observation. The goal is to learn what may work for one individual instead of relying only on population averages.

## Prototype status — read this first

This repository contains a browser-based front-end prototype. Its observations are **synthetic and illustrative**. The app does not connect to Apple Health, Health Connect, Fitbit, Strava, an ESP32 sensor, or a clinical data source. It does not run a validated Bayesian N-of-1 analysis, establish causality, or provide medical advice. The Brier-style score is a simplified demonstration of prediction calibration, not a validated health metric.

## What works in this prototype

- Responsive CALIBRE dashboard with overview, experiment studio, insight reveal, belief ledger, and progress milestones.
- Three selectable sample protocols: earlier caffeine cut-off, evening walk, and screen-off before bed.
- Confidence input and a deterministic synthetic result for demonstrating the interaction.
- Simplified Brier-style calibration calculation.
- Local browser persistence with `localStorage`.
- Ethical gamification: progress markers and milestones reward completing the experiment workflow, never a health outcome.
- No account, backend, analytics, or network API is required for the prototype.

## Run locally

No build step or package installation is required.

```bash
# Open index.html directly, or run a local server:
python3 -m http.server 4173
# Visit http://localhost:4173
```

## Project structure

```text
calibre-mvp/
├── index.html       # semantic app structure
├── styles.css       # responsive design system and components
├── app.js           # demo interactions, synthetic protocol data, local state
├── ARCHITECTURE.md  # current and proposed architecture
├── README.md
└── LICENSE
```

## Product principles

1. **Evidence before advice.** A recommendation should cite the experiment and uncertainty behind it.
2. **Inconclusive is a valid result.** The product must not force a positive or negative conclusion when evidence is weak.
3. **Privacy by design.** The prototype stores only demo state in the browser. The proposed production design keeps raw personal data on-device and makes external sharing opt-in.
4. **Human agency.** Experiments are voluntary, small, and low-risk. Gamification rewards consistency and learning, not body metrics or outcomes.
5. **Language models explain; statistics decide.** In the proposed architecture, an LLM may narrate verified findings but must not invent health claims.

## Proposed roadmap — not yet implemented

- Consent-based import from Apple Health exports and Android Health Connect.
- Pre-registered randomized paired-night protocols and a validated Bayesian N-of-1 analysis engine with uncertainty intervals.
- Encrypted on-device vault and auditable consent/access ledger.
- Evidence-gated nudges with explicit citations to the experiment that supports them.
- Opt-in voice check-ins and narration using ElevenLabs.
- Optional encrypted backup using AWS services, with user-controlled keys.

## Team

- Jeevan — Team Lead 1EP24IC015
- Arjun V — 1EP24IC007
- Harsh Jangir — 1EP24IC012

## License

MIT — see [LICENSE](LICENSE).
