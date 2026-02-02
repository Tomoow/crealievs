# Getting Started with Your Design System

## 🚀 How to Start Storybook

Open your terminal in this folder and run:

```bash
npm run storybook
```

This will:
1. Start a local server
2. Open Storybook in your browser (usually at http://localhost:6006)
3. Show you all your components with documentation

**Note:** The first time might take a minute to start. You'll see it compiling in the terminal.

To stop Storybook, press `Ctrl + C` in the terminal.

## 📁 What All These Files Are (Simple Explanation)

### **node_modules/** - The Toolbox
- **What it is:** All the tools (React, Storybook, TypeScript, etc.) your project needs
- **Think of it as:** A big toolbox with all your tools
- **Size:** It's HUGE (hundreds of megabytes) because it contains React, Storybook, and all their dependencies
- **Should you edit it?** NO! Never touch anything in here
- **Can you delete it?** Yes, but run `npm install` to get it back
- **Why so many folders?** Each tool needs other tools, creating a chain

### **src/** - YOUR Code (This is what you care about!)
- `src/components/` - Your design system components (Badge, Button, etc.)
- `src/styles/` - Your design tokens (colors, spacing, fonts)

### **.storybook/** - Storybook Settings
- Configuration files that tell Storybook how to work
- You probably won't need to edit these

### **Configuration Files** (in root folder)
- `package.json` - List of tools needed + commands to run things
- `tsconfig.json` - TypeScript settings (makes code safer)
- `vite.config.ts` - Build tool settings
- `.gitignore` - Tells Git what to ignore (like node_modules)

## 🎯 What You'll Actually Work With

**Files you'll edit:**
- `src/components/Badge/Badge.tsx` - Badge component code
- `src/components/Badge/Badge.css` - Badge styling
- `src/styles/tokens.css` - Your design tokens

**Files you'll create:**
- New components in `src/components/` (Button, Input, Card, etc.)

## ❓ Common Questions

**Q: Why is node_modules so big?**
A: It contains React (a big framework), Storybook (documentation tool), TypeScript, and hundreds of other tools. Each tool needs other tools. It's normal!

**Q: Do I need to understand node_modules?**
A: No! Just ignore it. It's like the engine of a car - you don't need to understand it to drive.

**Q: Can I delete node_modules to save space?**
A: Yes! Run `npm install` to get it back. It's just downloaded tools.

**Q: Should I commit node_modules to Git?**
A: No! That's why `.gitignore` exists. Anyone can recreate it with `npm install`.

## 🛠️ Useful Commands

- `npm run storybook` - Start Storybook (view your components)
- `npm run build` - Build your project for production
- `npm install` - Install/update all tools (if node_modules is missing)
