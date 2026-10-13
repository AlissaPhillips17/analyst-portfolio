# Ali’s Analytics Rush

An interactive product analyst portfolio game by Alissa Phillips.

## Play

The game runs from `index.html`; the original Analytics Lab is at `lab.html`.
For local preview, run `python3 -m http.server 8000` from this folder and open http://localhost:8000/. No dependencies or API keys are required.

## Gameplay

Serve stakeholder tickets before patience expires: repair a dashboard connection, fix a storefront price, or build and test a feature. Push validated work to prod, wait for the station to be ready, then deliver.

## Project files

- `rush-engine.js`: queue, timers, patience, jobs and scoring
- `rush.js`: game controls and mini-games
- `mini-logic.js`: validation gates
- `rush.css` and `arcade.css`: responsive interface and retro-future design
- `assets/`: illustrated office and Ali character
- `lab.html`, `app.js`, `logic.js`, `styles.css`: original interactive case studies

## Controls

Click a stakeholder, then the matching station. Keys 1/2/3 select stations; P pauses. Escape closes a task. Inputs accept normal keyboard entry. Drag interactions also offer click controls.

## Hosting

This is a static website. If GitHub Pages is enabled for the parent `analyst-portfolio` repository with its main branch and root folder, the game can be opened at `https://alissaphillips17.github.io/analyst-portfolio/arcade/`. That URL becomes live only after Pages is configured and deployed.

## Transparency

All scenarios and storefront data are synthetic. The illustrations were created with AI assistance; the code was developed with AI assistance. The game and case studies are demonstrations rather than employer deliverables.
