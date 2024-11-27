import { Injectable, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class DbService implements OnInit{
  private dbInstance!: SQLiteObject
  courses: Course[] = [];

  constructor(private sqlite: SQLite) { }
  ngOnInit(): void {
    this.initializeCourseDatabase();
    this.fetchCourses();
  }

  async initializeCourseDatabase() {
    return this.sqlite.create({ name: 'data.db', location: 'default' }).then(
      (db) => {
        this.dbInstance = db;
        return db.executeSql(
          'CREATE TABLE IF NOT EXISTS COURSES (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
            'code VARCHAR(10) UNIQUE, ' +
            'title VARCHAR(100), ' +
            'description TEXT, ' +
            'creditValue INTEGER, ' +
            'outline TEXT, ' +
            'duration INTEGER)',
          []
        ).then(() => {
          console.log('COURSES table created.');
        }).catch((error) => {
          console.error('Error creating COURSES table:', error);
        });
      }
    ).catch((error) => {
      console.error('Error initializing database:', error);
      throw error;
    });
  }

  async getAllCourses(): Promise<Course[]> {
    let courses: Course[] = [];
    if (this.dbInstance) {
      return this.dbInstance.executeSql('SELECT * FROM COURSES', []).then(
        (resultSet) => {
          for (let i = 0; i < resultSet.rows.length; i++) {
            const row = resultSet.rows.item(i);
            courses.push({
              code: row.code,
              title: row.title,
              description: row.description,
              creditValue: row.creditValue,
              outline: row.outline,
              duration: row.duration,
            });
          }
          this.courses = courses;
          return courses;
        }
      ).catch((error) => {
        console.error('Error retrieving courses:', error);
        return courses; // Return empty array on error
      });
    } else {
      console.warn('Database instance not initialized.');
      return courses;
    }
  }

  async addCourse(course: Course): Promise<void> {
    if (this.dbInstance) {
      return this.dbInstance.executeSql(
        'INSERT INTO COURSES (code, title, description, creditValue, outline, duration) VALUES (?,?,?,?,?,?)',
        [course.code, course.title, course.description, course.creditValue, course.outline, course.duration]
      ).then(() => {
        console.log('Course added successfully.');
        this.courses.push(course);
      }).catch((error) => {
        console.error('Error adding course:', error);
      });
    } else {
      console.warn('Database instance not initialized.');
    }
  }

  async updateCourse(course: Course): Promise<void> {
    if (this.dbInstance) {
      return this.dbInstance.executeSql(
        'UPDATE COURSES SET title=?, description=?, creditValue=?, outline=?, duration=? WHERE code=?',
        [course.title, course.description, course.creditValue, course.outline, course.duration, course.code]
      ).then(() => {
        console.log('Course updated successfully.');
        const index = this.courses.findIndex((c) => c.code === course.code);
      }).catch((error) => {
        console.error('Error updating course:', error);
      });
    } else {
      console.warn('Database instance not initialized.');
    }
  }

  async deleteCourse(code: string): Promise<void> {
    if (this.dbInstance) {
      return this.dbInstance.executeSql(
        'DELETE FROM COURSES WHERE code=?',
        [code]
      ).then(() => {
        console.log('Course deleted successfully.');
        const index = this.courses.findIndex((c) => c.code === code);
        if (index > -1) {
          this.courses.splice(index, 1);
        }
      }).catch((error) => {
        console.error('Error deleting course:', error);
      });
    } else {
      console.warn('Database instance not initialized.');
    }
  }

  async fetchCourse(code: string): Promise<Course | undefined> {
    if (this.dbInstance) {
      return this.dbInstance.executeSql(
        'SELECT * FROM COURSES WHERE code=?',
        [code]
      ).then((resultSet) => {
        if (resultSet.rows.length > 0) {
          const row = resultSet.rows.item(0);
          return {
            code: row.code,
            title: row.title,
            description: row.description,
            creditValue: row.creditValue,
            outline: row.outline,
            duration: row.duration,
          };
        } else {
          console.log('Course not found.');
          return undefined;
        }
      }).catch((error) => {
        console.error('Error fetching course:', error);
        return undefined;
      });
    } else {
      console.warn('Database instance not initialized.');
      return undefined;
    }
  }

  fetchCourses() {
    this.getAllCourses().then((data) => {
      console.log('Fetched courses:', data);
      this.courses = data;
    }).catch((error) => {
      console.error('Error fetching courses:', error);
    });
  }
}
