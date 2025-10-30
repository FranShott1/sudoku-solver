const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

// Valid puzzle strings for testing
const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {

  suite('Puzzle Validation', () => {

    test('Logic handles a valid puzzle string of 81 characters', (done) => {
      const result = solver.validate(validPuzzle);
      assert.isTrue(result.valid);
      done();
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
      const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.';
      const result = solver.validate(invalidPuzzle);
      assert.isFalse(result.valid);
      assert.equal(result.error, 'Invalid characters in puzzle');
      done();
    });

    test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
      const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
      const result = solver.validate(shortPuzzle);
      assert.isFalse(result.valid);
      assert.equal(result.error, 'Expected puzzle to be 81 characters long');
      done();
    });

  });

  suite('Placement Validation', () => {

    test('Logic handles a valid row placement', (done) => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkRowPlacement(puzzle, 'A', 2, '3');
      assert.isTrue(result);
      done();
    });

    test('Logic handles an invalid row placement', (done) => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkRowPlacement(puzzle, 'A', 2, '1');
      assert.isFalse(result);
      done();
    });

    test('Logic handles a valid column placement', (done) => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkColPlacement(puzzle, 'A', 2, '3');
      assert.isTrue(result);
      done();
    });

    test('Logic handles an invalid column placement', (done) => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkColPlacement(puzzle, 'A', 2, '9');
      assert.isFalse(result);
      done();
    });

    test('Logic handles a valid region (3x3 grid) placement', (done) => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkRegionPlacement(puzzle, 'A', 2, '3');
      assert.isTrue(result);
      done();
    });

    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkRegionPlacement(puzzle, 'A', 2, '5');
      assert.isFalse(result);
      done();
    });

  });

  suite('Solver', () => {

    test('Valid puzzle strings pass the solver', (done) => {
      const result = solver.solve(validPuzzle);
      assert.isObject(result);
      assert.property(result, 'solution');
      assert.isString(result.solution);
      assert.lengthOf(result.solution, 81);
      done();
    });

    test('Invalid puzzle strings fail the solver', (done) => {
      const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.';
      const result = solver.solve(invalidPuzzle);
      assert.isObject(result);
      assert.property(result, 'error');
      done();
    });

    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
      const result = solver.solve(validPuzzle);
      assert.isObject(result);
      assert.property(result, 'solution');
      assert.equal(result.solution, validSolution);
      done();
    });

  });

});
