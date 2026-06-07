## 2026-05-15 - React Component Re-render Optimization
**Learning:** Frequent timer updates (`setInterval`) inside a high-level state (like the main page component) force the entire tree to re-render constantly.
**Action:** Extract countdown timers or frequently updating small UI elements into isolated sub-components. Pass down props or a `resetKey` instead to keep the main component lightweight and preserve global performance.
