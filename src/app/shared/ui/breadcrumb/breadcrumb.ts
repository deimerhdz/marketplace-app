import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

interface BreadcrumbPath {
  label: string;
  url: string | null;
}
@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  template: ` <div class="breadcrumbs text-sm">
    <ul>
      @for (crumb of breadcrumbs(); track crumb.url) {
        <li>
          @if (crumb.url) {
            <a [routerLink]="crumb.url">{{ crumb.label }}</a>
          } @else {
            {{ crumb.label }}
          }
        </li>
      }
    </ul>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumb {
  private router = inject(Router);

  // Listen to route changes and convert to a signal
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url), // emit current URL immediately
    ),
  );

  breadcrumbs = computed<BreadcrumbPath[]>(() => {
    const url = this.currentUrl();
    if (!url) return [];

    // Split URL into segments and remove empty strings
    const segments = url.split('/').filter(Boolean);

    const crumbs: BreadcrumbPath[] = [
      { label: 'Inicio', url: '/' }, // Root is always present
    ];

    segments.forEach((segment, index) => {
      const fullUrl = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;

      crumbs.push({
        label: this.formatLabel(segment),
        url: isLast ? null : fullUrl, // Last item has no link
      });
    });

    return crumbs;
  });

  // Convert url segment to readable label (e.g. "add-document" → "Add Document")
  private formatLabel(segment: string): string {
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
