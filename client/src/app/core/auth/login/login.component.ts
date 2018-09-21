import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'anms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initLoginForm();
  }

  private initLoginForm() {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }
}
