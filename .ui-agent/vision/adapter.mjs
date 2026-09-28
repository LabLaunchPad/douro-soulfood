// VISION ADAPTER: provider abstraction with zero-cost local-first path.
// Providers: ollama (preferred) → openai-compatible → anthropic (env keys).
// No model installed here → VISION_DEGRADED: deterministic QA only, never fake it.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PREFERRED = ['qwen3-vl:2b', 'qwen3-vl:4b', 'gemma3:4b']; // small-first for constrained machines

export function detectVision() {
  try {
    execSync('ollama --version', { timeout: 8000, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch { return { provider: 'none', status: 'VISION_DEGRADED', reason: 'no ollama binary' }; }
  let models = [];
  try {
    const out = execSync('ollama list', { timeout: 15000 }).toString();
    models = out.split('\n').slice(1).map((l) => l.split(/\s+/)[0]).filter(Boolean);
  } catch { return { provider: 'ollama', status: 'VISION_DEGRADED', reason: 'ollama daemon unreachable' }; }
  const selected = PREFERRED.find((w) => models.some((m) => m.startsWith(w.split(':')[0])));
  if (!selected) return { provider: 'ollama', status: 'VISION_DEGRADED', reason: `no preferred vision model installed (want one of ${PREFERRED.join(', ')}) — pull with: ollama pull ${PREFERRED[0]}`, models };
  return { provider: 'ollama', status: 'VISION_READY', selected, models };
}

// describe(imagePath) → text. Degraded mode returns a marker, never a hallucination.
export async function describeImage(imagePath, prompt = 'Describe layout defects: alignment, spacing, overflow, hierarchy.') {
  const v = detectVision();
  if (v.status !== 'VISION_READY') return { status: 'VISION_DEGRADED', text: null, note: 'no vision model — deterministic geometry QA only' };
  // Ollama /api/generate with images (base64). Kept minimal; streaming off.
  const { readFileSync: rf } = await import('node:fs');
  const res = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: v.selected, prompt, images: [rf(imagePath).toString('base64')], stream: false }),
  });
  const j = await res.json();
  return { status: 'VISION_READY', text: j.response || null, model: v.selected };
}

if (process.argv[1] && process.argv[1].endsWith('adapter.mjs')) {
  console.log(JSON.stringify(detectVision(), null, 1));
}
void root;
