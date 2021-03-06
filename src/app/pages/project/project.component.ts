import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProjectHttpService } from '../../services/http/endpoint/project.http.service';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  private user: any;
  public form: FormGroup;
  public projects: Array<any> | null = null;
  public update: boolean = false;
  public projectId: number = null;

  constructor(
    private toastrService: ToastrService,
    private projectHttpService: ProjectHttpService,
  ) { }

  public toastr: ToastComponent = new ToastComponent(this.toastrService);

  ngOnInit() {
    this.getProjects();
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
      ])
    }, {
      updateOn: 'blur'
    });
  }

  private async createProject(project): Promise<void> {
    try {
      this.getUser();
      const params  = { ...project, userId: this.user.id };
      const response = await this.projectHttpService.create(params, this.user.token);

      if (response && response.status && response.result) {
        this.toastr.generateToastrAlert( 'Congrats', 'Project Created Successfully', 'success');
      }

      return this.getProjects();
    } catch (err) {
      const { message = null } = err.error || err;
      this.toastr.generateToastrAlert( 'Something went wrong', message, 'error');
    }
  }

  private async updateProject(project): Promise<void> {
    try {
      this.getUser();
      const params  = { ...project };
      const response = await this.projectHttpService.update(this.projectId, params, this.user.token);

      if (response && response.status && response.result) {
        this.toastr.generateToastrAlert( 'Congrats', 'Project Updated Successfully', 'success');
      }

      this.update = false;
      this.projectId = null;

      return this.getProjects();
    } catch (err) {
      const { message = null } = err.error || err;
      this.toastr.generateToastrAlert( 'Something went wrong', message, 'error');
    }
  }

  private getUser(): void {
    if (this.user) {
      return;
    }

    this.user = JSON.parse(localStorage.getItem('_auth_info'));
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.toastr.generateToastrAlert('Invalid Form', 'Check Your Form Data', 'error');
      return;
  }

    if (this.update) {
      this.updateProject(this.form.value);
      return;
    }

    this.createProject(this.form.value);
  }

  public async getProjects(): Promise<void> {
    this.getUser();

    const userId = this.user.id;
    const authorization = this.user.token;

    const { result } = await this.projectHttpService.list(userId, authorization);

    if (!result || !Array.isArray(result) || !result.length) {
      this.projects = null;
      return;
    }

    this.projects = result;
  }

  public async removeProjects(projectId): Promise<void> {
    this.getUser();

    const authorization = this.user.token;
    const response = await this.projectHttpService.remove(projectId, authorization);

    if (response && response.status && response.result) {
      this.toastr.generateToastrAlert('Congrats', 'Project Removed Successfully', 'success');
      }

    return this.getProjects();
  }

  public onRequestUpdate(name, projectId) {
    this.form.setValue({ name });
    this.update = true;
    this.projectId = projectId;
  }
}
