# Precedents: shipped vs. missing controls

What shipped agentic products offer for supervising delegated authority, what they don't, and
which component in this system fills each gap (brief §10, §12).

> **Status:** seeded, awaiting the table from the thesis document. Paste it below; each row should
> end with the component that addresses the gap.

| Control | Shipped in (product) | Missing / weak | Addressed by |
| ------- | -------------------- | -------------- | ------------ |
| _TODO_  |                      |                |              |

## Notes

- `ref-brokerage`'s `baseline` condition recreates the shipped Robinhood Agents flow. Anything in
  this table marked as missing from Robinhood Agents must be absent from the baseline too.
- Whether the shipped product has a per-trade or per-period limit is unverified (§17.3). Record
  the answer here once confirmed. None was visible on the Agentic account screen in the
  2026-10-07 recording, but the setup flow wasn't recorded.

## Observed in the shipped app (screen recording, 2026-10-07)

| Control                 | What the app shows                                                    |
| ----------------------- | --------------------------------------------------------------------- |
| Dedicated account       | Separate "Agentic" account tab with its own balance and chart         |
| Agent connection / stop | One row: agent name + red "Disconnect" link                           |
| Activity attribution    | Small agent glyph after the date on agent-placed orders; nothing else |
| Limits, rules, scope    | Not visible on the account screen                                     |
| Liability               | Not visible on the account screen                                     |
| Approvals               | Not shown in the recording; Cortex says approvals are on by default   |

See `docs/thesis-notes.md` entries 10–11.
