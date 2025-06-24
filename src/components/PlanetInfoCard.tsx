import React from 'react';
import styles from './PlanetInfoCard.module.css';
import { PLANET_INFOS } from './SolarSystem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface PlanetInfoCardProps {
  planet: string | null;
  onClose: () => void;
}


const PlanetInfoCard: React.FC<PlanetInfoCardProps> = ({ planet, onClose }) => {
    if (!planet) return null;
    return (
        <div
      className={styles.cardFadeIn}
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '20px',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}
        >

            <div className={styles['card-container']}>
                <div className={styles['card-canvas']}>
                <div className={[styles['tr-1'], styles.tracker].join(' ')}></div>
                <div className={[styles['tr-2'], styles.tracker].join(' ')}></div>
                <div className={[styles['tr-3'], styles.tracker].join(' ')}>
                  <div onClick={onClose} className={styles.closebtn}>
                          <FontAwesomeIcon icon={faChevronUp} />
                  </div>
                </div>
                <div className={[styles['tr-4'], styles.tracker].join(' ')}></div>
                <div className={[styles['tr-5'], styles.tracker].join(' ')}></div>
                <div className={[styles['tr-6'], styles.tracker].join(' ')}></div>
                <div className={[styles['tr-7'], styles.tracker].join(' ')}></div>
                <div className={[styles['tr-8'], styles.tracker].join(' ')}></div>
                <div className={[styles['tr-9'], styles.tracker].join(' ')}></div>
                <div className={styles['planet-card']}>
                    <div className={styles['card-content']}>
                    <div className={styles['card-glare']}></div>
                    <div className={styles['card-lines']}>
                        <span></span><span></span><span></span><span></span>
                    </div>
  
                    <p className={styles.prompt}>{PLANET_INFOS[planet].desc}</p>
                    <div className={styles.title}>
                        Back to Solar System
                    </div>
                    <div className={styles['glowing-elements']}>
                        <div className={styles['glow-1']}></div>
                        <div className={styles['glow-2']}></div>
                        <div className={styles['glow-3']}></div>
                    </div>
                    <div className={styles.subtitle}>
                        <span>PLANET</span>
                        <span className={styles.highlight}>{PLANET_INFOS[planet].title}</span>
                    </div>
                    <div className={styles['card-particles']}>
                        <span></span><span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <div className={styles['corner-elements']}>
                        <span></span><span></span><span></span><span></span>
                    </div>
                    <div className={styles['scan-line']}></div>
                    </div>
                </div>
                </div>
            </div>

        </div>
        
    );
  };

export default PlanetInfoCard; 