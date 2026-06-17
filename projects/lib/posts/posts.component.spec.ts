import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsComponent } from './posts.component';
import { PostService } from './post.service';

const mockPosts = [
  { userId: 1, id: 1, title: 'First post', body: 'Body of first' },
  { userId: 1, id: 2, title: 'Second post', body: 'Body of second' },
  { userId: 2, id: 3, title: 'Third article', body: 'Body of third' },
];

describe('PostsComponent (with loaded data)', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    req.flush(mockPosts);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render post cards after loading', () => {
    const cards = fixture.nativeElement.querySelectorAll('.post-card');
    expect(cards.length).toBe(3);

    const titles = fixture.nativeElement.querySelectorAll('.post-title');
    expect(titles[0].textContent.trim()).toBe('First post');
    expect(titles[1].textContent.trim()).toBe('Second post');
    expect(titles[2].textContent.trim()).toBe('Third article');
  });

  it('should filter posts by search query', () => {
    component.onSearchChange('third');
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.post-card');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Third article');
  });

  it('should reset to page 1 when search changes', () => {
    component.goToPage(2);
    component.onSearchChange('first');
    expect(component.currentPage()).toBe(1);
  });

  it('should navigate pages', () => {
    expect(component.totalPages()).toBe(1);

    const manyPosts = Array.from({ length: 20 }, (_, i) => ({
      userId: 1,
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body ${i + 1}`,
    }));

    component['allPosts'].set(manyPosts);
    fixture.detectChanges();

    expect(component.totalPages()).toBe(3);

    component.goToPage(2);
    fixture.detectChanges();
    expect(component.currentPage()).toBe(2);

    const cards = fixture.nativeElement.querySelectorAll('.post-card');
    expect(cards.length).toBe(8);
    expect(cards[0].textContent).toContain('Post 9');
  });

  it('should show empty state when search matches nothing', () => {
    component.onSearchChange('zzzzzzz');
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.empty-state');
    expect(empty).toBeTruthy();
    const cards = fixture.nativeElement.querySelectorAll('.post-card');
    expect(cards.length).toBe(0);
  });
});

describe('PostsComponent (loading & error states)', () => {
  let fixture: ComponentFixture<PostsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PostService,
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show skeleton while loading', () => {
    fixture = TestBed.createComponent(PostsComponent);
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('.skeleton-card');
    expect(skeletons.length).toBe(8);

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    req.flush(mockPosts);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.post-card');
    expect(cards.length).toBe(3);
  });

  it('should show error state on HTTP failure', () => {
    fixture = TestBed.createComponent(PostsComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.error-state');
    expect(errorEl).toBeTruthy();
  });

  it('should retry loading on retry button click', () => {
    fixture = TestBed.createComponent(PostsComponent);
    fixture.detectChanges();

    let req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    const retryBtn = fixture.nativeElement.querySelector('.retry-btn') as HTMLButtonElement;
    retryBtn.click();
    fixture.detectChanges();

    req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    req.flush(mockPosts);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.post-card');
    expect(cards.length).toBe(3);
  });
});
