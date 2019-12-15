import { Component, OnInit } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {

  constructor(private toastrService: ToastrService) { }

  ngOnInit() {
  }

  public generateToastrAlert(title, message, type): ActiveToast<any> {
    return this.toastrService[type](message, title, { timeOut: 3000 });
  }
}
