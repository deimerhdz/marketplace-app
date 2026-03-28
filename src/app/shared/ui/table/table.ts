import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
export type ColumnType = 'text' | 'mono' | 'currency' | 'stock' | 'badge' | 'actions';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  type?: ColumnType;
  // Para badge: función que retorna { text, variant: 'error'|'success'|'warning' }
  badgeFn?: (row: T) => { text: string; variant: 'error' | 'success' | 'warning' };
  // Para stock: función que indica si está en estado crítico
  criticalFn?: (row: T) => boolean;
  // Para currency: código de moneda
  currency?: string;
  // Para acceder a propiedades anidadas como 'inventory.stock'
  valueFn?: (row: T) => unknown;
}

export interface TableAction<T> {
  icon: string;
  title: string;
  class?: string;
  onClick: (row: T) => void;
}

export interface TableFooter {
  label: string;
  value: string | number;
  colspanBefore: number;
  colspanAfter: number;
}
@Component({
  selector: 'app-table',
  imports: [CurrencyPipe],
  template: `
    <div class="overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr>
            @for (col of columns(); track col.key) {
              <th>{{ col.label }}</th>
            }
            @if (actions().length > 0) {
              <th></th>
            }
          </tr>
        </thead>

        <tbody>
          @for (row of data(); track rowId(row)) {
            <tr
              [class.bg-red-50]="rowCriticalFn()(row)"
              [class.bg-opacity-5]="rowCriticalFn()(row)"
            >
              @for (col of columns(); track col.key) {
                <td>
                  @switch (col.type) {
                    @case ('mono') {
                      <span class="font-mono text-sm">{{ getValue(row, col) }}</span>
                    }

                    @case ('currency') {
                      <span class="font-semibold">
                        {{
                          $any(getValue(row, col))
                            | currency: col.currency ?? 'COP' : 'symbol' : '1.0-0'
                        }}
                      </span>
                    }

                    @case ('stock') {
                      <span
                        class="font-bold text-base"
                        [class.text-error]="col.criticalFn?.(row)"
                        [class.text-success]="!col.criticalFn?.(row)"
                      >
                        {{ getValue(row, col) }}
                      </span>
                    }

                    @case ('badge') {
                      @if (col.badgeFn) {
                        <span
                          class="badge badge-sm text-white"
                          [class.badge-error]="col.badgeFn(row).variant === 'error'"
                          [class.badge-success]="col.badgeFn(row).variant === 'success'"
                          [class.badge-warning]="col.badgeFn(row).variant === 'warning'"
                        >
                          {{ col.badgeFn(row).text }}
                        </span>
                      }
                    }

                    @default {
                      {{ getValue(row, col) }}
                    }
                  }
                </td>
              }

              @if (actions().length > 0) {
                <td>
                  <div class="flex gap-1">
                    @for (action of actions(); track action.title) {
                      <button
                        class="btn btn-ghost btn-xs"
                        [class]="action.class ?? ''"
                        [title]="action.title"
                        (click)="action.onClick(row)"
                      >
                        {{ action.icon }}
                      </button>
                    }
                  </div>
                </td>
              }
            </tr>
          }
        </tbody>

        @if (footer()) {
          <tfoot>
            <tr>
              <td [attr.colspan]="footer()!.colspanBefore" class="text-right font-bold text-sm">
                {{ footer()!.label }}
              </td>
              <td class="font-bold text-success text-base">{{ footer()!.value }}</td>
              <td [attr.colspan]="footer()!.colspanAfter"></td>
            </tr>
          </tfoot>
        }
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table<T extends { id: string | number }> {
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  actions = input<TableAction<T>[]>([]);
  footer = input<TableFooter | null>(null);
  // Función opcional para marcar toda la fila como crítica
  rowCriticalFn = input<(row: T) => boolean>(() => false);

  rowId(row: T): string | number {
    return row.id;
  }

  getValue(row: T, col: TableColumn<T>): unknown {
    if (col.valueFn) return col.valueFn(row);

    // Soporte para rutas anidadas: 'inventory.stock'
    return (col.key as string)
      .split('.')
      .reduce((obj, key) => (obj as Record<string, unknown>)?.[key], row as unknown);
  }
}
