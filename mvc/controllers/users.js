const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const containsDuplicate = function(array) {
    array.sort();
    for(let i=0; i<array.length; i++){
        if(array[i] == array[i+1]){
            return true;
        }
    }
}

const addCommentDetails = function(posts) {
    return new Promise(function(resolve, reject) {
        let promises = [];
        for(let post of posts){
            for(let comment of post.comments){
                let promise =  new Promise(function(resolve, reject) {
                    User.findById(comment.commenter_id, "name profile_image", (err, user) => {
                        comment.commenter_name = user.name;
                        comment.commenter_profile_image = user.profile_image;
                        resolve(comment);
                    });
                });
                promises.push(promise);
            }
        }

        Promise.all(promises).then((val) => {
            console.log(val);
            resolve(posts);
        });
    });
}

const getRandom = function(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const addToPost = function(arr, user){
    for(item of arr){
        item.name = user.name;
        item.ago = timeAgo.format(Number(item.date));
        item.ownerid = user._id;
        item.ownerProfileImage = user.profile_image;
    }
}

const registerUser = function({body}, res){

    if(
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.password ||
        !body.password_confirm
    ){
        return res.send({message: "All Feilds Are Required"});
    }

    if(body.password !== body.password_confirm){
        return res.send({message: "password dont match."});
    }

    const user = new User();

    user.name = body.first_name.trim() + " " + body.last_name.trim();
    user.email = body.email;
    user.setPassword(body.password);

    console.log('===============');
    console.log(user);
    console.log('===============');

    user.save((err, newUser) => {
        if(err){
            if(err.errmsg && err.errmsg.includes("duplicate key error")){
                console.log(err);
                console.log('===============');
                console.log(newUser);
                return res.json({message: "Email already Registered....."});
            }
            return res.json({message: "Something Went Wrong"});
        } else {
            const token = newUser.getJwt();
            console.log('===============');
            console.log(newUser);
            console.log('===============');
            return res.status(201).json({message: "Created user", token});
        }
    });
}

const loginUser = function(req, res){
    if(!req.body.email || !req.body.password){
        return res.status(404).json({message: "All Feilds Are Required"});
    }

    passport.authenticate("local", (err, user, info) => {
        if(user){
            const token = user.getJwt();
            return res.status(201).json({message: "Logged In", token});
        } else {
            return res.status(401).json(info);
        }
    })(req, res);
}

const generateFeed = function({payload}, res) {
    const posts = [];
    const maxPosts = 48;

    let myPosts = new Promise(function(resolve, reject) {
        User.findById(payload._id, "name posts profile_image friends", {lean: true}, (err, user) => {
            if(err) { return res.json({err: err}); }
            addToPost(user.posts, user);
            posts.push(...user.posts);
            resolve(user.friends);
        });
    });

    let myFriendsPosts = myPosts.then((friendsArray) => {
        return new Promise(function(resolve, reject) {
            User.find({'_id': {$in: friendsArray}}, "name profile_image posts", {lean: true}, (err, users) => {
                if(err) { return res.json({err: err}); }
                for(user of users){
                    addToPost(user.posts, user);
                    posts.push(...user.posts);
                }
                resolve();
            });
        });
    });

    myFriendsPosts.then(() => {
        posts.sort((a, b) => (a.date >  b.date) ? -1 : 1);

        addCommentDetails(posts).then((posts) => {
            res.statusJson(200, {posts: posts.slice(0, 30)});
        });
    });
}

const getSearchResults = function({query, payload}, res) {
    if(!query.query) { return res.json({err: "Missing a query."}); }
    User.find({name: { $regex: query.query, $options: "i" }}, "name profile_image friends friend_requests", (err, results) => {
        if(err) { return res.json({err: err}); }

        results = results.slice(0, 20);
        for(let i=0; i<results.length; i++){
            if(results[i]._id == payload._id){
                results.splice(i,1);
                break;
            }
        }
        return res.status(200).json({message: "Getting Search Results", results: results})
    });
}

const makeFriendRequest = function({params}, res){

    User.findById(params.to, (err, user) => {
        if(err) { return res.json({err: err}); }

        if(containsDuplicate([params.from, ...user.friend_requests])) {
            return res.json({message: "Already Sent."})
        }

        user.friend_requests.push(params.from);
        user.save((err, newUser) => {
            if(err) { return res.json({err: err}); }
            return res.statusJson(201, { message: "Succesfully sent a Friend Request." });
        });
    });
}

const getUserData = function({params}, res) {
    User.findById(params.userid, "-salt -password", {lean: true}, (err, user) => {
        if(err) { return res.json({err: err}); }

        function getRandomFriends(friendsList){
            let copyofFriendsList = Array.from(friendsList);
            let randomIds = [];

            for(let i=0; i<6; i++){
                if(friendsList.length <= 6){
                    randomIds = copyofFriendsList;
                    break;
                }
                let randomId = getRandom(0, copyofFriendsList.length);
                randomIds.push(copyofFriendsList[randomId]);
                copyofFriendsList.splice(randomId, 1);
            }

            return new Promise(function(resolve, reject) {
                User.find({'_id': { $in: randomIds }}, "name profile_image", (err, friends) => {
                    if(err) { return res.json({err: err}); }
                    resolve(friends);
                });
            });
        }

        user.posts.sort((a,b) => (a.date > b.date) ? -1 : 1);

        addToPost(user.posts, user);

        let randomFriends = getRandomFriends(user.friends);
        let commentDetails = addCommentDetails(user.posts);

        Promise.all([randomFriends, commentDetails]).then((val) => {
            user.random_friends = val[0];
            res.statusJson(200, {user: user});
        });
    });
}

const getFriendRequest = function({query}, res) {

    let friend_requests = JSON.parse(query.friend_requests);

    User.find({ '_id': {$in: friend_requests} }, "name profile_image", (err, users) => {
        if(err) { return res.json({err: err}); }
        return res.statusJson(200, {message:"Getting Friend Request", users: users});
    });
}

const resolveFriendRequest = function({query, params}, res) {

    User.findById(params.to, (err, user) => {
        if(err) { return res.json({err: err}); }

        for(let i=0; i<user.friend_requests.length; i++){
            if(user.friend_requests[i] == params.from){
                user.friend_requests.splice(i, 1);
                break;
            }
        }

        let promise = new Promise(function(resolve, reject) {
            if(query.resolution == "accept"){

                if(containsDuplicate([params.from, ...user.friends])) {
                    return res.json({message: "Duplicate..."});
                }
                user.friends.push(params.from);

                User.findById(params.from, (err, user) => {
                    if(err) { return res.json({err: err}); }
                    if(containsDuplicate([params.to, ...user.friends])) {
                        return res.json({message: "Duplicate..."});
                    }
                    user.friends.push(params.to);
                    user.save((err, user) => {
                        if(err) { return res.json({err: err}); }
                        resolve();
                    })

                });
            }
            else{
                resolve();
            }
        });
        promise.then(() => {
            user.save((err, user) => {
                if(err) { return res.json({err: err}); }
                res.statusJson(201, {message: "Resloved"});
            });
        });
    });
}

const createPost = function({body, payload}, res) {

    if(!body.content || !body.theme){
        return res.statusJson(400, {message: "Insufficient Data"});
    }

    let userId = payload._id;
    const post = new Post();
    post.theme = body.theme;
    post.content = body.content;

    User.findById(userId, (err, user) => {
        if(err) { return res.json({err: err}); }

        let newPost = post.toObject();
        newPost.name = payload.name;
        newPost.ownerid = payload._id;
        newPost.ownerProfileImage = user.profile_image;
        newPost.ago = "Just Now";

        user.posts.push(post);
        user.save((err, newUser) => {
            if(err) { return res.json({err: err}); }
            return res.statusJson(201, {message: "Created A Post", newPost: newPost });
        });
    });
}

const likeUnlike = function({payload, params}, res) {

    User.findById(params.ownerid, (err, user) => {
        if(err) { return res.json({err: err}); }

        const post = user.posts.id(params.postid);

        console.log(post);
        // console.log(payload._id);

        if(post.likes.includes(payload._id)){
            post.likes.splice(post.likes.indexOf(payload._id), 1);
        } else {
            post.likes.push(payload._id);
        }
        user.save((err, user) => {
            if(err) { return res.json({err: err}); }
            res.statusJson(201, {message: "Like or Unlike."});
        });
    });
}

const deleteAllUsers = function(req, res) {
    User.deleteMany({}, (err, info) => {
        if(err) { return res.json({error: err}); }
        return res.json({message: "Deleted All Users", info: info});
    });
}

const getAllUsers = function(req, res) {
    User.find((err, users) => {
        if(err) { return res.json({error: err}); }
        return res.json({users: users});
    });
}

const postCommentOnPost = function({body, payload, params}, res) {

    User.findById(params.ownerid,  (err, user) => {
        if(err) { return res.json({error: err}); }

        const post = user.posts.id(params.postid);

        let comment = new Comment();
        comment.commenter_id = payload._id;
        comment.comment_content = body.content;
        post.comments.push(comment);

        user.save((err, user) => {
            if(err) { return res.json({error: err}); }

            User.findById(payload._id, "name profile_image" ,(err, user) => {
                if(err) { return res.json({error: err}); }
                res.statusJson(201, {message: "POSTED COMMENT", comment: comment, commenter: user});
            });
        });
    });
}



module.exports = {
    deleteAllUsers,
    getAllUsers,
    registerUser,
    loginUser,
    generateFeed,
    getSearchResults,
    makeFriendRequest,
    getUserData,
    getFriendRequest,
    resolveFriendRequest,
    createPost,
    likeUnlike,
    postCommentOnPost
}
