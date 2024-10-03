import { Component } from '@angular/core';
import { CalculatorService } from './calculator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'calculator';
  expression = '';
  answer!: number | string;

  constructor(private readonly calculatorService: CalculatorService) {}

  submit() {
    try {
      this.answer = this.calculatorService.evaluationExpression(
        this.expression
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.answer = error.message;
      } else {
        this.answer = 'An unknown error occurred';
      }
    }
  }
}
