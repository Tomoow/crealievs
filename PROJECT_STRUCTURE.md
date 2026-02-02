# Project Structure Explanation

This document explains what each folder and file does in simple terms.

## 📁 What I Added to Your Project

### **node_modules/** folder
**What it is:** This is where all the "tools" (called "packages" or "dependencies") are stored that your project needs to work.

**Think of it like:** A toolbox that contains all the tools (React, Storybook, TypeScript, etc.) needed to build your design system.

**Important:** You should NEVER edit anything inside this folder. It's automatically created when you run `npm install`. You can ignore it - it's like a black box that just works.

**Why it's so big:** It contains React (the framework for building components), Storybook (for documenting components), TypeScript (for type safety), and many other tools. Each tool might need other tools, so it creates a chain of dependencies.

### **src/** folder
This is where YOUR code lives - the code you'll actually work with.

- **src/components/** - Your design system components (like Badge)
- **src/styles/** - Your design tokens (colors, spacing, etc.)

### **.storybook/** folder
This is the configuration for Storybook (the tool that shows your components in a browser).

### **Configuration Files** (in the root folder)

- **package.json** - A list of all the tools your project needs and instructions on how to run things
- **tsconfig.json** - Settings for TypeScript (makes your code safer and catches errors)
- **vite.config.ts** - Settings for Vite (the tool that builds your project)
- **.gitignore** - Tells Git which files to ignore (like node_modules)

## 🎯 What You Actually Need to Care About

**Files you'll edit:**
- `src/components/Badge/Badge.tsx` - The Badge component code
- `src/components/Badge/Badge.css` - The Badge component styles
- `src/styles/tokens.css` - Your design tokens

**Files you'll create:**
- More components in `src/components/` (like Button, Input, etc.)

**Everything else:** Just leave it alone - it's configuration that makes everything work!

## 🚀 How to Use

1. **Start Storybook:** `npm run storybook` - Opens a website where you can see your components
2. **Build your project:** `npm run build` - Creates a production version
3. **Install new tools:** `npm install package-name` - Adds new tools to node_modules

## ❓ Common Questions

**Q: Why is node_modules so huge?**
A: It contains React, Storybook, TypeScript, and hundreds of other tools. Each tool needs other tools, creating a chain. It's normal!

**Q: Should I commit node_modules to Git?**
A: No! That's why .gitignore exists - it tells Git to ignore node_modules. Anyone can recreate it by running `npm install`.

**Q: Can I delete node_modules?**
A: Yes, but you'll need to run `npm install` again to recreate it. It's safe to delete - it's just downloaded tools.
