class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return { valid: false, error: 'Required field missing' };
    }

    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }

    const validChars = /^[1-9.]+$/;
    if (!validChars.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const colIndex = parseInt(column) - 1;
    
    const startIndex = rowIndex * 9;
    const endIndex = startIndex + 9;
    const rowString = puzzleString.slice(startIndex, endIndex);
    
    for (let i = 0; i < 9; i++) {
      if (i !== colIndex && rowString[i] === value.toString()) {
        return false;
      }
    }
    
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const colIndex = parseInt(column) - 1;
    
    for (let i = 0; i < 9; i++) {
      const index = i * 9 + colIndex;
      if (i !== rowIndex && puzzleString[index] === value.toString()) {
        return false;
      }
    }
    
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const colIndex = parseInt(column) - 1;
    
    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColStart = Math.floor(colIndex / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = regionRowStart + i;
        const currentCol = regionColStart + j;
        const index = currentRow * 9 + currentCol;
        
        if (currentRow !== rowIndex || currentCol !== colIndex) {
          if (puzzleString[index] === value.toString()) {
            return false;
          }
        }
      }
    }
    
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return { error: validation.error };
    }

    const solution = this.solvePuzzle(puzzleString);
    
    if (!solution) {
      return { error: 'Puzzle cannot be solved' };
    }
    
    return { solution };
  }

  solvePuzzle(puzzleString) {
    let puzzle = puzzleString.split('');
    
    const findEmpty = () => {
      for (let i = 0; i < 81; i++) {
        if (puzzle[i] === '.') {
          return i;
        }
      }
      return -1;
    };
    
    const isValidPlacement = (index, value) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const rowLetter = String.fromCharCode('A'.charCodeAt(0) + row);
      const colNumber = (col + 1).toString();
      
      const currentPuzzle = puzzle.join('');
      
      return this.checkRowPlacement(currentPuzzle, rowLetter, colNumber, value) &&
             this.checkColPlacement(currentPuzzle, rowLetter, colNumber, value) &&
             this.checkRegionPlacement(currentPuzzle, rowLetter, colNumber, value);
    };
    
    const backtrack = () => {
      const emptyIndex = findEmpty();
      
      if (emptyIndex === -1) {
        return true;
      }
      
      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        
        if (isValidPlacement(emptyIndex, value)) {
          puzzle[emptyIndex] = value;
          
          if (backtrack()) {
            return true;
          }
          
          puzzle[emptyIndex] = '.';
        }
      }
      
      return false;
    };
    
    if (backtrack()) {
      return puzzle.join('');
    }
    
    return null;
  }
}

module.exports = SudokuSolver;
