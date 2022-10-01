import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class ToasterService {
  
  clear() {
    throw new Error("Method not implemented.");
  }

  toastConfig = {
    timeOut: 10000,
    closeButton: true,
    enableHtml: true,
    progressBar: true,
    positionClass: 'toast-top-center',
  };

  constructor(private toastrService: ToastrService) { }

  Success(message = "", title?: string) {
    this.toastrService.success(message, title, this.toastConfig);
  }

  Error(message = "", title?: string) {
    this.toastrService.error(message, title, this.toastConfig);
  }

  Info(message = "", title?: string) {
    this.toastrService.info(message, title, this.toastConfig);
  }

  Warning(message = "", title?: string) {
    this.toastrService.warning(message, title, this.toastConfig);
  }

  ErrorTimeOut(errMessag: string) {
    this.toastrService.error(
      errMessag ? errMessag : "Connection timeout, Please try again later.",
      "",
      this.toastConfig
    );
  }
}
