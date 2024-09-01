import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MovieListComponent } from './movie-list.component';
import { MovieService } from '../../services/movie.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let movieService: MovieService;
  let dialog: MatDialog;

  const mockMovies = [
    { _id: 1, title: 'Movie 1', genre: 'test', description: 'test', posterUrl: 'http://example.com/image.jpeg', releaseDate: '2023-01-01'},
    { _id: 2, title: 'Movie 2', genre: 'test', description: 'test', posterUrl: 'http://example.com/image.jpeg', releaseDate: '2023-01-01'}
  ];

  beforeEach(waitForAsync(() => {
    const movieServiceStub = {
      getAllMovies: () => of({ data: mockMovies })
    };

    const dialogStub = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(null)
      })
    };

    TestBed.configureTestingModule({
      declarations: [],
      imports: [MovieListComponent, BrowserAnimationsModule, NoopAnimationsModule],
      providers: [
        { provide: MovieService, useValue: movieServiceStub },
        { provide: MatDialog, useValue: dialogStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllMovies on init', () => {
    spyOn(component, 'getAllMovies');
    component.ngOnInit();
    expect(component.getAllMovies).toHaveBeenCalled();
  });

  it('getAllMovies should set movies from service', () => {
    component.getAllMovies();
    expect(component.movies.length).toBeGreaterThan(0);
  });

  it('searchMovies should filter movies', () => {
    const mockEvent = {
      target: { value: 'Movie 1' }
    };
    component.movies = mockMovies;
    component.searchMovies(mockEvent);
    expect(component.filteredMovies.length).toBe(1);
  });

  // it('loadMovie should set movie and open modal', () => {
  //   const movieToLoad = mockMovies[0];
  //   component.loadMovie(movieToLoad);
  //   expect(component.movie).toEqual(movieToLoad);
  // });

  // it('openModal should open a dialog and call getAllMovies after dialog is closed', waitForAsync(() => {
  //   spyOn(component, 'getAllMovies');
  //   component.openModal();
  //   fixture.detectChanges();

  //   component.dialogRef.afterClosed().subscribe(() => {
  //     expect(component.getAllMovies).toHaveBeenCalled();
  //   });
  // }));
});
