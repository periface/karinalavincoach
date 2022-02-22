import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { NewsPost } from './models/news.models';

@Injectable({ providedIn: 'root' })
export class NewsService {
  news$: Observable<NewsPost[]>;
  newsCollection: AngularFirestoreCollection<NewsPost>;
  /**
   *
   */
  constructor(private db: AngularFirestore) {
    this.newsCollection = db.collection<NewsPost>('news');
    this.news$ = this.newsCollection.valueChanges();
  }
  getAll(): Observable<NewsPost[]> {
    return this.newsCollection.valueChanges();
  }
  get(slug: string): Observable<NewsPost> {
    return this.db
      .collection<NewsPost>('news', (ref) =>
        ref.where('slug', '==', slug).limit(1)
      )
      .valueChanges()
      .pipe(
        flatMap((news): NewsPost[] => {
          return news;
        })
      );
  }
}
