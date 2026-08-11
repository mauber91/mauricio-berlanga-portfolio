import type { BuildingId, Point } from './world'

export type InteriorExhibit = {
  id: string
  index: string
  eyebrow: string
  title: string
  summary: string
  position: Point
}

export type InteriorScene = {
  image: string
  exhibits: InteriorExhibit[]
}

export const interiorScenes: Record<BuildingId, InteriorScene> = {
  foundry: {
    image: '/game/interiors/foundry.webp',
    exhibits: [
      { id: 'craft', index: '01', eyebrow: 'Fabrication bench', title: 'Product engineering', summary: 'Nine-plus years turning ambiguous product problems into dependable interfaces, platforms, and shared systems.', position: { x: 25, y: 25 } },
      { id: 'platform', index: '02', eyebrow: 'Systems core', title: 'Platform architecture', summary: 'React, TypeScript, Nx, Module Federation, tooling, APIs, and release foundations designed for teams—not demos.', position: { x: 73, y: 23 } },
      { id: 'archive', index: '03', eyebrow: 'Component vault', title: 'Reusable foundations', summary: 'Clear boundaries, useful defaults, observable behavior, and a bias toward systems that remain changeable.', position: { x: 23, y: 66 } },
      { id: 'quality', index: '04', eyebrow: 'Quality station', title: 'Technical leadership', summary: 'Architecture is also a team practice: communicating constraints, raising standards, and creating leverage for other engineers.', position: { x: 76, y: 67 } },
    ],
  },
  observatory: {
    image: '/game/interiors/observatory.webp',
    exhibits: [
      { id: 'optics', index: '01', eyebrow: 'Optics bench', title: 'Machine learning foundations', summary: 'Theory becomes useful when it sharpens the questions we ask of systems that actually run.', position: { x: 18, y: 44 } },
      { id: 'orrery', index: '02', eyebrow: 'Celestial orrery', title: 'Stanford AI study', summary: 'Graduate work across supervised learning, reinforcement learning, and modern policy learning.', position: { x: 50, y: 25 } },
      { id: 'archive', index: '03', eyebrow: 'Research desk', title: 'Questions in motion', summary: 'Evaluation, retrieval, model behavior, and agentic systems form a connected research map—not a checklist.', position: { x: 78, y: 43 } },
      { id: 'constellation', index: '04', eyebrow: 'Constellation table', title: 'Learning in public', summary: 'Experiments become more valuable when methods, negative results, and changed beliefs stay visible.', position: { x: 76, y: 70 } },
    ],
  },
  lab: {
    image: '/game/interiors/lab.webp',
    exhibits: [
      { id: 'retrieval', index: '01', eyebrow: 'Specimen gallery', title: 'Retrieval systems', summary: 'Query, retrieve, rerank, and explain—with evaluation infrastructure treated as part of the model.', position: { x: 17, y: 28 } },
      { id: 'core', index: '02', eyebrow: 'Neural lattice', title: 'Model experimentation', summary: 'Forecasting studies, honest baselines, and instrumentation that can prove when a sophisticated idea is not better.', position: { x: 50, y: 23 } },
      { id: 'routing', index: '03', eyebrow: 'Comparison bench', title: 'Model routing', summary: 'Local and cloud intelligence coordinated around latency, privacy, cost, and task difficulty.', position: { x: 81, y: 31 } },
      { id: 'evaluation', index: '04', eyebrow: 'Robustness rig', title: 'Evaluation loops', summary: 'Build, measure, inspect, revise—the lab is designed to make failure informative and progress legible.', position: { x: 24, y: 70 } },
    ],
  },
  archive: {
    image: '/game/interiors/archive.webp',
    exhibits: [
      { id: 'methods', index: '01', eyebrow: 'Specimen cabinet', title: 'Methods, not mythology', summary: 'The archive preserves the setup, baseline, failure modes, and reasoning—not only the polished conclusion.', position: { x: 17, y: 31 } },
      { id: 'desk', index: '02', eyebrow: 'Curator desk', title: 'Learning in public', summary: 'Three field notes turn coursework and experiments into practical stories another builder can use.', position: { x: 50, y: 22 } },
      { id: 'evidence', index: '03', eyebrow: 'Evidence table', title: 'Results with receipts', summary: 'Verifiers, local models, forecasting, and model orchestration documented with the uncomfortable findings intact.', position: { x: 72, y: 32 } },
      { id: 'index', index: '04', eyebrow: 'Living index', title: 'A growing body of work', summary: 'Every note links the claim back to the experiment and every experiment opens a better next question.', position: { x: 78, y: 68 } },
    ],
  },
  station: {
    image: '/game/interiors/station.webp',
    exhibits: [
      { id: 'origin', index: '01', eyebrow: 'Founder bench', title: 'Product origins', summary: 'GoBus began with a real transit problem and grew past 10,000 registered riders through practical route tools.', position: { x: 22, y: 24 } },
      { id: 'core', index: '02', eyebrow: 'Prototype core', title: 'Ship, observe, improve', summary: 'Start with the smallest useful thing, watch how people use it, and let evidence shape the next build.', position: { x: 73, y: 24 } },
      { id: 'blueprint', index: '03', eyebrow: 'Projection table', title: 'Creative technology', summary: 'Side projects are a proving ground for interaction ideas, intelligent tools, and end-to-end product instincts.', position: { x: 20, y: 51 } },
      { id: 'toolwall', index: '04', eyebrow: 'Public workbench', title: 'Open-source practice', summary: 'Repositories show the route from idea to working system across frontend, backend, and applied ML.', position: { x: 77, y: 50 } },
      { id: 'assembly', index: '05', eyebrow: 'Assembly alcove', title: 'Full-stack range', summary: 'The best prototype keeps enough technical depth to survive contact with reality.', position: { x: 75, y: 72 } },
    ],
  },
  signal: {
    image: '/game/interiors/signal.webp',
    exhibits: [
      { id: 'recording', index: '01', eyebrow: 'Recording nook', title: 'A direct channel', summary: 'Open a conversation about frontend platforms, applied AI, ML systems, or research engineering.', position: { x: 18, y: 29 } },
      { id: 'console', index: '02', eyebrow: 'Signal console', title: 'Current focus', summary: 'Technically ambitious work where product craft and strong systems foundations need to reinforce each other.', position: { x: 50, y: 25 } },
      { id: 'scope', index: '03', eyebrow: 'Constellation lens', title: 'The opportunity map', summary: 'The strongest fit: complex interfaces, platform leverage, intelligent workflows, and measurable learning loops.', position: { x: 79, y: 31 } },
      { id: 'network', index: '04', eyebrow: 'Routing board', title: 'Find Mauricio', summary: 'GitHub, LinkedIn, and email are online. Choose the channel that fits the conversation.', position: { x: 19, y: 67 } },
      { id: 'lounge', index: '05', eyebrow: 'Listening lounge', title: 'Make the signal useful', summary: 'Share the problem, the constraints, and what a meaningful outcome would look like.', position: { x: 79, y: 68 } },
    ],
  },
}
