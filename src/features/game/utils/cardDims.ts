// Dimensions de carte dérivées d'une largeur active. Calibré pour retomber
// EXACTEMENT sur les valeurs desktop actuelles à CARD_W_DESKTOP = 56.
export const CARD_W_DESKTOP = 56
export const CARD_W_COMPACT = 30 // étape 4 : à calibrer (lisibilité + tap targets mesurés)

const RATIO = 78 / 56 // hauteur / largeur (1.393)

export function getCardDims(cardW: number) {
  return {
    w: cardW,
    h: Math.round(cardW * RATIO),
    overlap: Math.round(cardW * (25 / 56)), // 25 à 56px
    fanPadding: Math.round(cardW * (8 / 56)), // 8 à 56px
    fanVPadding: Math.round(cardW * (17 / 56)), // 17 à 56px
  }
}
