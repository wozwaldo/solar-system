import React from 'react';
import styles from './PlanetInfoCard.module.css';
import { PLANET_INFOS } from './planetData';
import DecodeText from './DecodeText';

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
