import { useProfileStats } from "../hooks/useProfileStats";

export function ProfilePage() {
  const { data, isLoading, error } = useProfileStats()

  // TODO 1 : si isLoading, retourner un div "Chargement..."

  // TODO 2 : si error, retourner un div avec le message d'erreur

  // TODO 3 : afficher les stats
  // data?.totalGames
  // data?.wins
  // data?.winRate
  // data?.placements[1] ... [4]
}