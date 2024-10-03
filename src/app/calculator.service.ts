import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  operators = ['*', '/', '+', '-'];

  constructor() {}

  evaluationExpression(expression: string): number {
    try {
      // Validate expression for non-numeric characters and mismatched brackets
      if (!this.isValidExpression(expression)) {
        throw new Error(
          'Invalid expression. Please ensure it contains only numbers, operators, and parentheses.'
        );
      }

      return this.parseFormulaExpression(expression);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('An unknown error occurred');
      }
      return NaN;
    }
  }

  // Function to split by operator
  split(expression: string, operator: string): string[] {
    const result = [];
    let braces = 0;
    let currentChunk = '';

    for (let i = 0; i < expression.length; ++i) {
      const curCh = expression[i];
      if (curCh === '(') {
        braces++;
      } else if (curCh === ')') {
        braces--;
      }

      if (braces === 0 && operator === curCh) {
        result.push(currentChunk);
        currentChunk = '';
      } else {
        currentChunk += curCh;
      }
    }

    if (currentChunk !== '') {
      result.push(currentChunk);
    }

    return result;
  }

  // Functions to perform calculations per each operator
  parseFormulaExpression(expression: string): number {
    if (expression.startsWith('sqrt(')) {
      const innerExpression = expression.substring(5, expression.length - 1);
      return Math.sqrt(this.parseFormulaExpression(innerExpression));
    }

    const numberString = this.split(expression, '+');

    const numbers = numberString.map((noStr) =>
      this.parseMinusExpression(noStr)
    );
    const initialValue = 0.0;

    const result = numbers.reduce((acc, num) => acc + num, initialValue);

    return result;
  }

  parseMinusExpression(expression: string): number {
    const numberString = expression.split('-');
    const numbers = numberString.map((noStr) =>
      this.parseMultiplicationExpression(noStr)
    );
    const initialValue = numbers[0];
    const result =
      numbers.length === 1
        ? initialValue
        : numbers.slice(1).reduce((acc, no) => acc - no, initialValue);

    return result;
  }

  parseMultiplicationExpression(expression: string): number {
    const numberString = expression.split('*');
    const numbers = numberString.map((strNum) =>
      this.parseDivisionExpression(strNum)
    );
    const initialValue = 1.0;
    const result = numbers.reduce((acc, num) => acc * num, initialValue);

    return result;
  }

  parseDivisionExpression(expression: string): number {
    const numberString = expression.split('/');
    const numbers = numberString.map((strNum) => {
      if (strNum[0] === '(') {
        const expr = strNum.substr(1, strNum.length - 2);

        return this.parseFormulaExpression(expr);
      }
      return +strNum;
    });

    return numbers.length === 1
      ? numbers[0]
      : numbers[1] !== 0
      ? numbers[0] / numbers[1]
      : 0;
  }

  // Function to validate expression
  isValidExpression(expression: string): boolean {
    // Check for non-numeric characters
    if (
      /[^0-9\+\-\*/()\.]/.test(expression) &&
      expression.substring(0, 4) !== 'sqrt'
    ) {
      return false;
    }

    // Check for mismatched brackets
    let bracketCount = 0;
    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === '(') {
        bracketCount++;
      } else if (expression[i] === ')') {
        bracketCount--;
      }
      if (bracketCount < 0) {
        return false;
      }
    }
    return bracketCount === 0;
  }
}
