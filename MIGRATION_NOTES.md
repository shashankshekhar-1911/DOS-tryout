# Migration from CRACO to Vite

## Changes Made

### 1. Package Dependencies
- **Removed:**
  - `react-scripts` (replaced by Vite)
  - `@craco/craco` (replaced by Vite)
  - `cra-template` (no longer needed)
  - `@babel/plugin-transform-private-property-in-object` (handled by Vite)
  - `dotenv` (Vite handles env vars natively)

- **Added:**
  - `vite` - Build tool and dev server
  - `@vitejs/plugin-react` - React plugin for Vite
  - `@types/react` and `@types/react-dom` - TypeScript types
  - `eslint-plugin-react-refresh` - ESLint plugin for React Fast Refresh

### 2. Configuration Files
- **Created:** `vite.config.js` - Replaces `craco.config.js`
- **Moved:** `index.html` from `public/` to root directory (Vite requirement)
- **Updated:** `tailwind.config.js` - Updated content paths
- **Kept:** `jsconfig.json` - Path aliases still work with Vite

### 3. Scripts Updated
- `npm start` → `npm run dev` (development server)
- `npm run build` → `npm run build` (same, but uses Vite)
- `npm test` → Removed (add testing framework if needed)
- Added: `npm run preview` (preview production build)

### 4. Environment Variables
- Vite uses `.env` files like Create React App
- **Important:** Environment variables must be prefixed with `VITE_` to be exposed to the client
- Example: `VITE_API_URL=https://api.example.com`
- Access in code: `import.meta.env.VITE_API_URL`

### 5. Build Output
- Output directory changed from `build/` to `dist/`
- Already configured in `.gitignore`

## Features Not Migrated

### Webpack-Specific Plugins
The following features from `craco.config.js` were webpack-specific and are not available in Vite:

1. **Visual Edits Plugin** (`plugins/visual-edits/`)
   - This was a custom webpack plugin
   - Would need to be rewritten as a Vite plugin if needed

2. **Health Check Plugin** (`plugins/health-check/`)
   - This was a webpack dev server middleware
   - Can be reimplemented as Vite middleware if needed

These plugins can be reimplemented using Vite's plugin API if required.

## Next Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Benefits of Vite

- ⚡ **Faster dev server** - Native ESM, no bundling in dev
- 🚀 **Faster builds** - Uses esbuild for dependencies, Rollup for app code
- 📦 **Smaller bundle size** - Better tree-shaking and code splitting
- 🔧 **Better DX** - Hot Module Replacement (HMR) with React Fast Refresh
- 🎯 **Modern tooling** - Built on modern web standards

## Troubleshooting

### If you see import errors:
- Make sure all environment variables are prefixed with `VITE_`
- Check that path aliases (`@/`) are working (configured in `vite.config.js`)

### If styles aren't loading:
- Ensure `index.css` is imported in `src/index.js`
- Check that Tailwind is configured correctly in `tailwind.config.js`

### If build fails:
- Clear `node_modules` and `package-lock.json`, then reinstall
- Check for any remaining references to `react-scripts` or `craco`
