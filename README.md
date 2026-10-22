# Slate Workspace

Dependency-free static study workspace. All browser modules and data are deployed at the repository root so it works at any GitHub Pages project URL.

## Layout
- index.html and app.css: page shell and responsive styles
- boot.js: parallel JSON loading and startup recovery
- app.js: study, exam, navigation and result review
- core.js: deterministic shuffle and HTML escaping
- storage.js: validated browser-local progress
- documents.js: on-demand document viewer
- questions.json and references.json: 103 questions and source evidence
- image files: externally loaded exhibits
- reference-*.bin: three lossless pieces of the original PDF (joined only on opening documentation)

Run with `python3 -m http.server 8080` and open http://localhost:8080.

Published with GitHub Pages from main / root. There are no runtime packages, trackers or third-party fonts. Progress is local to each browser and origin. Neutral branding and robots.txt discourage indexing but do not restrict access. Supplied questions and answer keys are preserved; content is not independently verified.
