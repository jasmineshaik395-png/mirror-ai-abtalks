import { SessionState } from "./types";

// In-memory store — matches the "no persistence required" scope.
// Resets on server restart; fine for a hackathon demo / evaluation window.
const sessions = new Map<string, SessionState>();

export function createSession(session: SessionState) {
  sessions.set(session.sessionId, session);
  return session;
}

export function getSession(sessionId: string): SessionState | undefined {
  return sessions.get(sessionId);
}

export function updateSession(sessionId: string, updates: Partial<SessionState>) {
  const existing = sessions.get(sessionId);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates };
  sessions.set(sessionId, updated);
  return updated;
}
