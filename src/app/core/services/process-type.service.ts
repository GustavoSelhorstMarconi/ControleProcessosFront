import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../shared/models/response';
import { ProcessType } from '../../feature/process-type/process-type';
import { environment } from '../../../environments/environment.development';
import { HeaderCreator } from '../../shared/helpers/header-creator';

@Injectable({
  providedIn: 'root'
})
export class ProcessTypeService {
  baseUrl: string = environment.API_URL + 'processtype';

  constructor(private http: HttpClient) { }

  public post(processType: ProcessType): Observable<any> {
    const httpOptions = HeaderCreator.CreateHeader();

    return this.http.post(this.baseUrl, JSON.stringify(processType), httpOptions);
  }

  public put(processType: ProcessType): Observable<any> {
    const httpOptions = HeaderCreator.CreateHeader();

    return this.http.put(this.baseUrl, JSON.stringify(processType), httpOptions);
  }

  public getAll(): Observable<Response<Array<ProcessType>>>
  {
    return this.http.get<Response<Array<ProcessType>>>(this.baseUrl);
  }

  public delete(idProcessType: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + idProcessType);
  }
}
