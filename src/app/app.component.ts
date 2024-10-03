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
  answer!: number;

  constructor(private readonly calculatorService: CalculatorService) {}

  submit() {
    this.answer = this.calculatorService.evaluationExpression(this.expression);
  }
}
