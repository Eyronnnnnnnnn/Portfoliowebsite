# Portfolio source

- `App.tsx`: page composition, theme, project filtering, and expandable credentials.
- `components/`: contribution calendar, decorative robot companions, and project cards.
- `hooks/useContributions.ts`: live activity request, validation, timeout, retry, and cleanup.
- `data/portfolio.ts`: editable projects, experience, education, credentials, skills, and GitHub username.
- `assets/photos/profile.png`: your profile photo. Replace this file to change the portrait.
- `index.css`: shared design tokens, layout, responsive styling, and reduced-motion rules.
- `imports/`: retained original image assets.

The calendar fits its container without horizontal scrolling. It displays actual API results and an explicit unavailable state if the request fails. Its slider provides keyboard and touch access to individual dates.

Project illustrations are decorative, not application screenshots. Existing project, experience, and certificate content was retained; verify it before publishing. Education placeholder program/dates are excluded from the rendered page until filled in.

From the project root, run `npm run build` for a production build and `npx tsc --noEmit` for TypeScript validation.
