import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TaskHttpService extends HttpService {
  constructor(
    protected http: HttpClient
  ) {
    super(http);

    this.baseURI = 'tasks';
  }

  public create(requestModel: any, authorization: string): Promise<any> {
    return this.post(this.baseURI, requestModel, authorization);
  }

  public list(projectId: number,  authorization: string): Promise<any> {
    let queryString = null;

    if (projectId) {
      queryString = `?projectId=${projectId}`;
    }

    return this.get(this.baseURI, queryString, authorization);
  }

  public remove(taskId: number, authorization: string): Promise<any> {
    return this.delete(`${this.baseURI}/${taskId}`, authorization);
  }

  public update(taskId: number, requestModel: any): Promise<any> {
    return this.put(`${this.baseURI}/${taskId}`, requestModel);
  }
}
