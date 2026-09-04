# rgaa-ci — Tests d'accessibilité RGAA automatisés pour CI

Outil en ligne de commande qui exécute les tests d'accessibilité **automatisables du RGAA 4.1**
(environ 30 % des critères) sur une liste de pages web, et fait échouer le pipeline CI
en cas de violations.

Il s'appuie sur [axe-core](https://github.com/dequelabs/axe-core) (moteur de référence,
locale française) piloté par **Cypress** (via [cypress-axe](https://github.com/component-driven/cypress-axe)),
avec une **table de correspondance règles axe → critères RGAA** ([src/rgaa-mapping.js](src/rgaa-mapping.js)).

> ⚠️ Les tests automatiques ne couvrent qu'une partie du RGAA. Un audit manuel reste
> indispensable pour établir une déclaration d'accessibilité.

## Installation

```bash
npm install
```

Le binaire Cypress est téléchargé automatiquement à l'installation.
Pour ouvrir l'interface Cypress en local : `npm run cypress:open`.

## Utilisation

```bash
# URLs en ligne de commande
node bin/rgaa-ci.js --url https://mon-site.fr --url https://mon-site.fr/contact

# Ou via un fichier de configuration
node bin/rgaa-ci.js --config rgaa.config.json
```

### Options

| Option | Description | Défaut |
|---|---|---|
| `--url <url>` | URL à analyser (répétable) | — |
| `--sitemap <url>` | URL d'un sitemap.xml : ses pages sont ajoutées à l'analyse (index de sitemaps supportés) | — |
| `--max-pages <n>` | Nombre max de pages issues du sitemap | `25` |
| `--config <fichier>` | Fichier de configuration JSON | — |
| `--output <dossier>` | Dossier des rapports | `rgaa-report` |
| `--fail-on <niveau>` | Seuil d'échec : `critical`, `serious`, `moderate`, `minor`, `any` | `serious` |
| `--max-violations <n>` | Tolérance d'occurrences au-dessus du seuil | `0` |
| `--viewport <LxH>` | Taille du viewport | `1280x720` |
| `--timeout <ms>` | Timeout de chargement | `30000` |
| `--no-html` | Désactive le rapport HTML | — |
| `--quiet` | Sortie console minimale | — |

### Fichier de configuration

Voir [rgaa.config.json](rgaa.config.json). Champs supplémentaires disponibles :

- `ignoreRules` : liste de règles axe à désactiver (ex. `["color-contrast"]`) ;
- `httpHeaders` : en-têtes HTTP à envoyer (ex. jeton d'accès à un environnement de recette) ;
- `basicAuth` : `{ "username": "...", "password": "..." }`.

### Codes de sortie

| Code | Signification |
|---|---|
| `0` | Aucun dépassement du seuil |
| `1` | Violations au-delà du seuil → le pipeline échoue |
| `2` | Erreur d'exécution (config invalide, pages inaccessibles) |

## Rapports

Deux rapports sont générés dans le dossier de sortie :

- `rgaa-report.json` : exploitable en CI (par exemple pour un commentaire de merge request) ;
- `rgaa-report.html` : rapport lisible avec critères RGAA, thématiques, sévérités et extraits HTML fautifs.

## Intégration CI

- **GitHub Actions** : [.github/workflows/accessibility.yml](.github/workflows/accessibility.yml)
  (déclenchement sur push/PR, rapports publiés en artefacts).
- **GitLab CI** : [.gitlab-ci.yml](.gitlab-ci.yml) (image Cypress officielle, artefacts 30 jours).

Adaptez `rgaa.config.json` avec les URLs de votre environnement de recette. Pour tester une
application non déployée, démarrez-la dans une étape précédente du pipeline puis pointez
les URLs vers `http://localhost:<port>`.

## Couverture RGAA

Politique « tests solides » : seules sont mappées les règles axe taguées WCAG A/AA
(réellement exécutées) et dont une violation prouve objectivement l'échec du critère.
Les critères reposant sur un jugement humain (pertinence d'une alternative, d'une
étiquette, d'un intitulé de lien, caractère décoratif d'une image, ordre de
tabulation…) ne sont **pas** revendiqués comme couverts.

Critères vérifiés (partiellement) : 1.1, 2.1, 2.2, 3.1, 3.2, 4.3, 4.10, 5.7, 6.2,
7.1, 7.3, 8.2–8.5, 8.8, 9.3, 10.4, 10.12, 11.1, 11.13, 12.7, 13.1, 13.8.

Le détail règle par règle se trouve dans [src/rgaa-mapping.js](src/rgaa-mapping.js).
