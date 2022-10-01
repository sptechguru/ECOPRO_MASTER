import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { environment } from "environments/environment";
import { isDevMode } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

const dataName = "userData";

export interface UserData {
  registerForm: any;
  _id: string,
  email: string,
  gender: string,
  first_name: string,
  last_name: string
  image?: string,
  user_type: string,
  status: string,
  otp_verify: string,
  access_token: string,
  kyc:Boolean,
  questinarie:Boolean
  loginForm: {
    email?: string;
    password?: string;
  };
}

@Injectable()
export class StorageAccessorService {
  encryptionKey = environment.encryptionKey;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  
  constructor(private http: HttpClient,private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }

  storeData(data: UserData | object) {
    if (data) {
      if (true /* isDevMode() */) {
        localStorage.setItem(dataName, JSON.stringify(data));
      } else {
        localStorage.setItem(
          dataName,
          CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey)
        );
      }
    }
  }

  fetchData(): UserData | null {
    const userData = localStorage.getItem(dataName);
    if (!userData) {
      return null;
    }
    try {
      if (true /* isDevMode() */) {
        return JSON.parse(userData);
      }
      const bytes = CryptoJS.AES.decrypt(userData.toString(), this.encryptionKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (err) {
      this.deleteData();
      this.router.navigate(["/login"]);
    }
  }

  fetchToken() {
    const userData = this.fetchData();
    if (userData) {
      return userData.access_token || "";
    } else {
      return "";
    }
  }

  get islogin(){
    const userData = this.fetchData();
    if (userData) {
      return userData.access_token !== "" ? true : false;
    } else {
      return false;
    }
  }


  storeToken(newToken) {
    const userData = this.fetchData();
    if (userData) {
      const newData = Object.assign({}, userData, { access_token: newToken });
      this.storeData(newData);
    }
  }

  StoreSearchData(data: UserData | object) {
    const dataName = "get-all-search-data";
    if (data) {
      if (true /* isDevMode() */) {
        localStorage.setItem(dataName, JSON.stringify(data));
      } else {
        localStorage.setItem(
          dataName,
          CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey)
        );
      }
    }
  }


  fetchSearchData(): UserData | null { // store child id get function
    const dataName = "get-all-search-data";
    const userData = localStorage.getItem(dataName);
    if (!userData) {
      return null;
    }
    try {
      if (true /* isDevMode() */) {
        return JSON.parse(userData);
      }
      const bytes = CryptoJS.AES.decrypt(
        userData.toString(),
        this.encryptionKey
      );
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (err) {
      this.deleteAllSearchData();
    }
  }

  deleteAllSearchData() {
    localStorage.removeItem('get-all-search-data');
  }

  set KycAndQuesCheck(object){
    const userData = this.fetchData();
    if (userData) {
      const newData = {...userData,...object};
      this.storeData(newData);
    }
  }

  fetchRole() {
    const userData = this.fetchData();
    if (userData) {
      return userData["user_type"] || "";
    } else {
      return "";
    }
  }

  fetchUserDetailsByKey(keyToFetch) {
    const userData = this.fetchData();
    if (userData) {
      return userData[keyToFetch] || "";
    } else {
      return "";
    }
  }

  logout() {

    localStorage.removeItem('token');

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['home'])

}

  
  deleteToken() {
    this.storeToken("");
  }

  deleteData() {
    localStorage.removeItem(dataName);
  }
}
