import { useCallback, useEffect, useState } from "react";
import EasterEggContext from "./EasterEggContext";

export const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
  "Enter",
];

export default function EasterEgg({
  easterEgg = false,
  onSetEasterEgg,
}: {
  easterEgg: boolean;
  onSetEasterEgg: (state: boolean) => void;
}) {
  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  const listener = useCallback(
    (ev: KeyboardEvent) => {
      if (easterEgg) {
        return;
      }
      if (KONAMI_CODE[konamiCode.length] === ev.key) {
        const newKonamiCode = [...konamiCode, ev.key];
        setKonamiCode(newKonamiCode);
        if (KONAMI_CODE.length === newKonamiCode.length) {
          onSetEasterEgg(true);
        }
      } else {
        setKonamiCode([]);
      }
    },
    [konamiCode, easterEgg, onSetEasterEgg]
  );
  useEffect(() => {
    document.addEventListener("keyup", listener);
    return () => document.removeEventListener("keyup", listener);
  }, [listener]);
  return <></>;
}

export function useEasterEgg() {
  const [easterEgg, setEasterEgg] = useState<boolean>(false);
  const renderComponent = () => (
    <EasterEggContext.Provider value={easterEgg}>
      <EasterEgg easterEgg={easterEgg} onSetEasterEgg={setEasterEgg} />
    </EasterEggContext.Provider>
  );
  return { renderComponent, easterEgg };
}
