import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from "./local-storage.service";
import { EventEmitterService } from "./event-emitter.service";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
      private http: HttpClient,
      private storage: LocalStorageService,
      private events: EventEmitterService
  ) { }

    private baseUrl = environment.baseUrl;
    private successHandler(value) {
        return value;
    }
    private errorHandler(err) {
        return err;
    }

    public makeRequest(requestObject): any {

      let method = requestObject.method.toLowerCase();
      if(!method) { return console.log("No method specified in the request object."); }

      let body = requestObject.body || {};
      let location = requestObject.location;
      if(!location) { return console.log("No location specified in the request object."); }

      let url = `${this.baseUrl}/${location}`;
      let httpOptions = {};

      if(this.storage.getToken()){
          httpOptions = {
              headers: new HttpHeaders({
                  'Authorization': `Bearer ${this.storage.getToken()}`
              })
          }
      }

      if(method === 'get'){
          return this.http.get(url, httpOptions).toPromise()
            .then(this.successHandler)
            .catch(this.errorHandler);
      }

      if(method === 'post'){
          return this.http.post(url, body, httpOptions).toPromise()
            .then(this.successHandler)
            .catch(this.errorHandler);
      }
      console.log("Could not make GET or POST request.");

  }

    public makeFriendRequest(to: String){
      let from = this.storage.getParsedToken()._id;

      let requestObject = {
          location: `users/make-friend-request/${from}/${to}`,
          method: "POST"
      }

      return new Promise((resolve, reject) => {
          this.makeRequest(requestObject).then((val) => {
              if(val.statusCode === 201){
                  this.events.onAlertEvent.emit("Successfully Sent Friend Request.");
              }
              else{
                  this.events.onAlertEvent.emit("Already Sent.");
              }
              resolve(val);
          });
      });

  }

    public resolveFriendRequest(resolution, id){
        let to = this.storage.getParsedToken()._id;

        return new Promise((resolve, reject) => {
            let requestObject = {
                location: `users/resolve-friend-request/${id}/${to}?resolution=${resolution}`,
                method: "POST"
            }
            this.makeRequest(requestObject).then((val) => {
                if(val.statusCode === 201){
                    this.events.updateNumOfFriendRequestsEvent.emit();
                    let resolutioned = (resolution === 'accept') ? "accepted" : "declined";
                    this.events.onAlertEvent.emit(`Succesfully ${resolutioned} friend request.`);
                }
                else{
                    this.events.onAlertEvent.emit("Something went wrong!.");
                }
                resolve(val);
            });
        });
    }

    public sendMessage(sendMessageObject){
        if(!sendMessageObject.content){
            this.events.onAlertEvent.emit("Message noe sent. (Empty Content)");
            return;
        }

        let requestObject = {
            location: `users/send-message/${sendMessageObject.id}`,
            method: "POST",
            body: { content: sendMessageObject.content }
        }

        return new Promise((resolve, reject) => {
            this.makeRequest(requestObject).then((val) => {
                console.log(val);
                if(val.statusCode == 201){
                    this.events.onAlertEvent.emit("Successfully sent a friend request");
                }
                resolve(val);
            });
        });
    }

    public resetMessageNotifications(){
        
        let requestObject = {
            location: "users/reset-message-notifications",
            method: "POST"
        }
        return new Promise((resolve, reject) => {
            this.makeRequest(requestObject).then((val) => {
                if(val.statusCode == 201){
                    this.events.resetMessageNotificationsEvent.emit();
                }
                resolve(val);
            });
        });
    }
}
