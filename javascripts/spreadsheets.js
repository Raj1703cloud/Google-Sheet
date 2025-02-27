class Spreadsheet {
    constructor(container, rows = 100, cols = 26) {
        this.container = document.getElementById(container);
        this.rows = rows;
        this.cols = cols;
        this.cells = {};
        this.selectedCell = null;
        this.init();
    }

    init() {
        this.createGrid();
        this.setupEventListeners();
        this.initFormulaBar();
        this.initFunctionDropdown();
        this.initRangeSelection(); // <-- New: initialize range dragging for formulas
        this.initDataQualityDropdown(); // New: data quality function dropdown
        this.selectCellAt(0, 0); // Select first cell by default
    }

    initDataQualityDropdown() {
        const dataQualitySelect = document.getElementById('data-quality-select');
        
        // Add data quality functions to dropdown
        const functions = ['TRIM', 'UPPER', 'LOWER', 'REMOVE_DUPLICATES', 'FIND_AND_REPLACE'];
        functions.forEach(func => {
            const option = document.createElement('option');
            option.value = func;
            option.textContent = func;
            dataQualitySelect.appendChild(option);
        });

        // Handle function selection for data quality functions
        dataQualitySelect.addEventListener('change', () => {
            if (this.selectedCell && dataQualitySelect.value) {
                const formulaInput = document.getElementById('formula-input');
                const selectedFunction = dataQualitySelect.value;
                
                if (selectedFunction === 'FIND_AND_REPLACE') {
                    const find = prompt('Enter the text to find:');
                    const replace = prompt('Enter the text to replace with:');
                    formulaInput.value = `=FIND_AND_REPLACE(${selectedFunction})(${find}, ${replace})`;
                } else {
                    formulaInput.value = `=${selectedFunction}()`;
                }
                
                formulaInput.focus();
            }
        });
    }
        

    createGrid() {
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'spreadsheet-scroll-container';

        const table = document.createElement('table');
        table.className = 'spreadsheet-table';
        const tbody = document.createElement('tbody');

        // Create column headers
        const headerRow = document.createElement('tr');
        const cornerCell = document.createElement('th');
        cornerCell.className = 'corner-header';
        headerRow.appendChild(cornerCell);

        for (let col = 0; col < this.cols; col++) {
            const th = document.createElement('th');
            th.className = 'header-cell';
            th.textContent = String.fromCharCode(65 + col);
            headerRow.appendChild(th);
        }
        tbody.appendChild(headerRow);

        // Create rows and cells
        for (let row = 0; row < this.rows; row++) {
            const tr = document.createElement('tr');
            
            // Row header
            const rowHeader = document.createElement('th');
            rowHeader.className = 'header-cell';
            rowHeader.textContent = row + 1;
            tr.appendChild(rowHeader);

            // Cells
            for (let col = 0; col < this.cols; col++) {
                const td = document.createElement('td');
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.contentEditable = true;
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.dataset.formula = '';
                td.appendChild(cell);
                tr.appendChild(td);
                this.cells[`${row},${col}`] = cell;
            }
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        scrollContainer.appendChild(table);
        this.container.appendChild(scrollContainer);
    }

    setupEventListeners() {
        // Cell selection via click
        this.container.addEventListener('click', (e) => {
            // Only proceed with selection if not range selecting
            const cell = e.target.closest('.cell');
            if (cell && !cell.classList.contains('range-selected')) {
                this.selectCell(cell);
            }
        });

        // Cell content changes
        this.container.addEventListener('input', (e) => {
            const cell = e.target.closest('.cell');
            if (cell) {
                this.updateFormulaBar(cell);
            }
        });

        // Handle cell keydown events
        this.container.addEventListener('keydown', (e) => {
            const cell = e.target.closest('.cell');
            if (!cell) return;

            if (e.key === 'Enter') {
                e.preventDefault();
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.evaluateCell(cell);
                if (row < this.rows - 1) {
                    this.selectCellAt(row + 1, col);
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.evaluateCell(cell);
                if (col < this.cols - 1) {
                    this.selectCellAt(row, col + 1);
                } else if (row < this.rows - 1) {
                    this.selectCellAt(row + 1, 0);
                }
            } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.evaluateCell(cell);

                switch (e.key) {
                    case 'ArrowUp':
                        if (row > 0) this.selectCellAt(row - 1, col);
                        break;
                    case 'ArrowDown':
                        if (row < this.rows - 1) this.selectCellAt(row + 1, col);
                        break;
                    case 'ArrowLeft':
                        if (col > 0) this.selectCellAt(row, col - 1);
                        break;
                    case 'ArrowRight':
                        if (col < this.cols - 1) this.selectCellAt(row, col + 1);
                        break;
                }
            }
        });
    }

    initFormulaBar() {
        const formulaInput = document.getElementById('formula-input');
        
        formulaInput.addEventListener('input', (e) => {
            if (this.selectedCell) {
                this.selectedCell.textContent = e.target.value;
            }
        });

        formulaInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.selectedCell) {
                    const value = formulaInput.value;
                    this.selectedCell.textContent = value;
                    this.evaluateCell(this.selectedCell);
                    this.selectedCell.focus();
                }
            }
        });
    }

    initFunctionDropdown() {
        const functionSelect = document.getElementById('function-select');
        
        // Add functions to dropdown
        const functions = Formula.getFunctionList();
        functions.forEach(func => {
            const option = document.createElement('option');
            option.value = func;
            option.textContent = func;
            functionSelect.appendChild(option);
        });

        // Handle function selection
        functionSelect.addEventListener('change', () => {
            if (this.selectedCell && functionSelect.value) {
                const formulaInput = document.getElementById('formula-input');
                formulaInput.value = `=${functionSelect.value}()`;
                formulaInput.focus();
                
                // Place cursor between parentheses
                const pos = formulaInput.value.length - 1;
                formulaInput.setSelectionRange(pos, pos);
            }
        });
    }

    // New: Initialize range selection (drag-to-select) for formulas
    initRangeSelection() {
        const formulaInput = document.getElementById('formula-input');
        let isRangeSelecting = false;
        let startCell = null;
        
        // When the user presses the mouse button down on a cell while editing a formula, begin range selection.
        this.container.addEventListener('mousedown', (e) => {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            // Only enable range selection if the formula input is active and starts with "=" (indicating a formula)
            if (document.activeElement === formulaInput && formulaInput.value.startsWith('=')) {
                isRangeSelecting = true;
                startCell = cell;
                this.clearRangeSelection();
                this.addCellToRange(cell);
                // Prevent default behavior (e.g. regular cell selection)
                e.preventDefault();
            }
        });

        // As the user moves the mouse, update the range highlight.
        this.container.addEventListener('mouseover', (e) => {
            if (!isRangeSelecting) return;
            const cell = e.target.closest('.cell');
            if (!cell) return;
            this.highlightRange(startCell, cell);
        });

        // On mouseup, finalize the range selection, update the formula input, and clear highlights.
        document.addEventListener('mouseup', (e) => {
            if (!isRangeSelecting) return;
            isRangeSelecting = false;
            const cell = e.target.closest('.cell');
            if (cell) {
                this.finalizeRangeSelection(startCell, cell);
            }
        });
    }

    // Remove the highlighting from all cells.
    clearRangeSelection() {
        Object.values(this.cells).forEach(cell => {
            cell.classList.remove('range-selected');
        });
    }

    // Add a single cell to the temporary range highlight.
    addCellToRange(cell) {
        cell.classList.add('range-selected');
    }

    // Highlight all cells in the rectangle defined by startCell and endCell.
    highlightRange(startCell, endCell) {
        this.clearRangeSelection();
        const startRow = parseInt(startCell.dataset.row);
        const startCol = parseInt(startCell.dataset.col);
        const endRow = parseInt(endCell.dataset.row);
        const endCol = parseInt(endCell.dataset.col);

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
                const cellKey = `${r},${c}`;
                if (this.cells[cellKey]) {
                    this.cells[cellKey].classList.add('range-selected');
                }
            }
        }
    }

    // Finalize range selection: compute the range string (e.g. A1:B3) and update the formula input.
    finalizeRangeSelection(startCell, endCell) {
        const startRow = parseInt(startCell.dataset.row);
        const startCol = parseInt(startCell.dataset.col);
        const endRow = parseInt(endCell.dataset.row);
        const endCol = parseInt(endCell.dataset.col);

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        const startRef = String.fromCharCode(65 + minCol) + (minRow + 1);
        const endRef = String.fromCharCode(65 + maxCol) + (maxRow + 1);
        const rangeString = startRef === endRef ? startRef : `${startRef}:${endRef}`;

        // Update the formula input by inserting the range string inside the function parentheses if present.
        this.updateFormulaWithRange(rangeString);
        this.clearRangeSelection();

        // Refocus the formula input for further editing.
        const formulaInput = document.getElementById('formula-input');
        formulaInput.focus();
    }

    // Update the formula input with the selected range.
    updateFormulaWithRange(range) {
        const formulaInput = document.getElementById('formula-input');
        const formula = formulaInput.value;
        const openParenIndex = formula.indexOf('(');
        const closeParenIndex = formula.indexOf(')');
        if (openParenIndex !== -1 && closeParenIndex !== -1 && closeParenIndex > openParenIndex) {
            const newFormula = formula.substring(0, openParenIndex + 1) + range + formula.substring(closeParenIndex);
            formulaInput.value = newFormula;
        } else {
            // If the formula isn't in a recognized format, simply append the range.
            formulaInput.value = `${formula}${range}`;
        }
    }

    selectCell(cell) {
        if (this.selectedCell) {
            this.selectedCell.classList.remove('selected');
        }
        this.selectedCell = cell;
        cell.classList.add('selected');
        this.updateFormulaBar(cell);
        
        // Update selected cell display (e.g., A1, B2, etc.)
        const col = String.fromCharCode(65 + parseInt(cell.dataset.col));
        const row = parseInt(cell.dataset.row) + 1;
        document.querySelector('.selected-cell').textContent = `${col}${row}`;
    }

    selectCellAt(row, col) {
        const cell = this.cells[`${row},${col}`];
        if (cell) {
            this.selectCell(cell);
            cell.focus();
            
            // Place cursor at end of text
            const range = document.createRange();
            range.selectNodeContents(cell);
            range.collapse(false);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    updateFormulaBar(cell) {
        const formulaInput = document.getElementById('formula-input');
        formulaInput.value = cell.dataset.formula || cell.textContent;
    }

    evaluateCell(cell) {
        const value = cell.textContent;
        if (value.startsWith('=')) {
            try {
                cell.dataset.formula = value;
                const result = Formula.evaluateFormula(value, (row, col) => {
                    const targetCell = this.cells[`${row},${col}`];
                    return targetCell ? targetCell.textContent : '';
                });
                cell.textContent = result;
            } catch (e) {
                cell.textContent = '#ERROR!';
            }
        } else {
            cell.dataset.formula = value;
        }
    }

    getCellValue(row, col) {
        const cell = this.cells[`${row},${col}`];
        return cell ? cell.textContent : '';
    }
}
