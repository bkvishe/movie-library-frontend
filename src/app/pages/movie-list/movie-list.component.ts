import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
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
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css',
})
export class MovieListComponent implements OnInit {
  movie!: IMovie | undefined;
  movies: IMovie[] = [];
  isModalOpen: boolean = false;
  dialogRef!: MatDialogRef<any>;

  constructor(
    private movieService: MovieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllMovies();
  }

  getAllMovies(searchKeyword: string = "") {
    this.movieService.getAllMovies(searchKeyword).subscribe({
      next: (response) => {
        console.log({ response });
        if (response.data) {
          this.movies = response.data;
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

  searchMovies(event: any) {
    this.getAllMovies(event.target.value);
  }

  loadMovie(movie: IMovie) {
    console.log({ movie });
    this.movie = movie;
    this.openModal();
  }

  openModal() {
    console.log('this.movie', this.movie);
    this.dialogRef = this.dialog.open(MovieFormComponent, {
      width: '700px',
      data: this.movie,
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.movie = undefined;
      this.getAllMovies();
    });
  }

  deleteMovie(id: string) {
    this.movieService.deleteMovie(id).subscribe({
      next: (response) => {
        // this.getAllMovies();
        console.log({movies: this.movies});
        this.movies = this.movies.filter((m) => {
          return m.movieId !== id
        });
        console.log({movies2: this.movies});
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
