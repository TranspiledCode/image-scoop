# Image Scoop

A modern image processing web application built with React and Netlify Functions. Process and optimize images in multiple formats with batch processing capabilities.

## Features

- 🖼️ **Multiple Export Formats**: JPEG, PNG, WebP
- 📦 **Batch Processing**: Process multiple images at once
- 🎨 **Modern UI**: Drag-and-drop interface with real-time feedback
- ⚡ **Serverless**: Powered by Netlify Functions
- 🔧 **Image Optimization**: Automatic resizing and optimization

## Development

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Netlify CLI

### Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

**⚠️ IMPORTANT:** Always access the app at `http://localhost:8888` (Netlify Dev proxy).

- ✅ **Use:** `http://localhost:8888` - Full functionality with Netlify Functions
- ❌ **Don't use:** `http://localhost:1234` - Parcel only, functions won't work

The Netlify dev server proxies requests to Parcel (running on 1234) and provides access to serverless functions.

### Scripts

- `yarn dev` - Start Netlify development server
- `yarn build` - Build for production
- `yarn format` - Format code with Prettier
- `yarn lint` - Lint code with ESLint

## Release Process

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) for automated versioning and changelog generation based on [Conventional Commits](https://www.conventionalcommits.org/).

### Version Bumping Rules

- `feat:` commits → **MINOR** bump (2.0.0 → 2.1.0)
- `fix:` commits → **PATCH** bump (2.0.0 → 2.0.1)
- `feat!:` or `fix!:` → **MAJOR** bump (2.0.0 → 3.0.0)
- `docs:`, `chore:`, etc. → **PATCH** bump

### Release Checklist

Follow these steps **in order** when creating a release:

```bash
# ✅ Step 1: Switch to dev and pull latest
git checkout dev
git pull origin dev

# ✅ Step 2: Create release (REQUIRED - DO NOT SKIP!)
yarn release          # Auto-detects version bump from commits
# OR force specific version:
# yarn release:patch  # 2.0.0 → 2.0.1 (for fixes)
# yarn release:minor  # 2.0.0 → 2.1.0 (for features)
# yarn release:major  # 2.0.0 → 3.0.0 (for breaking changes)

# ✅ Step 3: Push release commit and tags
git push --follow-tags origin dev

# ✅ Step 4: Create PR to main for production deployment
gh pr create --base main --head dev --fill

# ✅ Step 5: Wait for PR approval and merge
gh pr view <PR-number> --json state,mergedAt

# ✅ Step 6: IMMEDIATELY after merge - Sync dev with main
git checkout dev
git pull origin dev
git merge origin/main
git push origin dev

# ✅ Step 7: Verify branches are synced (output should be empty)
git log --oneline origin/main..origin/dev
git log --oneline origin/dev..origin/main

# ✅ Step 8: Clean up merged feature branches
git branch -D <feature-branch-name>           # Delete local
git push origin --delete <feature-branch-name> # Delete remote

# ✅ Step 9: Update local main
git checkout main
git pull origin main

# ✅ Step 10: Return to dev for next work
git checkout dev
```

### Release Scripts

- `yarn release` - Auto-detect version bump from commits
- `yarn release:patch` - Force patch version bump
- `yarn release:minor` - Force minor version bump
- `yarn release:major` - Force major version bump

### What Happens During Release

1. Analyzes conventional commits since last release
2. Determines appropriate version bump
3. Updates `package.json` version
4. Generates/updates `CHANGELOG.md`
5. Creates a git commit with the changes
6. Creates a git tag with the new version

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `chore`: Maintenance tasks
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests

**Example:**
```bash
git commit -m "feat(processor): add WebP export support

- Add WebP format to export options
- Update image processor to handle WebP
- Add WebP quality settings

Closes #42"
```

## Deployment

The application is deployed on Netlify:

- **Production**: Deployed from `main` branch
- **Development**: Deployed from `dev` branch

### Manual Deployment

```bash
# Build the application
yarn build

# Deploy to Netlify (requires Netlify CLI authentication)
netlify deploy --prod
```

## Project Structure

```
image-scoop/
├── Netlify/
│   └── functions/
│       └── process-image.js    # Image processing function
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page components
│   ├── context/                # React context providers
│   └── style/                  # Styling
├── .versionrc.json             # Release configuration
├── CHANGELOG.md                # Auto-generated changelog
└── package.json                # Project dependencies
```

## License

MIT
