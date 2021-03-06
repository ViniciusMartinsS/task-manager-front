import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProjectHttpService extends HttpService {
  constructor(
    protected http: HttpClient
  ) {
    super(http);

    this.baseURI = 'projects';
  }

  public create(request: any, authorization: string): Promise<any> {
    return this.post(this.baseURI, request, authorization);
  }

  public list(userId: number, authorization: string): Promise<any> {
    let queryString = null;

    if (userId) {
      queryString = `?userId=${userId}`;
    }

    return this.get(this.baseURI, queryString, authorization);
  }

  public remove(projectId: number, authorization: string): Promise<any> {
    return this.delete(`${this.baseURI}/${projectId}`, authorization);
  }

  public update(projectId: number, request: any, authorization: string): Promise<any> {
    return this.put(`${this.baseURI}/${projectId}`, request, authorization);
  }
}
