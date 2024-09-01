import { IApiResponse } from '../models/api-response.interface';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { IMovie } from '../models/movie.interface';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MovieService', () => {
  let service: MovieService;
  let httpTestingController: HttpTestingController;
  let mockApiResponse: IApiResponse<IMovie[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [MovieService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(MovieService);
    httpTestingController = TestBed.inject(HttpTestingController);

    mockApiResponse = {
      status: 'success',
      message: 'Data fetched successfully',
      data: [{
        _id: 1,
        title: 'Test Movie',
        genre: "test",
        description: "test",
        posterUrl: "test",
        releaseDate: '2023-01-01',
      }]
    };
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all movies', () => {
    service.getAllMovies().subscribe((response: IApiResponse<IMovie[]>) => {
      expect(response.status).toEqual('success');
    });

    const req = httpTestingController.expectOne(service.url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockApiResponse);
  });

  it('should get a single movie', () => {
    const mockMovie: IMovie = {
      _id: 1,
      title: 'Test Movie',
      genre: "test",
      description: "test",
      posterUrl: "test",
      releaseDate: '2023-01-01',
    };

    service.getMovie(1).subscribe(response => {
      expect(response.data).toEqual(mockMovie);
    });

    const req = httpTestingController.expectOne(`${service.url}/1`);
    expect(req.request.method).toEqual('GET');
    req.flush({ success: true, data: mockMovie });
  });

  it('should post a new movie', () => {
    const newMovie: IMovie = {
      title: 'New Movie',
      genre: "test",
      description: "test",
      posterUrl: "test",
      releaseDate: '2023-01-01',
    };

    service.createMovie(newMovie).subscribe(response => {
      expect(response).toEqual(jasmine.objectContaining({
        success: true
      }));
    });

    const req = httpTestingController.expectOne(service.url);
    expect(req.request.method).toEqual('POST');
    req.flush({ success: true, data: newMovie });
  });

  it('should update a movie', () => {
    const updatedMovie: IMovie = {
      _id: 1,
      title: 'Updated Movie',
      genre: "test",
      description: "test",
      posterUrl: "test",
      releaseDate: '2023-01-01',
    };

    service.updateMovie(1, updatedMovie).subscribe(response => {
      expect(response).toEqual(jasmine.objectContaining({
        status: 'success'
      }));
    });

    const req = httpTestingController.expectOne(`${service.url}/1`);
    expect(req.request.method).toEqual('PUT');
    req.flush({ status: 'success', data: updatedMovie });
  });

  it('should delete a movie', () => {
    service.deleteMovie(1).subscribe(response => {
      expect(response.status).toEqual('success');
    });

    const req = httpTestingController.expectOne(`${service.url}/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({ status: 'success' });
  });

  // ... more tests as needed
});
