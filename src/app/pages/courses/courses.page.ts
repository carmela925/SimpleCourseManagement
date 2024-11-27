import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {
  courses!: Course[];
  active: boolean = false;
  searchText: string = '';
  constructor(private dbService: DbService) { }

  ngOnInit() {
    this.getCourses();
  }

  getCourses(){
    this.dbService.getAllCourses().then((data) => {
      console.log('Fetched courses:', data);
      this.courses = data;
    }).catch((error) => {
      console.error('Error fetching courses:', error);
    });
  }

  search(){
    if(this.active){
      this.courses = this.courses.filter((course) => course.title.toLowerCase().includes(this.searchText.toLowerCase()));
    } else {
      this.active = false;
    }
  }
}
