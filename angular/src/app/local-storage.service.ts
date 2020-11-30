import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    constructor() { }

    tokenName = "--token-ASM";
    postThemeName = "--post-theme-ASM";

    private set(key, value){
        if(localStorage){
            localStorage.setItem(key, value);
        } else {
            alert('Browser does not support Local Storage');
        }
    }

    private get(key){
        if(localStorage) {
            if(key in localStorage){
                return localStorage.getItem(key);
            }
        } else{
            alert('Browser does not support Local Storage');
        }
    }

    public setToken(token){
      this.set(this.tokenName, token);
    }

    public getToken(){
      return this.get(this.tokenName);
    }

    public getParsedToken(){
        let token = this.getToken();
        return JSON.parse(atob(token.split('.')[1]));
    }

    public removeToken(){
        localStorage.removeItem(this.tokenName);
    }

    public setPostTheme(name){
        this.set(this.postThemeName, name);
    }

    public getPostTheme(){
        return this.get(this.postThemeName);
    }

}
