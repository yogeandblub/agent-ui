# Wireframing process

How the lo-fi wireframes in the Figma **Catalogue** were planned and built (2026-10-08), so the
same method can be reused for the scenario sections, for travel and email, or for a new round. The
screen-by-screen result is in [`wireframes.md`](wireframes.md).

Written for two readers: the owner, deciding what to ask for next, and whoever builds the next
batch (a person, or Claude Code through the Figma MCP server).

---

## 1. Principles that shaped every screen

These came from the owner's feedback during the session, and from the brief.

1. **One decision per screen.** Robinhood splits flows into short steps, so we do too. A screen
   that asks for several decisions becomes a flow. The first one-screen G1 was rejected as "a lot
   to look at".
2. **A catalogue screen is a journey, not a frame.** Each screen ID gets a row; its states or steps
   run left to right. Leave room for rows to grow.
3. **Plan, get approval, then build.** For anything new, describe the flow and the reasoning first,
   flag weak ideas, and ask only the decisions that shape the thesis. Small details (copy, sample
   numbers) are decided, not asked.
4. **Lo-fi means simple shapes, not unfinished thinking.** Boxes, text, pills and simple glyphs;
   no extracted components and no colour. But the content is real (fixture numbers, real copy),
   because participants react to what the words say.
5. **Behavioural signals use shape, weight and wording, never colour.** This keeps the wireframes
   valid for the `wireframe` theme (brief §9.5) and for colour-blind participants.
6. **Every screen has to answer the brief's design principles** (§3): authority visible, read and
   write shown separately, every rule shows its source, stopping isn't undoing, irreversibility
   changes behaviour, intervention one step away.
7. **Both study conditions get the same treatment** (branding, tone, density). Only the authority
   design differs. The baseline is kept sparse because the shipped product is, not to make it
   worse.

## 2. Workflow

For each row (or batch of rows):

1. **Read the inputs.** The row's entry in `screen-inventory.md` (purpose, components), every
   scenario step that uses the screen (states, the decision it asks), and the fixtures for content.
2. **Plan the journey.** List the frames: one per step or per state that a scenario needs. For
   each, write what it shows and why. Check it against the principles in §1.
3. **Check with the owner** when the plan introduces something new (a new pattern, a new rule,
   an answer to an open question). Otherwise build and report the decisions afterwards.
4. **Build the row in one script** (§5). Replace the row's placeholder frame. Link the prototype:
   Continue, back, and links into neighbouring rows.
5. **Check overflow from numbers.** Every build returns where each frame's body ends and where its
   footer starts. Fix any overlap before looking at it.
6. **Screenshot and review.** Look for wrapping labels, cramped rows and numbers that don't add
   up across screens (e.g. a meter that disagrees with the banner above it).
7. **Fix with a small targeted script.** Don't rebuild the row.
8. **Document.** Add the frames and the reasoning to `wireframes.md`; log anything that looks like
   a research finding in `thesis-notes.md`.
9. **Report.** Summarise per screen, and list decisions made without the owner separately from the
   owner's own.

## 3. Page layout conventions

All positions are relative to the **Catalogue** section (node `4:6`) on the Screen inventory page
(node `0:1`).

| Thing                  | Convention                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| Row pitch              | 1200 pt. System rows start at y = 140; the baseline header sits after the last system row |
| Row title              | Semi Bold 20 at (80, rowY). Purpose text in grey 14, 16 pt to the right of the title      |
| Frames                 | 440 × 956, at x = 80 + col × 500, y = rowY + 80                                           |
| Frame caption          | Semi Bold 14 grey, 32 pt above the frame: `<ID>-<n> · <name>`                             |
| Frame names            | `<ID>-<n> <name>`, e.g. `A1-3 Over limit`. Alternatives get a letter: `G1a-…`, `G1b-…`    |
| Alternative versions   | Same row, to the right of the first version, under a "Version B: …" label                 |
| Prototype start points | One per row, named after the row (e.g. "A1 Approval request")                             |

The scenario sections sit below the Catalogue and move down when it grows.

## 4. Screen anatomy and visual key

### Anatomy (440 × 956)

| Part                   | Spec                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------- |
| Status bar             | "9:41", Semi Bold 15 at (40, 18)                                                        |
| Back / close           | 32 pt grey circle at (20, 62) with ‹ or ✕                                               |
| Progress (flows)       | Segments from x = 68 to 416 at y = 76, 4 pt high; filled up to the current step         |
| Centred title (detail) | Semi Bold 16 at y = 68                                                                  |
| Account tabs (home)    | At (24, 60); the active tab is bold and underlined                                      |
| Body                   | Vertical auto layout, 392 wide, at x = 24, y = 104 (home), 112 (detail) or 118 (flow)   |
| Heading                | Bold 26, with an optional Regular 15 grey subtitle                                      |
| Footer                 | Pinned so its bottom sits at y = 922: buttons 48 high, radius 24                        |
| Home indicator         | 134 × 5 at (153, 940); left out on screens with a tab bar                               |
| Tab bar (home)         | 400 × 62 pill at (20, 872)                                                              |
| Bottom sheet           | Full width, top radius 20, grab handle, over a 45% black scrim. Usually on a copy of H1 |

The body must end above the footer (or above y = 872 on home screens). Builds report both numbers.

### Greys

| Token | Value (0–1) | Use                                           |
| ----- | ----------- | --------------------------------------------- |
| INK   | 0.13        | Text, strong strokes, filled glyphs           |
| DARK  | 0.20        | Primary buttons, selected states, filled tags |
| MID   | 0.45        | Secondary text, outlines                      |
| LINE  | 0.80        | Card borders                                  |
| SOFT  | 0.95        | Soft card fills, input fills                  |

Font: Inter (Regular, Medium, Semi Bold, Bold).

### State and meaning, without colour

| Meaning                           | Shape                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------- |
| Agent working                     | Filled dot ●                                                                      |
| Waiting (condition, background)   | Ring ○                                                                            |
| Paused                            | Two bars ❚❚                                                                       |
| Stopped / blocked                 | Filled square ■                                                                   |
| Needs you                         | Filled triangle ▲, on a dark badge                                                |
| Failed                            | ✕                                                                                 |
| Rule set by the user              | Outlined tag (`YOUR RULE`)                                                        |
| Rule set by platform or regulator | Filled tag (`PLATFORM`, `REGULATOR · NY`), plus "you can't turn this off"         |
| Read scope                        | Dashed box                                                                        |
| Write scope                       | Solid 2 pt box                                                                    |
| External agent                    | Dashed avatar, plus an `EXTERNAL` tag                                             |
| Empty / not set yet               | Dashed box with "+ Set …"                                                         |
| Limit near / reached / over       | A tag on the meter, plus a threshold tick on the track                            |
| Can't be undone                   | Black `CAN’T BE UNDONE` tag with a square, and a different flow (hold to confirm) |
| Severity of an alert              | How much it interrupts: outlined banner → filled banner → blocking sheet          |
| Risk                              | 5 bars, filled up to the level, plus the word                                     |

## 5. Building with the Figma MCP server

### Setup

- The Figma plugin must be signed in (`whoami` checks this). The file key is
  `3hxTnvbUjczlAeyimq2tGt`.
- Load the `figma-use` skill before any `use_figma` call. Pass `skillNames: "figma-use"`.
- Every call starts on the first page. Switch with `await figma.setCurrentPageAsync(page)`, once per
  call.

### One call per row

Each row was built by a single script: the **prelude** (§7), then `prepRow(...)`, then one block
per frame, then links. Benefits:

- **Retry-safe.** `prepRow` deletes the row's previous frames, captions and purpose text first. If
  a script throws, Figma rolls the whole call back, so it can be fixed and rerun.
- **Self-checking.** The script returns frame IDs and where each body and footer ends.
- **Cross-row links use node IDs** returned by earlier calls. No state survives between calls, so
  IDs are passed as string literals.

### Reuse before rebuilding

- **Clone a finished screen** for states shown on top of it (banners on H1, sheets over H1). Edit
  the clone's text and add the overlay. Clones keep the prototype links of their buttons.
- **Link to an existing screen** rather than drawing a near copy: G1b's "Edit the wording" reuses
  G1a-5b.

### Pitfalls hit in this session

| Symptom                                                 | Cause and fix                                                                                          |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `Found duplicate input nodeIds` on `flowStartingPoints` | Adding prototype links can auto-create a start point. Filter out the node ID before adding your own    |
| A stray "Flow 1" start point                            | Same cause. Remove it once a batch is done                                                             |
| `cannot read property 'id' of null`                     | `appendChild` returns nothing. Keep the node in a variable, then append                                |
| `Unrecognized key(s) … 'direction', 'matchLayers'`      | `DISSOLVE` transitions take no direction. Use `MOVE_IN` / `SLIDE_IN` with a direction                  |
| A screenshot call shows only 5 images                   | It returns at most 5 per call. Split larger batches                                                    |
| Text collapses to a thin column                         | Wrapping text needs `layoutSizingHorizontal = 'FILL'` and `textAutoResize = 'HEIGHT'`, after appending |
| A label wraps inside a crowded header row               | Move tags under the name instead of beside it (fixed on H2's external card)                            |
| Glyph characters missing in Inter                       | Draw state glyphs as shapes (ellipse, rectangle, polygon), not Unicode symbols                         |

The Figma library pitfalls (spacer heights, sizing modes after `resize`, DM Sans style names) are in
the project memory and `figma.md`.

## 6. Content rules

- **Use the fixtures** (`packages/schema/src/fixtures/brokerage.ts`) for agent names, limits, rules
  and wording, so the wireframes match what the code will render.
- **Keep numbers consistent across a journey.** If H1 says $500 spent this week, the stop confirm
  and recovery screens agree.
- **Don't claim real-world policy.** Liability text is the fixture's wording; regulator rules name
  no specific law; model names in the baseline are placeholders until verified.
- **Mark anything unverified** "to verify", in the row's purpose text rather than inside the frame,
  so test participants don't see it.
- **Copy style:** plain words, short sentences, say what happens next. Every stop, pause or revoke
  says that it doesn't undo past actions.

## 7. The prelude

Paste this at the top of a `use_figma` script. It defines the helpers used for every row. Pattern
helpers specific to a row (approval "why you're asked", claim vs. check, timeline, banners, recovery
sections) were defined inline in each build. Recreate them from the descriptions in
[`wireframes.md`](wireframes.md) when needed.

```js
const page = await figma.getNodeByIdAsync('0:1');
await figma.setCurrentPageAsync(page);
for (const s of ['Regular', 'Medium', 'Semi Bold', 'Bold'])
  await figma.loadFontAsync({ family: 'Inter', style: s });
const sec = await figma.getNodeByIdAsync('4:6'); // Catalogue section
const G = (v) => [{ type: 'SOLID', color: { r: v, g: v, b: v } }];
const INK = 0.13,
  MID = 0.45,
  LINE = 0.8,
  SOFT = 0.95,
  DARK = 0.2;

// text, auto layout, sizing
function T(s, size = 14, style = 'Regular', c = INK) {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style };
  t.fontSize = size;
  t.characters = s;
  t.fills = G(c);
  return t;
}
function add(p, n, fw = false) {
  p.appendChild(n);
  if (fw) {
    n.layoutSizingHorizontal = 'FILL';
    if (n.type === 'TEXT') n.textAutoResize = 'HEIGHT';
  }
  return n;
}
function AL(dir, props = {}) {
  const f = figma.createAutoLayout(dir, props);
  f.fills = [];
  return f;
}
function fixSize(n, w, h) {
  n.resize(w, h);
  if (n.layoutMode && n.layoutMode !== 'NONE') {
    n.primaryAxisSizingMode = 'FIXED';
    n.counterAxisSizingMode = 'FIXED';
  }
  return n;
}
function spacer(p) {
  const s = AL('HORIZONTAL', { name: 'Spacer' });
  p.appendChild(s);
  s.layoutSizingHorizontal = 'FILL';
  s.resize(s.width, 1);
  s.layoutSizingVertical = 'FIXED';
  return s;
}
function row(p, name, o = {}) {
  const r = AL('HORIZONTAL', {
    name,
    itemSpacing: o.gap ?? 10,
    counterAxisAlignItems: o.align ?? 'CENTER',
    paddingTop: o.py ?? 0,
    paddingBottom: o.py ?? 0,
  });
  add(p, r, true);
  return r;
}
function col(p, gap = 2) {
  const c = AL('VERTICAL', { itemSpacing: gap });
  add(p, c);
  c.layoutSizingHorizontal = 'FILL';
  return c;
}

// building blocks
function addBtn(p, label, kind = 'primary', h = 48, fill = true) {
  // kind: primary | secondary | strong | ghost | disabled
  const b = AL('HORIZONTAL', {
    name:
      kind === 'primary'
        ? 'Primary button'
        : kind === 'disabled'
          ? 'Disabled button'
          : 'Secondary button',
    primaryAxisAlignItems: 'CENTER',
    counterAxisAlignItems: 'CENTER',
    paddingLeft: 16,
    paddingRight: 16,
  });
  if (kind === 'primary') b.fills = G(DARK);
  else if (kind === 'disabled') b.fills = G(0.88);
  else if (kind === 'ghost') {
  } else {
    b.fills = G(1);
    b.strokes = G(kind === 'strong' ? INK : MID);
    b.strokeWeight = kind === 'strong' ? 2.5 : 1.5;
  }
  b.appendChild(
    T(
      label,
      h < 44 ? 13 : 15,
      'Semi Bold',
      kind === 'primary' ? 1 : kind === 'disabled' ? 0.6 : INK,
    ),
  );
  p.appendChild(b);
  if (fill) b.layoutSizingHorizontal = 'FILL';
  b.resize(b.width, h);
  b.layoutSizingVertical = 'FIXED';
  b.cornerRadius = h / 2;
  return b;
}
function tag(label, filled = true) {
  const p = AL('HORIZONTAL', {
    name: 'Tag',
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 3,
    paddingBottom: 3,
  });
  p.cornerRadius = 10;
  if (filled) p.fills = G(0.3);
  else {
    p.fills = G(1);
    p.strokes = G(MID);
  }
  p.appendChild(T(label, 10, 'Bold', filled ? 1 : INK));
  return p;
}
function card(p, name, o = {}) {
  // o: soft | strong | dash, pad, padY, gap, r
  const c = AL('VERTICAL', {
    name,
    paddingLeft: o.pad ?? 16,
    paddingRight: o.pad ?? 16,
    paddingTop: o.padY ?? 14,
    paddingBottom: o.padY ?? 14,
    itemSpacing: o.gap ?? 10,
  });
  c.cornerRadius = o.r ?? 12;
  if (o.soft) c.fills = G(SOFT);
  else {
    c.fills = G(1);
    c.strokes = G(o.strong ? INK : LINE);
    c.strokeWeight = o.strong ? 2 : 1;
    if (o.dash) c.dashPattern = [6, 4];
  }
  add(p, c, true);
  return c;
}
function kv(p, k, v, right) {
  const r = row(p, 'Row · ' + k, { align: 'MIN' });
  const a = T(k, 13, 'Medium', MID);
  r.appendChild(a);
  a.resize(84, a.height);
  a.textAutoResize = 'HEIGHT';
  const b = T(v, 14, 'Semi Bold');
  add(r, b);
  b.layoutSizingHorizontal = 'FILL';
  b.textAutoResize = 'HEIGHT';
  if (right) r.appendChild(right);
  return r;
}
function heading(body, title, sub) {
  const h = AL('VERTICAL', { name: 'Heading', itemSpacing: 8 });
  add(body, h, true);
  add(h, T(title, 26, 'Bold'), true);
  if (sub) add(h, T(sub, 15, 'Regular', MID), true);
  return h;
}
function shape(kind, s = 10, c = INK) {
  // dot | ring | square | tri | bars | x | check
  let n;
  if (kind === 'dot') {
    n = figma.createEllipse();
    n.resize(s, s);
    n.fills = G(c);
  } else if (kind === 'ring') {
    n = figma.createEllipse();
    n.resize(s, s);
    n.fills = [];
    n.strokes = G(c);
    n.strokeWeight = 2;
  } else if (kind === 'square') {
    n = figma.createRectangle();
    n.resize(s, s);
    n.fills = G(c);
  } else if (kind === 'tri') {
    n = figma.createPolygon();
    n.pointCount = 3;
    n.resize(s + 2, s);
    n.fills = G(c);
  } else if (kind === 'bars') {
    n = AL('HORIZONTAL', { itemSpacing: 2 });
    for (let i = 0; i < 2; i++) {
      const r = figma.createRectangle();
      r.resize(3, s);
      r.fills = G(c);
      n.appendChild(r);
    }
  } else if (kind === 'x') {
    n = T('✕', s + 2, 'Bold', c);
  } else {
    n = T('✓', s + 2, 'Bold', c);
  }
  n.name = 'Glyph · ' + kind;
  return n;
}
function badge(label, kind, strong = false) {
  const p = AL('HORIZONTAL', {
    name: 'AgentStatusBadge',
    itemSpacing: 6,
    counterAxisAlignItems: 'CENTER',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  });
  p.cornerRadius = 14;
  if (strong) p.fills = G(DARK);
  else {
    p.fills = G(1);
    p.strokes = G(INK);
    p.strokeWeight = 1.5;
  }
  p.appendChild(shape(kind, 9, strong ? 1 : INK));
  p.appendChild(T(label, 12, 'Bold', strong ? 1 : INK));
  return p;
}
function meter(p, label, valueText, frac, state = 'normal', W = 360) {
  // state: normal | near | reached | over
  const m = AL('VERTICAL', { name: 'LimitMeter', itemSpacing: 6 });
  add(p, m, true);
  const r = row(m, 'Label');
  r.appendChild(T(label, 13, 'Medium'));
  spacer(r);
  if (state === 'near') r.appendChild(tag('NEAR LIMIT', false));
  if (state === 'reached') r.appendChild(tag('LIMIT REACHED', true));
  if (state === 'over') r.appendChild(tag('OVER LIMIT', true));
  r.appendChild(T(valueText, 13, 'Semi Bold'));
  const tr = figma.createFrame();
  tr.name = 'Track';
  tr.resize(W, 8);
  tr.cornerRadius = 4;
  tr.fills = G(0.9);
  const f = figma.createRectangle();
  f.resize(Math.max(4, Math.min(1, frac) * W), 8);
  f.cornerRadius = 4;
  f.fills = G(state === 'normal' ? 0.55 : INK);
  tr.appendChild(f);
  if (state !== 'normal') {
    const tick = figma.createRectangle();
    tick.resize(2, 14);
    tick.fills = G(INK);
    tr.clipsContent = false;
    tr.appendChild(tick);
    tick.x = W * (state === 'over' ? 0.91 : 0.8) - 1;
    tick.y = -3;
  }
  m.appendChild(tr);
  return m;
}
function activity(p, glyph, title, sub, meta, o = {}) {
  // o: strong, tags:[[label,filled]]
  const r = row(p, 'ActivityItem', { gap: 12, py: 8, align: 'MIN' });
  const ic = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  ic.cornerRadius = 18;
  ic.fills = G(o.strong ? DARK : 0.9);
  ic.appendChild(T(glyph, 13, 'Bold', o.strong ? 1 : INK));
  r.appendChild(ic);
  fixSize(ic, 36, 36);
  const c = col(r, 2);
  add(c, T(title, 14, 'Semi Bold'), true);
  if (sub) add(c, T(sub, 12, 'Regular', MID), true);
  if (o.tags) {
    const tr = AL('HORIZONTAL', { itemSpacing: 6, paddingTop: 2 });
    add(c, tr);
    o.tags.forEach((t) => tr.appendChild(tag(t[0], t[1])));
  }
  r.appendChild(T(meta, 12, 'Regular', MID));
  return r;
}
function sectionLabel(p, s, right) {
  const r = row(p, 'Section label');
  r.appendChild(T(s, 17, 'Bold'));
  if (right) {
    spacer(r);
    r.appendChild(T(right, 13, 'Semi Bold'));
  }
  return r;
}

// rows, frames, footers, sheets
let ROW_PREFIX = '',
  FY = 0,
  ROWY = 0;
async function prepRow(prefix, titleId, purpose, placeholderId) {
  // clears the row, writes the purpose, removes the placeholder
  ROW_PREFIX = prefix;
  const title = await figma.getNodeByIdAsync(titleId);
  ROWY = title.y;
  FY = ROWY + 80;
  sec.children
    .filter(
      (c) =>
        c.name.startsWith(prefix + '-') ||
        c.name === prefix + ' caption' ||
        c.name === prefix + ' purpose',
    )
    .forEach((c) => c.remove());
  const pt = T(purpose, 14, 'Regular', MID);
  pt.name = prefix + ' purpose';
  sec.appendChild(pt);
  pt.x = title.x + title.width + 16;
  pt.y = ROWY + 5;
  if (placeholderId) {
    const ph = await figma.getNodeByIdAsync(placeholderId);
    if (ph) ph.remove();
  }
}
function caption(name, x) {
  const cap = T(name.replace(/^(\S+) /, '$1 · '), 14, 'Semi Bold', MID);
  cap.name = ROW_PREFIX + ' caption';
  sec.appendChild(cap);
  cap.x = x;
  cap.y = FY - 32;
}
function phone(name, colIdx, o = {}) {
  // o.nav: flow | back | home | none; o.steps, o.step, o.title, o.close, o.gap, o.bodyY
  const f = figma.createFrame();
  f.name = name;
  f.resize(440, 956);
  f.fills = G(1);
  f.strokes = G(0.82);
  f.clipsContent = true;
  sec.appendChild(f);
  f.x = 80 + colIdx * 500;
  f.y = FY;
  const tm = T('9:41', 15, 'Semi Bold');
  f.appendChild(tm);
  tm.x = 40;
  tm.y = 18;
  caption(name, f.x);
  let bodyY = 112;
  if (o.nav === 'flow' || o.nav === 'back') {
    const b = figma.createFrame();
    b.name = 'Back';
    b.resize(32, 32);
    b.cornerRadius = 16;
    b.fills = G(SOFT);
    const ch = T(o.close ? '✕' : '‹', o.close ? 14 : 22, 'Medium');
    b.appendChild(ch);
    ch.x = o.close ? 10 : 11;
    ch.y = o.close ? 7 : 1;
    f.appendChild(b);
    b.x = 20;
    b.y = 62;
    if (o.nav === 'flow') {
      const n = o.steps || 3,
        W = (416 - 68 - 4 * (n - 1)) / n;
      for (let i = 0; i < n; i++) {
        const r = figma.createRectangle();
        r.name = 'Progress';
        r.resize(W, 4);
        r.cornerRadius = 2;
        r.fills = G(i < o.step ? DARK : 0.88);
        f.appendChild(r);
        r.x = 68 + i * (W + 4);
        r.y = 76;
      }
      bodyY = 118;
    }
    if (o.title) {
      const t = T(o.title, 16, 'Semi Bold');
      f.appendChild(t);
      t.x = 220 - t.width / 2;
      t.y = 68;
    }
  }
  if (o.nav === 'home') {
    const tabs = AL('HORIZONTAL', { name: 'AccountTabs', itemSpacing: 22 });
    f.appendChild(tabs);
    tabs.x = 24;
    tabs.y = 60;
    ['Individual', 'Agent', 'Crypto', 'Retirement'].forEach((l) => {
      const c = AL('VERTICAL', { itemSpacing: 6, counterAxisAlignItems: 'CENTER' });
      c.appendChild(T(l, 15, l === 'Agent' ? 'Bold' : 'Medium', l === 'Agent' ? INK : MID));
      const u = figma.createRectangle();
      u.resize(l === 'Agent' ? 46 : 1, 3);
      u.fills = l === 'Agent' ? G(INK) : [];
      c.appendChild(u);
      tabs.appendChild(c);
    });
    bodyY = 104;
    const tb = AL('HORIZONTAL', {
      name: 'TabBar',
      primaryAxisAlignItems: 'SPACE_BETWEEN',
      counterAxisAlignItems: 'CENTER',
      paddingLeft: 28,
      paddingRight: 28,
    });
    tb.fills = G(1);
    tb.strokes = G(LINE);
    tb.cornerRadius = 31;
    f.appendChild(tb);
    fixSize(tb, 400, 62);
    tb.x = 20;
    tb.y = 872;
    for (let i = 0; i < 5; i++) {
      const d = figma.createEllipse();
      d.resize(22, 22);
      d.fills = G(i === 0 ? INK : 0.8);
      tb.appendChild(d);
    }
  } else {
    const hi = figma.createRectangle();
    hi.name = 'Home indicator';
    hi.resize(134, 5);
    hi.cornerRadius = 3;
    hi.fills = G(INK);
    f.appendChild(hi);
    hi.x = 153;
    hi.y = 940;
  }
  const body = AL('VERTICAL', { name: 'Body', itemSpacing: o.gap ?? 20 });
  f.appendChild(body);
  body.x = 24;
  body.y = o.bodyY ?? bodyY;
  body.resize(392, 10);
  body.counterAxisSizingMode = 'FIXED';
  body.primaryAxisSizingMode = 'AUTO';
  return { f, body };
}
async function cloneFrame(srcId, name, colIdx) {
  const src = await figma.getNodeByIdAsync(srcId);
  const f = src.clone();
  sec.appendChild(f);
  f.name = name;
  f.x = 80 + colIdx * 500;
  f.y = FY;
  caption(name, f.x);
  return f;
}
function footer(f) {
  const ft = AL('VERTICAL', { name: 'Footer', itemSpacing: 12 });
  f.appendChild(ft);
  ft.x = 24;
  ft.resize(392, 10);
  ft.counterAxisSizingMode = 'FIXED';
  ft.primaryAxisSizingMode = 'AUTO';
  return ft;
}
function place(ft, bottom = 922) {
  ft.y = bottom - ft.height;
  return ft;
} // call after the footer is filled
function centerText(p, s, size = 12, c = MID) {
  const t = T(s, size, 'Regular', c);
  add(p, t, true);
  t.textAlignHorizontal = 'CENTER';
  return t;
}
function scrim(f) {
  const d = figma.createRectangle();
  d.name = 'Scrim';
  d.resize(440, 956);
  d.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.45 }];
  f.appendChild(d);
  return d;
}
function sheet(f, name) {
  const s = AL('VERTICAL', {
    name,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 12,
    paddingBottom: 34,
    itemSpacing: 16,
  });
  s.fills = G(1);
  s.topLeftRadius = 20;
  s.topRightRadius = 20;
  f.appendChild(s);
  s.resize(440, 10);
  s.counterAxisSizingMode = 'FIXED';
  s.primaryAxisSizingMode = 'AUTO';
  s.x = 0;
  const hw = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER' });
  add(s, hw, true);
  const h = figma.createRectangle();
  h.resize(40, 5);
  h.cornerRadius = 3;
  h.fills = G(0.8);
  hw.appendChild(h);
  return s;
} // then s.y = 956 - s.height

// prototype
const nav = (d, dir = 'LEFT', type = 'SLIDE_IN') => [
  {
    trigger: { type: 'ON_CLICK' },
    actions: [
      {
        type: 'NODE',
        destinationId: d,
        navigation: 'NAVIGATE',
        transition: {
          type,
          direction: dir,
          matchLayers: false,
          easing: { type: 'EASE_OUT' },
          duration: 0.3,
        },
        preserveScrollPosition: false,
      },
    ],
  },
];
async function link(n, d, dir, type) {
  const node = typeof n === 'string' ? await figma.getNodeByIdAsync(n) : n;
  await node.setReactionsAsync(nav(d, dir, type));
}
async function backLinks(frames) {
  for (const fr of frames) {
    const b = fr.findOne((n) => n.name === 'Back');
    if (b)
      await b.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'BACK' }] }]);
  }
}
function flowStart(id, name) {
  page.flowStartingPoints = [
    ...page.flowStartingPoints.filter((p) => p.nodeId !== id && p.name !== name),
    { nodeId: id, name },
  ];
}
function overflow(frames) {
  return frames.map((fr) => {
    const b = fr.findOne((n) => n.name === 'Body');
    const ft = fr.findOne((n) => n.name === 'Footer');
    return `${fr.name}: body→${Math.round(b.y + b.height)} footer@${ft ? Math.round(ft.y) : '-'}`;
  });
}
```

### A row script, in outline

```js
// …prelude…
await prepRow(
  'S2',
  '<row title node id>',
  'Purpose shown beside the row title',
  '<placeholder frame id or null>',
);
const ids = {};
{
  const { f, body } = phone('S2-1 Rule detail', 0, {
    nav: 'back',
    title: 'Background rule',
    gap: 16,
  });
  ids.detail = f.id;
  heading(body, 'QQQ dip rule', null);
  // …cards, meters, activity…
  const ft = footer(f);
  ids.stop = addBtn(ft, 'Stop rule').id;
  place(ft);
}
await link(ids.stop, '<next frame id>');
await backLinks([await figma.getNodeByIdAsync(ids.detail)]);
flowStart(ids.detail, 'S2 Standing instruction detail');
return { ids, overflow: overflow([await figma.getNodeByIdAsync(ids.detail)]) };
```

## 8. Node IDs worth knowing

IDs as of 2026-10-08. Verify them before relying on them; names are stable too.

| Node                                 | ID                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| Screen inventory page                | `0:1`                                                                                 |
| Catalogue section                    | `4:6`                                                                                 |
| Row titles G1 … S2                   | `26:2` … `26:13` (in catalogue order: G1, G2, H1, H2, A1, A2, N1, D1, I1, R1, S1, S2) |
| Row titles BG1 … BR1                 | `26:14` … `26:18`                                                                     |
| H1-1 Working (home, used for clones) | `34:3`                                                                                |
| H1-3 Near limit                      | `34:177`                                                                              |
| H1-4 Paused                          | `34:276`                                                                              |
| G2-1 Review                          | `32:3`                                                                                |
| A1-1 Financial                       | `35:3`                                                                                |
| I1-2 Confirm stop                    | `37:128`                                                                              |
| R1-1 After stop / R1-3 Rule stopped  | `37:318` / `37:422`                                                                   |

## 9. Next uses

- **Scenario sections.** Each scenario step maps to a catalogue frame (see the scenario tables in
  `screen-inventory.md`). Fill them by cloning the catalogue frame and changing the content for
  that step, not by redrawing.
- **Mid-fi.** When the owner moves up a fidelity level, these frames become the reference for the
  `ref-brokerage` app in the `wireframe` theme (brief §12.1). The visual key in §4 maps to the
  behavioural tokens.
- **Travel and email (Phase 6).** Rebuild the same rows with domain content only. If a screen
  needs a new layout, not just new words, that's a leak to log in `thesis-notes.md`.
