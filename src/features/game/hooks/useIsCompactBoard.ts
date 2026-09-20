import useMediaQuery from '@/shared/hooks/useMediaQuery'

/**
 * Point de vérité unique : le plateau doit-il passer en mode compact
 * (sidebar repliée derrière un bouton flottant) ?
 */
export default function useIsCompactBoard(): boolean {
  return useMediaQuery('(pointer: coarse) and (max-width: 950px)')
}