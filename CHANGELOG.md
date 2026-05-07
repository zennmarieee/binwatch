# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- Extracted the public student lookup into a dedicated component for cleaner homepage structure
- Moved mock student lookup records into a separate data module (`data/publicStudentLookup.ts`)
- Refined the public lookup result layout to better balance identity, stats, and recent activity

### Fixed

- Loaded Leaflet map preview client-side only to avoid `window is not defined` during SSR
- Removed the global Leaflet height override that was collapsing the map container
- Stabilized the map preview container sizing so the campus map renders reliably on the homepage

## [0.2.0] - 2026-05-06

### Added

- Integrated Leaflet.js for interactive campus map preview (`components/MapPreview.tsx`)
- Added public overview map of University of Science and Technology of Southern Philippines (USTP)
- Leaflet CSS import and global container styling for proper clipping and rendering
- Subtle circle marker on map to indicate campus center

### Changed

- Reordered homepage sections: public student lookup now appears above "How It Works" for improved mobile UX
- Refined card shadows for better visual hierarchy (softer mobile, slightly stronger desktop)
- Made card shadows responsive with media query (`sm:` breakpoint)
- Updated map preview section with locked, non-interactive Leaflet map (no panning/zooming)

### Improved

- Leaflet container clipping and overflow handling to prevent scattered tiles
- Multiple `invalidateSize()` calls to stabilize tile rendering in rounded containers
- Bounded map view to prevent panning outside campus area

## [0.1.0] - 2026-05-06

### Added

- Initialized Next.js project with TypeScript and Tailwind CSS
- Set up project metadata and homepage layout
- Added styled header and hero section
- Installed three.js, @react-three/fiber, and @react-three/drei for 3D model support
- Provided guidance for 3D model integration

### Fixed

- Resolved initial dependency conflicts between React and Next.js
- Updated Next.js to latest version for compatibility

### Notes

- Vulnerabilities in some dependencies remain (moderate severity, not critical for MVP)
- Project documentation and design philosophy added
