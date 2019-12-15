import { HttpClient } from '@angular/common/http';

export abstract class HttpService {
  protected baseURL: string = 'http://localhost:3000';
  protected baseURI: string;

  constructor(
    protected http: HttpClient,
  ) {}

  protected async post(
    uri: string,
    requestModel: any,
  ): Promise<any> {
    const url = this.defineUrl(uri);
    return this.http.post(url, requestModel).toPromise();
  }

  protected async get(
    uri: string,
    requestModel?: any,
  ): Promise<any> {
    const url = this.defineUrl(uri);
    return this.http.get(url, requestModel).toPromise();
  }

  protected async put(
    uri: string,
    requestModel: any,
  ): Promise<any> {
    const url = this.defineUrl(uri);
    return this.http.put(url, requestModel).toPromise();
  }

  protected async delete(
    uri: string,
  ): Promise<any> {
    const url = this.defineUrl(uri);
    return this.http.delete(url).toPromise();
  }

  protected defineUrl(uri: string) {
    return `${this.baseURL}/${uri}`;
  }
}
