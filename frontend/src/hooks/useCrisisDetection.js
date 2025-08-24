const CRISIS_TERMS = [
  "suicid","quitarme la vida","no quiero vivir","me quiero morir","me voy a matar","hacerme dano","autolesion","auto lesion","no aguanto mas"
];
const normalize = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function useCrisisDetection() {
  const isCrisis = (text) => {
    const t = normalize(text);
    return CRISIS_TERMS.some(k => t.includes(normalize(k)));
  };
  return { isCrisis };
}