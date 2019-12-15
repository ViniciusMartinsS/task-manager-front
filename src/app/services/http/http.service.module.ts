import { ModuleWithProviders, NgModule } from '@angular/core';

import { UserHttpService } from './endpoint/user.http.service';
import { AuthHttpService } from './endpoint/auth.http.service';
import { ProjectHttpService } from './endpoint/project.http.service';
import { TaskHttpService } from './endpoint/task.http.service';

@NgModule({
  providers: [
    UserHttpService,
    AuthHttpService,
    ProjectHttpService,
    TaskHttpService
  ]
})
export class HttpServiceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HttpServiceModule
    };
  }
}
