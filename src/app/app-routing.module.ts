import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full'
  },
  {
    path: 'courses',
    loadChildren: () => import('./pages/courses/courses.module').then( m => m.CoursesPageModule)
  },
  {
    path: 'course-details/:id',
    loadChildren: () => import('./pages/course-details/course-details.module').then( m => m.CourseDetailsPageModule)
  },
  {
    path: 'add-course/:id',
    loadChildren: () => import('./pages/add-course/add-course.module').then( m => m.AddCoursePageModule)
  },
  {
    path: 'add-course',
    loadChildren: () => import('./pages/add-course/add-course.module').then( m => m.AddCoursePageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
