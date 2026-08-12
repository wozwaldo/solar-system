import { useEffect, useState } from 'react';

const GLYPHS = "█▓▒░<>/\\|+=*·01";

// sci-fi decode effect: characters start as random glyphs and settle into the
// real text left-to-right; renders instantly under prefers-reduced-motion
export function useDecodedText(text: string, framesPerChar = 2, delayFrames = 0) {
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

export default function DecodeText({ text, framesPerChar = 2, delayFrames = 0 }: {
  text: string; framesPerChar?: number; delayFrames?: number;
}) {
  const display = useDecodedText(text, framesPerChar, delayFrames);
  return <>{display}</>;
}
