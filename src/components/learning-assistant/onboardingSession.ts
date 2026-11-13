const KEY = 'eduaihub_assistant_onboarding_v24';
export type WelcomeAudience = 'guest' | 'member';
interface WelcomeState { guest: boolean; member: boolean; dismissed: boolean }
let fallback: WelcomeState = { guest: false, member: false, dismissed: false };

function readWelcomeState(): WelcomeState {
  try {
    const raw = sessionStorage.getItem(KEY);
    // Respect preferences recorded before the greeting bubble was introduced.
    if (raw === 'seen' || raw === 'dismissed') return { guest: true, member: true, dismissed: raw === 'dismissed' };
    if (raw) {
      const value = JSON.parse(raw);
      return { guest: value?.guest === true || fallback.guest, member: value?.member === true || fallback.member, dismissed: value?.dismissed === true || fallback.dismissed };
    }
  } catch { /* Storage may be unavailable or contain an invalid preference. */ }
  return fallback;
}

export function hasSeenAssistantWelcome(audience: WelcomeAudience = 'guest') {
  const state = readWelcomeState();
  return state.dismissed || state[audience];
}

export function rememberAssistantWelcome(dismissed = false, audience: WelcomeAudience = 'guest') {
  const state = readWelcomeState();
  fallback = { ...state, [audience]: true, dismissed: state.dismissed || dismissed };
  try { sessionStorage.setItem(KEY, JSON.stringify(fallback)); } catch { /* Keep the preference in memory for this page load. */ }
}
