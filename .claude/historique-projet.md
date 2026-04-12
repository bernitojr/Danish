## SESSION — Chantier layout GameBoard (Milestone UI v2)

### Objectif

Rendre le plateau de jeu entièrement visible en 100vh sans scroll,
repositionner les zones UI et refactoriser le panneau émotes.

### Modifications apportées

**Layout GameBoard (GameBoard.tsx) :**

- Structure flex column height 100vh overflow hidden
- Bot haut : 36vh (cartes + hidden + avatar entièrement visibles)
- Rangée centrale : 16vh (pile/deck + bots latéraux groupés au centre)
- Zone humain : flex 1 (occupe l'espace restant, ancrée en bas)
- Zone UI basse : ~10vh fixe (émotes + log)

**Bots latéraux (Bot 1 & 3) :**

- Rapprochés du centre via justify-content center + gap contrôlé
- Plus collés aux bords viewport

**Bouton "Ramasser la pile" :**

- Correctement positionné dans le DOM (zone centrale)
- Plus recouvert par la zone humain grâce au rééquilibrage vertical

**Panneau émotes :**

- Repositionné en bas à gauche, ancré
- Grille 2×2 (4 emojis cliquables)
- Textes supprimés (hors scope)
- Couleur text-white corrigée

**Log de jeu :**

- Bas droit, font-size 1rem, max 4 entrées, 300px

### Décisions prises

- Textes des bulles émotes supprimés — trop complexe, hors scope Phase 1
- Hauteurs en vh avec fallback flex 1 pour la zone humain

### État au milestone

- Layout validé visuellement ✅
- Démo client à venir
- Prochains chantiers identifiés : DA Casino, composants visuels, écran Lobby
