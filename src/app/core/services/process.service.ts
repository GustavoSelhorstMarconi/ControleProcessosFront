import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Process } from '../../feature/process/process';
import { Response } from '../../shared/models/response';
import { environment } from '../../../environments/environment.development';
import { HeaderCreator } from '../../shared/helpers/header-creator';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  baseUrl: string = environment.API_URL + 'process';

  constructor(private http: HttpClient) { }

  public post(process: Process): Observable<Response<Process>> {
    const httpOptions = HeaderCreator.CreateHeader();

    return this.http.post<Response<Process>>(this.baseUrl, JSON.stringify(process), { headers: httpOptions?.headers });
  }

  public put(process: Process): Observable<Response<Process>> {
    const httpOptions = HeaderCreator.CreateHeader();

    return this.http.put<Response<Process>>(this.baseUrl, JSON.stringify(process), { headers: httpOptions?.headers });
  }

  public get(idProcessType: number): Observable<Response<Array<Process>>>
  {
    return this.http.get<Response<Array<Process>>>(this.baseUrl + '/' + idProcessType);
  }

  public delete(idProcess: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + idProcess);
  }
}
