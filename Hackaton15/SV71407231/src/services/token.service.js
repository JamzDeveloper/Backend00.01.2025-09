const refreshStore = new Map();

export function saveRefresh(jti, data) {
  refreshStore.set(jti, { ...data, revoked: false });
}

export function getRefresh(jti) {
  return refreshStore.get(jti);
}

export function revokeRefresh(jti) {
  const t = refreshStore.get(jti);
  if (t) t.revoked = true;
}

export function revokeAllForUser(userId) {
  for (const [k, v] of refreshStore.entries()) {
    if (v.userId === userId) v.revoked = true;
  }
}
