# Calculator App

A modern, responsive web-based calculator application built with React and Vite. This application provides a clean, intuitive interface for performing basic arithmetic operations.

![Calculator App Screenshot](https://via.placeholder.com/600x400?text=Calculator+App)

## Features

### Core Calculator
- **Basic Arithmetic Operations**: Addition, subtraction, multiplication, and division
- **Advanced Functions**: Square root, square, reciprocal, percentage, and sign toggling
- **ANS (Answer) Button**: Quickly recall and reuse the last calculated result
- **Decimal Support**: Precise calculations with decimal numbers
- **Error Handling**: Graceful handling of division by zero and other errors
- **Keyboard Support**: Full keyboard control for all operations
- **Backspace/Delete**: Use the `Backspace` key to erase the last digit
- **Copy / Paste Support**: Copy current value or paste numbers from clipboard

### Advanced Features
- **Memory Functions**: Store and recall values with M+, M-, MR, MC
- **Calculation History**: Persistent history with reuse and clear (up to 20 entries)
- **History Export/Import**: Export history as CSV, JSON, or TXT; import saved history
- **Number Formatting**: Toggle thousands separators (e.g., 1,000 vs 1000)
- **Scientific Notation**: Auto/Always/Off modes for large and small numbers (e.g., 1.23×10³)
- **Constants Library**: Quick access to 16 mathematical and physical constants (π, e, c, g, etc.)
- **Theme Switching**: Dark and light mode with smooth transitions
- **Sound Effects**: Optional audio feedback for button interactions
- **Command Palette**: Quick access to all features with fuzzy search (Cmd/Ctrl+K)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Keyboard Mappings

| Key(s)          | Action                       |
| --------------- | ---------------------------- |
| `0–9`           | Enter digits                 |
| `.`             | Decimal point                |
| `+`             | Addition                     |
| `-`             | Subtraction                  |
| `*` or `x`      | Multiplication               |
| `/`             | Division                     |
| `Enter` or `=`  | Equals / calculate           |
| `%`             | Percentage                   |
| `Backspace`     | Delete last digit            |
| `Escape` or `c` | Clear (AC)                   |
| `R`             | Square root (√)              |
| `S`             | Square (x²)                  |
| `I`             | Reciprocal (1/x)             |
| `A`             | Insert last answer (ANS)     |
| `Shift+M`       | Memory Add (M+)              |
| `Shift+N`       | Memory Subtract (M-)         |
| `Shift+R`       | Memory Recall (MR)           |
| `Shift+C`       | Memory Clear (MC)            |
| `Ctrl/Cmd+C`    | Copy current value           |
| `Ctrl/Cmd+V`    | Paste numeric value          |
| `Ctrl/Cmd+K`    | Open command palette         |

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/factory-shiv/hackathon-demo-repo.git
   cd hackathon-demo-repo
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

### Development Server

To start the development server:

```
npm run dev
```

This will start the application on [http://localhost:3000](http://localhost:3000) (opens automatically in your default browser).

### Building for Production

To create a production build:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

To preview the production build locally:

```
npm run preview
```

## Technology Stack

- **React**: Frontend library for building user interfaces
- **Vite**: Next-generation frontend tooling for faster development
- **CSS Grid & Flexbox**: Modern layout techniques for responsive design
- **CSS Variables**: For consistent theming and styling
- **React Hooks**: For state management and component lifecycle

## Project Structure

```
calculator-app/
├── public/
│   └── calculator.svg    # App favicon
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # App-specific styles
│   ├── Calculator.jsx    # Calculator component with core functionality
│   ├── Calculator.css    # Calculator-specific styles
│   ├── index.css         # Global styles
│   └── main.jsx          # Application entry point
├── index.html            # HTML template
├── package.json          # Project dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Created with ♥ by [Factory](https://www.factory.ai)
