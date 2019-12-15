import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserHttpService extends HttpService {
  constructor(
    protected http: HttpClient
  ) {
    super(http);

    this.baseURI = 'users';
  }

  public getUser(requestModel: any): Promise<any> {
    return this.get(this.baseURI, requestModel);
  }
}
