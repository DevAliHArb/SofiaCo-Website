import { useNavigate as useRouterNavigate } from 'react-router-dom';

// Track Ctrl/Meta key state at module level (shared across all hook instances)
let ctrlKeyPressed = false;

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) ctrlKeyPressed = true;
  });
  window.addEventListener('keyup', (e) => {
    if (!e.ctrlKey && !e.metaKey) ctrlKeyPressed = false;
  });
  // Reset when window loses focus
  window.addEventListener('blur', () => {
    ctrlKeyPressed = false;
  });
}

/**
 * Custom useNavigate hook that opens links in a new tab when Ctrl/Cmd is held.
 * Drop-in replacement for react-router-dom's useNavigate.
 */
export function useNavigate() {
  const routerNavigate = useRouterNavigate();

  return (to, options) => {
    if (ctrlKeyPressed && typeof to === 'string') {
      window.open(to, '_blank', 'noopener,noreferrer');
      return;
    }
    routerNavigate(to, options);
  };
}
