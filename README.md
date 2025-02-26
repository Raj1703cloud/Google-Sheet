# Web Sheets

A web-based spreadsheet application that mimics Google Sheets functionality. Built with vanilla JavaScript, HTML, and CSS.

## Features

- Excel-like grid with A-Z columns and 1-100 rows
- Formula support with basic arithmetic operations
- Built-in functions: SUM, AVERAGE, MAX, MIN, COUNT, PRODUCT
- Cell references (e.g., A1) and ranges (e.g., A1:A5)
- Function dropdown for easy formula insertion
- Keyboard navigation (arrow keys, Enter, Tab)
- Modern Google Sheets-like UI

## Files Structure

```
web-sheets/
├── index.html          # Main HTML file
├── styles/
│   └── main.css       # Stylesheet
├── js/
│   ├── Formula.js     # Formula evaluation logic
│   └── Spreadsheet.js # Main spreadsheet functionality
└── README.md          # This file
```

## Usage

1. Open index.html in a web browser
2. Enter values in cells by clicking and typing
3. Use formulas by starting with '=' (e.g., =A1+B1)
4. Use functions from the dropdown menu
5. Navigate with arrow keys, Enter, or Tab

## Formulas

- Basic arithmetic: =A1+B1, =C1*D1
- Functions: =SUM(A1:A5), =AVERAGE(A1:A5)
- Cell references: =A1, =B2
- Cell ranges: A1:A5, B1:B10
