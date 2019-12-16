import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskHttpService } from '../../services/http/endpoint/task.http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  private user: any;
  private projectId: number;
  public update: boolean = false;
  public taskId: number = null;
  public form: FormGroup;
  public tasks: Array<any> | null = null;
  public tasksDone: Array<any> | null = null;

  constructor(
    private route: ActivatedRoute,
    private taskHttpService: TaskHttpService,
    private toastrService: ToastrService,
  ) { }

  public toastr: ToastComponent = new ToastComponent(this.toastrService);

  ngOnInit() {
    this.projectId = this.route.snapshot.params.projectId;
    this.getTasks(this.projectId);
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      description: new FormControl(null, [
        Validators.required,
      ])
    }, {
      updateOn: 'blur'
    });
  }

  private getUser(): void {
    if (this.user) {
       return;
    }

    this.user = JSON.parse(localStorage.getItem('_auth_info'));
  }

  private async createTask(task): Promise<void> {
    try {
      this.getUser();
      const params  = { ...task, projectId: this.projectId };
      const response = await this.taskHttpService.create(params, this.user.token);

      if (response && response.status && response.result) {
        this.toastr.generateToastrAlert('Congrats', 'Task Created Successfully' , 'success');
      }

      return this.getTasks(this.projectId);
    } catch (err) {
      const { message = null } = err.error || err;
      this.toastr.generateToastrAlert('Something went wrong', message , 'error');
    }
  }

  public async getTasks(projectId): Promise<void> {
    this.getUser();
    const authorization = this.user.token;

    const { result } = await this.taskHttpService.list(projectId, authorization);

    if (!result || !Array.isArray(result) || !result.length) {
      this.tasks = null;
      return;
    }

    this.tasks = result.filter(item => !item.done);
    this.tasksDone = result.filter(item => item.done);
  }

  private async updateTask(task): Promise<void> {
    try {
      this.getUser();
      const params  = { ...task };
      const response = await this.taskHttpService.update(this.taskId, params, this.user.token);

      if (response && response.status && response.result) {
        this.toastr.generateToastrAlert( 'Congrats', 'Task Updated Successfully', 'success');
      }

      this.update = false;
      this.taskId = null;

      return this.getTasks(this.projectId);
    } catch (err) {
      const { message = null } = err.error || err;
      this.toastr.generateToastrAlert( 'Something went wrong', message, 'error');
    }
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.toastr.generateToastrAlert('Invalid Form', 'Check Your Form Data', 'error');
      return;
    }

    if (this.update) {
      this.updateTask(this.form.value);
      return;
    }

    this.createTask(this.form.value);
  }

  public async onRemove(taskId): Promise<void> {
    this.getUser();
    const authorization = this.user.token;
    const response = await this.taskHttpService.remove(taskId, authorization);

    if (response && response.status && response.result) {
      this.toastr.generateToastrAlert('Congrats', 'Task Removed Successfully', 'success');
    }

    return this.getTasks(this.projectId);
  }

  public async setTaskAsDone(taskId) {
    this.getUser();
    const authorization = this.user.token;

    const params = { done: true, endAt: new Date() };
    const response = await this.taskHttpService.update(taskId, params, authorization);

    if (response && response.status && response.result) {
      this.toastr.generateToastrAlert('Congrats', 'Your task is done!!', 'success');
    }

    return this.getTasks(this.projectId);
  }

  public onRequestUpdate(description, taskId) {
    this.form.setValue({ description });
    this.update = true;
    this.taskId = taskId;
  }

  public formatDoneDate(date): string {
    const REGEX = /^(\d{4}-\d{2}-\d{2}).+/
    return date
      ? date.replace(REGEX, '$1')
      : null;
  }
}
