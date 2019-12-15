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

  public createTask(requestModel: any): Promise<any> {
    return this.post(this.baseURI, requestModel);
  }

  public getTasks(projectId: number): Promise<any> {
    return this.get(`${this.baseURI}/${projectId}`);
  }

  public deleteTask(taskId: number): Promise<any> {
    return this.delete(`${this.baseURI}/${taskId}`);
  }

  public updateTask(taskId: number, requestModel: any): Promise<any> {
    return this.put(`${this.baseURI}/${taskId}`, requestModel);
  }
}
