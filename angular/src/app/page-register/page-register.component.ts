import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.component.html',
  styleUrls: ['./page-register.component.css']
})
export class PageRegisterComponent implements OnInit {

  constructor(
      private api: ApiService,
      private storage: LocalStorageService,
      private router: Router,
      private title: Title,
  ) { }

  ngOnInit(): void {
      this.title.setTitle("A Social Media - Register");
  }

  public formError = "";

  public credentials = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: ''
  };

  public formSubmit(){
      this.formError = "";
      if(
          !this.credentials.first_name ||
          !this.credentials.last_name ||
          !this.credentials.email ||
          !this.credentials.password ||
          !this.credentials.password_confirm
      ){
          return this.formError = "All Feilds Are Required";
      }

      // var re = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
      // if(!re.test(this.credentials.email)){
      //     return this.formError = "Please Enter A Valid Email Address.";
      // }
      //
      // if(this.credentials.password !== this.credentials.password_confirm){
      //     return this.formError = "Password do not match.";
      // }

      this.register();
  }

  private register(){

      let requestObject = {
          method: "POST",
          location: "users/register",
          body: this.credentials
      };

      this.api.makeRequest(requestObject).then((val) => {
          if(val.token) {
              this.storage.setToken(val.token);
              this.router.navigate(['/']);
              return;
          }
          if(!val.user){
              this.formError = val.message;
          }
      });
  }
}
