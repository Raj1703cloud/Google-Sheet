# Web Sheets

A web-based spreadsheet application that mimics Google Sheets functionality. Built with vanilla JavaScript, HTML, and CSS.

# Features

- Excel-like grid with A-Z columns and 1-100 rows
- Formula support with basic arithmetic operations
- Built-in functions: SUM, AVERAGE, MAX, MIN, COUNT, PRODUCT
- Cell references (e.g., A1) and ranges (e.g., A1:A5)
- Function dropdown for easy formula insertion
- Keyboard navigation (arrow keys, Enter, Tab)
- Modern Google Sheets-like UI

# Files Structure

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

# Usage

1. Open index.html in a web browser
2. Enter values in cells by clicking and typing
3. Use formulas by starting with '=' (e.g., =A1+B1)
4. Use functions from the dropdown menu
5. Navigate with arrow keys, Enter, or Tab

# Formulas

## Functions

SUM (Sum of a range of cells):
Formula: =SUM(A1:A5)

AVERAGE (Average of a range of cells):
Formula: =AVERAGE(A1:A5)

MAX (Maximum value in a range):
Formula: =MAX(A1:A5)

MIN (Minimum value in a range):
Formula: =MIN(A1:A5)

COUNT (Count of non-empty and numeric cells):
Formula: =COUNT(A1:A5)

PRODUCT (Product of a range of values):
Formula: =PRODUCT(A1:A5)

SQRT (Square root of a value):
Formula: =SQRT(A1)

POWER (Raising a number to a power):
Formula: =POWER(A1, B1)

ROUND (Round a value to the nearest integer):
Formula: =ROUND(A1)

MEDIAN (Median value of a range):
Formula: =MEDIAN(A1:A5)

STDEV (Standard deviation of a range):
Formula: =STDEV(A1:A5)

VARIANCE (Variance of a range):
Formula: =VARIANCE(A1:A5)

IF (Conditional statement, return value based on condition):
Formula: =IF(A1 > 5, "High", "Low")

## Data Quality Functions

TRIM (Remove leading/trailing spaces):
Formula: =TRIM(A1)

UPPER (Convert text to uppercase):
Formula: =UPPER(A1)

LOWER (Convert text to lowercase):
Formula: =LOWER(A1)

REMOVE_DUPLICATES (Remove duplicate values in a range):
Formula: =REMOVE_DUPLICATES(A1:A5)

FIND_AND_REPLACE (Find and replace values in a range):
Formula: =FIND_AND_REPLACE(A1:A5, "apple", "orange")

- Cell references: =A1, =B2
- Cell ranges: A1:A5, B1:B10
