/* ============================================================
   ADDIE Pipeline Visualization — Animation Engine
   ============================================================ */

// ---- Pipeline Data Model ----

const AGENTS = {
  faculty:     { name: 'Teaching Faculty',       icon: 'assets/icons/faculty.png',     color: '#4a90d9', short: 'Faculty' },
  designer:    { name: 'Instructional Designer',  icon: 'assets/icons/designer.png',    color: '#9b59b6', short: 'Designer' },
  coordinator: { name: 'Course Coordinator',      icon: 'assets/icons/coordinator.png', color: '#e67e22', short: 'Coordinator' },
  ta:          { name: 'Teaching Assistant',       icon: 'assets/icons/TA.png',          color: '#27ae60', short: 'TA' },
  pc:          { name: 'Program Chair',            icon: 'assets/icons/PC.png',          color: '#e74c3c', short: 'Program Chair' },
  student:     { name: 'Test Student',             icon: 'assets/icons/student.png',     color: '#7f8c8d', short: 'Student' },
};

// Home positions — where agents sit when idle (spread around the classroom)
const HOME_POSITIONS = {
  faculty:     { x: 2,  y: 52 },   // far left, by the door
  designer:    { x: 18, y: 60 },   // left side
  coordinator: { x: 78, y: 60 },   // right side
  ta:          { x: 62, y: 58 },   // right-center
  pc:          { x: 80, y: 30 },   // far right, back row
  student:     { x: 62, y: 30 },   // right, back row
};

// Meeting spots — where active agents converge (center stage area)
// Index-based: first active agent goes to slot 0, second to slot 1, etc.
const MEETING_SLOTS = [
  { x: 25, y: 42 },   // left of center
  { x: 45, y: 42 },   // right of center
  { x: 35, y: 30 },   // center-back (for 3rd agent)
  { x: 55, y: 42 },   // far right (for 4th, rare)
];

// Bubble positions relative to agent (offset in px)
const BUBBLE_OFFSET = { x: 0, y: -110 };

const PIPELINE = [
  // Phase 1: Foundation Deliberations
  {
    phase: 1,
    phaseName: 'Phase 1: Foundation Deliberations',
    id: 'goals',
    name: 'Instructional Goals',
    agents: ['faculty', 'designer'],
    summarizer: null,
    output: 'result_instructional_goals.md',
    description: 'Define instructional goals and pedagogical objectives for the course.',
    dialogues: [
      { agent: 'faculty', text: 'Proposing learning objectives and pedagogical goals based on course requirements...' },
      { agent: 'designer', text: 'Reviewing objectives for alignment with instructional design principles...' },
      { agent: 'faculty', text: '[Summarizing] Synthesizing deliberation into final instructional goals document.', isSummary: true },
    ],
  },
  {
    phase: 1,
    phaseName: 'Phase 1: Foundation Deliberations',
    id: 'resources',
    name: 'Resource Assessment',
    agents: ['faculty', 'designer'],
    summarizer: null,
    output: 'result_resource_assessment.md',
    description: 'Assess available resources, constraints, and teaching environment.',
    dialogues: [
      { agent: 'faculty', text: 'Identifying available teaching resources and technology constraints...' },
      { agent: 'designer', text: 'Evaluating resource feasibility and suggesting alternatives...' },
      { agent: 'faculty', text: '[Summarizing] Compiling resource assessment report with recommendations.', isSummary: true },
    ],
  },
  {
    phase: 1,
    phaseName: 'Phase 1: Foundation Deliberations',
    id: 'audience',
    name: 'Target Audience',
    agents: ['faculty', 'coordinator'],
    summarizer: null,
    output: 'result_target_audience.md',
    description: 'Analyze target audience, student profiles, and learning needs.',
    dialogues: [
      { agent: 'faculty', text: 'Describing student demographics and prerequisite knowledge levels...' },
      { agent: 'coordinator', text: 'Analyzing enrollment data and prior student feedback...' },
      { agent: 'faculty', text: '[Summarizing] Compiling target audience analysis and learning needs.', isSummary: true },
    ],
  },
  {
    phase: 1,
    phaseName: 'Phase 1: Foundation Deliberations',
    id: 'syllabus',
    name: 'Syllabus Design',
    agents: ['faculty', 'designer'],
    summarizer: null,
    output: 'result_syllabus_design.md',
    description: 'Design course syllabus with chapter structure and learning objectives.',
    dialogues: [
      { agent: 'faculty', text: 'Proposing chapter topics and weekly schedule based on course scope...' },
      { agent: 'designer', text: 'Structuring syllabus with clear learning objectives per chapter...' },
      { agent: 'faculty', text: '[Summarizing] Finalizing syllabus design with chapter breakdown.', isSummary: true },
    ],
    postProcess: { text: 'SyllabusProcessor extracts chapters into JSON...', output: 'processed_chapters.json' },
  },
  {
    phase: 1,
    phaseName: 'Phase 1: Foundation Deliberations',
    id: 'assessment',
    name: 'Assessment Planning',
    agents: ['faculty', 'designer'],
    summarizer: null,
    output: 'result_assessment_planning.md',
    description: 'Plan assessment strategies, rubrics, and evaluation methods.',
    dialogues: [
      { agent: 'faculty', text: 'Defining assessment types: quizzes, assignments, and exams...' },
      { agent: 'designer', text: 'Aligning assessments with learning objectives and Bloom\'s taxonomy...' },
      { agent: 'faculty', text: '[Summarizing] Compiling comprehensive assessment plan.', isSummary: true },
    ],
  },
  {
    phase: 1,
    phaseName: 'Phase 1: Foundation Deliberations',
    id: 'final_project',
    name: 'Final Project',
    agents: ['faculty', 'designer'],
    summarizer: null,
    output: 'result_final_exam_project.md',
    description: 'Design final project or exam with rubrics and guidelines.',
    dialogues: [
      { agent: 'faculty', text: 'Designing capstone project requirements and deliverables...' },
      { agent: 'designer', text: 'Creating evaluation rubric and grading criteria...' },
      { agent: 'faculty', text: '[Summarizing] Finalizing project/exam design document.', isSummary: true },
    ],
  },
  // Phase 2: Chapter Development (SlidesDeliberation)
  {
    phase: 2,
    phaseName: 'Phase 2: Chapter Development',
    id: 'slides_outline',
    name: 'Slide Outline',
    agents: ['designer'],
    summarizer: null,
    output: 'slide_outline.json',
    description: 'Instructional Designer creates the slide outline with titles and descriptions for each slide.',
    dialogues: [
      { agent: 'designer', text: 'Creating structured slide outline: titles, key topics, and learning flow...' },
    ],
  },
  {
    phase: 2,
    phaseName: 'Phase 2: Chapter Development',
    id: 'initial_latex',
    name: 'Initial LaTeX',
    agents: ['ta'],
    summarizer: null,
    output: 'slides_initial.tex',
    description: 'Teaching Assistant generates the initial LaTeX Beamer frame structure.',
    dialogues: [
      { agent: 'ta', text: 'Generating LaTeX Beamer frame structure from outline...' },
    ],
  },
  {
    phase: 2,
    phaseName: 'Phase 2: Chapter Development',
    id: 'script_template',
    name: 'Script Template',
    agents: ['ta'],
    summarizer: null,
    output: 'script_template.json',
    description: 'Teaching Assistant generates the presentation script template.',
    dialogues: [
      { agent: 'ta', text: 'Creating script template with speaker notes structure...' },
    ],
  },
  {
    phase: 2,
    phaseName: 'Phase 2: Chapter Development',
    id: 'assessment_template',
    name: 'Assessment Template',
    agents: ['ta'],
    summarizer: null,
    output: 'assessment_template.json',
    description: 'Teaching Assistant generates the assessment question template.',
    dialogues: [
      { agent: 'ta', text: 'Building assessment template with question types and formats...' },
    ],
  },
  {
    phase: 2,
    phaseName: 'Phase 2: Chapter Development',
    id: 'per_slide',
    name: 'Per-Slide Content',
    agents: ['faculty', 'ta'],
    summarizer: null,
    output: 'slides + scripts + assessments',
    description: 'For each slide: Faculty drafts content, then TA generates LaTeX, script, and assessment.',
    isLoop: true,
    dialogues: [
      { agent: 'faculty', text: 'Drafting detailed content for slide with examples and explanations...' },
      { agent: 'ta', text: 'Converting draft to LaTeX Beamer frames with proper formatting...' },
      { agent: 'ta', text: 'Generating speaker script and assessment questions for this slide...' },
    ],
  },
  {
    phase: 2,
    phaseName: 'Phase 2: Chapter Development',
    id: 'compile',
    name: 'Compile Outputs',
    agents: ['ta'],
    summarizer: null,
    output: 'slides.tex + script.md + assessment.md',
    description: 'Compile all individual slide outputs into final chapter materials.',
    dialogues: [
      { agent: 'ta', text: 'Compiling LaTeX source, scripts, and assessments into final documents...' },
    ],
  },
  // Phase 3: Evaluation (ADDIE "E")
  {
    phase: 3,
    phaseName: 'Phase 3: Evaluation',
    id: 'pc_validation',
    name: 'Program Chair Review',
    agents: ['pc'],
    summarizer: null,
    output: 'validation_Program_Chair/',
    description: 'Program Chair evaluates all generated course materials for academic rigor, program alignment, and quality of educational design.',
    dialogues: [
      { agent: 'pc', text: 'Evaluating academic rigor and alignment with program standards...' },
      { agent: 'pc', text: 'Reviewing quality of educational design and overall coherence...' },
      { agent: 'pc', text: 'Generating validation report with constructive feedback...' },
    ],
  },
  {
    phase: 3,
    phaseName: 'Phase 3: Evaluation',
    id: 'student_validation',
    name: 'Test Student Review',
    agents: ['student'],
    summarizer: null,
    output: 'validation_Test_Student/',
    description: 'Test Student evaluates course materials for clarity, engagement, and learning support from the learner perspective.',
    dialogues: [
      { agent: 'student', text: 'Checking clarity and understandability of the materials...' },
      { agent: 'student', text: 'Evaluating engagement level and learning support...' },
      { agent: 'student', text: 'Generating student perspective feedback report...' },
    ],
  },
  {
    phase: 3,
    phaseName: 'Phase 3: Evaluation',
    id: 'final_evaluation',
    name: 'Final Evaluation',
    agents: ['pc', 'student'],
    summarizer: null,
    output: 'evaluation_report.json',
    description: 'Combined evaluation scores and feedback from Program Chair and Test Student are compiled into a final quality report.',
    dialogues: [
      { agent: 'pc', text: 'Consolidating validation scores across all chapters...' },
      { agent: 'student', text: 'Consolidating learner perspective scores...' },
    ],
  },
];

// ---- Animation Controller ----

class AnimationController {
  constructor() {
    this.stepIndex = 0;          // current animation step (flat index into all dialogues)
    this.taskIndex = 0;          // current task in PIPELINE
    this.dialogueIndex = 0;      // current dialogue within current task
    this.isPlaying = false;
    this.speed = 1;
    this.timer = null;
    this.generation = 0;         // for cancellation
    this.onStep = null;          // callback

    // Precompute total steps
    this.totalSteps = 0;
    this.stepMap = [];  // [{taskIdx, dlgIdx}]
    PIPELINE.forEach((task, ti) => {
      task.dialogues.forEach((_, di) => {
        this.stepMap.push({ taskIdx: ti, dlgIdx: di });
        this.totalSteps++;
      });
      if (task.postProcess) {
        this.stepMap.push({ taskIdx: ti, dlgIdx: -1, isPostProcess: true });
        this.totalSteps++;
      }
    });
  }

  get currentTask() { return PIPELINE[this.stepMap[this.stepIndex]?.taskIdx ?? 0]; }
  get currentDialogue() {
    const s = this.stepMap[this.stepIndex];
    if (!s) return null;
    if (s.isPostProcess) return null;
    return PIPELINE[s.taskIdx].dialogues[s.dlgIdx];
  }
  get currentStepInfo() { return this.stepMap[this.stepIndex]; }
  get isPostProcess() { return this.stepMap[this.stepIndex]?.isPostProcess; }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this._scheduleNext();
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.timer);
    this.timer = null;
  }

  togglePlayPause() {
    this.isPlaying ? this.pause() : this.play();
  }

  stepForward() {
    this.pause();
    if (this.stepIndex < this.totalSteps - 1) {
      this.stepIndex++;
      this._emit();
    }
  }

  stepBack() {
    this.pause();
    if (this.stepIndex > 0) {
      this.stepIndex--;
      this._emit();
    }
  }

  jumpTo(stepIndex) {
    this.pause();
    this.stepIndex = Math.max(0, Math.min(stepIndex, this.totalSteps - 1));
    this._emit();
  }

  // Find the first step of a given task
  jumpToTask(taskIdx) {
    const idx = this.stepMap.findIndex(s => s.taskIdx === taskIdx);
    if (idx >= 0) this.jumpTo(idx);
  }

  setSpeed(s) { this.speed = s; }

  _emit() {
    if (this.onStep) this.onStep(this.stepIndex);
  }

  _scheduleNext() {
    if (!this.isPlaying) return;
    const baseDuration = this.isPostProcess ? 2000 : 2500;
    const duration = baseDuration / this.speed;
    this.timer = setTimeout(() => {
      if (!this.isPlaying) return;
      if (this.stepIndex < this.totalSteps - 1) {
        this.stepIndex++;
        this._emit();
        this._scheduleNext();
      } else {
        this.pause();
        this._emit();
      }
    }, duration);
  }
}

// ---- Stage Renderer ----

class StageRenderer {
  constructor(stageEl) {
    this.stage = stageEl;
    this.agentEls = {};
    this.bubbleEl = null;
    this.contextStackEl = document.getElementById('contextStack');
    this.actionOverlay = document.getElementById('actionOverlay');
    this.completedTasks = 0;
    this._createAgents();
  }

  _createAgents() {
    for (const [id, info] of Object.entries(AGENTS)) {
      const div = document.createElement('div');
      div.className = 'agent-sprite agent-sprite--dim';
      div.dataset.agent = id;
      div.style.setProperty('--glow-color', info.color);
      div.style.left = HOME_POSITIONS[id].x + '%';
      div.style.top = HOME_POSITIONS[id].y + '%';
      div.innerHTML = `<img src="${info.icon}" alt="${info.name}">`;
      this.stage.appendChild(div);
      this.agentEls[id] = div;
    }
  }

  renderStep(stepInfo, task, dialogue) {
    // 1. All agents always visible; active ones move to meeting area, rest stay home
    const activeAgents = new Set(task.agents);
    const isSummaryStep = dialogue && dialogue.isSummary;

    // Assign meeting slots to active agents (in order of task.agents array)
    const meetingAssignment = {};
    task.agents.forEach((agentId, i) => {
      if (i < MEETING_SLOTS.length) {
        meetingAssignment[agentId] = MEETING_SLOTS[i];
      }
    });

    for (const [id, el] of Object.entries(this.agentEls)) {
      el.classList.remove('agent-sprite--hidden', 'agent-sprite--dim', 'agent-sprite--speaking', 'agent-sprite--active');

      if (activeAgents.has(id)) {
        // Move to meeting position
        const slot = meetingAssignment[id];
        if (slot) {
          el.style.left = slot.x + '%';
          el.style.top = slot.y + '%';
        }
        // Visual state
        if (dialogue && dialogue.agent === id) {
          el.classList.add('agent-sprite--speaking', 'agent-sprite--active');
        } else if (isSummaryStep || stepInfo.isPostProcess) {
          el.classList.add('agent-sprite--dim');
        } else {
          el.classList.add('agent-sprite--active');
        }
      } else {
        // Return to home position
        const home = HOME_POSITIONS[id];
        el.style.left = home.x + '%';
        el.style.top = home.y + '%';
        el.classList.add('agent-sprite--dim');
      }
    }

    // 2. Speech bubble
    this._removeBubble();
    if (dialogue) {
      this._showBubble(dialogue.agent, dialogue.text);
    } else if (stepInfo.isPostProcess && task.postProcess) {
      this._showActionOverlay(task.postProcess.text);
    }

    // 3. Action overlay for loop indicator
    if (task.isLoop && dialogue) {
      this._showActionOverlay('Repeating for each slide in chapter...');
    } else if (!stepInfo.isPostProcess) {
      this._hideActionOverlay();
    }
  }

  addContextDoc(label) {
    this.completedTasks++;
    const doc = document.createElement('div');
    doc.className = 'context-doc';
    doc.textContent = '#' + this.completedTasks;
    doc.title = label;
    this.contextStackEl.appendChild(doc);
    // Brief glow
    this.contextStackEl.classList.add('context-stack--glow');
    setTimeout(() => this.contextStackEl.classList.remove('context-stack--glow'), 800);
  }

  resetContextStack() {
    this.completedTasks = 0;
    this.contextStackEl.innerHTML = '';
  }

  _showBubble(agentId, text) {
    const agent = AGENTS[agentId];
    // Read the agent's current position from the DOM (it may have moved to meeting spot)
    const el = this.agentEls[agentId];
    const posX = parseFloat(el.style.left);
    const posY = parseFloat(el.style.top);
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.style.setProperty('--bubble-color', agent.color);
    // For right-side agents, shift bubble left to avoid clipping
    if (posX > 55) {
      bubble.style.right = (100 - posX - 5) + '%';
      bubble.style.left = 'auto';
    } else {
      bubble.style.left = posX + '%';
    }
    bubble.style.top = 'calc(' + posY + '% - 120px)';
    bubble.innerHTML = `
      <div class="bubble-name">${agent.short}</div>
      <div class="bubble-text"></div>
    `;
    this.stage.appendChild(bubble);
    this.bubbleEl = bubble;

    // Typewriter effect
    requestAnimationFrame(() => {
      bubble.classList.add('speech-bubble--visible');
      this._typewriter(bubble.querySelector('.bubble-text'), text);
    });
  }

  _typewriter(el, text, i = 0) {
    if (!this.bubbleEl || i >= text.length) return;
    el.textContent = text.slice(0, i + 1);
    setTimeout(() => this._typewriter(el, text, i + 1), 15);
  }

  _removeBubble() {
    if (this.bubbleEl) {
      this.bubbleEl.remove();
      this.bubbleEl = null;
    }
  }

  _showActionOverlay(text) {
    this.actionOverlay.textContent = text;
    this.actionOverlay.classList.add('action-overlay--visible');
  }

  _hideActionOverlay() {
    this.actionOverlay.classList.remove('action-overlay--visible');
  }
}

// ---- Timeline Renderer ----

class TimelineRenderer {
  constructor(timelineEl, controller) {
    this.timeline = timelineEl;
    this.controller = controller;
    this.nodeEls = [];
    this.connectorEls = [];
    this._build();
  }

  _build() {
    let lastPhase = null;

    PIPELINE.forEach((task, idx) => {
      // Phase divider
      if (task.phase !== lastPhase) {
        if (lastPhase !== null) {
          const divider = document.createElement('div');
          divider.className = 'tl-divider';
          this.timeline.appendChild(divider);
        }
        lastPhase = task.phase;
      }

      // Connector (except first)
      if (idx > 0 && PIPELINE[idx - 1].phase === task.phase) {
        const conn = document.createElement('div');
        conn.className = 'tl-connector';
        this.timeline.appendChild(conn);
        this.connectorEls.push({ el: conn, afterTask: idx - 1 });
      }

      // Node
      const node = document.createElement('div');
      node.className = 'tl-node';
      node.dataset.taskIdx = idx;
      node.innerHTML = `
        <div class="tl-dot">${idx + 1}</div>
        <div class="tl-node-label">${task.name}</div>
      `;
      node.addEventListener('click', () => this.controller.jumpToTask(idx));
      this.timeline.appendChild(node);
      this.nodeEls.push(node);
    });
  }

  update(stepIndex, stepMap) {
    const currentTaskIdx = stepMap[stepIndex]?.taskIdx ?? 0;

    this.nodeEls.forEach((el, idx) => {
      el.classList.remove('tl-node--active', 'tl-node--complete');
      if (idx < currentTaskIdx) {
        el.classList.add('tl-node--complete');
      } else if (idx === currentTaskIdx) {
        el.classList.add('tl-node--active');
        // Scroll into view
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    this.connectorEls.forEach(({ el, afterTask }) => {
      el.classList.remove('tl-connector--filled', 'tl-connector--active');
      if (afterTask < currentTaskIdx) {
        el.classList.add('tl-connector--filled');
      } else if (afterTask === currentTaskIdx - 1) {
        el.classList.add('tl-connector--active');
      }
    });
  }
}

// ---- Detail Panel Renderer ----

class DetailPanelRenderer {
  constructor() {
    this.titleEl = document.getElementById('detailTitle');
    this.agentsEl = document.getElementById('detailAgents');
    this.descEl = document.getElementById('detailDescription');
    this.outputEl = document.getElementById('detailOutput');
  }

  update(task) {
    this.titleEl.textContent = task.name;

    // Agents
    const allAgents = [...task.agents];
    if (task.summarizer) allAgents.push(task.summarizer);
    this.agentsEl.innerHTML = allAgents.map(id => {
      const a = AGENTS[id];
      return `
        <div class="detail-agent" style="border-color: ${a.color}20">
          <img src="${a.icon}" alt="${a.name}">
          <div>
            <div class="detail-agent-name" style="color: ${a.color}">${a.short}</div>
            <div class="detail-agent-role">${a.name}</div>
          </div>
        </div>
      `;
    }).join('');

    this.descEl.textContent = task.description;
    this.outputEl.textContent = task.output ? 'Output: ' + task.output : '';
  }
}

// ---- Main Init ----

function init() {
  const stage = document.getElementById('stage');
  const timelineEl = document.getElementById('timeline');
  const phaseLabel = document.getElementById('phaseLabel');
  const taskLabel = document.getElementById('taskLabel');
  const progressText = document.getElementById('progressText');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const iconPlay = btnPlayPause.querySelector('.icon-play');
  const iconPause = btnPlayPause.querySelector('.icon-pause');

  const controller = new AnimationController();
  const stageRenderer = new StageRenderer(stage);
  const timelineRenderer = new TimelineRenderer(timelineEl, controller);
  const detailRenderer = new DetailPanelRenderer();

  let lastTaskIdx = -1;

  function onStep(stepIndex) {
    const info = controller.stepMap[stepIndex];
    if (!info) return;

    const task = PIPELINE[info.taskIdx];
    const dialogue = info.isPostProcess ? null : task.dialogues[info.dlgIdx];

    // Update phase/task labels
    phaseLabel.textContent = task.phaseName;
    taskLabel.textContent = task.name;
    if (task.isLoop) taskLabel.textContent += ' (per slide)';

    // Update progress
    progressText.textContent = `Step ${stepIndex + 1} / ${controller.totalSteps}`;

    // Context stack: add doc when we move to a new task
    if (info.taskIdx !== lastTaskIdx) {
      if (lastTaskIdx >= 0 && lastTaskIdx < info.taskIdx) {
        // Add context docs for all completed tasks between lastTaskIdx and current
        for (let t = lastTaskIdx; t < info.taskIdx; t++) {
          stageRenderer.addContextDoc(PIPELINE[t].output);
        }
      } else if (info.taskIdx < lastTaskIdx) {
        // Going backward — rebuild context stack
        stageRenderer.resetContextStack();
        for (let t = 0; t < info.taskIdx; t++) {
          stageRenderer.addContextDoc(PIPELINE[t].output);
        }
      }
      lastTaskIdx = info.taskIdx;
    }

    // Render stage
    stageRenderer.renderStep(info, task, dialogue);

    // Render timeline
    timelineRenderer.update(stepIndex, controller.stepMap);

    // Render detail
    detailRenderer.update(task);

    // Update play/pause icon
    updatePlayPauseIcon();
  }

  function updatePlayPauseIcon() {
    if (controller.isPlaying) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    }
  }

  controller.onStep = onStep;

  // Controls
  btnPlayPause.addEventListener('click', () => {
    controller.togglePlayPause();
    updatePlayPauseIcon();
  });
  document.getElementById('btnStepBack').addEventListener('click', () => controller.stepBack());
  document.getElementById('btnStepForward').addEventListener('click', () => controller.stepForward());

  // Speed buttons
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      controller.setSpeed(parseFloat(btn.dataset.speed));
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        controller.togglePlayPause();
        updatePlayPauseIcon();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        controller.stepBack();
        break;
      case 'ArrowRight':
        e.preventDefault();
        controller.stepForward();
        break;
      case '1': controller.setSpeed(0.5); updateSpeedButtons(0.5); break;
      case '2': controller.setSpeed(1); updateSpeedButtons(1); break;
      case '3': controller.setSpeed(2); updateSpeedButtons(2); break;
      case '4': controller.setSpeed(4); updateSpeedButtons(4); break;
    }
  });

  function updateSpeedButtons(speed) {
    document.querySelectorAll('.speed-btn').forEach(b => {
      b.classList.toggle('active', parseFloat(b.dataset.speed) === speed);
    });
  }

  // Initial render
  onStep(0);
}

// Boot
document.addEventListener('DOMContentLoaded', init);
