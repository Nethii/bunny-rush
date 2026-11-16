const BASE = 'http://localhost:5000/api';

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const registerUser  = (data)         =>
  fetch(`${BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const loginUser     = (data)         =>
  fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const startGame     = (token)        =>
  fetch(`${BASE}/game/start`, { method: 'POST', headers: authHeaders(token) }).then(r => r.json());

export const fetchPuzzle   = (token)        =>
  fetch(`${BASE}/game/puzzle`, { headers: authHeaders(token) }).then(r => r.json());

export const submitAnswer  = (token, data)  =>
  fetch(`${BASE}/game/answer`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(data) }).then(r => r.json());

export const usePowerUp    = (token, type)  =>
  fetch(`${BASE}/game/powerup`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify({ type }) }).then(r => r.json());

export const getLeaderboard = ()            =>
  fetch(`${BASE}/leaderboard`).then(r => r.json());

