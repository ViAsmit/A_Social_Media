import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../api.service';
import { Title } from "@angular/platform-browser";
import { UserDataService } from "../user-data.service";
import { DOCUMENT } from "@angular/common";
import { AutoUnsubscribe } from "../unsubscribe";

@Component({
    selector: 'app-page-searches',
    templateUrl: './page-searches.component.html',
    styleUrls: ['./page-searches.component.css']
})

@AutoUnsubscribe
export class PageSearchesComponent implements OnInit {

    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private title: Title,
        private centralUserData: UserDataService,
         @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit(): void {
        this.title.setTitle("A Social Media - Search");
        this.document.getElementById('sidebarToggleTop').classList.add("d-none");
        let userDataEvent = this.centralUserData.getUserData.subscribe((data) => {
            this.route.params.subscribe(params => {
                this.query = params.query;
                this.user = data;
                this.getResult();

            });
        });
        this.subscription.push(userDataEvent);
    }

    public results;
    public query = this.route.snapshot.params.query;
    private user;

    private subscription = [];

    private getResult() {
        let requestObject = {
            location: `users/get-search-results?query=${this.query}`,
            method: "GET"
        };

        this.api.makeRequest(requestObject).then((val) => {
            this.results = val.results;
            for(let result of this.results){
                if(result.friends.includes(this.user._id)){
                    result.isFriend = true;
                }
                if(result.friend_requests.includes(this.user._id)){
                    result.haveSentFriendRequest = true;
                }
                if(this.user.friend_requests.includes(result._id)){
                    result.haveRecievedFriendRequest = true;
                }
            }
        });
    }

}
