import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/models/course';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss'],
})
export class CourseDetailsPage implements OnInit {
  courseId!: string;
  course: Course | undefined;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.courseId = params.get('id') || '';  // Get the 'id' parameter from the URL
      console.log('Course ID:', this.courseId);
      // Now you can use this.courseId to fetch course details from a database or API
    });

    // Fetch course details from the database
    this.dbService.fetchCourse(this.courseId).then(course => {
      this.course = course;
    }).catch(error => {
      console.error('Error fetching course details:', error);
    });

  }

  updateCourse(courseCode: string) {
    // Use the router to navigate to the 'addcourse' page and pass courseCode as a query parameter
    this.router.navigate(['/add-course/'+courseCode]);
  }

  deleteCourse(code: string) {
    // Delete the course from the database
    this.dbService.deleteCourse(code).then(() => {
      console.log('Course deleted successfully.');
      // Navigate back to the list of courses
      this.router.navigate(['/courses']);
    }).catch(error => {
      console.error('Error deleting course:', error);
    });
  }

}
