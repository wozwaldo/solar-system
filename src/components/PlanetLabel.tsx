import { Html } from "@react-three/drei";
import styles from "./PlanetLabel.module.css";

export default function PlanetLabel({ name, visible, offsetY }: { name: string; visible: boolean; offsetY: number }) {
  return (
    <Html position={[0, offsetY, 0]} center distanceFactor={40} style={{ pointerEvents: "none" }}>
      <div className={`${styles.label} ${visible ? styles.visible : ""}`}>{name}</div>
    </Html>
  );
}
