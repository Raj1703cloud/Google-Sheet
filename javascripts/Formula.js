class Formula {
    static functions = {
        'SUM': (args) => args.reduce((a, b) => parseFloat(a) + parseFloat(b), 0),
        'AVERAGE': (args) => args.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / args.length,
        'MAX': (args) => Math.max(...args.map(a => parseFloat(a))),
        'MIN': (args) => Math.min(...args.map(a => parseFloat(a))),
        'COUNT': (args) => args.filter(a => a !== '' && !isNaN(a)).length,
        'PRODUCT': (args) => args.reduce((a, b) => parseFloat(a) * parseFloat(b), 1)
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
                
                // Check if it's a cell range (e.g., A1:A5)
                const rangeMatch = arg.match(/^([A-Z])(\d+):([A-Z])(\d+)$/i);
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
                
                // Check if it's a single cell reference (e.g., A1)
                const cellMatch = arg.match(/^([A-Z])(\d+)$/i);
                if (cellMatch) {
                    const [, col, row] = cellMatch;
                    const colIndex = col.toUpperCase().charCodeAt(0) - 65;
                    const rowIndex = parseInt(row) - 1;
                    const value = getCellValue(rowIndex, colIndex);
                    return value === '' ? '0' : value;
                }
                
                return arg;
            }).flat();
            
            return func(evaluatedArgs);
        }
        
        // Handle basic arithmetic
        try {
            // Replace cell references with their values
            const formulaWithValues = formula.replace(/([A-Z])(\d+)/gi, (match, col, row) => {
                const colIndex = col.toUpperCase().charCodeAt(0) - 65;
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
