import { Injectable } from '@angular/core';
import {HttpClient} from'@angular/common/http';
import { Observable } from 'rxjs';
import { Workers } from 'src/app/models/workers.model';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private servidor = 'http://localhost:3000/worker';

  constructor(private http: HttpClient) { }

  getWorkers(): Observable<Workers[]>{
    const endpoint = this.servidor;
    const headers = {
      'Content-Type':"application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    }
    return this.http.get<Workers[]>(endpoint,{headers});
  }

  addWorker(worker: Workers): Observable<any>{
    const endpoint = `${this.servidor}/addWorker`;
    return this.http.post(endpoint, worker);
  }

}
