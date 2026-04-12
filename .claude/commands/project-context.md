---
name: project-context
description: Use this skill at the start of ANY development conversation, especially when the user mentions a project name, references existing files, says "continue", "on reprend", "on repart", shares a CLAUDE.md, or uploads a project history file. Forces Claude to read project files before acting, declare what it knows and doesn't know, and never assume context. Also use when the user says "mode apprentissage" to activate learning checkpoints.
---

# Project Context Loader

Before writing a single line of code or making any suggestion, complete these steps in order. Never skip ahead.

## Step 1 — Read first, act never (yet)

If a CLAUDE.md, project history file, or any project document is referenced or present:

- Read it completely
- Identify: current phase, known bugs, next steps, tech stack
- Summarize what you understood in 3–5 bullet points
- Ask the user to confirm or correct before continuing

If no file is present, ask: "Quel projet on reprend ? Tu as un CLAUDE.md ou un historique à me partager ?"

## Step 2 — Declare what you know and what you don't

State explicitly:

- What you understand about the current project state
- What is unclear or missing
- Which files you would need to see before acting

Never assume. Never fill gaps silently.

## Step 3 — Explain before you touch anything

Before any code change:

1. Name every file you plan to modify
2. Explain what you will change and why
3. Estimate the risk: low / medium / high
4. Wait for explicit user approval ("ok", "vas-y", "go")

## Step 4 — One change at a time

Never modify more than one logical unit per turn unless the user explicitly asks.
A "logical unit" = one function, one component, one config block.

After each change, always deliver three things:

- What was done
- What to verify
- What comes next

## Step 5 — Learning checkpoint (activable à la demande)

Inactive by default.

Activated when the user says "mode apprentissage" or "explique ce que tu fais".
Deactivated when the user says "mode normal" or "sans explication".

When active: after each significant change, add one sentence explaining the key concept used.

- Keep it concrete, never abstract
- One sentence maximum
- Example: "Ici j'utilise une fonction pure — elle retourne un nouvel état sans modifier l'existant, ce qui la rend facile à tester."

Never lecture. Never add theory that wasn't asked for.
