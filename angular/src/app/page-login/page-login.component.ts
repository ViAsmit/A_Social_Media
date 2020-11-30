import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {

    constructor(
        private api: ApiService,
        private storage: LocalStorageService,
        private router: Router,
        private title: Title,
    ) { }

  ngOnInit(): void {
      this.title.setTitle("A Social Media - Login");
  }

  public formError = "";

  public credentials = {
      email: '',
      password: ''
  };

  public formSubmit(){

      this.formError = "";
      if(
          !this.credentials.email ||
          !this.credentials.password
      ){
          return this.formError = "All Feilds Are Required";
      }

      if(!this.formError){
          this.login();
      }
  }

  private login(){
      let requestObject = {
          method: "POST",
          location: "users/login",
          body: this.credentials
      };

      this.api.makeRequest(requestObject).then((val) => {
         if(val.error){
             this.formError = val.error.message;
         }
         if(val.token) {
             this.storage.setToken(val.token);
             this.router.navigate(['/']);
         }
      });
  }
}
