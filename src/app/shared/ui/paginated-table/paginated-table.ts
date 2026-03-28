import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { TableColumn, TableAction } from '@app/shared/ui/table/table';
import { Paginated } from '@app/core/model/paginated-response.model';

@Component({
  selector: 'app-paginated-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <!-- ── VISTA MÓVIL: Cards (visible solo en < md) ── -->
      <div class="flex flex-col gap-3 md:hidden">
        @if (data()?.empty) {
          <div
            class="text-center text-base-content/50 py-10 bg-base-100 rounded-box border border-base-content/5"
          >
            No hay registros para mostrar.
          </div>
        }

        @for (row of data()?.content; track rowId(row)) {
          <div class="bg-base-100 rounded-box border border-base-content/5 p-4 flex flex-col gap-3">
            <!-- Campos -->
            @for (col of columns(); track col.key) {
              <div class="flex items-start justify-between gap-2">
                <span
                  class="text-xs font-semibold text-base-content/50 uppercase tracking-wide min-w-24"
                >
                  {{ col.label }}
                </span>

                <span class="text-sm text-right">
                  @switch (col.type) {
                    @case ('mono') {
                      <span class="font-mono badge badge-ghost badge-sm">{{
                        getValue(row, col)
                      }}</span>
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
                        class="font-bold"
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
                </span>
              </div>
            }

            <!-- Acciones -->
            @if (actions().length > 0) {
              <div class="flex gap-2 pt-2 border-t border-base-content/5">
                @for (action of actions(); track action.title) {
                  <button
                    class="btn btn-sm flex-1"
                    [ngClass]="action.class ?? 'btn-ghost'"
                    [title]="action.title"
                    (click)="action.onClick(row)"
                  >
                    <i [class]="action.icon"></i>

                    @if (action.title) {
                      {{ action.title }}
                    }
                  </button>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- ── VISTA DESKTOP: Tabla (visible solo en >= md) ── -->
      <div
        class="hidden md:block overflow-x-auto rounded-box border border-base-content/5 bg-base-100"
      >
        <table class="table">
          <thead>
            <tr>
              @for (col of columns(); track col.key) {
                <th>{{ col.label }}</th>
              }
              @if (actions().length > 0) {
                <th>Acciones</th>
              }
            </tr>
          </thead>

          <tbody>
            @if (data()?.empty) {
              <tr>
                <td
                  [attr.colspan]="columns().length + (actions().length > 0 ? 1 : 0)"
                  class="text-center text-base-content/50 py-10"
                >
                  No hay registros para mostrar.
                </td>
              </tr>
            }

            @for (row of data()?.content; track rowId(row)) {
              <tr class="hover">
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
                          class="btn btn-sm"
                          [ngClass]="action.class ?? 'btn-ghost'"
                          [title]="action.title"
                          (click)="action.onClick(row)"
                        >
                          <i [class]="action.icon"></i>
                          @if (action.title) {
                            {{ action.title }}
                          }
                        </button>
                      }
                    </div>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- ── Paginación (ambas vistas) ── -->
      @if (data() && !data()!.empty) {
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          <!-- Info -->
          <span class="text-sm text-base-content/60">
            Mostrando
            <span class="font-semibold text-base-content">{{ rangeStart() }}–{{ rangeEnd() }}</span>
            de
            <span class="font-semibold text-base-content">{{ data()!.totalElements }}</span>
            registros
          </span>

          <!-- Controles — en móvil solo Anterior/Siguiente -->
          <div class="join">
            <button
              class="join-item btn btn-sm"
              [disabled]="data()!.first"
              (click)="goToPage(0)"
              title="Primera página"
            >
              «
            </button>

            <button
              class="join-item btn btn-sm"
              [disabled]="data()!.first"
              (click)="goToPage(currentPage() - 1)"
              title="Página anterior"
            >
              ‹
            </button>

            <!-- Páginas numéricas: ocultas en móvil -->
            @for (page of visiblePages(); track page) {
              @if (page === -1) {
                <button class="join-item btn btn-sm btn-disabled hidden sm:flex">…</button>
              } @else {
                <button
                  class="join-item btn btn-sm hidden sm:flex"
                  [class.btn-active]="page === currentPage()"
                  (click)="goToPage(page)"
                >
                  {{ page + 1 }}
                </button>
              }
            }

            <!-- En móvil: indicador compacto de página actual -->
            <button class="join-item btn btn-sm btn-active pointer-events-none sm:hidden">
              {{ currentPage() + 1 }} / {{ data()!.totalPages }}
            </button>

            <button
              class="join-item btn btn-sm"
              [disabled]="data()!.last"
              (click)="goToPage(currentPage() + 1)"
              title="Página siguiente"
            >
              ›
            </button>

            <button
              class="join-item btn btn-sm"
              [disabled]="data()!.last"
              (click)="goToPage(data()!.totalPages - 1)"
              title="Última página"
            >
              »
            </button>
          </div>

          <!-- Tamaño de página -->
          <div class="flex items-center gap-2 text-sm">
            <span class="text-base-content/60">Filas:</span>
            <select
              class="select select-bordered select-sm"
              [value]="data()!.size"
              (change)="onPageSizeChange($any($event.target).value)"
            >
              @for (size of pageSizeOptions(); track size) {
                <option [value]="size">{{ size }}</option>
              }
            </select>
          </div>
        </div>
      }
    </div>
  `,
})
export class PaginatedTable<T extends { id: string | number }> {
  // ── Inputs ──────────────────────────────────────────────────────────────
  columns = input.required<TableColumn<T>[]>();
  data = input.required<Paginated<T> | null>();
  actions = input<TableAction<T>[]>([]);
  pageSizeOptions = input<number[]>([10, 20, 50]);

  // ── Outputs ─────────────────────────────────────────────────────────────
  /** Emite { page, size } cuando el usuario cambia de página o tamaño */
  pageChange = output<{ page: number; size: number }>();

  // ── Computed ─────────────────────────────────────────────────────────────
  currentPage = computed(() => this.data()?.number ?? 0);

  rangeStart = computed(() => {
    const d = this.data();
    if (!d) return 0;
    return d.pageable.offset + 1;
  });

  rangeEnd = computed(() => {
    const d = this.data();
    if (!d) return 0;
    return d.pageable.offset + d.numberOfElements;
  });

  /** Genera los índices de páginas visibles con ellipsis (-1) */
  visiblePages = computed<number[]>(() => {
    const total = this.data()?.totalPages ?? 0;
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);

    const pages: number[] = [0];
    if (current > 2) pages.push(-1);

    const start = Math.max(1, current - 1);
    const end = Math.min(total - 2, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push(-1);
    pages.push(total - 1);

    return pages;
  });

  // ── Helpers ──────────────────────────────────────────────────────────────
  rowId(row: T): string | number {
    return row.id;
  }

  getValue(row: T, col: TableColumn<T>): unknown {
    if (col.valueFn) return col.valueFn(row);
    return (col.key as string)
      .split('.')
      .reduce((obj, key) => (obj as Record<string, unknown>)?.[key], row as unknown);
  }

  goToPage(page: number) {
    const d = this.data();
    if (!d || page < 0 || page >= d.totalPages) return;
    this.pageChange.emit({ page, size: d.size });
  }

  onPageSizeChange(size: string) {
    this.pageChange.emit({ page: 0, size: +size });
  }
}
