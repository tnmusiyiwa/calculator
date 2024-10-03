import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  operators = ['*', '/', '+', '-'];

  constructor() {}

  evaluationExpression(expression: string): number {
    return this.parseFormulaExpression(expression);
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
    console.log(expression);
    const numberString = this.split(expression, '+');

    console.log(numberString);

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

        console.log(strNum);
        console.log(expr);
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
}
