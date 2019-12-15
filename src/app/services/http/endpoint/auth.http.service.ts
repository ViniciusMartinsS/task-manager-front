import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthHttpService extends HttpService {
  constructor(
    protected http: HttpClient
  ) {
    super(http);

    this.baseURI = 'auth';
  }

  public auth(requestModel: any): Promise<any> {
    return this.post(`${this.baseURI}/login`, requestModel);
  }

  public register(requestModel: any): Promise<any> {
    return this.post(`${this.baseURI}/register`, requestModel);
  }
}
