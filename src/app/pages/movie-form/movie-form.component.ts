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
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { IMovie } from '../../models/movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD-MM-YYYY',
        },
        display: {
          dateInput: 'DD-MM-YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
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
    MatDatepickerModule,
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
      releaseYear: [null, Validators.required],
      genre: [null, Validators.required],
      details: [null, Validators.required],
      posterUrl: [null, Validators.required],
    });
  }

  onClose() {
    this.resetEmployeeForm();
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log('this.data', this.data);
    if (this.data) {
      this.movieForm.patchValue(this.data);
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.movieForm.valid) {
      const payload = {
        ...this.movieForm.value
      };
      if (this.data) {
        this.movieService
          .updateMovie(this.data.movieId as string, payload)
          .subscribe({
            next: (response: any) => {
              this.onClose();
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
            this.onClose();
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
