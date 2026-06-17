import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Post } from './post.model';
import { PostService } from './post.service';

const POSTS_PER_PAGE = 8;

@Component({
  selector: 'lib-posts',
  imports: [FormsModule],
  template: `
    <div class="container">
      <!-- Search -->
      <div class="search-bar">
        <svg
          class="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          class="search-input"
          type="text"
          placeholder="Search posts by title..."
          autocomplete="off"
          [ngModel]="searchQuery()"
          (ngModelChange)="onSearchChange($event)"
        />
        @if (searchQuery()) {
          <button class="search-clear" aria-label="Clear search" (click)="onSearchChange('')">&times;</button>
        }
      </div>

      <!-- Posts grid -->
      @if (loading()) {
        <div class="skeleton-grid">
          @for (_ of skeletonArray; track $index) {
            <div class="skeleton-card">
              <div class="skeleton-line skeleton-id"></div>
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-line skeleton-body"></div>
              <div class="skeleton-line skeleton-body short"></div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="error-state">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <p>Failed to load posts</p>
          <button class="retry-btn" (click)="retry()">Retry</button>
        </div>
      } @else if (paginatedPosts().length === 0) {
        <div class="empty-state">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M8 11h6" />
          </svg>
          <p>No posts match "{{ searchQuery() }}"</p>
        </div>
      } @else {
        <div class="posts-grid">
          @for (post of paginatedPosts(); track post.id) {
            <article class="post-card">
              <span class="post-id">#{{ post.id }}</span>
              <span class="post-user">User {{ post.userId }}</span>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-body">{{ post.body }}</p>
            </article>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="pagination">
            <button
              class="page-btn"
              [disabled]="currentPage() === 1"
              (click)="goToPage(currentPage() - 1)"
            >
              &laquo; Prev
            </button>

            <div class="page-numbers">
              @for (page of visiblePages(); track $index) {
                @if (page === '...') {
                  <span class="page-ellipsis">...</span>
                } @else {
                  <button
                    class="page-num"
                    [class.active]="currentPage() === page"
                    (click)="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                }
              }
            </div>

            <button
              class="page-btn"
              [disabled]="currentPage() === totalPages()"
              (click)="goToPage(currentPage() + 1)"
            >
              Next &raquo;
            </button>
          </div>
        }

        <!-- Results summary -->
        <div class="results-summary">
          Showing {{ (currentPage() - 1) * postsPerPage() + 1 }}
          &ndash;
          {{
            currentPage() * postsPerPage() > filteredPosts().length
              ? filteredPosts().length
              : currentPage() * postsPerPage()
          }}
          of {{ filteredPosts().length }} post{{ filteredPosts().length !== 1 ? 's' : '' }}
          @if (searchQuery()) {
            (filtered from {{ allPosts().length }})
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .container {
      background: var(--background);
      border-radius: 12px;
      padding: 24px;
      transition: background 0.3s ease;
    }

    /* ── Search ── */
    .search-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0 16px;
      margin-bottom: 24px;
      transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.2s ease;
    }

    .search-bar:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
    }

    .search-icon {
      color: var(--textSecondary);
      flex-shrink: 0;
      transition: color 0.3s ease;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      padding: 14px 0;
      font-size: 0.9375rem;
      color: var(--textPrimary);
      transition: color 0.3s ease;
    }

    .search-input::placeholder {
      color: var(--textSecondary);
      transition: color 0.3s ease;
    }

    .search-clear {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: var(--textSecondary);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      line-height: 1;
      transition: color 0.2s ease, background 0.2s ease;
    }

    .search-clear:hover {
      color: var(--textPrimary);
      background: var(--border);
    }

    /* ── Posts Grid ── */
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .post-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .post-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .post-id {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 0.03em;
      transition: color 0.3s ease;
    }

    .post-user {
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--textSecondary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      transition: color 0.3s ease;
    }

    .post-title {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--textPrimary);
      line-height: 1.4;
      text-transform: capitalize;
      transition: color 0.3s ease;
    }

    .post-body {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--textSecondary);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color 0.3s ease;
    }      /* ── Error State ── */
    .error-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--textSecondary);
      transition: color 0.3s ease;
    }

    .error-state svg {
      margin-bottom: 16px;
      opacity: 0.5;
      color: var(--error);
    }

    .error-state p {
      margin: 0 0 16px;
      font-size: 0.9375rem;
    }

    .retry-btn {
      padding: 8px 24px;
      border: none;
      border-radius: 8px;
      background: var(--primary);
      color: var(--onPrimary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .retry-btn:hover {
      opacity: 0.88;
    }

    /* ── Skeleton Loading ── */
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .skeleton-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: background 0.3s ease, border-color 0.3s ease;
    }

    .skeleton-line {
      background: var(--border);
      border-radius: 6px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-id {
      width: 50px;
      height: 12px;
    }

    .skeleton-title {
      width: 80%;
      height: 16px;
    }

    .skeleton-body {
      width: 100%;
      height: 12px;
    }

    .skeleton-body.short {
      width: 60%;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }

    /* ── Empty State ── */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--textSecondary);
      transition: color 0.3s ease;
    }

    .empty-state svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 0.9375rem;
    }

    /* ── Pagination ── */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .page-btn {
      padding: 8px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--textPrimary);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
    }

    .page-btn:hover:not(:disabled) {
      background: var(--border);
    }

    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .page-num {
      min-width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--textPrimary);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    }

    .page-num:hover {
      background: var(--border);
    }

    .page-num.active {
      background: var(--primary);
      color: var(--onPrimary);
      border-color: var(--primary);
    }

    .page-ellipsis {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      height: 36px;
      color: var(--textSecondary);
      font-size: 0.8125rem;
      transition: color 0.3s ease;
    }

    .results-summary {
      text-align: center;
      font-size: 0.75rem;
      color: var(--textSecondary);
      transition: color 0.3s ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
  private readonly postService = inject(PostService);

  readonly postsPerPage = signal(POSTS_PER_PAGE);
  readonly searchQuery = signal('');
  readonly currentPage = signal(1);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly allPosts = signal<Post[]>([]);

  readonly skeletonArray = Array.from({ length: POSTS_PER_PAGE });

  readonly filteredPosts = computed<Post[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.allPosts();
    }
    return this.allPosts().filter((post) =>
      post.title.toLowerCase().includes(query),
    );
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredPosts().length / this.postsPerPage())),
  );

  readonly paginatedPosts = computed<Post[]>(() => {
    const start = (this.currentPage() - 1) * this.postsPerPage();
    return this.filteredPosts().slice(start, start + this.postsPerPage());
  });

  readonly visiblePages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [];

    pages.push(1);

    if (current > 3) {
      pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  });

  constructor() {
    this.fetchPosts();
  }

  retry(): void {
    this.error.set(false);
    this.loading.set(true);
    this.fetchPosts();
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number | '...'): void {
    if (page !== '...') {
      this.currentPage.set(page);
    }
  }

  private fetchPosts(): void {
    this.postService.getAll().subscribe({
      next: (posts) => {
        this.allPosts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }
}
