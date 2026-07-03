# Auburn Laboratory Astrophysics Website

This is a low-maintenance static site. Most edited content lives in `site.js`; recent papers and research-term data live in `data/papers.json`.

## Editing the Site

- Edit people, summaries, profile links, facilities, collaborations, and hero slides in `site.js`.
- Edit layout and colors in `styles.css`.
- Edit page structure in `index.html`.
- Store local images in `assets/`.
- Do not commit ADS API tokens. Use repository secrets or a local environment variable.

To preview locally from this folder:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## GitHub Setup

1. Create a GitHub repository for this folder.
2. Push the contents of this folder as the repository root.
3. In GitHub, invite group members through repository settings.
4. If using GitHub Pages, set Pages to deploy from the repository root on the default branch.
5. Add a repository secret named `ADS_API_TOKEN` so the scheduled paper update can run.

## Automatic ADS Paper Updates

The public page never calls NASA ADS directly, because ADS requires a private API token. Instead, run:

```bash
ADS_API_TOKEN=your-token node scripts/update-papers.mjs
```

The script searches NASA ADS for the group roster and writes 10 recent matching papers to `data/papers.json` and `data/papers.js`.
It also ensures that each PI listed in `principalInvestigators` has at least one paper represented when ADS returns one.
The same run builds the research-term word cloud from titles, abstracts, and keywords in the latest 100 matching ADS records.

For GitHub Pages, add a repository secret named `ADS_API_TOKEN`. The included workflow in `.github/workflows/update-papers.yml` refreshes the JSON weekly and commits the result.

To tune the search, edit the `groupMembers` list or `adsQuery` in `scripts/update-papers.mjs`.

## Hero Images

Hero images are stored locally in `assets/hero/` so the page does not hotlink remote image URLs:

- `comet-neowise.jpg`: Middle panel crop from `Full Res (For Display).png`, labeled November 9, 2025.
- `swift-observatory.jpg`: Converted from `260626-nasa-swift-ww-1729-00d9e0.webp`, Swift spacecraft above Earth.
- `diii-d-tokamak.jpg`: DIII-D tokamak interior, Rswilcox via Wikimedia Commons, CC BY-SA 4.0.
- `astronomy-terrace.jpg`: Converted from `Terrace.jpg`, Auburn astronomy terrace with telescopes.

DIII-D is a tokamak rather than a stellarator. If a stellarator image is preferred later, replace the file and update the hero slide entry in `site.js`.

## People Photos

People photos are stored locally in `assets/people/` so the site does not hotlink Auburn image URLs. The current photos were downloaded from official Auburn Physics/COSAM pages:

- `physics-faculty/fogle/headshot.jpg`
- `physics-faculty/loch/stuart_loch.jpg`
- `physics-faculty/gall/amy_gall_picture.jpg`
- `physics-faculty/bodewits/dennis-bodewits.jpg`
- `physics-faculty/bromley/steven_bromley.jpg`
- `physics-postdocs/images/john_noonan.jpg`
- `resources/physics/gallery/student-presenting-gallery.jpg` for Zexi Xing

Shawn Oset was not present on the current Auburn Physics graduate-student page I checked, and Patrick Flint's entry used `src="/"` rather than a usable headshot. Their cards intentionally fall back to initials until a real Auburn-hosted photo is available.
