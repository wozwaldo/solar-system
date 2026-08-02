import { useEffect, useRef } from 'react';
import styles from './Cursor.module.css';
import { cursorState } from './cursorState';

export default function Cursor() {
  const orbRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('customCursor');

    let mx = -100, my = -100;
    const orb = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let domHover = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    const onOver = (e: PointerEvent) => {
      domHover = !!(e.target as HTMLElement).closest('[data-hover], button, a');
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);

    const loop = () => {
      const kOrb = reduced ? 1 : 0.35;
      const kTrail = reduced ? 1 : 0.12;
      orb.x += (mx - orb.x) * kOrb;   orb.y += (my - orb.y) * kOrb;
      trail.x += (mx - trail.x) * kTrail; trail.y += (my - trail.y) * kTrail;
      const hot = cursorState.hover || domHover;
      const o = orbRef.current, t = trailRef.current;
      if (o) {
        o.style.transform = `translate(${orb.x}px, ${orb.y}px)`;
        o.classList.toggle(styles.hot, hot && !cursorState.drag);
        o.classList.toggle(styles.drag, cursorState.drag);
      }
      if (t) {
        t.style.transform = `translate(${trail.x}px, ${trail.y}px)`;
        t.style.opacity = cursorState.drag ? '0' : '1';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.classList.remove('customCursor');
    };
  }, []);

  return (
    <>
      <div ref={orbRef} className={styles.orb} aria-hidden />
      <div ref={trailRef} className={styles.trail} aria-hidden />
    </>
  );
}
