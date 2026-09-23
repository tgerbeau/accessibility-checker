---
description: "Analyser un rgaa-report.json : prioriser les violations par cause racine et proposer des correctifs HTML/ARIA"
name: "Analyse rapport RGAA"
argument-hint: "Chemin du rapport (ex. rgaa-report/rgaa-report.json)"
agent: "agent"
---
Analyse le rapport JSON indiqué (par défaut [rgaa-report/rgaa-report.json](../../rgaa-report/rgaa-report.json)) et produis une synthèse actionnable :

1. **Regrouper par cause racine** plutôt que par page : une même violation (même règle axe + même extrait HTML ou même composant) présente sur N pages = un seul correctif.
2. **Prioriser** : d'abord les violations `critical` et `serious` (elles font échouer la CI avec le seuil par défaut), puis par nombre d'occurrences.
3. Pour chaque groupe, fournir :
   - le critère RGAA et la thématique concernés ;
   - l'extrait HTML fautif ;
   - un **correctif concret** (HTML/ARIA corrigé), en privilégiant le HTML natif à ARIA ;
   - les pages affectées.
4. Signaler les **faux positifs probables** (ex. contraste sur du texte décoratif, éléments masqués) sans les corriger — proposer le cas échéant `ignoreRules` dans la config, avec justification.
5. Terminer par un tableau récapitulatif : groupe, critère RGAA, sévérité, occurrences, effort estimé (faible/moyen/élevé).

Ne modifie aucun fichier : cette analyse est destinée à être partagée (commentaire de PR, ticket).
