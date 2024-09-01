import { TestBed, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MovieFormComponent } from './movie-form.component';
import { MovieService } from '../../services/movie.service';
import { IMovie } from '../../models/movie.interface';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MovieFormComponent', () => {
  let component: MovieFormComponent;
  let fixture: ComponentFixture<MovieFormComponent>;
  let movieService: MovieService;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const mockDialogData: IMovie = {
    movieId: '1',
    name: 'Test Movie',
    genre: "test",
    details: "test",
    posterUrl: "test",
    releaseYear: '2023-01-01',
    actors: '',
    director: '',
    rating: '',
    duration: '',
    language: ''
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [],
    imports: [ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        MovieFormComponent],
    providers: [
        FormBuilder,
        MovieService,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    movieService = TestBed.inject(MovieService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form values if data is provided', () => {
    component.ngOnInit();
    expect(component.movieForm.value).toEqual(jasmine.objectContaining({
      title: mockDialogData.name,
      genre: mockDialogData.genre,
      description: mockDialogData.details,
      posterUrl: mockDialogData.posterUrl,
      releaseDate: mockDialogData.releaseYear,
    }));
  });

  it('should close the dialog on close', () => {
    component.onClose();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should submit the form for update if data is provided', fakeAsync(() => {
    spyOn(movieService, 'updateMovie').and.returnValue(of({}));
    component.ngOnInit();
    component.onSubmit();
    tick();
    expect(movieService.updateMovie).toHaveBeenCalledWith(mockDialogData.movieId as string, jasmine.any(Object));
    flush();
  }));

  it('should submit the form for create if no data is provided', fakeAsync(() => {
    component.data = undefined;
    spyOn(movieService, 'createMovie').and.returnValue(of({}));
    component.movieForm.controls['title'].setValue('New Movie');
    component.movieForm.controls['releaseDate'].setValue('2024-01-01');
    component.onSubmit();
    tick();
    expect(movieService.createMovie).toHaveBeenCalledWith(jasmine.any(Object));
    flush();
  }));
});
