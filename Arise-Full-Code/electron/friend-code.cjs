function generateFriendCode(seedName) {
  const base =
    (seedName || "PLAYER")
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 6) || "PLAYER";
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}-${suffix}`;
}

module.exports = { generateFriendCode };
