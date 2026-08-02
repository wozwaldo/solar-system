import React, { useRef } from 'react';
import styles from './PlanetInfoCard.module.css';
import { PLANET_INFOS } from './planetData';

interface PlanetInfoCardProps { planet: string | null; onClose: () => void; }

const PlanetInfoCard: React.FC<PlanetInfoCardProps> = ({ planet, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!planet) return null;
  const info = PLANET_INFOS[planet];

  const handleMove = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };
  const handleLeave = () => { if (cardRef.current) cardRef.current.style.transform = ''; };

  return (
    <div className={styles.wrap}>
      <div ref={cardRef} className={styles.holoBorder} onPointerMove={handleMove} onPointerLeave={handleLeave}>
        <div className={styles.glass}>
          <div className={styles.eyebrow}>Planet · {info.numeral}</div>
          <h2 className={styles.title}>{info.title}</h2>
          <p className={styles.desc}>{info.desc}</p>
          <div className={styles.chips}>
            <span className={styles.chip}>{info.distanceFromSun}</span>
            <span className={styles.chip}>{info.moonCount}</span>
            <span className={styles.chip}>day · {info.dayLength}</span>
          </div>
          <button className={styles.close} onClick={onClose} data-hover>
            Return to system
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanetInfoCard;
