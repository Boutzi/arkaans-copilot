---
name: project-stats-improvement
description: Prochaine tâche — améliorer la commande /stats de Boutzi
metadata:
  type: project
---

Améliorer `/stats` (commande réservée à Boutzi via BOUTZI_ID).

Idées à explorer :
- Nombre de serveurs utilisant le bot (déjà présent)
- Nombre total d'utilisateurs sur chaque serveur listé
- Nombre de canaux sources configurés par serveur
- Éventuellement : nombre de canaux temporaires actifs en ce moment

**Why:** Boutzi veut plus de visibilité sur l'usage réel du bot en prod.
**How to apply:** Enrichir l'embed existant dans `src/commands/boutzi/stats.ts` avec des requêtes Prisma + données Discord.js (guild.memberCount, etc.)
