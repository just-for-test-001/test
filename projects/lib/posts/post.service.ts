import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  private readonly posts$ = this.http.get<Post[]>(this.apiUrl).pipe(
    shareReplay(1),
  );

  getAll(): Observable<Post[]> {
    return this.posts$;
  }
}
