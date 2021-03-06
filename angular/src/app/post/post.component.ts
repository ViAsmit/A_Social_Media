import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from "../api.service";
import { LocalStorageService } from "../local-storage.service";

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit {

    @Input() post;

    constructor(
        private api:ApiService,
        private storage: LocalStorageService,
    ) { }

    ngOnInit(): void {

        function removeLeadingNumber(string) {
            function isNumber(n) {
                n = Number(n);
                if(!isNaN(n)){
                    return true;
                }
            }

            if(string && isNumber(string[0])){
                string = removeLeadingNumber(string.substr(1));
            }
            return string;
        }

        this.fakeId = removeLeadingNumber(this.post._id);

        if(this.post.content.length < 40) { this.fontSize = 22; }
        if(this.post.content.length < 24) { this.fontSize = 28; this.align = "center"; }
        if(this.post.content.length < 14) { this.fontSize = 32; }
        if(this.post.content.length < 8) { this.fontSize = 44; }
        if(this.post.content.length < 5) { this.fontSize = 64; }

        this.userid = this.storage.getParsedToken()._id;

        if(this.post.likes.includes(this.userid)){
            this.liked = true;
        }
    }

    public fakeId: String = "";
    public fontSize: Number = 18;
    public align: String = "left";
    public liked: boolean = false;
    public userid: string = "";
    public comment: string = "";

    public likeButtonClicked(postid) {
        let requestObject = {
            location: `users/like-unlike/${this.post.ownerid}/${this.post._id}`,
            method: "POST"
        }

        this.api.makeRequest(requestObject).then((val) => {
            if(this.post.likes.includes(this.userid)){
                this.post.likes.splice(this.post.likes.indexOf(this.userid), 1);
                this.liked = false;
            }
            else{
                this.post.likes.push(this.userid);
                this.liked = true;
            }
        });
    }

    public postComment() {
        if(this.comment.length == 0) { return; }

        let requestObject = {
            location: `users/post-comment/${this.post.ownerid}/${this.post._id}`,
            method: "POST",
            body: { content: this.comment }
        }

        this.api.makeRequest(requestObject).then((val) => {
            if(val.statusCode == 201){
                let newComment = {
                    ...val.comment,
                    commenter_name: val.commenter.name,
                    commenter_profile_image: val.commenter.profile_image
                }
                this.post.comments.push(newComment);
                this.comment = "";
            }
        });
    }
}
