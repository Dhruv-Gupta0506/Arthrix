// Tiny pub-sub so axios.js can announce "the server is being slow" without
// needing React context. ServerWakeBanner.jsx listens for these.
export const WAKE_START_EVENT = "server:wake-start";
export const WAKE_END_EVENT = "server:wake-end";

let pendingSlowRequests = 0;

export function beginSlowRequest() {
  pendingSlowRequests += 1;
  if (pendingSlowRequests === 1) {
    window.dispatchEvent(new CustomEvent(WAKE_START_EVENT));
  }
}

export function endSlowRequest() {
  if (pendingSlowRequests === 0) return;
  pendingSlowRequests -= 1;
  if (pendingSlowRequests === 0) {
    window.dispatchEvent(new CustomEvent(WAKE_END_EVENT));
  }
}