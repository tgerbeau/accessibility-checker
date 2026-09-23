---
description: "Ajouter ou réviser une correspondance règle axe-core → critère RGAA dans le mapping, en respectant la politique « tests solides »"
name: "Ajout critère RGAA"
argument-hint: "Règle axe ou critère RGAA à couvrir (ex. 'target-size' ou '13.11')"
agent: "agent"
---
Ajoute la correspondance demandée dans `AXE_TO_RGAA` ([src/rgaa-mapping.js](../../src/rgaa-mapping.js)) en suivant ce processus :

1. **Vérifier l'éligibilité** de la règle axe :
   - elle doit être taguée WCAG A ou AA (pas uniquement best-practice, sinon elle n'est jamais exécutée par le runner) ;
   - une violation doit prouver **objectivement** l'échec du critère RGAA — refuser tout critère de pertinence nécessitant un jugement humain (1.2, 1.3, 3.3, 6.1, 8.7, 9.1, 9.2, 11.2, 11.7, 12.8…). Si la règle n'est pas éligible, expliquer pourquoi et s'arrêter.
2. **Identifier** le ou les critères RGAA 4.1 exacts et la thématique officielle (Images, Cadres, Couleurs, Multimédia, Tableaux, Liens, Scripts, Éléments obligatoires, Structuration, Présentation, Formulaires, Navigation, Consultation).
3. **Insérer** l'entrée dans la section de la bonne thématique, en respectant l'alignement et le style des entrées existantes, avec un commentaire seulement si l'exclusion ou le rattachement n'est pas évident.
4. **Valider** en lançant un audit sur une page de test : `node bin/rgaa-ci.js --url <url>` et vérifier que le critère apparaît correctement dans `rgaa-report.json` (id RGAA, thématique, sévérité).
5. **Mettre à jour** la documentation si le README mentionne le nombre de critères couverts.
