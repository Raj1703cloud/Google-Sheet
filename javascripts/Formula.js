class Formula {
    static functions = {
        'SUM': (args) => args.reduce((a, b) => parseFloat(a) + parseFloat(b), 0),
        'AVERAGE': (args) => args.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / args.length,
        'MAX': (args) => Math.max(...args.map(a => parseFloat(a))),
        'MIN': (args) => Math.min(...args.map(a => parseFloat(a))),
        'COUNT': (args) => args.filter(a => a !== '' && !isNaN(a)).length,
        'PRODUCT': (args) => args.reduce((a, b) => parseFloat(a) * parseFloat(b), 1),
        'SQRT': (args) => Math.sqrt(args[0]),
        'POWER': (args) => Math.pow(args[0], args[1]),
        'ROUND': (args) => Math.round(args[0]),
        'MEDIAN': (args) => {
            args.sort((a, b) => a - b);
            const middle = Math.floor(args.length / 2);
            return args.length % 2 === 0 ? (args[middle - 1] + args[middle]) / 2 : args[middle];
        },
        'STDEV': (args) => {
            const mean = args.reduce((a, b) => a + parseFloat(b), 0) / args.length;
            return Math.sqrt(args.reduce((a, b) => a + Math.pow(parseFloat(b) - mean, 2), 0) / (args.length - 1));
        },
        'VARIANCE': (args) => {
            const mean = args.reduce((a, b) => a + parseFloat(b), 0) / args.length;
            return args.reduce((a, b) => a + Math.pow(parseFloat(b) - mean, 2), 0) / (args.length - 1);
        },
        'IF': (args) => args[0] ? args[1] : args[2] // Conditional: if condition, then value1, else value2
    };

    static evaluateFormula(formula, getCellValue) {
        if (!formula.startsWith('=')) return formula;

        formula = formula.substring(1).trim(); // Remove '=' and trim

        // Check if it's a function call
        const functionMatch = formula.match(/^([A-Z]+)\((.*)\)$/i);
        if (functionMatch) {
            const [, functionName, args] = functionMatch;
            const func = this.functions[functionName.toUpperCase()];
            if (!func) throw new Error(`Unknown function: ${functionName}`);

            // Parse arguments
            const evaluatedArgs = args.split(',').map(arg => {
                arg = arg.trim();

                // Handle both relative and absolute references
                const cellMatch = arg.match(/^([A-Z$]+)(\d+)$/i);
                if (cellMatch) {
                    const [, col, row] = cellMatch;
                    const colIndex = col.replace('$', '').toUpperCase().charCodeAt(0) - 65;
                    const rowIndex = parseInt(row) - 1;
                    const value = getCellValue(rowIndex, colIndex);
                    return value === '' ? '0' : value;
                }

                // Handle ranges (e.g., A1:B2)
                const rangeMatch = arg.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i);
                if (rangeMatch) {
                    const [, startCol, startRow, endCol, endRow] = rangeMatch;
                    const values = [];
                    const startColIndex = startCol.toUpperCase().charCodeAt(0) - 65;
                    const endColIndex = endCol.toUpperCase().charCodeAt(0) - 65;

                    for (let col = startColIndex; col <= endColIndex; col++) {
                        for (let row = parseInt(startRow) - 1; row < parseInt(endRow); row++) {
                            const value = getCellValue(row, col);
                            if (value !== '') {
                                values.push(value);
                            }
                        }
                    }
                    return values;
                }

                return arg;
            }).flat();

            return func(evaluatedArgs);
        }

        // Handle basic arithmetic
        try {
            // Replace cell references with their values (relative and absolute)
            const formulaWithValues = formula.replace(/([A-Z\$]+)(\d+)/gi, (match, col, row) => {
                const colIndex = col.replace('$', '').toUpperCase().charCodeAt(0) - 65;
                const rowIndex = parseInt(row) - 1;
                const value = getCellValue(rowIndex, colIndex);
                return value === '' ? '0' : value;
            });

            return eval(formulaWithValues);
        } catch (e) {
            return '#ERROR!';
        }
    }

    static getFunctionList() {
        return Object.keys(this.functions);
    }
}
