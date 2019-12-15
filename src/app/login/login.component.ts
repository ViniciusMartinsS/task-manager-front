import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthHttpService } from '../services/http/endpoint/auth.http.service';
import { omit } from 'lodash';

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
      this.toastrService.error(message, 'Something went wrong', {
        timeOut: 3000
      });
    }
  }

  private async register(params): Promise<void> {
    try {
      const response = await this.authHttpService.register(params);

      if (response && response.status && response.result) {
        this.toastrService.success('User Created Successfully', 'Congrats', {
          timeOut: 3000
        });

      }
    } catch (err) {
      const { message = null } = err.error || err;
      this.toastrService.error(message, 'Something went wrong', {
        timeOut: 3000
      });
    }
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.toastrService.error('Check Your Form Data', 'Invalid Form', {
        timeOut: 3000
      });

      return;
    }

    const params = omit(this.form.value, [ 'name' ]);
    this.login(params);
  }

  public onRegister(): void {
    if (this.form.invalid) {
      this.toastrService.error('Check Your Form Data', 'Invalid Form', {
        timeOut: 3000
      });

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
    return;
  }
}
