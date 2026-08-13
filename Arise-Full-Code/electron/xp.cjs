// Mirrors src/lib/xp.ts exactly. Kept in sync manually since the main
// process (CommonJS) and renderer (TS/ESM) don't share a build step.
// If you change the curve in one place, change it in the other.

function xpToNextLevel(level) {
  return 100 + (level - 1) * 40;
}

function levelFromTotalXp(totalXp) {
  let level = 1;
  let remaining = totalXp;
  for (let i = 0; i < 500; i++) {
    const needed = xpToNextLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level += 1;
  }
  return level;
}

module.exports = { xpToNextLevel, levelFromTotalXp };
