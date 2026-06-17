import { type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { PostsComponent } from '../../../lib/posts/public-api';

const meta: Meta<PostsComponent> = {
  title: 'Lib/Posts',
  component: PostsComponent,
  parameters: {
    controls: {
      exclude: [
        'postsPerPage',
        'allPosts',
        'loading',
        'error',
        'filteredPosts',
        'totalPages',
        'paginatedPosts',
        'visiblePages',
        'skeletonArray',
        'goToPage',
        'onSearchChange',
        'retry',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<PostsComponent>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Wait for posts to load — posts render as <article> elements
    const posts = await canvas.findAllByRole('article', {}, { timeout: 10000 });
    const firstCard = posts[0];

    // Helper: query the actual <lib-posts> host element (not the Storybook wrapper)
    const host = () => canvasElement.querySelector('lib-posts') as HTMLElement;

    // Helper: parse a computed px value to float for numeric comparison
    const px = (val: string) => parseFloat(val.replace('px', ''));

    // ════════════════════════════════════════════════════════
    //  VISUAL — Computed Styles
    // ════════════════════════════════════════════════════════
    await step('Visual', async () => {
      await step('Container & search bar styles', async () => {
        const container = canvasElement.querySelector(
          '.container',
        ) as HTMLElement;
        const searchBar = canvasElement.querySelector(
          '.search-bar',
        ) as HTMLElement;
        const searchInput = canvasElement.querySelector(
          '.search-input',
        ) as HTMLInputElement;

        const containerStyles = window.getComputedStyle(container);
        await expect(containerStyles.borderRadius).toBe('12px');
        await expect(containerStyles.paddingTop).toBe('24px');

        const searchBarStyles = window.getComputedStyle(searchBar);
        await expect(searchBarStyles.borderRadius).toBe('10px');
        await expect(searchBarStyles.display).toBe('flex');
        await expect(px(searchBarStyles.columnGap)).toBeCloseTo(10, 0);

        const inputStyles = window.getComputedStyle(searchInput);
        await expect(px(inputStyles.fontSize)).toBeCloseTo(15, 0);
        await expect(inputStyles.borderTopWidth).toBe('0px');
      });

      await step('Post ID & user label', async () => {
        const postId = firstCard.querySelector('.post-id') as HTMLElement;
        const postUser = firstCard.querySelector('.post-user') as HTMLElement;

        const idStyles = window.getComputedStyle(postId);
        await expect(px(idStyles.fontSize)).toBeCloseTo(12, 0);
        await expect(idStyles.fontWeight).toBe('700');

        const userStyles = window.getComputedStyle(postUser);
        await expect(px(userStyles.fontSize)).toBeCloseTo(11.2, 0);
        await expect(userStyles.textTransform).toBe('uppercase');
        await expect(px(userStyles.letterSpacing)).toBeCloseTo(0.672, 1);
      });

      await step('Post title & body', async () => {
        const postTitle = firstCard.querySelector('.post-title') as HTMLElement;
        const postBody = firstCard.querySelector('.post-body') as HTMLElement;

        const titleStyles = window.getComputedStyle(postTitle);
        await expect(px(titleStyles.fontSize)).toBeCloseTo(15, 0);
        await expect(titleStyles.fontWeight).toBe('600');
        await expect(titleStyles.textTransform).toBe('capitalize');
        await expect(px(titleStyles.lineHeight)).toBeCloseTo(21, 0);

        const bodyStyles = window.getComputedStyle(postBody);
        await expect(px(bodyStyles.fontSize)).toBeCloseTo(13, 0);
        await expect(px(bodyStyles.lineHeight)).toBeCloseTo(20.8, 1);
      });

      await step('Host font, card, pagination & grid', async () => {
        const pageBtn = canvasElement.querySelector(
          '.page-btn',
        ) as HTMLButtonElement;
        const activePageBtn = canvasElement.querySelector(
          '.page-num.active',
        ) as HTMLElement;
        const grid = canvasElement.querySelector('.posts-grid') as HTMLElement;

        const hostEl = host();
        const hostStyles = window.getComputedStyle(hostEl);
        await expect(hostStyles.fontFamily.toLowerCase()).toContain(
          'system-ui',
        );

        const cardStyles = window.getComputedStyle(firstCard);
        await expect(cardStyles.borderRadius).toBe('10px');
        await expect(cardStyles.paddingTop).toBe('20px');
        await expect(cardStyles.display).toBe('flex');
        await expect(cardStyles.flexDirection).toBe('column');
        await expect(px(cardStyles.rowGap)).toBeCloseTo(8, 0);

        const pageBtnStyles = window.getComputedStyle(pageBtn);
        await expect(pageBtnStyles.borderRadius).toBe('8px');
        await expect(px(pageBtnStyles.fontSize)).toBeCloseTo(13, 0);
        await expect(pageBtnStyles.fontWeight).toBe('500');

        const activeStyles = window.getComputedStyle(activePageBtn);
        await expect(activeStyles.borderRadius).toBe('8px');
        await expect(activeStyles.fontWeight).toBe('500');

        const gridStyles = window.getComputedStyle(grid);
        await expect(gridStyles.display).toBe('grid');
        await expect(px(gridStyles.columnGap)).toBeCloseTo(16, 0);
      });
    });

    // ════════════════════════════════════════════════════════
    //  DATA — Content & Wording
    // ════════════════════════════════════════════════════════
    await step('Data', async () => {
      await step('Posts rendering', async () => {
        await expect(posts).toHaveLength(8);

        await expect(
          firstCard.querySelector('.post-id')?.textContent?.trim(),
        ).toMatch(/^#\d+$/);
        await expect(
          firstCard.querySelector('.post-user')?.textContent?.trim(),
        ).toMatch(/^User \d+$/);
        await expect(firstCard.querySelector('.post-title')).toBeTruthy();
        await expect(firstCard.querySelector('.post-body')).toBeTruthy();

        const title = firstCard
          .querySelector('.post-title')!
          .textContent!.trim();
        await expect(title.length).toBeGreaterThan(0);
      });

      await step('Post IDs are sequential', async () => {
        const ids = Array.from(canvasElement.querySelectorAll('.post-id')).map(
          (el) => el.textContent?.trim(),
        );
        await expect(ids[0]).toBe('#1');
        await expect(ids[1]).toBe('#2');
        await expect(ids[2]).toBe('#3');
        await expect(ids[7]).toBe('#8');
      });

      await step('Results summary', async () => {
        const summary = canvasElement.querySelector(
          '.results-summary',
        ) as HTMLElement;
        await expect(summary).toBeTruthy();
        await expect(summary.textContent?.trim()).toBe(
          'Showing 1 – 8 of 100 posts',
        );
      });

      await step('Pagination buttons & page numbers', async () => {
        const pageNums = canvasElement.querySelectorAll('.page-num');
        const pageNumTexts = Array.from(pageNums).map((el) =>
          el.textContent?.trim(),
        );

        await expect(pageNumTexts).toContain('1');
        await expect(pageNumTexts).toContain('13');

        const active = canvasElement.querySelector(
          '.page-num.active',
        ) as HTMLElement;
        await expect(active.textContent?.trim()).toBe('1');

        const buttons = canvasElement.querySelectorAll('.page-btn');
        const prevBtn = buttons[0] as HTMLButtonElement;
        await expect(prevBtn.textContent?.trim()).toContain('Prev');
        await expect(prevBtn.disabled).toBe(true);

        const nextBtn = buttons[buttons.length - 1] as HTMLButtonElement;
        await expect(nextBtn.textContent?.trim()).toContain('Next');
        await expect(nextBtn.disabled).toBe(false);
      });

      await step('Post user labels', async () => {
        const userLabels = Array.from(
          canvasElement.querySelectorAll('.post-user'),
        ).map((el) => el.textContent?.trim());
        await expect(userLabels[0]).toBe('User 1');
      });
    });

    // ════════════════════════════════════════════════════════
    //  INTERACTIONS & ACTIONS — Events, Clicks
    // ════════════════════════════════════════════════════════

    // Helpers for pagination buttons (re-queried each call for freshness)
    const getPrevBtn = () => {
      const buttons = canvasElement.querySelectorAll('.page-btn');
      return buttons[0] as HTMLButtonElement;
    };
    const getNextBtn = () => {
      const buttons = canvasElement.querySelectorAll('.page-btn');
      return buttons[buttons.length - 1] as HTMLButtonElement;
    };

    await step('Interactions & Actions', async () => {
      await step('Search: filter by title', async () => {
        const searchInput = canvasElement.querySelector(
          '.search-input',
        ) as HTMLInputElement;
        await userEvent.type(searchInput, 'est');

        await waitFor(() => {
          const summary = canvasElement.querySelector(
            '.results-summary',
          ) as HTMLElement;
          expect(summary.textContent).toContain('filtered from 100');
        });

        const filteredPosts = canvasElement.querySelectorAll('.post-card');
        await expect(filteredPosts.length).toBeGreaterThanOrEqual(1);
      });

      await step('Search: clear restores full list', async () => {
        const clearBtn = canvas.getByRole('button', { name: 'Clear search' });
        await userEvent.click(clearBtn);

        await waitFor(() => {
          const cards = canvasElement.querySelectorAll('.post-card');
          expect(cards).toHaveLength(8);
        });

        await waitFor(() => {
          const restoredSummary = canvasElement.querySelector(
            '.results-summary',
          ) as HTMLElement;
          expect(restoredSummary.textContent?.trim()).toBe(
            'Showing 1 – 8 of 100 posts',
          );
        });
      });

      await step('Search: resets pagination to page 1', async () => {
        const page2Btn = canvas.getByRole('button', { name: '2' });
        await userEvent.click(page2Btn);

        await waitFor(() => {
          const summaryPage2 = canvasElement.querySelector(
            '.results-summary',
          ) as HTMLElement;
          expect(summaryPage2.textContent?.trim()).toBe(
            'Showing 9 – 16 of 100 posts',
          );
        });

        const searchInput = canvasElement.querySelector(
          '.search-input',
        ) as HTMLInputElement;
        await userEvent.type(searchInput, 'est');

        await waitFor(() => {
          const activePage = canvasElement.querySelector(
            '.page-num.active',
          ) as HTMLElement;
          expect(activePage.textContent?.trim()).toBe('1');
        });

        const clearBtn = canvas.getByRole('button', { name: 'Clear search' });
        await userEvent.click(clearBtn);

        await waitFor(() => {
          const cards = canvasElement.querySelectorAll('.post-card');
          expect(cards).toHaveLength(8);
        });
      });

      await step('Pagination: Next → page 2', async () => {
        await userEvent.click(getNextBtn());

        await waitFor(() => {
          const summary = canvasElement.querySelector(
            '.results-summary',
          ) as HTMLElement;
          expect(summary.textContent?.trim()).toBe(
            'Showing 9 – 16 of 100 posts',
          );
        });

        const activePage = canvasElement.querySelector(
          '.page-num.active',
        ) as HTMLElement;
        await expect(activePage.textContent?.trim()).toBe('2');
        await expect(getPrevBtn().disabled).toBe(false);
      });

      await step('Pagination: click page 3', async () => {
        const page3Btn = canvas.getByRole('button', { name: '3' });
        await userEvent.click(page3Btn);

        await waitFor(() => {
          const summary = canvasElement.querySelector(
            '.results-summary',
          ) as HTMLElement;
          expect(summary.textContent?.trim()).toBe(
            'Showing 17 – 24 of 100 posts',
          );
        });

        const activePage = canvasElement.querySelector(
          '.page-num.active',
        ) as HTMLElement;
        await expect(activePage.textContent?.trim()).toBe('3');
      });

      await step('Pagination: Next to 4 then click 5', async () => {
        await userEvent.click(getNextBtn());

        await waitFor(() => {
          const summary = canvasElement.querySelector(
            '.results-summary',
          ) as HTMLElement;
          expect(summary.textContent?.trim()).toBe(
            'Showing 25 – 32 of 100 posts',
          );
        });

        const page5Btn = canvas.getByRole('button', { name: '5' });
        await userEvent.click(page5Btn);

        await waitFor(() => {
          const summary = canvasElement.querySelector(
            '.results-summary',
          ) as HTMLElement;
          expect(summary.textContent?.trim()).toBe(
            'Showing 33 – 40 of 100 posts',
          );
        });

        const activePage = canvasElement.querySelector(
          '.page-num.active',
        ) as HTMLElement;
        await expect(activePage.textContent?.trim()).toBe('5');
      });

      await step('Pagination: Prev → page 4', async () => {
        await userEvent.click(getPrevBtn());

        await waitFor(() => {
          const summary = canvasElement.querySelector(
            '.results-summary',
          ) as HTMLElement;
          expect(summary.textContent?.trim()).toBe(
            'Showing 25 – 32 of 100 posts',
          );
        });

        const activePage = canvasElement.querySelector(
          '.page-num.active',
        ) as HTMLElement;
        await expect(activePage.textContent?.trim()).toBe('4');
      });

      await step('Pagination: last page, Next disabled', async () => {
        const lastPageBtn = canvas.getByRole('button', { name: '13' });
        await userEvent.click(lastPageBtn);

        await waitFor(() => {
          const summary = canvasElement.querySelector(
            '.results-summary',
          ) as HTMLElement;
          expect(summary.textContent?.trim()).toBe(
            'Showing 97 – 100 of 100 posts',
          );
        });

        await expect(getNextBtn().disabled).toBe(true);
        await expect(getPrevBtn().disabled).toBe(false);
      });
    });
  },
};
