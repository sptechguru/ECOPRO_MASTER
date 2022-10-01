import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { patternValidator, password } from 'app/shared/custom/customValidation';

@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit {
  constructor(
    private _fb : FormBuilder,
    private _api :ApiHandlerService,
    private _route : ActivatedRoute,
    private _router : Router
  ) { }

  passwordForm : FormGroup;
  submitted =false;


  ngOnInit() {
    let id  = this._route.snapshot.paramMap.get('code');
    this.createForm();
    this.formControls.email_code.patchValue(id)
  }
  createForm(){
      this.passwordForm = this._fb.group({
        password : ['', [
          // 1. Password Field is Required
          Validators.required,
          // 2. check whether the entered password has a number
          patternValidator(/\d/, { hasNumber: true }),
          // 3. check whether the entered password has upper case letter
          patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          // 4. check whether the entered password has a lower-case letter
          patternValidator(/[a-z]/, { hasSmallCase: true }),
          // 5. check whether the entered password has a special character
         patternValidator(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/, { hasSpecialCharacters: true }),
          // 6. Has a minimum length of 8 characters
          Validators.minLength(8)]
        ],
        confirm_password : [''],
        confirmpassword:['',Validators.required],
        email_code : ['',Validators.required]
      },{
        validators: [password.bind(this)]
      })
  }

  get formControls(){
    return this.passwordForm.controls;
  }

  submit(){
    this.submitted = true;
    if(this.passwordForm.invalid) return;
    this.formControls.confirm_password.patchValue(this.formControls.confirmpassword.value)
    this._api.apiPost(API.AUTH_ENDPOINTS.RESET_PASSWORD,this.passwordForm.value).subscribe({
      next : result=> {
        this.passwordForm.reset()
        this._router.navigate(['/'])
      },
      error: err=>  console.log(err)
    })
  }

 }
