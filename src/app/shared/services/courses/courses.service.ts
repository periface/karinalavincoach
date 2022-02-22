import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course, CourseType } from './models/course.models';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  courseTypeCollection: AngularFirestoreCollection<CourseType>;
  /**
   *
   */
  constructor(private fb: AngularFirestore) {
    this.courseTypeCollection = this.fb.collection<CourseType>('courseTypes');
  }
  getCourseTypes(): Observable<CourseType[]> {
    return this.courseTypeCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as CourseType;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }
  getCourses(typeId: string): Observable<Course[]> {
    return this.fb
      .collection<Course>('courses', (ref) =>
        ref.where('courseTypeId', '==', typeId)
      )
      .valueChanges();
  }
  getCourse(courseId: string): Observable<Course | any> {
    return this.fb
      .collection<Course>('courses')
      .doc<Course>(courseId)
      .valueChanges();
  }
}
