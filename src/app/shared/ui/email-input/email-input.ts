import { Component, forwardRef, input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-email-input',
  imports: [],
  host: {
    class: 'block',
  },
  template: `
    <!-- Label -->
    <label [for]="id()" class="block text-sm font-medium mb-2">
      {{ label() }}
    </label>

    <!-- Input -->
    <div class="relative">
      <input
        [id]="id()"
        type="email"
        [placeholder]="placeholder()"
        [value]="value"
        [disabled]="disabled"
        [readOnly]="readonly()"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="input w-full "
        [class.input-disabled]="readonly()"
        [class.cursor-not-allowed]="readonly()"
      />
    </div>

    <!-- Errores -->
    @if (control() && control()!.touched) {
      @if (control()!.hasError('required')) {
        <p class="mt-1 text-xs text-error">{{ label() }} es requerido.</p>
      } @else if (control()!.hasError('email') || control()!.hasError('pattern')) {
        <p class="mt-1 text-xs text-error">Ingresa un correo electrónico válido.</p>
      }
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailInput),
      multi: true,
    },
  ],
})
export class EmailInput implements ControlValueAccessor {
  label = input<string>('Correo electrónico');
  placeholder = input<string>('ejemplo@correo.com');
  id = input<string>('email');
  readonly = input<boolean>(false);
  control = input<AbstractControl | null>(null);

  value = '';
  disabled = false;

  onChange: (value: string) => void = () => {
    return;
  };
  onTouched: () => void = () => {
    return;
  };

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  writeValue(val: string): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
