import { useState } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/shared/Modal'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: Props) {
  const { profile } = useAuthStore()
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirm: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async () => {
    //vérifier si newPassword === confirm sinon toast erreur
    if (form.newPassword !== form.confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    // verifier que newPassword fasse mini 6 caractères
    if (form.newPassword.length < 6) {
      toast.error('Le mot de passe doit faire au moins 6 caractères')
      return
    }
    // signIn silencieux avec l'ancien pwd pour le verif
    setIsLoading(true)
    // utiler supabase.auth.signInWithPassword avec le fake email patern
    supabase.auth
      .signInWithPassword({
        email: `${profile?.username}@dwc.internal`,
        password: form.oldPassword,
      })
      .then(({ error }) => {
        setIsLoading(false)
        if (error) {
          toast.error('Ancien mot de passe incorrect')
        } else {
          // update du mot de passe avec supabase.auth.updateUser
          supabase.auth
            .updateUser({
              password: form.newPassword,
            })
            .then(({ error }) => {
              if (error) {
                toast.error('Erreur lors de la mise à jour du mot de passe')
              } else {
                toast.success('Mot de passe mis à jour avec succès')
                onClose()
                setForm({
                  oldPassword: '',
                  newPassword: '',
                  confirm: '',
                })
              }
            })
        }
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Changer le mot de passe">
      <div className="flex flex-col gap-4">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="password"
            autoComplete = "current-password"
            placeholder="Ancien mot de passe"
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[hsl(var(--card))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          />
          <input
            type="password"
            autoComplete = "new-password"
            placeholder="Nouveau mot de passe"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[hsl(var(--card))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          />
          <input
            type="password"
            autoComplete = "new-password"
            placeholder="Confirmer le nouveau mot de passe"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[hsl(var(--card))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          />

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-md hover:bg-[hsl(var(--primary-hover))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Chargement...' : 'Mettre à jour le mot de passe'}
          </button>
        </form>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-md hover:bg-[hsl(var(--secondary-hover))] transition-colors"
        >
          Annuler
        </button>
      </div>
    </Modal>
  )
}
