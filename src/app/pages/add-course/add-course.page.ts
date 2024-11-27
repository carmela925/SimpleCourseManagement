import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/models/course';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.page.html',
  styleUrls: ['./add-course.page.scss'],
})
export class AddCoursePage implements OnInit {
  courseForm!: FormGroup;
  courseId: string = '';
  course: Course | undefined;
  constructor(private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute,private dbService: DbService, private route: Router) { }

  ngOnInit() {
    this.courseForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]{1,10}')]], // Example pattern for code
      creditValue: ['', [Validators.required, Validators.min(1)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      outline: ['', Validators.required]
    });

    this.activatedRoute.paramMap.subscribe(params => {
      this.courseId = params.get('id') || '';  // Get the 'id' parameter from the URL
      console.log('Course ID:', this.courseId);
      // Now you can use this.courseId to fetch course details from a database or API
    });

    if (this.courseId) {
      this.dbService.fetchCourse(this.courseId).then(course => {
        this.course = course;
      }).catch(error => {
        console.error('Error fetching course details:', error);
      });
    }
  }

  addCourse(){
    this.course = {
      title: this.courseForm.value.title,
      description: this.courseForm.value.description,
      code: this.courseForm.value.code,
      creditValue: this.courseForm.value.creditValue,
      duration: this.courseForm.value.duration,
      outline: this.courseForm.value.outline
    };
    if (!this.courseId) {
      this.dbService.addCourse(this.course).then(() => {
        console.log('Course deleted successfully.');

        // Navigate back to the list of courses
        this.route.navigate(['/courses']);
      }).catch(error => {
        console.error('Error adding course:', error);
      });
    } else {
      this.dbService.updateCourse(this.course).then(() => {
        console.log('Course deleted successfully.');

        // Navigate back to the list of courses
        this.route.navigate(['/courses']);
      }).catch(error => {
        console.error('Error adding course:', error);
      });
    }
  }
}
