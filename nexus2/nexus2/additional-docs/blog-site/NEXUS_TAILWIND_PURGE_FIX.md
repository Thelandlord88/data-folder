# 🔧 NEXUS TECHNICAL ANALYSIS: Tailwind Purge Issue with NPM Packages

**Lead Analyst:** 🌈 Prism (Tailwind Specialist)  
**Date:** October 3, 2025  
**Issue:** External package Tailwind classes being purged  
**Environment:** Astro + Vite + Tailwind v3  

---

## 🎯 THE PROBLEM (Simplified)

You're using an **npm package** (like `@olehendrix/{package_name}`) that has **Tailwind classes** inside its Vue components.

**Problem:** Those classes **disappear** in production builds because Tailwind doesn't know to scan that package.

**Why:** Tailwind only scans files you tell it to. By default, it **ignores `node_modules/`**.

---

## 🧠 WHAT'S HAPPENING UNDER THE HOOD

### **Prism's Explanation:**

> **Prism says:**
> 
> "Tailwind is like a librarian with a whitelist. It only keeps books (CSS classes) that someone checked out (used in your code). But your external package is in a locked room (node_modules) that the librarian doesn't have the key to. So even though the package uses `lg:flex`, Tailwind never sees it and throws it away (purges it) in production."

### **The Purge Process:**

```
1. Tailwind reads your tailwind.config.js
2. Looks at the `content` array (what files to scan)
3. Scans those files for class names (plain text search)
4. Generates CSS ONLY for classes it finds
5. Everything else? Purged (removed) to keep file size small
```

**Default `content` in Astro:**
```javascript
// tailwind.config.mjs
content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}']
```

**Notice:** `node_modules` is NOT listed!

---

## 🔍 YOUR SPECIFIC SITUATION

### **Environment:**
- ✅ Astro (SSG framework)
- ✅ Vite (bundler)
- ✅ Tailwind v3 (NOT v4 CSS-first)
- ✅ Main CSS: `src/styles/main.css` (confirmed)
- ❓ External package: `@olehendrix/{package_name}` (Vue components with Tailwind classes)

### **Current Setup (Guessing):**

**`tailwind.config.mjs`:**
```javascript
export default {
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
```

**`src/styles/main.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**The Issue:**
- Your package lives in `node_modules/@olehendrix/{package_name}/`
- It has Vue components with Tailwind classes like `lg:flex`, `bg-blue-500`, etc.
- Tailwind never scans that folder → those classes get purged → components break

---

## ✅ THE FIX (3 Solutions)

### **Solution 1: Add Package to `content` (Recommended)** ⭐

**Edit `tailwind.config.mjs`:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}',
    
    // 👇 ADD THIS: Tell Tailwind to scan your package
    './node_modules/@olehendrix/{package_name}/**/*.vue',
    // Replace {package_name} with actual name, e.g., @olehendrix/ui-components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Why this works:**
- Now Tailwind scans the Vue files in your package
- Finds classes like `lg:flex`
- Includes them in the final CSS
- No classes get purged

**Example with real package name:**
```javascript
content: [
  './src/**/*.{astro,html,js,ts,jsx,tsx}',
  './node_modules/@olehendrix/ui-kit/**/*.vue', // ✅
]
```

---

### **Solution 2: Use `require.resolve` (If complex paths)**

If the package path is weird or you're in a monorepo:

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}',
    
    // 👇 Dynamically find the package
    path.join(
      path.dirname(require.resolve('@olehendrix/{package_name}/package.json')),
      '**/*.vue'
    ),
  ],
  theme: { extend: {} },
  plugins: [],
}
```

**Why this works:**
- `require.resolve` finds the package's location
- Works even if npm/yarn puts it somewhere unexpected
- More reliable in monorepos

---

### **Solution 3: Safelist Classes (Last Resort)** ⚠️

If you can't modify `content` for some reason, manually whitelist the classes:

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  
  // 👇 Force these classes to always be included
  safelist: [
    'lg:flex',
    'bg-blue-500',
    'hover:bg-blue-600',
    // ... list ALL classes from package (tedious!)
  ],
  
  theme: { extend: {} },
  plugins: [],
}
```

**Why this is last resort:**
- Manual work (you have to list every class)
- Easy to forget classes
- Doesn't scale
- Use only if Solution 1/2 don't work

---

## 🚫 WHAT DOESN'T WORK (Common Mistakes)

### **❌ Mistake 1: Adding to CSS with `@source` (Tailwind v3)**

```css
/* src/styles/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@source "../node_modules/@olehendrix/{package_name}/**/*.vue"; /* ❌ Won't work! */
```

**Why it fails:**
- `@source` is a **Tailwind v4** feature
- You're using Tailwind v3 (non-v4 setup)
- v3 doesn't understand `@source` directive
- This syntax gets ignored

---

### **❌ Mistake 2: Wildcard `node_modules` Scan**

```javascript
content: [
  './src/**/*.{astro,html,js,ts,jsx,tsx}',
  './node_modules/**/*.vue', // ❌ TOO BROAD!
]
```

**Why it fails:**
- Scans ENTIRE node_modules (thousands of files)
- Super slow builds (minutes instead of seconds)
- Can crash Tailwind with memory errors
- Only scan the SPECIFIC package you need

**Fix:**
```javascript
content: [
  './src/**/*.{astro,html,js,ts,jsx,tsx}',
  './node_modules/@olehendrix/ui-kit/**/*.vue', // ✅ Specific!
]
```

---

### **❌ Mistake 3: Not Restarting Dev Server**

After changing `tailwind.config.mjs`:
```bash
# Must restart!
npm run dev  # or astro dev
```

**Why:**
- Tailwind caches the config
- Changes won't apply until restart
- Always restart after config changes

---

## 🎨 ASTRO-SPECIFIC CONSIDERATIONS

### **1. CSS Import Location**

**Prism's tip:**
> "Make sure `main.css` is imported in a layout that wraps all pages. If it's only imported on one page, other pages won't have Tailwind!"

**Correct setup:**

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/main.css'; // ✅ Import here (top-level layout)
---

<html>
  <head>
    <title>{Astro.props.title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

Then use this layout on all pages:
```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Home">
  <h1 class="lg:flex">Hello</h1> <!-- Tailwind works! -->
</BaseLayout>
```

---

### **2. File Extensions in `content`**

Make sure you list ALL file types you use:

```javascript
content: [
  './src/**/*.{astro,html,js,ts,jsx,tsx,vue,svelte,mdx}',
  //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //             List every type! Astro, JS, TS, Vue, etc.
  
  './node_modules/@olehendrix/{package_name}/**/*.vue',
]
```

---

### **3. Astro Client Components**

If you use `client:only` or `client:load` with a Vue component from the package:

```astro
<MyVueComponent client:load /> <!-- Classes might still get purged! -->
```

**Why:** Astro doesn't always see client-side-only code during build.

**Fix:** Explicitly import the component in your Astro file:
```astro
---
import MyVueComponent from '@olehendrix/{package_name}/MyComponent.vue';
// Now Tailwind sees this import and scans MyComponent.vue
---

<MyVueComponent client:load />
```

Or safelist the classes (if needed).

---

## 🔄 STEP-BY-STEP FIX FOR YOUR PROJECT

### **Step 1: Find Your Package Name**

```bash
# Look in package.json
cat package.json | grep "@olehendrix"
```

Let's say it's `@olehendrix/vue-ui`

---

### **Step 2: Update `tailwind.config.mjs`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}',
    './node_modules/@olehendrix/vue-ui/**/*.vue', // 👈 ADD THIS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

### **Step 3: Restart Dev Server**

```bash
# Stop current server (Ctrl+C)
npm run dev
# or
astro dev
```

---

### **Step 4: Check CSS in Browser**

1. Open DevTools → Network tab
2. Find the CSS file (e.g., `/_astro/main.abc123.css`)
3. Search for a class from your package (e.g., `lg:flex`)
4. **If found:** ✅ Fix worked!
5. **If not found:** Check content path is correct

---

### **Step 5: Build for Production**

```bash
npm run build
npm run preview
```

Check if classes still work in production build.

---

## 🐛 TROUBLESHOOTING

### **Classes still missing after fix?**

**Check 1: Is the path correct?**
```bash
# Verify the package exists
ls -la node_modules/@olehendrix/
# Should show your package folder
```

**Check 2: What files does the package actually have?**
```bash
# Look inside package
ls -R node_modules/@olehendrix/{package_name}/
# Are there .vue files? Where?
```

**Check 3: Is the file extension correct?**
```javascript
// If package has .ts files, not .vue:
content: [
  './node_modules/@olehendrix/{package_name}/**/*.{vue,ts,js}',
]
```

**Check 4: Clear cache**
```bash
# Delete Astro cache
rm -rf .astro
rm -rf dist
npm run build
```

---

## 📚 TAILWIND v3 vs v4 CONFUSION

### **What you showed in your message:**

The `@source` directive and CSS-first config is **Tailwind v4** only:

```css
/* This is Tailwind v4 syntax: */
@import "tailwindcss";
@source "../node_modules/@olehendrix/{package_name}/**/*.vue";
```

**Since you said you're NOT using v4**, this won't work for you.

### **Your current setup (v3):**

```javascript
// tailwind.config.mjs (v3 way)
export default {
  content: [/* paths */],
  theme: {},
  plugins: [],
}
```

```css
/* src/styles/main.css (v3 way) */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Stick with this!** Don't mix v3 and v4 syntax.

---

## 🎯 RECOMMENDED SOLUTION FOR YOU

Based on your setup (Astro + Vite + Tailwind v3 + external Vue package):

### **`tailwind.config.mjs`:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Your Astro files
    './src/**/*.{astro,html,js,ts,jsx,tsx}',
    
    // External package (REPLACE {package_name} with actual name!)
    './node_modules/@olehendrix/{package_name}/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      // Your custom theme
      colors: {
        primary: {
          50: '#eff6ff',
          // ... (your existing colors)
        }
      }
    },
  },
  plugins: [],
}
```

### **`src/styles/main.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* No @source needed (that's v4 only) */
```

### **Restart + Test:**

```bash
npm run dev
# Check in browser
# Build for production
npm run build
```

---

## 🚀 SUMMARY

| Issue | Solution |
|-------|----------|
| **External package classes purged** | Add package path to `content` in config |
| **`@source` not working** | That's v4 only; you're on v3 |
| **Slow build** | Don't scan all of `node_modules`, be specific |
| **Classes still missing** | Check path, restart server, clear cache |
| **Client-only components** | Import component in Astro file explicitly |

---

## 💬 PRISM'S FINAL ADVICE

> **Prism says:**
> 
> "The fix is almost always: 'Add the package to the content array.' Tailwind can't read minds—it only knows to scan files you explicitly tell it about. Once you add the path, it's like giving the librarian the key to that locked room. Suddenly all those classes are visible and they stop getting purged."
> 
> "And remember: Tailwind v3 uses `tailwind.config.js`, Tailwind v4 uses CSS `@import` and `@source`. Don't mix them! Since you're on v3, stick with the config file approach."

---

## 📁 FILES TO CHECK/MODIFY

1. **`tailwind.config.mjs`** → Add package path to `content`
2. **`src/styles/main.css`** → Should have `@tailwind` directives (already correct)
3. **`src/layouts/BaseLayout.astro`** → Must import `main.css`
4. **`package.json`** → Confirm package name (for content path)

---

## 🎯 NEED HELP?

If you can provide:
1. **Actual package name** (instead of `{package_name}`)
2. **Where package files live** (run `ls node_modules/@olehendrix/...`)
3. **Error messages** (if any)

I can give you the exact config to paste! 🎯

---

**Created by:** 🌈 Prism (NEXUS Tailwind Specialist)  
**Date:** October 3, 2025  
**Topic:** Tailwind Purge Issue with External NPM Packages  
**Environment:** Astro + Vite + Tailwind v3  
**Status:** Fix documented, ready to implement  

---

🔧✨🎨 **NEXUS Technical Analysis Complete!**
