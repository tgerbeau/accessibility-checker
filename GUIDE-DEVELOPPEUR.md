# Guide développeur — Tester l'accessibilité RGAA de votre plateforme

`rgaa-ci` analyse automatiquement vos pages web et détecte les violations
des critères **RGAA automatisables** (contrastes, alternatives d'images,
étiquettes de formulaires, structure…). Il bloque vos pull requests en cas
de régression et poste un rapport directement dans la PR.

> ⚠️ L'outil couvre ~30 % des critères RGAA. Un pipeline vert ≠ site conforme.
> C'est un filet anti-régression, pas un audit.

---

## 1. Essayer en 2 minutes (en local)

```bash
git clone https://github.com/tgerbeau/accessibility-checker
cd accessibility-checker
npm install
node bin/rgaa-ci.js --url https://ma-plateforme.fr
```

Ouvrez ensuite `rgaa-report/rgaa-report.html` dans un navigateur :
chaque violation y figure avec le code HTML fautif et comment la corriger.

---

## 2. Intégrer à votre dépôt GitHub (2 fichiers à créer)

### Fichier 1 : `rgaa.config.json` (à la racine de votre projet)

Listez 3 à 10 pages **aux gabarits différents** (accueil, formulaire,
liste de résultats, page de contenu…) :

```json
{
  "urls": [
    "https://recette.ma-plateforme.fr/",
    "https://recette.ma-plateforme.fr/connexion",
    "https://recette.ma-plateforme.fr/recherche"
  ],
  "failOn": "serious"
}
```

### Fichier 2 : `.github/workflows/rgaa.yml`

```yaml
name: Accessibilité RGAA
on: [pull_request]

permissions:
  contents: read
  pull-requests: write

jobs:
  rgaa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: tgerbeau/accessibility-checker@v1
        with:
          config: rgaa.config.json
```

**C'est terminé.** À chaque pull request :

- ✅ pas de violation au-dessus du seuil → job vert ;
- ❌ violations détectées → job rouge + **commentaire automatique dans la PR**
  avec le détail par critère RGAA + rapports téléchargeables en artefact.

---

## 3. Options utiles

| Besoin | Solution |
|---|---|
| Adoption en douceur | `"failOn": "critical"` d'abord, puis durcir vers `serious` / `any` |
| Tolérer N violations | `"maxViolations": 5` |
| Beaucoup de pages | `"sitemap": "https://ma-plateforme.fr/sitemap.xml"` + `"maxPages": 25` |
| Recette protégée par jeton | `"httpHeaders": { "Authorization": "Bearer …" }` |
| Recette protégée par mot de passe | `"basicAuth": { "username": "…", "password": "…" }` |
| Ignorer une règle (faux positif assumé) | `"ignoreRules": ["color-contrast"]` |
| Appli non déployée | Démarrez-la dans un step précédent, puis `"urls": ["http://localhost:3000"]` |

Toutes les options : voir le [README](README.md).

---

## 4. Lire les résultats

- **Commentaire de PR** : synthèse par sévérité et par critère RGAA ;
- **`rgaa-report.html`** (artefact du job) : rapport détaillé, avec pour chaque
  violation le sélecteur CSS, l'extrait HTML et le correctif attendu ;
- **`rgaa-report.json`** : exploitable par vos propres scripts.

Codes de sortie : `0` = OK, `1` = seuil dépassé, `2` = erreur (page inaccessible…).

---

## 5. Questions fréquentes

**Le job échoue dès l'installation ?**
Vérifiez Node ≥ 18. Le binaire Cypress (~200 Mo) est mis en cache automatiquement
par l'action après le premier run.

**Une violation est un faux positif ?**
Ajoutez la règle axe concernée dans `ignoreRules` avec un commentaire de revue
expliquant pourquoi.

**Le site est une SPA, certaines pages semblent vides ?**
L'analyse se fait après chargement de la page. Les contenus qui n'apparaissent
qu'après interaction (modales, menus…) ne sont pas couverts : ils relèvent de
l'audit manuel.

**Qui contacter ?**
Ouvrez une issue sur le dépôt [tgerbeau/accessibility-checker](https://github.com/tgerbeau/accessibility-checker/issues).
