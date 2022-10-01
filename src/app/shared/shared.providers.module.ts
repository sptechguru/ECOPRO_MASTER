import { NgModule } from "@angular/core";
import { ModuleWithProviders } from "@angular/compiler/src/core";
// import { AuthAppModuleGuard } from "./services/authAppModuleGuard.service";
// import { GoogleMapService } from "./services/googlemap.service";
// import { SocketIOService } from "./services/socket.service";
// import { IdleService } from "./services/idle.service";
import { from } from "rxjs/observable/from";
import { ApiHandlerService } from "./services/api-handler.service";
import { StorageAccessorService } from "./services/localstorage-accessor.service";
import { ToasterService } from "./services/toaster.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./services/app.interceptor";
import { AuthGuardService } from "./services/auth.guard.service";
import { ConfirmationDialogHandlerService } from "./components/confirmation-dialog/confirmation-dialog-handler.service";
import { UserService } from "./services/user.service";
@NgModule({})
export class SharedProvidersModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedProvidersModule,
      providers: [
        AuthGuardService,
        ApiHandlerService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        },
        StorageAccessorService,
        UserService,
        ToasterService
      ]
    };
  }
}
