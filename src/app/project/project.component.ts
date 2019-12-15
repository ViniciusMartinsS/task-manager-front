import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { ProjectHttpService } from '../services/http/endpoint/project.http.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  private user: any;
  public form: FormGroup;
  public projects: Array<any> | null = null;

  constructor(
    private toastrService: ToastrService,
    private projectHttpService: ProjectHttpService,
  ) { }

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
        this.toastrService.success('Project Created Successfully', 'Congrats', {
          timeOut: 3000
        });
      }

      return this.getProjects();
    } catch (err) {
      const { message = null } = err.error || err;
      this.toastrService.error(message, 'Something went wrong', {
        timeOut: 3000
      });
    }
  }

  private getUser(): void {
    this.user = JSON.parse(localStorage.getItem('_auth_info'));
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.toastrService.error('Check Your Form Data', 'Invalid Form', {
      timeOut: 3000
      });

      return;
  }

    this.createProject(this.form.value);
  }

  public async getProjects(): Promise<void> {
    if (!this.user) {
      this.getUser();
    }

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
    if (!this.user) {
      this.getUser();
    }

    const authorization = this.user.token;
    const response = await this.projectHttpService.remove(projectId, authorization);

    if (response && response.status && response.result) {
      this.toastrService.success('Project Removed Successfully', 'Congrats', {
        timeOut: 3000
      });
    }

    return this.getProjects();
  }
}
