# CALIBRE — Architecture notes

## Implemented prototype

```text
User selects a sample protocol + confidence
                 │
                 ▼
        Browser interface
          HTML / CSS / JS
                 │
                 ▼
     Deterministic synthetic outcome
       (explicitly labelled demo)
                 │
          ┌──────┴──────┐
          ▼             ▼
 Simplified Brier-   Reveal + belief
 style calculation  ledger + milestones
          │             │
          └──────┬──────┘
                 ▼
       Browser localStorage
```

No backend or health-data connector is present in this repository. The current demo does not perform statistical inference from real observations.

## Proposed production architecture

```text
Apple Health / Health Connect / Fitbit / Strava / optional ESP32
                              │
                              ▼
                 On-device ingestion + normalization
                              │
                              ▼
               Pre-registered experiment scheduler
                              │
                              ▼
             Bayesian N-of-1 analysis + uncertainty
                              │
                 ┌────────────┴─────────────┐
                 ▼                          ▼
       Calibration / Self-Map        Evidence / Nudge gate
                 │                          │
                 └────────────┬─────────────┘
                              ▼
                 Local language narrator
                              │
                              ▼
                 User-approved insight
```

## Proposed technology choices

- Client: Next.js, TypeScript, Tailwind CSS, D3.
- On-device storage and cryptography: IndexedDB, SQLite-WASM, WebCrypto (AES-GCM, Ed25519).
- Statistical engine: Python, NumPy, SciPy, PyMC via Pyodide or a controlled FastAPI service where appropriate.
- Narration: local Llama 3.2 / Qwen; narrator-only constraint.
- Optional voice: ElevenLabs TTS/STT with explicit consent.
- Optional encrypted backup: AWS S3 + KMS, Lambda + API Gateway; any Bedrock use must be opt-in and de-identified.

These are proposed components from the project design, not claims about the current prototype implementation.

## Trust boundary

The intended production trust boundary is the user's device. Raw health data should remain local. External services should receive only explicitly permitted text or ciphertext. Consent and access events should be auditable. The app must support an inconclusive result and must not diagnose or replace professional medical care.
