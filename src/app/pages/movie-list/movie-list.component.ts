import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MovieService } from '../../services/movie.service';
import { IMovie } from '../../models/movie.interface';
import { MovieFormComponent } from '../movie-form/movie-form.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MovieFormComponent,
    MatGridListModule,
    MatSnackBarModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css',
})
export class MovieListComponent implements OnInit {
  movie!: IMovie | any;
  movies: IMovie[] = [];
  isModalOpen: boolean = false;
  dialogRef!: MatDialogRef<any>;
  value: string = "";

  constructor(
    private movieService: MovieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllMovies();
  }

  trackByMovieId(index: number, movie: IMovie): string | any {
    return movie.movieId;
  }

  searchMovies() {
    this.getAllMovies(this.value);
  }

  clearSearchBar() {
    this.value = ""
    this.getAllMovies();
  }

  getAllMovies(searchKeyword: string = "") {
    this.movieService.getAllMovies(searchKeyword).subscribe({
      next: (response) => {
        console.log({ response });
        if (response.data) {
          this.movies = MovieService.movieList = response.data;
        }
      },
      error: (error) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      },
    });
  }

  openModal(movie?: any, index?: number) {
    this.dialogRef = this.dialog.open(MovieFormComponent, {
      width: '700px',
      data: movie,
    });
    this.movie = movie;
    this.dialogRef.afterClosed().subscribe((data) => {
      
      if(data.action === 'add'){
        this.movies.push({...data.data});
      }
      else if(data.action === 'update'){
        this.movies[index as any] = {...data.data};
      }
    });
  }

  deleteMovie(id: string, index: number) {
    this.movieService.deleteMovie(id).subscribe({
      next: (response) => {
        this.movies.splice(index, 1);
        this.snackBar.open('Movie deleted', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      },
      error: (error) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      },
    });
  }
}
