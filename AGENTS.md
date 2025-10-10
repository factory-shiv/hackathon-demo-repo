# Agent Guidelines for Calculator App

## Project Overview

This is a modern React-based calculator application built with Vite. The app features a clean UI with theme switching, sound effects, number formatting options, keyboard support, and a command palette.

## Tech Stack

- **React 18.2** - UI framework using functional components and hooks
- **Vite 5.0** - Build tool and dev server
- **CSS** - Styling with CSS variables for theming
- **No TypeScript** - Project uses plain JavaScript (.jsx files)

## Project Structure

```
src/
├── App.jsx                 # Root component with providers and layout
├── Calculator.jsx          # Main calculator logic and UI
├── main.jsx               # Application entry point
├── components/            # Reusable UI components
│   ├── CommandPalette.jsx
│   ├── NumberFormatToggle.jsx
│   ├── SoundToggle.jsx
│   └── ThemeToggle.jsx
├── contexts/              # React Context providers
│   ├── NumberFormatContext.jsx
│   └── ThemeContext.jsx
└── utils/                 # Utility functions
    └── soundManager.js
```

## Coding Conventions

### General Style
- Use functional components with hooks (no class components)
- Follow existing indentation (2 spaces)
- Use single quotes for strings
- Use JSX file extension (.jsx) for React components
- Keep imports organized: React first, then local imports, then CSS

### React Patterns
- Use React Context for global state (theme, number formatting, etc.)
- Use `useState` and `useEffect` hooks for component state
- Export components as default exports
- Use descriptive component and function names

### State Management
- Global state uses React Context (see `contexts/` folder)
- Local state uses `useState` hook
- Persist settings in localStorage when appropriate
- Context structure: create context, provider component, and consumer hook

### Naming Conventions
- Components: PascalCase (e.g., `ThemeToggle.jsx`)
- Functions: camelCase (e.g., `handleClick`)
- Constants: UPPER_SNAKE_CASE for true constants
- CSS classes: camelCase or kebab-case consistently

### CSS
- CSS files accompany their components (e.g., `App.jsx` → `App.css`)
- Use CSS variables for theming (defined in `:root`)
- Use BEM-like naming or descriptive class names
- Responsive design using CSS Grid and Flexbox

## Key Features to Preserve

1. **Keyboard Support**: Full keyboard navigation and shortcuts
2. **Theme System**: Dark/light theme toggle with localStorage persistence
3. **Number Formatting**: Locale-aware thousand separators toggle
4. **Sound Effects**: Optional sound feedback for interactions
5. **Command Palette**: Cmd/Ctrl+K shortcut for quick actions
6. **Calculation History**: Persistent history with localStorage
7. **Copy/Paste**: Clipboard integration for calculator values

## Testing and Verification

### Before Completing Tasks
1. Run `npm run dev` to test in development
2. Verify keyboard shortcuts still work
3. Test theme switching functionality
4. Check that localStorage persistence works
5. Verify responsive design on different screen sizes
6. Build production bundle: `npm run build`

### Common Commands
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

## Dependencies

### Production
- `react` & `react-dom` - Core framework
- `fuse.js` - Fuzzy search for command palette

### Development
- `@vitejs/plugin-react` - Vite React plugin
- `vite` - Build tool

**Important**: Do not add new dependencies without checking if existing libraries can fulfill the need. This project intentionally keeps dependencies minimal.

## Common Patterns

### Creating a New Context
1. Create file in `src/contexts/`
2. Define context with `createContext()`
3. Create provider component with state
4. Export context and provider
5. Wrap App in provider (see `App.jsx`)

### Adding a New Component
1. Create file in `src/components/`
2. Import React and necessary hooks
3. Import corresponding CSS file if needed
4. Use functional component pattern
5. Export as default

### Adding Keyboard Shortcuts
- Add event listener in component with keyboard logic (see `Calculator.jsx`)
- Document in README.md keyboard mappings section
- Update command palette help text if applicable

## Security Considerations

- No sensitive data should be logged
- No API keys or secrets in code
- Sanitize user input for eval-like operations
- Be careful with localStorage data validation

## Git Workflow

- Branch naming: descriptive-feature-name
- Commit messages: concise, present tense (e.g., "feat: add dark mode toggle")
- Always check `git status` and `git diff` before committing
- Default branch: `main`

## Known Patterns in Codebase

### localStorage Usage
```javascript
// Read from localStorage with fallback
const stored = localStorage.getItem('key');
const value = stored ? JSON.parse(stored) : defaultValue;

// Write to localStorage
localStorage.setItem('key', JSON.stringify(value));
```

### Context Pattern
```javascript
const Context = createContext();

export function Provider({ children }) {
  const [state, setState] = useState(defaultValue);
  return (
    <Context.Provider value={{ state, setState }}>
      {children}
    </Context.Provider>
  );
}

export function useContextHook() {
  return useContext(Context);
}
```

## Troubleshooting

- **Port already in use**: Kill process on port or use different port
- **Build errors**: Check for syntax errors, missing imports
- **Styling issues**: Verify CSS variables are defined in `:root`
- **State not persisting**: Check localStorage implementation

## Additional Notes

- This is a client-side only application (no backend)
- Focus on user experience and smooth interactions
- Keep the UI clean and intuitive
- Performance matters: avoid unnecessary re-renders
- Accessibility: maintain keyboard navigation support
