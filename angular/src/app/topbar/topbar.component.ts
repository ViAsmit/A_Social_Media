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
            this.numOfFriendsRequests--;
        });

        let userDataEvent = this.centralUserData.getUserData.subscribe((data) => {
            this.userData = data;
            this.new_notifications = data.new_notifications;
            this.new_message_notifications = data.new_message_notifications
            this.numOfFriendsRequests = data.friend_requests.length;
            this.profilePicture = data.profile_image;

        });

        let requestObject = {
            location: `users/get-user-data/${this.usersId}`,
            method: "GET"
        }

        this.api.makeRequest(requestObject).then((val) => {
            this.centralUserData.getUserData.emit(val.user);
        })

        this.subscription.push(alertEvent, friendRequestEvent, userDataEvent);
    }

    public query: String = "";
    public usersName: String = "";
    public usersId: String = "";
    public userData: Object = {};
    public alertMessage: String = "";
    public profilePicture: String = "default-avatar";
    public new_notifications: Number = 0;
    public new_message_notifications: Number = 0;
    public numOfFriendsRequests: number = 0;

    private subscription = [];

    public searchForFriends(){
        this.router.navigate(['/search-results', {query: this.query}]);
    };

}
