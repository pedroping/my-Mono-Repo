import { Component, input } from '@angular/core';
import { IInputBuilder } from '../../models/models';
import { GenerateDirective } from '../generate-directive/generate-directive.directive';

@Component({
  selector: 'dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
  standalone: true,
  imports: [GenerateDirective],
})
export class DynamicFormsComponent<T> {
  config = input.required<IInputBuilder<T>[]>();

  constructor() {}
}
