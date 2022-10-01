import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  contactUsForm: FormGroup;
  isProcessing: boolean;

  constructor(private fb: FormBuilder ,
    private http: HttpClient,
    public translate: TranslateService,
    private router: Router,
    private toasterService: ToasterService,
    private apiHandlerService: ApiHandlerService) { }

  ngOnInit(): void {
    this.createForm();
    this.contactUsForm.reset();
  }

  createForm() {
    this.contactUsForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30), 
        Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      contact_number: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(15)]],
      company_name: ['',  [Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    })  
  }

  handleSubmitFirst(){
    let data = {
      "name": this.contactUsForm.value.name,
      "email": this.contactUsForm.value.email,
      "phone_number": this.contactUsForm.value.contact_number,
      "company_name": this.contactUsForm.value.company_name,
      "message": this.contactUsForm.value.message
    }
    this.isProcessing = true;
    this.apiHandlerService.apiPost(API.CONTACT_US.CONTACT_US, data, {}, { contentType: { isFormDataContent: false } }).subscribe({
      next: result => {
        if (result.message) {
          this.isProcessing = true;
          this.toasterService.Success('Detail saved Successfully!'); 
        } else {
          this.isProcessing = true;
          let msg = 'Process failed';
          this.toasterService.Error(msg);
        }
      },
      error: err => {
        this.isProcessing = false;
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

}
