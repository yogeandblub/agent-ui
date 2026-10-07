# Design references

Source material for extracting the reference brand's visual language: screenshots and screen
recordings of the shipped product. Used to build the `robinhood` theme and to fill the
wireframe scaffolds in Figma.

```text
design-references/
  robinhood/
    images/   screenshots (.png, .jpg, .webp, .heic)
    videos/   screen recordings (.mp4, .mov)
```

## Naming

`<flow>-<screen>-<nn>.<ext>`, lowercase with hyphens. If a file shows the same moment as a
screen in `docs/screen-inventory.md`, put that screen ID first.

| Example                              | What it is                                  |
| ------------------------------------ | ------------------------------------------- |
| `ba1-agents-approval-prompt-01.png`  | Shipped approval prompt (baseline BA1)      |
| `bg2-agents-approvals-toggle-01.png` | Approvals toggle during setup (BG2)         |
| `home-portfolio-01.png`              | General app screen, no inventory equivalent |
| `agents-setup-flow-01.mov`           | Recording of the whole agent setup flow     |

## Before adding files

- **Redact personal data.** Real screenshots show balances, positions, account numbers and
  names. Blur or crop them before saving here.
- **Not committed by default.** Everything in these folders is gitignored except this README and
  the `.gitkeep` files. The material is a real company's product, and videos are large. To commit
  a specific file deliberately, use `git add -f <file>`.
- Brand assets such as logos come from the project owner only (brief §1). Nothing here is
  redrawn as a logo.
