# Figma

**File:** https://www.figma.com/design/3hxTnvbUjczlAeyimq2tGt/Untitled

Connected to Claude Code through the Figma MCP server (signed in 2026-10-06).

## Pages

The full page structure in brief §9.2 is created in Phase 2. Status so far:

| Page             | Status                                                                          |
| ---------------- | ------------------------------------------------------------------------------- |
| Screen inventory | Scaffolded (Phase 1.5): header, catalogue, 8 scenario sections, 83 empty frames |

### Screen inventory layout

- **Catalogue:** one frame per screen ID (12 system, 5 baseline).
- **One section per scenario:** system row on top, baseline row underneath, lined up by step.
  Baseline frames exist only where the shipped flow has an equivalent (30 of 36 steps).
- Every frame is 390 × 844 (phone) with a grey spec note at the top: screen, states,
  components, decision. Steps where a study measure is taken have a heavier border and a
  "MEASURE" label.
- Frame names match `docs/screen-inventory.md`, e.g. `1.4 A1 Approval request — system`.

## Sync workflow

To be written in Phase 2 (token → variables push) and Phase 3 (variant manifest).

## Parity status

Not started. The parity check runs from Phase 4 onward (§14).
