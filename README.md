# Calculator App

A modern, responsive web-based calculator application built with React and Vite. This application provides a clean, intuitive interface for performing basic arithmetic operations.

![Calculator App Screenshot](https://via.placeholder.com/600x400?text=Calculator+App)

## Features

- **Basic Arithmetic Operations**: Addition, subtraction, multiplication, and division
- **Additional Functions**: Percentage calculation and sign toggling
- **Decimal Support**: Precise calculations with decimal numbers
- **Error Handling**: Graceful handling of division by zero and other errors
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with visual feedback
- **Keyboard Support**: Use your keyboard for calculations (coming soon)

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
