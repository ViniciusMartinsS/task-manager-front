import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthHttpService } from '../../services/http/endpoint/auth.http.service';
import { omit } from 'lodash';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public registerField = false;

  constructor(
    private toastrService: ToastrService,
    private authHttpService: AuthHttpService,
    private route: Router,
  ) {}

  public toastr: ToastComponent = new ToastComponent(this.toastrService);

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new  FormControl(),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required
      ])
    }, {
      updateOn: 'blur'
    });
  }

  private localStorageData(user): void {
    localStorage.setItem('_auth_token', user.token);
    localStorage.setItem('_auth_info', JSON.stringify(user));
  }

  private async login(params): Promise<void> {
    try {
      const { result } = await this.authHttpService.auth(params);
      this.localStorageData(result);
      await this.route.navigate(['/projects']);
    } catch (err) {
      const { message = null } = err.error || err;
      this.toastr.generateToastrAlert('Something went wrong', message , 'error');
    }
  }

  private async register(params): Promise<void> {
    try {
      const response = await this.authHttpService.register(params);

      if (response && response.status && response.result) {
        this.toastr.generateToastrAlert('Congrats', 'User Created Successfully' , 'success');
      }
    } catch (err) {
      const { message = null } = err.error || err;
      this.toastr.generateToastrAlert('Something went wrong', message, 'error');
    }
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.toastr.generateToastrAlert('Invalid Form', 'Check Your Form Data', 'error');
      return;
    }

    const params = omit(this.form.value, [ 'name' ]);
    this.login(params);
  }

  public onRegister(): void {
    if (this.form.invalid) {
      this.toastr.generateToastrAlert('Invalid Form', 'Check Your Form Data', 'error');
      return;
    }

    this.register(this.form.value);
  }

  public setRegistersField(): void {
    if (!this.registerField) {
      this.registerField = true;
      return;
    }

    this.registerField = false;
  }
}
