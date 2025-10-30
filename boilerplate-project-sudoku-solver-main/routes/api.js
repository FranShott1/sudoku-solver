'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }

      const coordinateRegex = /^[A-I][1-9]$/;
      if (!coordinateRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate[0];
      const column = coordinate[1];

      const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
      const colIndex = parseInt(column) - 1;
      const currentIndex = rowIndex * 9 + colIndex;

      if (puzzle[currentIndex] === value) {
        return res.json({ valid: true });
      }

      let puzzleArray = puzzle.split('');
      puzzleArray[currentIndex] = value;
      let testPuzzle = puzzleArray.join('');

      const conflicts = [];

      if (!solver.checkRowPlacement(testPuzzle, row, column, value)) {
        conflicts.push('row');
      }

      if (!solver.checkColPlacement(testPuzzle, row, column, value)) {
        conflicts.push('column');
      }

      if (!solver.checkRegionPlacement(testPuzzle, row, column, value)) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const result = solver.solve(puzzle);
      
      return res.json(result);
    });
};
