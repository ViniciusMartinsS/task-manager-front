import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskHttpService } from '../services/http/endpoint/task.http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  private user: any;
  private projectId: number;
  public form: FormGroup;
  public tasks: Array<any> | null = null;
  public tasksDone: Array<any> | null = null;

  constructor(
    private route: ActivatedRoute,
    private taskHttpService: TaskHttpService,
    private toastrService: ToastrService,
  ) { }

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
       return
    }

    this.user = JSON.parse(localStorage.getItem('_auth_info'));
  }

  private async createTask(task): Promise<void> {
    try {
      this.getUser();
      const params  = { ...task, projectId: this.projectId };
      const response = await this.taskHttpService.create(params, this.user.token);

      if (response && response.status && response.result) {
        this.toastrService.success('Task Created Successfully', 'Congrats', {
          timeOut: 3000
        });
      }

      return this.getTasks(this.projectId);
    } catch (err) {
      const { message = null } = err.error || err;
      this.toastrService.error(message, 'Something went wrong', {
        timeOut: 3000
      });
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

  public onSubmit(): void {
    if (this.form.invalid) {
      this.toastrService.error('Check Your Form Data', 'Invalid Form', {
        timeOut: 3000
      });

      return;
    }

    this.createTask(this.form.value);
  }

  public async onRemove(taskId): Promise<void> {
    this.getUser();
    const authorization = this.user.token;
    const response = await this.taskHttpService.remove(taskId, authorization);

    if (response && response.status && response.result) {
      this.toastrService.success('Task Removed Successfully', 'Congrats', {
        timeOut: 3000
      });
    }

    return this.getTasks(this.projectId);
  }

  public async setTaskAsDone(taskId) {
    this.getUser();
    const authorization = this.user.token;

    const params = { done: true, endAt: new Date() };
    const response = await this.taskHttpService.update(taskId, params, authorization);

    if (response && response.status && response.result) {
      this.toastrService.success('Your task is done!!', 'Congrats', {
        timeOut: 3000
      });
    }

    return this.getTasks(this.projectId);
  }

  public formatDoneDate(date): string {
    const REGEX = /^(\d{4}-\d{2}-\d{2}).+/
    return date
      ? date.replace(REGEX, '$1')
      : null;
  }
}
