import styles from './Hud.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

export default function Hud({ muted, onToggleMute, showReturn, onReturn }: {
  muted: boolean; onToggleMute: () => void; showReturn: boolean; onReturn: () => void;
}) {
  return (
    <>
      <div className={styles.topRight}>
        <div className={styles.holoRing}>
          <button className={styles.pill} onClick={onToggleMute} data-hover
            aria-label={muted ? 'Unmute' : 'Mute'}>
            <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} />
          </button>
        </div>
      </div>
      {showReturn && (
        <div className={styles.topLeft}>
          <div className={styles.holoRing}>
            <button className={styles.pill} onClick={onReturn} data-hover>
              ← Return to system
            </button>
          </div>
        </div>
      )}
    </>
  );
}
