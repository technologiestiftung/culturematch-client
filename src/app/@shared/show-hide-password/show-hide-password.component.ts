import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'proto-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShowHidePasswordComponent),
      multi: true,
    },
  ],
})
export class ShowHidePasswordComponent implements ControlValueAccessor {
  @Input() public label: string;
  @Input() public placeholder: string;

  public isVisible = false;

  private _value = '';

  constructor() { }

  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  public onChange: any = () => { };
  public onTouched: any = () => { };

  public registerOnChange(func: Function) {
    this.onChange = func;
  }

  public registerOnTouched(func: Function) {
    this.onTouched = func;
  }

  public writeValue(value: string) {
    if (value) {
      this.value = value;
    }
  }
}
