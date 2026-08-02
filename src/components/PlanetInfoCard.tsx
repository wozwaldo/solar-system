import React, { useEffect, useState } from 'react';
import styles from './PlanetInfoCard.module.css';
import { PLANET_INFOS } from './planetData';

const GLYPHS = "█▓▒░<>/\\|+=*·01";

// sci-fi decode effect: characters start as random glyphs and settle into the
// real text left-to-right; renders instantly under prefers-reduced-motion
function useDecodedText(text: string, framesPerChar = 2, delayFrames = 0) {
  const [display, setDisplay] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? text : ''
  );

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    let frame = -delayFrames;
    let raf = 0;
    const tick = () => {
      frame++;
      const settled = Math.floor(frame / framesPerChar);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ') { out += ' '; continue; }
        out += i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (settled < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, framesPerChar, delayFrames]);

  return display;
}

function DecodeText({ text, framesPerChar = 2, delayFrames = 0 }: {
  text: string; framesPerChar?: number; delayFrames?: number;
}) {
  const display = useDecodedText(text, framesPerChar, delayFrames);
  return <>{display}</>;
}

interface PlanetInfoCardProps {
  planet: string | null;
  onClose: () => void;
}

const PlanetInfoCard: React.FC<PlanetInfoCardProps> = ({ planet, onClose }) => {
  if (!planet) return null;
  const info = PLANET_INFOS[planet];

  const stats = [
    { label: 'Distance from sun', value: info.distanceFromSun },
    { label: 'Moons', value: info.moonCount },
    { label: 'Day length', value: info.dayLength },
    { label: 'Year length', value: info.yearLength },
    { label: 'Mean temperature', value: info.temperature },
  ];

  return (
    <>
      {/* identity + story, floating left of the planet */}
      <aside className={styles.left} key={`left-${planet}`}>
        <div className={styles.eyebrow}>
          <DecodeText text={`Planet · ${info.numeral}`} framesPerChar={3} />
        </div>
        <h2 className={styles.title}>
          <DecodeText text={info.title.toUpperCase()} framesPerChar={5} delayFrames={8} />
        </h2>
        <div className={styles.hairline} />
        <p className={styles.desc}>{info.desc}</p>
        <button className={styles.close} onClick={onClose} data-hover>
          Return to system
        </button>
      </aside>

      {/* telemetry, floating right of the planet */}
      <aside className={`${styles.right} ${styles.panel}`} key={`right-${planet}`}>
        <div className={styles.dataHeading}>
          <DecodeText text="Telemetry" framesPerChar={3} />
        </div>
        {stats.map((stat, i) => (
          <div key={stat.label} className={styles.statRow}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>
              <DecodeText text={stat.value} framesPerChar={4} delayFrames={10 + i * 8} />
            </span>
          </div>
        ))}
      </aside>
    </>
  );
};

export default PlanetInfoCard;
