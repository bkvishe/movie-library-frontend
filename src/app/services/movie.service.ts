import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IApiResponse } from '../models/api-response.interface';
import { IMovie } from '../models/movie.interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MovieService {
  url = `${environment.apiBaseUrl}/movies`;
  headers = new HttpHeaders().set('x-api-key', '123');
  public static movieList: IMovie[] = [];
  constructor(
    private http: HttpClient
  ) { }

  getAllMovies(searchKeyword: string = ""): Observable<IApiResponse<IMovie[]>> {
    const urlString = searchKeyword ? `${this.url}?keyword=${searchKeyword}` : this.url;
    return this.http.get<IApiResponse<IMovie[]>>(urlString, { headers: this.headers });
  }

  getMovie(id: string): Observable<IApiResponse<IMovie>> {
    return this.http.get<IApiResponse<IMovie>>(`${this.url}/${id}`, { headers: this.headers });
  }

  createMovie(movie: IMovie): Observable<any> {
    return this.http.post(`${this.url}`, movie, { headers: this.headers });
  }

  updateMovie(id: string, movie: IMovie): Observable<any> {
    return this.http.put(`${this.url}/${id}`, movie, { headers: this.headers });
  }

  deleteMovie(id: string): Observable<IApiResponse<any>> {
    return this.http.delete<IApiResponse<any>>(`${this.url}/${id}`, { headers: this.headers });
  }
}
