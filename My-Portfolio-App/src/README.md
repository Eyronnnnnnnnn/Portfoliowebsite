# Portfolio source

The original centered profile, floating navigation, glass cards, ambient gradients, and subpages are preserved.

- `App.tsx`: original page layout, navigation, and section composition.
- `components/ContributionGraph.tsx`: responsive monochrome activity dots, with no horizontal scroll.
- `components/PremiumRobot.tsx` and `PremiumDrone.tsx`: original animated companions with refined materials.
- `hooks/useContributions.ts`: real GitHub activity, response validation, timeout, and retry.
- `data/portfolio.ts`: editable projects, experience, education, certificates, and skills.
- `theme/palette.ts`: original light and dark palettes.
- `assets/photos/profile.png`: replace this image with your portrait, keeping the filename.
- `index.css`: shared font and responsive refinements.
- `imports/`: retained original images.

The graph only displays real API data. It shows an unavailable message if the request fails, rather than generating contributions.

Run `npm run build` and `npx tsc --noEmit` from the project root to validate changes.
