import { Component, OnInit, Inject } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { UserDataService } from "../user-data.service";
import { ApiService } from "../api.service";
import { EventEmitterService } from "../event-emitter.service";
import { AutoUnsubscribe } from "../unsubscribe";

@Component({
    selector: 'app-page-profile',
    templateUrl: './page-profile.component.html',
    styleUrls: ['./page-profile.component.css']
})

@AutoUnsubscribe
export class PageProfileComponent implements OnInit {

    constructor(
        private title: Title,
        private centralUserData: UserDataService,
        private api: ApiService,
        private route: ActivatedRoute,
        private events: EventEmitterService,
        @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit(): void {
        this.title.setTitle("A Social Media - Profile");
        this.document.getElementById('sidebarToggleTop').classList.add("d-none");


        let userDataEvent = this.centralUserData.getUserData.subscribe((user) => {
            this.route.params.subscribe((params) => {
                this.showPosts = 6;
                if(user._id == params.userid){
                    this.setComponentValues(user);
                    this.resetBooleans();
                } else{
                    this.canSendMessage = true;

                    let requestObject = {
                        location: `users/get-user-data/${params.userid}`,
                        method: "GET"
                    };

                    this.api.makeRequest(requestObject).then((data) => {
                        if(data.statusCode == 200){
                            this.canAddUser = user.friends.includes(data.user._id) ? false : true;
                            this.haveRecievedFriendRequest = user.friend_requests.includes(data.user._id);
                            this.haveSentFriendRequest = data.user.friend_requests.includes(user._id);

                            if(this.canAddUser){
                                this.showPosts = 0;
                            }

                            this.setComponentValues(data.user);
                        }
                    });
                }
            });
        });

        this.subscription.push(userDataEvent);
    }

    public randomFriends: string[] = [];
    public totalFriends: number = 0;
    public posts: object[] = [];
    public showPosts: number = 6;
    public profilePicture: string = "default-avatar";
    public usersName: string = "";
    public usersEmail: string = "";
    public usersId: string = "";

    public canAddUser: boolean = false;
    public canSendMessage: boolean = false;
    public haveSentFriendRequest: boolean = true;
    public haveRecievedFriendRequest: boolean = true;

    private subscription = [];

    public showMorePosts(){
        this.showPosts += 6;
    }

    public backToTop(){
        this.document.body.scrollTop = this.document.documentElement.scrollTop = 0;
    }

    public setComponentValues(user){
        this.randomFriends = user.random_friends;
        this.profilePicture = user.profile_image;
        this.posts = user.posts;
        this.usersName = user.name;
        this.totalFriends = user.friends.length;
        this.usersEmail = user.email;
        this.usersId = user._id;
    }

    public accept(){
        this.api.resolveFriendRequest("accept", this.usersId).then((val: any) => {
            if(val.statusCode == 201){
                this.haveRecievedFriendRequest = false;
                this.canAddUser = false;
                this.totalFriends++;
                this.showPosts = 6;
            }
        });

    }

    public decline(){
        this.api.resolveFriendRequest("decline", this.usersId).then((val: any) => {
            if(val.statusCode == 201){
                this.haveRecievedFriendRequest = false;
            }
        });
    }

    public makeFriendRequest(){
        this.api.makeFriendRequest(this.usersId).then((val: any) => {
            if(val.statusCode == 201){
                this.haveSentFriendRequest = true;
            }
        });
    }

    private resetBooleans(){
        this.canAddUser = false;
        this.canSendMessage = false;
        this.haveSentFriendRequest = false;
        this.haveRecievedFriendRequest = false;
    }
}
