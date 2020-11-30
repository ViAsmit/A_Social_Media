import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';
import { Title } from "@angular/platform-browser";
import { LocalStorageService } from "../local-storage.service";
import { EventEmitterService } from "../event-emitter.service";

@Component({
    selector: 'app-page-feed',
    templateUrl: './page-feed.component.html',
    styleUrls: ['./page-feed.component.css']
})
export class PageFeedComponent implements OnInit {

    constructor(
        public auth: AuthService,
        private api: ApiService,
        private title: Title,
        private storage: LocalStorageService,
        private event: EventEmitterService
    ) { }

    ngOnInit(): void {
        this.title.setTitle("A Social Media - Feed");
        let requestObject = {
            method: "GET",
            location: "users/generate-feed"
        }

        this.api.makeRequest(requestObject).then((val) => {

            if(val.statusCode === 200){
                let col1 = val.posts.filter((val, i) => i%4 === 0);
                let col2 = val.posts.filter((val, i) => i%4 === 1);
                let col3 = val.posts.filter((val, i) => i%4 === 2);
                let col4 = val.posts.filter((val, i) => i%4 === 3);

                let cols = [col1, col2, col3, col4];
                this.addPostToFeed(cols, 0, 0);
            }
        });
    }

    public posts = {
        col1: [],
        col2: [],
        col3: [],
        col4: [],
    }

    public newPostContent: string = "";
    public newPostTheme: string = this.storage.getPostTheme() || "primary";

    public changeTheme(newTheme){
        this.newPostTheme = newTheme;
        this.storage.setPostTheme(newTheme);
    }

    public createPost(){
        if(this.newPostContent.length == 0 ){
            return this.event.onAlertEvent.emit("No Content.");
        }

        let requestObject = {
            location: "users/create-post",
            method: "POST",
            body: {
                theme: this.newPostTheme,
                content: this.newPostContent
            }
        };

        this.api.makeRequest(requestObject).then((val) => {
            if(val.statusCode === 201) {
                this.posts.col1.unshift(val.newPost);
            } else {
                this.event.onAlertEvent.emit("Something Went Worng. Post not Displaying.");
            }
        });
    }

    private addPostToFeed(array, colNumber, delay){
        setTimeout(() => {
            if(array[colNumber].length){
                this.posts["col"+(colNumber+1)].push(array[colNumber].splice(0,1)[0]);
                colNumber = ++colNumber % 4;
                this.addPostToFeed(array, colNumber, 100)
            }
        }, delay);
    }
}
