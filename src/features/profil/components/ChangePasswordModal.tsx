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
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Ancien mot de passe */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))] font-mono">
            Ancien mot de passe
          </label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
            className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-[hsl(var(--background-dark))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-muted))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-colors"
          />
        </div>

        {/* Nouveau mot de passe */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))] font-mono">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-[hsl(var(--background-dark))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-muted))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-colors"
          />
        </div>

        {/* Confirmation */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))] font-mono">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-[hsl(var(--background-dark))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-muted))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[hsl(var(--border))] mt-1">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-lg shadow-[hsl(var(--primary)/0.25)]"
          >
            {isLoading ? 'Mise à jour…' : 'Mettre à jour'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-[hsl(var(--border))] text-sm font-medium text-[hsl(var(--foreground-secondary))] hover:border-[hsl(var(--primary)/0.5)] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  )
}
