import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LocalStorageService } from "../local-storage.service";
import { EventEmitterService } from "../event-emitter.service";
import { UserDataService } from "../user-data.service";
import { ApiService } from "../api.service";
import { AutoUnsubscribe } from "../unsubscribe";


@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.css']
})

@AutoUnsubscribe
export class TopbarComponent implements OnInit {

    constructor(
        public auth: AuthService,
        private router: Router,
        private storage: LocalStorageService,
        private events: EventEmitterService,
        private centralUserData: UserDataService,
        private api: ApiService,
    ) { }


    ngOnInit(): void {
        this.usersName = this.storage.getParsedToken().name;
        this.usersId = this.storage.getParsedToken()._id;

        let alertEvent = this.events.onAlertEvent.subscribe((msg) => {
            console.log("ALERT");
            this.alertMessage = msg;
        });
        
        let friendRequestEvent = this.events.updateNumOfFriendRequestsEvent.subscribe((msg) => {
            this.notifications.friendRequests--;
        });

        let userDataEvent = this.centralUserData.getUserData.subscribe((user) => {

            console.log(user.messages);
            

            this.notifications.friendRequests = user.friend_requests.length;
            this.notifications.messages = user.new_message_notifications.length;
            this.notifications.alert = user.new_notifications;
            this.profilePicture = user.profile_image;

        });

        let updateMessageEvent = this.events.updateSendMessageObjectEvent.subscribe((d) => {
            this.sendMessageObject.id = d.id;
            this.sendMessageObject.name = d.name;
        });

        let resetMessagesEvent = this.events.resetMessageNotificationsEvent.subscribe(() => {
            this.notifications.messages = 0;
        });
        
        let requestObject = {
            location: `users/get-user-data/${this.usersId}`,
            method: "GET"
        }

        this.api.makeRequest(requestObject).then((val) => {
            this.centralUserData.getUserData.emit(val.user);
        })

        this.subscription.push(alertEvent, friendRequestEvent, userDataEvent, updateMessageEvent, resetMessagesEvent);
    }

    public query: String = "";
    private subscription = [];
    public sendMessageObject = {
        id: "",
        name: "",
        content: ""
    };
    public alertMessage: String = "";

    //UserData
    public usersName: String = "";
    public usersId: String = "";
    public profilePicture: String = "default-avatar";

    public messagePreviews = [];
    public notifications = {
        alert: 0,
        friendRequests: 0,
        messages: 0,
    }



    public searchForFriends(){
        this.router.navigate(['/search-results', {query: this.query}]);
    };

    public sendMessage(){
        this.api.sendMessage(this.sendMessageObject);
        console.log("Send Message to: ", this.sendMessageObject.name, this.sendMessageObject.id, this.sendMessageObject.content);
        this.sendMessageObject.content = "";
        
    }

    public resetMessageNotifications(){
        this.api.resetMessageNotifications();
    }
    

}
