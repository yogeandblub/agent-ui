// Builds the "Test · System" and "Test · Baseline" pages from the Catalogue section of the
// Wireframes page. Not run by Node: paste it into the Figma MCP `use_figma` tool (or a
// scratch plugin), once per condition, with CONDITION set. It wipes and rebuilds the target page,
// so the Catalogue stays the only copy anyone edits. See docs/prototype-testing.md.

const CONDITION = 'system'; // 'system' | 'baseline'

const CATALOGUE_ID = '4:6';
// Frames are named "<row name> <position>", optionally with a tag for alternatives:
// "Agent home 2 (needs you)". Baseline rows start with this prefix.
const BASELINE = 'Baseline · ';
const FRAME_NAME = /^(.+?) \d+(?: \(.+\))?$/;
const CONFIG = {
  system: {
    page: 'Test · System',
    include: (name) => !name.startsWith(BASELINE),
    // A copy of this frame gets a 6 s timer to `timedTo`. The copy is used only as a task's
    // entry, so returning home later doesn't fire the event again.
    timed: {
      from: '34:3',
      to: '34:99',
      name: 'Agent home 1 (working, timed start)',
      row: 'Agent home',
    },
    entersTimed: ['32:89'], // Review and confirm 3: its primary button goes to the timed copy
    // Task wording mirrors docs/prototype-testing.md. Participants read it in Maze or
    // UserTesting; on the canvas it's for the research team.
    starts: [
      [
        'T1 · Set up the agent (guided steps)',
        '28:2',
        'Set up an agent to invest in large-cap tech for you, with $5,000.',
        'Review and confirm 3',
        'RQ1/RQ2 handover',
      ],
      [
        'T1b · Set up the agent (building blocks)',
        '29:3',
        'Same as T1. Give each participant one setup version only.',
        'Review and confirm 3',
        'RQ1/RQ2, guided vs. blocks',
      ],
      [
        'T2 · Approve a trade, then hit the limit',
        '32:89',
        'Your agent is running. Keep an eye on it and respond if it needs anything.',
        'Agent asks for approval 3 (over limit), a choice made',
        'RQ3 (rough): events arrive on 6 s timers',
      ],
      [
        'T3 · Agent breaks a rule (off by default)',
        '36:214',
        'Something has come up with your agent. Find out what happened and deal with it.',
        'After a stop or a failure 1 (after stop)',
        'RQ3. Ethics flag: leave out until open question 2 is decided',
      ],
      [
        'T4 · A trade fails',
        '37:372',
        "A trade didn't go through. What happened to your money?",
        'After a stop or a failure 2 (after failure), then a written answer',
        'Recovery',
      ],
      [
        'T5 · Pause, then stop the agent',
        '34:3',
        'You want the agent to stop for now, then stop for good.',
        'After a stop or a failure 1 (after stop)',
        'Stop is not undo',
      ],
      [
        'T6 · Asked to approve with approvals off',
        '35:75',
        'You turned approvals off, but the agent is asking you anyway. Decide what to do.',
        'Agent home 3 (near limit)',
        'Rule source',
      ],
      [
        'T7 · Create and stop a background rule',
        '38:178',
        'Have the agent buy more QQQ whenever it drops. Later, end that rule.',
        'After a stop or a failure 3 (rule stopped)',
        'Background rules',
      ],
      [
        'T8 · Stop one of two agents',
        '38:3',
        'Stop the research assistant without stopping your trading agent.',
        'Home with two agents 2',
        'Provenance',
      ],
      [
        "T9 · Confirm a sale that can't be undone",
        '35:268',
        'Your agent wants to sell. Go ahead with it.',
        'Agent home 3 (near limit)',
        'Irreversibility. Hold to sell is a tap here',
      ],
    ],
    timerNote:
      "Agent home 1 (working, timed start) moves to Agent home 2 (needs you) after 6 s. Limit warnings and rule breaks 1 (near limit) moves to 2 (limit reached) after 6 s. Returning home goes to the ordinary Agent home 1, so the approval doesn't repeat.",
  },
  baseline: {
    page: 'Test · Baseline',
    include: (name) => name.startsWith(BASELINE),
    timed: {
      from: '42:143',
      to: '42:209',
      name: "Baseline · Agent's account 1 (timed start)",
      row: "Baseline · Agent's account",
    },
    entersTimed: ['42:102', '42:122'], // Baseline · Approvals on or off 1 and 2, "Finish setup"
    starts: [
      [
        'T1 · Set up the agent',
        '42:3',
        'Set up an agent to invest in large-cap tech for you, with $5,000.',
        "Baseline · Agent's account 1 (timed start), then Baseline · Approval prompt 1",
        'RQ1/RQ2 handover',
      ],
      [
        'T2 · Approve a trade',
        '42:102',
        'Your agent is running. Keep an eye on it and respond if it needs anything.',
        "Baseline · Agent's account 1, after the approval prompt",
        'RQ3 (rough): the prompt arrives on a 6 s timer',
      ],
      [
        'T5 · Disconnect the agent',
        '42:143',
        'You want the agent to stop for now, then stop for good.',
        'Baseline · Disconnect the agent 2',
        'Stop is not undo',
      ],
    ],
    timerNote:
      "Baseline · Agent's account 1 (timed start) moves to Baseline · Approval prompt 1 after 6 s. Both Finish setup buttons lead there. Returning home goes to the ordinary Baseline · Agent's account 1. No baseline screens exist for T3, T4 or T6 to T9: the shipped product shows none of those states.",
  },
}[CONDITION];

const nav = (id) => ({
  type: 'NODE',
  destinationId: id,
  navigation: 'NAVIGATE',
  transition: null,
  preserveScrollPosition: false,
});
const withReactions = (root) => [
  root,
  ...root.findAll((n) => 'reactions' in n && n.reactions.length),
];

const catalogue = await figma.getNodeByIdAsync(CATALOGUE_ID);
const frames = catalogue.findAll(
  (n) =>
    n.type === 'FRAME' &&
    n.parent.type === 'SECTION' &&
    FRAME_NAME.test(n.name) &&
    CONFIG.include(n.name),
);

let page = figma.root.children.find((p) => p.name === CONFIG.page);
// Pages load lazily: an unloaded page reports no children, so the wipe would leave the old copies.
if (page) {
  await page.loadAsync();
  for (const c of [...page.children]) c.remove();
} else {
  page = figma.createPage();
  page.name = CONFIG.page;
}
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

// One row per row name, frames left to right as in the Catalogue.
const rows = new Map();
for (const f of frames) {
  const key = f.name.match(FRAME_NAME)[1];
  if (!rows.has(key)) rows.set(key, []);
  rows.get(key).push(f);
}
const LABEL_WIDTH = 360;
const map = {};
const clones = [];
let y = 0;
let timed = null;
for (const [key, fs] of rows) {
  const label = figma.createText();
  page.appendChild(label);
  label.fontName = { family: 'Inter', style: 'Semi Bold' };
  label.fontSize = 32;
  label.characters = key;
  label.textAutoResize = 'HEIGHT';
  label.resize(LABEL_WIDTH, label.height);
  label.x = -LABEL_WIDTH - 40;
  label.y = y + 60;
  let x = 0;
  for (const f of fs.sort((a, b) => a.x - b.x)) {
    const c = f.clone();
    page.appendChild(c);
    c.x = x;
    c.y = y + 60;
    map[f.id] = c.id;
    clones.push(c);
    x += 520;
  }
  if (key === CONFIG.timed.row) {
    timed = (await figma.getNodeByIdAsync(CONFIG.timed.from)).clone();
    page.appendChild(timed);
    timed.name = CONFIG.timed.name;
    timed.x = x;
    timed.y = y + 60;
    clones.push(timed);
  }
  y += 1116;
}

// Point every link at the copies on this page.
for (const c of clones) {
  for (const n of withReactions(c)) {
    await n.setReactionsAsync(
      n.reactions.map((r) => ({
        trigger: r.trigger,
        actions: (r.actions || []).map((a) =>
          a.destinationId && map[a.destinationId]
            ? { ...a, destinationId: map[a.destinationId] }
            : a,
        ),
      })),
    );
  }
}
await timed.setReactionsAsync([
  { trigger: { type: 'AFTER_TIMEOUT', timeout: 6 }, actions: [nav(map[CONFIG.timed.to])] },
]);
for (const id of CONFIG.entersTimed) {
  const btn = (await figma.getNodeByIdAsync(map[id])).findOne((n) => n.name === 'Primary button');
  await btn.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [nav(timed.id)] }]);
}
page.flowStartingPoints = CONFIG.starts.map(([name, id]) => ({ name, nodeId: map[id] }));

// Notes for the research team. They sit on the canvas, outside every frame, so they never show
// in the prototype.
const text = (parent, chars, { size = 16, bold = false, width = 1000 } = {}) => {
  const t = figma.createText();
  parent.appendChild(t);
  t.fontName = { family: 'Inter', style: bold ? 'Semi Bold' : 'Regular' };
  t.fontSize = size;
  t.characters = chars;
  t.textAutoResize = 'HEIGHT';
  t.resize(width, t.height);
  return t;
};
const brief = figma.createAutoLayout('VERTICAL', { name: 'Test brief', itemSpacing: 16 });
page.appendChild(brief);
brief.set({
  paddingTop: 40,
  paddingBottom: 40,
  paddingLeft: 40,
  paddingRight: 40,
  cornerRadius: 16,
});
brief.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.96 } }];
text(brief, `${CONFIG.page}: test brief`, { size: 40, bold: true });
text(
  brief,
  `Generated from Wireframes › Catalogue by packages/figma-sync/scripts/build-test-pages.js. Don't edit this page: a rebuild wipes it. Change the Catalogue, then rebuild. Full plan: docs/prototype-testing.md.`,
);
text(
  brief,
  'Participants never see this canvas, only the prototype. The wording below is what goes into each Maze or UserTesting task. These notes keep the canvas and the test in step.',
);
text(brief, 'Timed events', { size: 24, bold: true });
text(brief, CONFIG.timerNote);
text(brief, 'Tasks', { size: 24, bold: true });
for (const [name, , wording, success, measures] of CONFIG.starts) {
  const card = figma.createAutoLayout('VERTICAL', { name, itemSpacing: 6 });
  brief.appendChild(card);
  card.set({
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    cornerRadius: 8,
  });
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  text(card, name, { size: 20, bold: true, width: 940 });
  text(card, `Task: “${wording}”`, { width: 940 });
  text(card, `Success screen: ${success}   ·   Measures: ${measures}`, { size: 14, width: 940 });
}
text(brief, 'After each task, ask', { size: 24, bold: true });
text(
  brief,
  '1. What can the agent do without asking you? (RQ1)\n2. If the agent loses money, who pays for it? (RQ2)\n3. If you stop the agent, what happens to trades it already made?' +
    (CONDITION === 'system' ? '\n4. After T6: who decided this trade needed your approval?' : ''),
);
brief.x = -LABEL_WIDTH - 40 - 80 - brief.width;
brief.y = 0;

// A start tag above each task's first frame.
const tags = [];
for (const [name, id] of CONFIG.starts) {
  const f = await figma.getNodeByIdAsync(map[id]);
  const others = tags.filter((t) => t.x === f.x && Math.abs(t.y - (f.y - 40)) < 120).length;
  const t = text(page, `▶ ${name}`, { size: 20, bold: true, width: 440 });
  t.x = f.x;
  t.y = f.y - 40 - others * 30;
  tags.push(t);
}

// Nothing on a test page may link outside it (that would cross conditions).
const ids = new Set(clones.map((c) => c.id));
const outside = [];
for (const c of clones)
  for (const n of withReactions(c))
    for (const r of n.reactions)
      for (const a of r.actions || [])
        if (a.destinationId && !ids.has(a.destinationId)) outside.push(`${c.name} > ${n.name}`);
return { pageId: page.id, frames: clones.length, startPoints: CONFIG.starts.length, outside };
