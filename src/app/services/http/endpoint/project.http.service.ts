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

  public createProject(requestModel: any): Promise<any> {
    return this.post(this.baseURI, requestModel);
  }

  public getProjects(): Promise<any> {
    return this.get(this.baseURI);
  }

  public deleteProject(projectId: number): Promise<any> {
    return this.delete(`${this.baseURI}/${projectId}`);
  }

  public updateProject(projectId: number, requestModel: any): Promise<any> {
    return this.put(`${this.baseURI}/${projectId}`, requestModel);
  }
}
