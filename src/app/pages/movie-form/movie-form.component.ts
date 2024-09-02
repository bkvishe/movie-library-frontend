import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

import { IMovie } from '../../models/movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  providers: [],
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css',
})
export class MovieFormComponent implements OnInit {
  movieForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MovieFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMovie | undefined
  ) {
    this.movieForm = this.fb.group({
      name: [null, Validators.required],
      releaseYear: [
        null,
        [
          Validators.required,
          Validators.pattern(/^\d{4}$/),
          Validators.min(1888),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      genre: [null, Validators.required],
      actors: [null, Validators.required],
      director: [null, Validators.required],
      language: [null, Validators.required],
      details: [null, Validators.required],
      posterUrl: [null, Validators.required],
    });
  }

  onClose(action?: string, data?: IMovie) {
    this.resetEmployeeForm();
    this.dialogRef.close({ action, data });
  }

  ngOnInit(): void {
    console.log('this.data', this.data);
    if (this.data) {
      this.movieForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.movieForm.valid) {
      console.log({movieForm: this.movieForm});
      const payload = {
        ...this.movieForm.value,
        releaseYear: Number(this.movieForm.value.releaseYear)
      };
      if (this.data) {
        this.movieService
          .updateMovie(this.data.movieId as string, payload)
          .subscribe({
            next: (response: any) => {
              this.onClose('update', response.data);
              this.snackBar.open('Movie updated', 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              });
            },
            error: (error: any) => {
              this.snackBar.open(error.error.message, 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              });
            },
          });
      } else {
        this.movieService.createMovie(payload).subscribe({
          next: (response: any) => {
            this.onClose('add', response.data);
            this.snackBar.open('Movie added', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
          },
          error: (error: any) => {
            this.snackBar.open(error.error.message, 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
          },
        });
      }
    } else {
      this.movieForm.markAllAsTouched();
    }
  }

  resetEmployeeForm() {
    this.data = undefined;
    this.movieForm.reset();
  }
}
