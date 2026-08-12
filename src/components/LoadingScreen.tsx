import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import styles from './LoadingScreen.module.css';

// hold the loader a beat even on fast connections so the decode/orbit moment
// reads, then fade to reveal the fully-loaded scene
const MIN_SHOW_MS = 900;
const FADE_MS = 700;

export default function LoadingScreen() {
  const { active, progress } = useProgress();
  const [fontsReady, setFontsReady] = useState(false);
  const [displayed, setDisplayed] = useState(0);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);
  const mountedAt = useRef(performance.now());

  // useProgress reports {active:false, progress:0} for a frame or two before
  // the texture loaders kick in — only trust "100%" after loading has begun
  const startedRef = useRef(false);
  if (active) startedRef.current = true;

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  // percent readout eases toward the real progress instead of jumping
  // between the loader's coarse per-file steps
  const targetRef = useRef(0);
  targetRef.current = Math.max(targetRef.current, progress);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setDisplayed((d) => {
        const t = targetRef.current;
        const next = d + (t - d) * 0.12;
        return t - next < 0.1 ? t : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ready = fontsReady && startedRef.current && !active && progress >= 100;

  useEffect(() => {
    if (!ready) return;
    const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - mountedAt.current));
    const t = setTimeout(() => setFading(true), wait);
    return () => clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setDone(true), FADE_MS);
    return () => clearTimeout(t);
  }, [fading]);

  if (done) return null;

  return (
    <div
      className={fading ? `${styles.overlay} ${styles.hidden}` : styles.overlay}
      role="status"
      aria-label="Loading the solar system"
    >
      <div className={styles.orbitLoader} aria-hidden="true">
        <div className={styles.tilt}>
          <div className={styles.ring} />
          <div className={styles.spin}>
            <span className={styles.orbitDot} />
          </div>
        </div>
        <div className={styles.sunDot} />
      </div>
      <div className={styles.text}>
        <h1 className={styles.title}>Solar System</h1>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${displayed}%` }} />
        </div>
        <div className={styles.readout}>{String(Math.round(displayed)).padStart(3, '0')}%</div>
      </div>
    </div>
  );
}
