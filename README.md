# 🎬 WANTED s.f.o. - Film Production Support

A modern, responsive website for WANTED s.f.o., showcasing film production support services with a beautiful bento grid layout.

## 🚀 What's New in v2.0

### **Major Refactoring Complete!**

This project has been completely restructured for better maintainability, performance, and developer experience:

#### **Code Organization**

- ✅ **CSS Reduced by 60%**: Split monolithic CSS (1500+ lines) into logical modules
- ✅ **JavaScript Modularized**: Reduced main.js from 1741 lines to ~250 lines
- ✅ **Better Separation**: Clean separation of concerns with modules

#### **New Structure**

```
wanted/
├── css/
│   ├── core/               # Foundation
│   │   ├── reset.css       # Modern CSS reset
│   │   ├── variables.css   # Design tokens & CSS vars
│   │   └── typography.css  # Typography system
│   ├── layout/             # Structure
│   │   ├── grid.css        # Bento grid system
│   │   └── header.css      # Header styles
│   ├── components/         # Reusable elements
│   ├── sections/           # Page-specific styles
│   └── utilities/          # Helper classes
├── js/
│   ├── core/               # Core functionality
│   │   ├── config.js       # Configuration
│   │   └── utils.js        # Utilities
│   ├── modules/            # Feature modules
│   │   ├── scroll.js       # Natural scrolling (ES6 class)
│   │   ├── slider.js       # Project slider
│   │   ├── contact.js      # Contact form
│   │   ├── navigation.js   # Navigation
│   │   └── timeline.js     # Timeline (future)
│   ├── i18n.js             # Internationalization
│   └── main-new.js         # Application entry point
└── ...
```

## 📦 Quick Start

### **Option 1: Modern Development (Recommended)**

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Option 2: Simple HTTP Server**

```bash
# Python 3
python3 -m http.server 8000

# Or use any static server
npx serve
```

## 🎨 Features

- ✨ **Bento Grid Layout**: Modern, asymmetric grid design
- 🌍 **6 Languages**: EN, CS, DE, FR, PL, HU
- 📱 **Fully Responsive**: Mobile-first design
- 🎪 **Interactive Animations**: Smooth transitions and effects
- ⚡️ **Performance Optimized**: Fast loading and smooth scrolling
- ♿️ **Accessible**: ARIA labels and keyboard navigation
- 📧 **Contact Integration**: EmailJS for form submissions

## 🛠 Development

### **Code Quality**

```bash
# Lint JavaScript
npm run lint

# Format all files
npm run format
```

### **CSS Architecture**

We use a **modular CSS architecture** with:

- CSS Custom Properties (variables)
- BEM naming convention
- Mobile-first responsive design
- Consistent breakpoint system

### **JavaScript Modules**

All JavaScript is organized into ES6 modules:

- **Core**: Configuration and utilities
- **Modules**: Feature-specific code
- **Clean imports**: Easy to understand dependencies

### **Key Changes from v1.0**

| Aspect           | Before         | After             | Improvement      |
| ---------------- | -------------- | ----------------- | ---------------- |
| main.js size     | 1741 lines     | ~250 lines        | **85% smaller**  |
| CSS organization | 3 huge files   | 15+ focused files | **Much cleaner** |
| Breakpoints      | 7 inconsistent | 4 standardized    | **Simpler**      |
| Build process    | None           | Vite + ESLint     | **Modern DX**    |
| Modularity       | Monolithic     | Modular           | **Maintainable** |

## 📝 Configuration

Edit `js/core/config.js` to customize:

- EmailJS credentials
- Language settings
- Scroll behavior
- Breakpoints

## 🌐 Internationalization

The site supports 6 languages. Translations are in `langs/*.json`:

- English (en)
- Czech (cs)
- German (de)
- French (fr)
- Polish (pl)
- Hungarian (hu)

## 🎯 Performance

### **Before Refactoring**

- CSS: ~50KB (unminified)
- JS: 70KB (main.js alone)
- Maintenance: Difficult

### **After Refactoring**

- CSS: Modular, tree-shakeable
- JS: Code-split, lazy loadable
- Maintenance: Easy

## 🔧 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📂 Project Structure Explained

### **CSS Layers**

1. **Core**: Reset, variables, typography
2. **Layout**: Grid system, structural elements
3. **Components**: Reusable UI components
4. **Sections**: Page-specific styles
5. **Utilities**: Helper classes

### **JavaScript Layers**

1. **Core**: Configuration, utilities
2. **Modules**: Feature implementations
3. **I18n**: Translation system
4. **Main**: Application orchestration

## 🚧 Future Enhancements

See the implementation plan in the project documentation for:

- [ ] Component templating system
- [ ] Enhanced timeline with filters
- [ ] Movie grid category filtering
- [ ] Image optimization pipeline
- [ ] Further performance optimizations

## 📄 License

Private - WANTED s.f.o.

## 👥 Credits

**Design & Development**: WANTED s.f.o.
**Refactoring**: AI-assisted modernization (2024)

---

## 📖 Migration Guide (v1.0 → v2.0)

### **For Developers**

1. **CSS**: Old `main.css` is now split into modular files
    - Import order matters! Check `css/main-new.css`
    - Use CSS variables from `core/variables.css`

2. **JavaScript**: Old `main.js` is now `main-new.js` + modules
    - Features are in `js/modules/`
    - Import what you need
    - Use ES6 modules syntax

3. **Build Process**: Now using Vite
    - Run `npm install` first
    - Use `npm run dev` for development
    - Bundle with `npm run build`

### **Backward Compatibility**

The old files (`main.js`, `layout.css`, etc.) are still present for reference.
To use the new modular version:

1. Update `index.html` to use `main-new.css` and `main-new.js`
2. Or keep using old files (but lose benefits of new structure)

---

**Happy coding! 🎬**
