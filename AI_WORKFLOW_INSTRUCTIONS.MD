# AI Workflow Instructions

> **Purpose:** This document defines the exact development workflow and process for AI-assisted development. Follow these instructions precisely to maintain consistency across AI assistants and projects.

---

## ⚠️ CRITICAL: Instructions for AI Assistants

### TL;DR for AI Assistants

**Before ANY development work:**
1. 📖 Read this document
2. 📋 Present a plan → 🛑 WAIT for approval
3. 🔨 Implement step-by-step
4. ✅ `yarn format && yarn lint` → Fix all errors
5. 🧪 Ask developer to test → 🛑 WAIT for approval
6. 💾 Only then commit

**🚫 NEVER:**
- Skip planning or commit without testing
- Ignore the 🛑 checkpoints
- Commit with linting errors

---

**If you are an AI assistant, you MUST:**

1. **Read this entire document** before starting any development work
2. **Follow every step in order** - no skipping, no shortcuts
3. **Stop and ask** if anything is unclear or ambiguous
4. **Use the checklists** provided and confirm completion of each step
5. **Wait for user approval** at designated checkpoints (marked with 🛑)
6. **Reference this document** when the user asks you to follow the workflow

**How to use this document:**
- When starting a new task, read the relevant workflow phase
- Before committing code, review the "Testing Before Committing" checklist
- When unsure, search this document for guidance
- If this document conflicts with user instructions, ask for clarification

**The user may remind you to follow these instructions by saying:**
- "Follow the workflow"
- "Check the AI instructions"
- "Follow the process"

When you hear these phrases, **immediately re-read the relevant sections** of this document.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [AI Assistant: Non-Negotiable Rules](#-ai-assistant-non-negotiable-rules)
3. [Development Workflow](#development-workflow)
4. [Code Quality Standards](#code-quality-standards)
5. [Release Process](#release-process)
6. [Communication Style](#communication-style)
7. [Tools & Commands](#tools--commands)
8. [How to Ensure AI Assistants Follow This Document](#-how-to-ensure-ai-assistants-follow-this-document)
9. [AI Assistant Response Templates](#-ai-assistant-response-templates)

---

## Core Principles

### 1. **Always Follow the Process**

- Never skip steps
- Always create issues before branches
- Always test before committing
- Always use conventional commits
- Always follow the PR workflow

### 2. **Step-by-Step Development**

- Break down tasks into clear steps
- Present a plan before starting
- Ask clarifying questions upfront
- Execute one step at a time
- Test after each significant change

### 3. **Quality First**

- Run `yarn format` BEFORE `yarn lint`
- Fix all linting errors before committing
- Test in the browser before shipping
- No shortcuts, no "we'll fix it later"

---

## 🚨 AI Assistant: Non-Negotiable Rules

**These rules MUST be followed. No exceptions.**

### RULE 1: Never Code Without Approval
```
IF user requests a feature
THEN present a plan
THEN wait for approval (🛑 CHECKPOINT)
THEN create issue and branch
THEN implement

DO NOT start coding immediately
DO NOT skip the planning phase
```

### RULE 2: Never Commit Without Testing
```
IF implementation is complete
THEN run yarn format
THEN run yarn lint
THEN fix all errors
THEN ask developer to test (🛑 CHECKPOINT)
THEN wait for explicit approval
THEN commit

DO NOT commit without user testing
DO NOT commit with linting errors
DO NOT skip the format step
```

### RULE 3: Always Use Conventional Commits
```
IF committing code
THEN use format: type(scope): description
THEN include body with details
THEN reference issue number

DO NOT use generic commit messages
DO NOT commit without proper format
```

### RULE 4: Test After Every Change
```
IF you make a code change
THEN run yarn lint on that file
THEN check for errors immediately
THEN fix before moving on

DO NOT batch multiple changes before testing
DO NOT ignore linting warnings
```

### RULE 5: Follow the Order
```
The workflow phases MUST be followed in order:
1. Planning & Discussion (🛑 wait for approval)
2. Issue & Branch Creation
3. Implementation
4. User Testing & Verification (🛑 wait for approval)
5. Commit & Push
6. Release (when applicable)

DO NOT skip phases
DO NOT reorder phases
DO NOT combine phases without permission
```

---

## Development Workflow

### Phase 1: Planning & Discussion

**When the developer presents a feature request:**

1. **Understand the requirement fully**

   - Ask clarifying questions
   - Confirm edge cases
   - Discuss user experience implications

2. **Present a plan**

   ```
   Here's my plan:
   1. [Step 1]
   2. [Step 2]
   3. [Step 3]

   Does this approach work for you?
   ```

3. **🛑 CHECKPOINT: Wait for approval** before proceeding
   - Do NOT create issues or branches yet
   - Do NOT start coding
   - WAIT for explicit approval from the developer

### Phase 2: Issue & Branch Creation

**Always use GitHub CLI:**

```bash
# 1. Create issue (no labels initially)
gh issue create --title "Feature title" --body "Description with acceptance criteria"

# 2. Create branch from issue
gh issue develop <issue-number> --checkout

# 3. Verify you're on the correct branch
git branch --show-current

**Branch naming rules:**
- Keep feature branch names **≤ 45 characters** (including issue prefix)
- Format: `<issue-number>-<short-kebab-summary>`
- Use concise verbs/nouns (e.g., `193-doc-merge-strategy`, `205-fix-cart-totals`)
- Avoid filler words, articles, or unnecessary context
```

**Issue Template:**

```markdown
**Problem:**
[Describe the problem or need]

**Solution:**
[Describe the proposed solution]

**Acceptance Criteria:**

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

**Issue Labels:**

When creating multiple issues (e.g., from a project review), create and assign labels systematically:

```bash
# 1. Create priority labels
gh label create "priority:critical" --color "d73a4a" --description "Critical priority - must fix immediately"
gh label create "priority:high" --color "ff6b35" --description "High priority - fix soon"
gh label create "priority:medium" --color "fbca04" --description "Medium priority - fix when possible"
gh label create "priority:low" --color "0e8a16" --description "Low priority - nice to have"

# 2. Create type labels
gh label create "type:security" --color "d73a4a" --description "Security related"
gh label create "type:bug" --color "d73a4a" --description "Bug fix"
gh label create "type:feature" --color "0075ca" --description "New feature"
gh label create "type:enhancement" --color "a2eeef" --description "Enhancement to existing feature"
gh label create "type:docs" --color "0075ca" --description "Documentation"
gh label create "type:refactor" --color "5319e7" --description "Code refactoring"
gh label create "type:performance" --color "0e8a16" --description "Performance improvement"
gh label create "type:accessibility" --color "f9d0c4" --description "Accessibility improvement"

# 3. Create effort labels (Fibonacci scale)
gh label create "effort:1" --color "c2e0c6" --description "Very small effort (< 1 hour)"
gh label create "effort:2" --color "bfdadc" --description "Small effort (1-3 hours)"
gh label create "effort:3" --color "fef2c0" --description "Medium effort (3-8 hours)"
gh label create "effort:5" --color "fad8c7" --description "Large effort (1-2 days)"
gh label create "effort:8" --color "f9c5d1" --description "Very large effort (2+ days)"

# 4. Assign labels to issues
gh issue edit <issue-number> --add-label "priority:critical,type:security,effort:2"
```

**Label Guidelines:**

- **Priority**: Assign ONE priority label per issue (critical, high, medium, low)
- **Type**: Assign one or more type labels as appropriate
- **Effort**: Assign ONE effort label using Fibonacci scale (1, 2, 3, 5, 8)
  - effort:1 = Quick wins (< 1 hour)
  - effort:2 = Small tasks (1-3 hours)
  - effort:3 = Medium tasks (3-8 hours)
  - effort:5 = Large tasks (1-2 days)
  - effort:8 = Very large tasks (2+ days)

**When creating labels:**
- Use these exact colors for consistency across projects
- Create all labels at once before assigning to issues
- Batch assign labels using `&&` to chain commands efficiently

### Phase 3: Implementation

**Step-by-step execution:**

1. **Read relevant files first**

   - Use `read_file` to understand context
   - Check existing patterns
   - Identify dependencies

2. **Make changes incrementally**

   - One logical change at a time
   - Explain what you're doing
   - Show the code changes

3. **Write tests where it makes sense**

   - Write tests for complex business logic
   - Write tests for utility functions
   - Write tests for critical user flows
   - Write tests for bug fixes (regression tests)
   - Run `yarn test` to verify tests pass

4. **Test immediately after implementation**

   - Run linter: `yarn lint <file>`
   - Run tests: `yarn test` (if tests exist)
   - Check in browser if UI change
   - Fix errors before moving on

5. **Format and lint before committing**
   ```bash
   # ALWAYS in this order:
   yarn format
   yarn lint
   yarn test  # If tests exist
   ```

### Phase 4: User Testing & Verification

**CRITICAL: Always verify with the developer before committing**

Before staging any changes:

1. **Ask the developer to test**

   - "Can you please test this in the browser?"
   - "Does everything work as expected?"
   - Wait for confirmation

2. **Verify all functionality**

   - New features work correctly
   - Existing features still work (no regressions)
   - UI looks good and is responsive
   - No console errors
   - No visual bugs

3. **🛑 CHECKPOINT: Only proceed after approval**
   - WAIT for developer to confirm it works
   - Fix ALL issues found during testing
   - Do NOT commit until you receive explicit approval
   - If there are issues, fix them and ask for testing again

**⚠️ NEVER COMMIT WITHOUT USER TESTING AND APPROVAL ⚠️**

**AI Assistant: Before moving to Phase 5, you MUST:**
- [ ] Have asked the developer to test
- [ ] Have received explicit approval
- [ ] Have fixed any issues that were found
- [ ] Have run `yarn format && yarn lint` successfully

### Phase 5: Commit & Push

**Conventional Commit Format:**

```bash
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature (bumps MINOR version)
- `fix`: Bug fix (bumps PATCH version)
- `feat!` or `fix!`: Breaking change (bumps MAJOR version)
- `docs`: Documentation only
- `chore`: Maintenance tasks
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests

**Example commits:**

```bash
git commit -m "feat(checkout): prevent access with empty cart

- Add empty cart check on mount
- Redirect to homepage if empty
- Return null to prevent flash

Closes #173"
```

**Push and create PR:**

```bash
git push origin <branch-name>
gh pr create --fill
```

**PR Merge Strategy:**

- Always use GitHub's **Rebase and merge** option for feature branches
- Never squash merge (we rely on individual conventional commits for releases)
- Avoid merge commits on dev/main to keep history linear

### Phase 5: Release Process

> **⚠️ CRITICAL: You MUST run `yarn release` before creating the PR to main!**
>
> This step:
>
> - Analyzes conventional commits to determine version bump
> - Updates package.json version
> - Generates CHANGELOG.md
> - Creates a git tag
> - Commits these changes to dev
>
> **Without this step, the release will not be properly versioned!**

**Release Checklist - Follow in Order:**

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

**Version Bumping:**

- `feat:` commits → MINOR bump (2.0.0 → 2.1.0)
- `fix:` commits → PATCH bump (2.0.0 → 2.0.1)
- `feat!:` or `fix!:` → MAJOR bump (2.0.0 → 3.0.0)
- `docs:`, `chore:`, etc. → PATCH bump

**Critical: Always sync dev with main after release!**

- This prevents merge conflicts on future releases
- Keeps branch histories aligned
- Use `merge` not `reset --hard` to preserve history

### Phase 6: Hotfix Process (Production Emergencies)

**For critical bugs in production that can't wait for normal release cycle:**

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/<issue-number>-description

# 2. Fix the bug
[make changes]
yarn format
yarn lint
[test thoroughly]

# 3. Commit with fix type
git commit -m "fix(scope): critical bug description

Fixes critical production issue.

Closes #<issue-number>"

# 4. Create PR to main
git push origin hotfix/<issue-number>-description
gh pr create --base main --head hotfix/<issue-number>-description --fill

# 5. After merge to main, backport to dev
git checkout dev
git pull origin dev
git merge origin/main
git push origin dev

# 6. Clean up hotfix branch
git branch -D hotfix/<issue-number>-description
git push origin --delete hotfix/<issue-number>-description

# 7. Verify sync (should be empty)
git log --oneline origin/main..origin/dev
git log --oneline origin/dev..origin/main

# 8. Update local main
git checkout main
git pull origin main
git checkout dev
```

**Hotfix Guidelines:**

- ⚠️ Only for critical production bugs
- 🚨 Must be tested thoroughly before merge
- 🔄 Always backport to dev after deploying
- 📝 Still create GitHub issue first
- 🏷️ Use `fix:` commit type (bumps PATCH)

**When to use hotfix:**

- Production is broken
- Security vulnerability
- Data loss risk
- Critical user-facing bug

**When NOT to use hotfix:**

- Minor bugs (use normal flow)
- New features (use normal flow)
- Non-critical improvements

---

## Branch Cleanup Checklist

**After EVERY release or hotfix merge to main:**

✅ **Sync dev with main:**

```bash
git checkout dev
git pull origin dev
git merge origin/main
git push origin dev
```

✅ **Verify sync (both should be empty):**

```bash
git log --oneline origin/main..origin/dev
git log --oneline origin/dev..origin/main
```

✅ **Delete merged feature branches:**

```bash
# Local
git branch -D <branch-name>

# Remote
git push origin --delete <branch-name>

# Or use fetch --prune to clean up stale remote refs
git fetch origin --prune
```

✅ **Update local main:**

```bash
git checkout main
git pull origin main
git checkout dev
```

✅ **Verify clean state:**

```bash
git branch --all
# Should only see: dev, main, origin/dev, origin/main
```

**Why this matters:**

- Prevents merge conflicts on future releases
- Keeps repository clean and organized
- Ensures dev and main histories stay aligned
- Makes it easy to see what's in progress vs deployed

---

## Code Quality Standards

### 1. **Linting & Formatting**

**CRITICAL ORDER:**

```bash
# 1. Format FIRST
yarn format

# 2. Lint SECOND
yarn lint
```

**Never commit with linting errors.**

- **Respond immediately to IDE lint feedback**: resolve errors/warnings before making additional edits

### 2. **Testing Philosophy**

**CRITICAL: Multi-layered testing is mandatory**

**Always test before committing:**

1. **Write automated tests where appropriate**
2. **Run all tests** (`yarn test`)
3. **Lint and format** (`yarn format && yarn lint`)
4. **Manual browser testing** (test all functionality)
5. **Ask developer to verify** (wait for approval)
6. **Only commit after approval**

**Write automated tests for:**

- ✅ Complex business logic
- ✅ Utility functions
- ✅ Critical user flows
- ✅ Bug fixes (regression tests)
- ✅ API integrations
- ✅ Data transformations

**Skip automated tests for:**

- ⏭️ Simple UI components with no logic
- ⏭️ Styling-only changes
- ⏭️ Proof-of-concept code

**Testing commands:**

```bash
# Run all tests
yarn test

# Watch mode during development
yarn test:watch

# Coverage when needed
yarn test:coverage
```

**Test location:**

- Tests go in `tests/` directory
- Mirror the source structure
- Use `.test.js` or `.test.jsx` extension

**Manual testing checklist:**

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] No visual bugs
- [ ] Edge cases handled
- [ ] Existing features still work (no regressions)

**User testing (Developer):**

- Always ask: "Can you please test this in the browser?"
- Wait for confirmation before committing
- Fix any issues found
- Never skip this step

### 3. **Code Style**

**General Guidelines:**

- Follow the existing code style and patterns in the codebase
- Use the project's configured styling approach (CSS-in-JS, CSS modules, etc.)
- Follow existing patterns for imports and file organization
- Use appropriate documentation format (JSDoc, TSDoc, etc.)

**File naming:**

- Follow the project's established naming conventions
- Components: Usually PascalCase (e.g., `CheckoutForm.jsx`)
- Utilities: Usually camelCase (e.g., `formatUtils.js`)
- Check existing files for specific patterns

### 4. **Import Order**

**Follow the project's established import order. Common pattern:**

```javascript
// 1. Framework imports (React, Vue, etc.)
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

// 3. Internal modules (contexts, stores, etc.)
import { useAuth } from 'context/AuthContext';

// 4. Components
import Button from 'components/ui/Button';

// 5. Utilities and helpers
import { formatCurrency } from 'utils/formatters';
```

### 5. **Error Handling**

**Use the project's error tracking service (Sentry, LogRocket, etc.):**

```javascript
// Example with Sentry
import * as Sentry from '@sentry/react';

try {
  // code
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'ComponentName', action: 'actionName' },
    extra: { relevantData },
  });
}
```

**Development logging:**

```javascript
// Adjust based on project's env variables
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('[Component]', message);
}
```

---

## Communication Style

### 1. **Be Direct & Concise**

- No fluff or unnecessary pleasantries
- Get straight to the point
- Use bullet points and clear headings

### 2. **Show, Don't Just Tell**

- Show code changes
- Provide command examples
- Include expected outcomes

### 3. **Acknowledge Mistakes Quickly**

- If something breaks, acknowledge it immediately
- Explain what went wrong
- Fix it right away

### 4. **Use Emojis Sparingly**

- ✅ for success
- ❌ for errors
- 🎯 for goals achieved
- 🚀 for deployments
- Don't overuse

### 5. **Progress Updates**

```markdown
## What We Did:

1. ✅ Created issue #123
2. ✅ Implemented feature
3. ✅ Tested and fixed bugs
4. ✅ Created PR #124

**Next steps:** Review and merge PR
```

---

## Tools & Commands

### GitHub CLI

```bash
# Issues
gh issue create --title "Title" --body "Description"
gh issue develop <number> --checkout
gh issue edit <number> --add-label "label1,label2"
gh issue list
gh issue list --label "priority:critical"

# Labels
gh label create "name" --color "hexcode" --description "Description"
gh label list

# Pull Requests
gh pr create --fill
gh pr create --base main --head dev --fill
gh pr list
```

### Git Workflow

```bash
# Branch management
git checkout dev
git pull origin dev
git branch --show-current

# Committing
git add <files>
git commit -m "type(scope): message"
git push origin <branch>

# Releases
git push --follow-tags origin dev
```

### Yarn Commands

```bash
# Development
yarn dev                    # Start dev server
yarn format                 # Format code (run FIRST)
yarn lint                   # Lint code (run SECOND)
yarn lint:fix              # Auto-fix linting errors

# Testing
yarn test                   # Run tests
yarn test:watch            # Watch mode

# Releases (if using standard-version or similar)
yarn release               # Auto version bump
yarn release:patch         # Force patch bump
yarn release:minor         # Force minor bump
yarn release:major         # Force major bump
```

### Deployment CLI (if applicable)

```bash
# Example for Netlify
netlify env:set VAR_NAME value
netlify env:get VAR_NAME
netlify env:list

# Example for Vercel
vercel env add VAR_NAME
vercel env ls

# Adjust based on your deployment platform
```

---

## Common Patterns

### 1. **Testing Before Committing**

**CRITICAL: Multi-layered testing approach**

```bash
# 1. Write tests where appropriate
yarn test

# 2. Lint the specific file
yarn lint src/pages/Checkout.jsx

# 3. Format and lint everything
yarn format
yarn lint

# 4. Run all tests
yarn test

# 5. Manual browser testing
# - Open the feature in browser
# - Test all functionality
# - Check for console errors
# - Verify responsive design
# - Test edge cases

# 6. Ask developer to verify
# "Can you please test this? Does everything work as expected?"

# 7. Only after approval, commit
git add <files>
git commit -m "type(scope): message"
```

**Never skip user testing. Always wait for developer's approval before committing.**

### 2. **Fixing Linting Errors**

**Unused variables:**

```javascript
// Prefix with underscore
const _unusedVar = something;

// Or remove if truly unused
```

**Unused imports:**

```javascript
// Just remove them
```

**Case blocks:**

```javascript
// Wrap in braces
case 'action': {
  const variable = value;
  break;
}
```

### 3. **When Things Break**

1. **Read the error message carefully**
2. **Check the browser console**
3. **Verify variable names match context exports**
4. **Test the fix immediately**
5. **Don't commit until it works**

---

## Project-Specific Notes

> **Fill this section with project-specific details for each codebase**

### 1. **State Management**

- [State management approach: Redux, Context API, Zustand, etc.]
- [Key patterns and naming conventions]
- [Common gotchas or important exports]

### 2. **Backend/Database**

- [Backend service: Firebase, Supabase, custom API, etc.]
- [Database type: Firestore, PostgreSQL, MongoDB, etc.]
- [Environment configuration and toggles]

### 3. **Third-Party Integrations**

- [Payment providers, analytics, etc.]
- [Environment-specific configurations]
- [API endpoints and authentication patterns]

### 4. **Serverless Functions / API Routes**

- [Location in codebase]
- [Key dependencies and SDKs used]
- [CORS, timeout, or other important configurations]

### 5. **Styling Approach**

- [CSS-in-JS library, CSS Modules, Tailwind, etc.]
- [Theme system and how to access it]
- [Design system conventions]
- [File organization preferences]

### 6. **Testing**

- [Testing framework: Jest, Vitest, Cypress, etc.]
- [Testing patterns and conventions]
- [Mocking strategies]

### 7. **Build & Deployment**

- [Build tool: Vite, Webpack, etc.]
- [Deployment platform: Netlify, Vercel, AWS, etc.]
- [Environment variables and configuration]

---

## Workflow Checklist

**For every feature:**

- [ ] Understand the requirement
- [ ] Present a plan
- [ ] Get approval
- [ ] Create GitHub issue
- [ ] Create branch from issue
- [ ] Implement step-by-step
- [ ] Write tests where appropriate (`yarn test`)
- [ ] Test after each change
- [ ] Format code (`yarn format`)
- [ ] Lint code (`yarn lint`)
- [ ] Run tests (`yarn test`)
- [ ] Fix all errors
- [ ] Test in browser thoroughly
- [ ] **Ask developer to verify and test**
- [ ] **Wait for developer's approval**
- [ ] Fix any issues found during testing
- [ ] Commit with conventional commit message (only after approval)
- [ ] Push branch
- [ ] Create PR
- [ ] Wait for merge
- [ ] Create release (on dev)
- [ ] Push with tags
- [ ] Create PR to main

**Never skip steps. Never commit without user testing and approval. This process works flawlessly.**

---

## Emergency Procedures

### If Linting Fails

1. Read the error messages
2. Fix one error at a time
3. Run `yarn lint` after each fix
4. Don't commit until clean

### If Build Fails

1. Check the error in terminal
2. Check browser console
3. Verify imports are correct
4. Check for typos in variable names

### If Tests Fail

1. Read the test output
2. Fix the code, not the test
3. Ensure test expectations are correct
4. Run tests again

---

## Success Metrics

**You're doing it right when:**

- ✅ No linting errors
- ✅ No console errors in browser
- ✅ Features work as expected
- ✅ Conventional commits used
- ✅ PRs created for all changes
- ✅ Releases are clean and documented
- ✅ Developer approves for deployment

---

## Final Notes

**This workflow has been proven to work flawlessly. Follow it exactly.**

- Don't suggest shortcuts
- Don't skip testing
- Don't commit broken code
- Don't merge without review
- Don't deploy without testing

**When in doubt:**

1. Ask the developer
2. Check this document
3. Look at recent PRs for examples
4. Follow the established patterns

---

**Document Version:** 3.1.0 (AI-Enhanced)
**Last Updated:** 2025-12-23
**Maintained By:** [Developer Name]

**Changelog:**
- v3.1.0: Added comprehensive label system (priority, type, effort with Fibonacci scale) for consistent issue tracking across projects
- v3.0.0: Added AI assistant instructions, checkpoints, response templates, and enforcement mechanisms
- v2.0.0: Generalized for all projects, changed from "project lead" to "developer"
- v1.0.0: Initial version for Birreria El Semaforo

---

## Quick Reference Card

```bash
# Start new feature
gh issue create --title "Feature" --body "Description"
gh issue develop <number> --checkout

# Development cycle
[make changes]
yarn format
yarn lint
[test in browser]

# Ship it
git add <files>
git commit -m "feat(scope): description"
git push origin <branch>
gh pr create --fill

# Release (after PRs merged to dev)
git checkout dev && git pull
yarn release                              # ⚠️ REQUIRED - Creates version, changelog, tag
git push --follow-tags origin dev        # Push release commit + tag
gh pr create --base main --head dev --fill
```

**Remember: This process works. Follow it exactly. No shortcuts.**

---

## 🤖 How to Ensure AI Assistants Follow This Document

### For Developers: Setting Up Your AI Assistant

**At the start of each session, use this prompt:**

```
Please read the AI_WORKFLOW_INSTRUCTIONS.MD file in this repository.
This document contains the complete development workflow you must follow.
Confirm that you've read it and will follow each phase in order.
```

**When the AI skips steps, use these reminders:**

```
Stop. Follow the workflow document. What phase are we in?
```

```
Have you asked me to test this yet? Check Phase 4 of the workflow.
```

```
Don't commit yet. Review the testing checklist first.
```

### For AI Assistants: Self-Check Questions

**Before creating issues/branches:**
- Have I presented a plan and received approval?
- Have I asked clarifying questions?

**Before committing:**
- Have I run `yarn format && yarn lint`?
- Have I asked the developer to test?
- Have I received explicit approval?
- Are there any linting errors?

**Before creating a PR:**
- Is the branch pushed?
- Have all tests passed?
- Is the commit message following conventional format?

### Adding to Claude Projects (Recommended)

If using Claude.ai Projects, add this to your project instructions:

```
DEVELOPMENT WORKFLOW:
- Always read and follow AI_WORKFLOW_INSTRUCTIONS.MD in the repository
- Never skip testing phases or commit without user approval
- Use conventional commits and follow the branching strategy
- Stop at checkpoints marked with 🛑 and wait for approval
```

### Integration with GitHub

**Add to `.github/CONTRIBUTING.md`:**
```markdown
## AI-Assisted Development

This project uses AI assistants for development. All AI assistants must follow
the workflow defined in `AI_WORKFLOW_INSTRUCTIONS.MD`. Key requirements:

- Present plans before implementation
- Wait for approval at checkpoints
- Never commit without user testing
- Follow conventional commit format
```

### Validation Script (Optional)

Create a git hook to validate commits:

```bash
# .git/hooks/commit-msg
#!/bin/bash
# Validate conventional commit format
commit_msg=$(cat "$1")
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|chore|refactor|perf|test|feat!|fix!)(\(.+\))?: .+"; then
    echo "Error: Commit message must follow conventional commit format"
    echo "See AI_WORKFLOW_INSTRUCTIONS.MD for details"
    exit 1
fi
```

---

## 📝 AI Assistant Response Templates

**Use these templates to communicate at key checkpoints:**

### After Receiving a Feature Request
```
I understand you want to [summarize request].

Let me make sure I understand correctly:
- [Key requirement 1]
- [Key requirement 2]
- [Edge case or clarification question]

Here's my plan:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Does this approach work for you?

🛑 Waiting for your approval before proceeding.
```

### After Implementation, Before Committing
```
I've completed the implementation. Here's what I did:
- [Change 1]
- [Change 2]
- [Change 3]

I've run `yarn format && yarn lint` - no errors.

🛑 Can you please test this in the browser?
- Test [specific functionality]
- Check [specific edge case]
- Verify [specific behavior]

Does everything work as expected?
```

### When Receiving Test Feedback with Issues
```
Thank you for testing. I'll fix these issues:
- [Issue 1] - [how I'll fix it]
- [Issue 2] - [how I'll fix it]

[Make fixes]

I've fixed the issues and re-run `yarn format && yarn lint`.

🛑 Can you please test again to confirm everything works?
```

### When Ready to Commit (After Approval)
```
Great! I have your approval. I'll now:
1. Stage the changes
2. Create a commit with message: "feat(scope): description"
3. Push the branch
4. Create a PR

[Proceed with commit]
```

### If Tempted to Skip a Step
```
⚠️ I need to stop here and follow the workflow.

According to AI_WORKFLOW_INSTRUCTIONS.MD, I should:
- [What the workflow says to do]
- [Checkpoint that needs approval]

Let me do that correctly.
```
