import { HttpClient } from '@angular/common/http';

export abstract class HttpService {
  protected baseURL: string = 'http://localhost:3000';
  protected baseURI: string;

  constructor(
    protected http: HttpClient,
  ) {}

  protected async post(uri: string, request: any, authorization?: string): Promise<any> {
    const url = this.defineUrl(uri);
    const options = authorization ? { headers: { authorization } } : {}
    return this.http.post(url, request, options).toPromise();
  }

  protected async get(uri: string, queryString?: string, authorization?: string): Promise<any> {
    const url = this.defineUrl(uri);
    const options = authorization ? { headers: { authorization } } : {}
    return this.http.get(`${url}${queryString}`, options).toPromise();
  }

  protected async put(uri: string, request: any): Promise<any> {
    const url = this.defineUrl(uri);
    return this.http.put(url, request).toPromise();
  }

  protected async delete(uri: string, authorization?: string): Promise<any> {
    const url = this.defineUrl(uri);
    const options = authorization ? { headers: { authorization } } : {}
    return this.http.delete(url, options).toPromise();
  }

  protected defineUrl(uri: string) {
    return `${this.baseURL}/${uri}`;
  }
}
