import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

export function useAuth() {
  const { setUser, setProfile } = useAuthStore()

  const signIn = async (username: string, password: string) => {
    // chercher le profil avec ce username pr récup l'email
    const fakeEmail = `${username}@dwc.internal`
    console.log('signIn called with:', {
      username,
      passwordLength: password.length,
    })
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (!profile) throw new Error('Utilisateur non trouvé')

    // se connecter avec l'email et le password
    const { error, data } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    })

    if (error) throw error

    setUser(data.user)
    setProfile(profile)
  }

  const signUp = async (username: string, password: string) => {
    console.log('signUp called with:', {
      username,
      passwordLength: password.length,
    })
    const fakeEmail = `${username}@dwc.internal`
    // créer le user dans supabase auth
    const { data, error } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
    })
    console.log('error détaillé:', error)
    console.log('data:', data)
    if (error) throw error

    // créer le profil dans la table "profiles"
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user?.id,
        username,
      })
      .select('*')
      .single()
    if (profileError) throw profileError

    setUser(data.user)
    setProfile({ username, avatar_url: null, role: 'player' })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    console.log('User signed out')
  }

  return { signIn, signUp, signOut }
}
