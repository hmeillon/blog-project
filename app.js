import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let newDate = new Date().toDateString();

//Helps to assign and keep track of different posts IDs, each of the posts has a unique ID, so even if one post with certain id number get deleted, the number will no be repeated again. Starting with 3 since there are 3 posts already created (0, 1, 2).
let currentPostID = 4;

//Is the array "database" to store all the existing and new posts created by the user.
let postsDataBase = [
    {
        id: 3,
        title: "CSS and some UI polishing!", 
        description: "After finishing the project, I took a rest and go with family and friends to enjoy the rest of the day. Now, I decided to finish and make some improvements to my app and css. For the app, I decided to make the blog to show newer posts at the top, so I made some changes to the array and a function when the server handles a new post. For the array I moce the objects from newest to oldest, so this pre-created posts will appear in that order. To the function, instead of using the .push() method, I decided to use the .unshift(), that instead of adding a new value or object at the end of the array, it add it at the beggining of the array, so, in that way the newest post will be appearing at the top of the webpage. And for CSS, I made my website responsive, some of this changes only applies to mobile devices, but it render acceptable in tablets. I feel confident about my project and project decisions, I think I made some good changes that improve my website. Anyways, I'm planning to add more features in the future, like user creation a logging, error handling (like showing a webpage when a post is not found), etc. Feel free to reach me and suggest me more changes and improvements to make this website greater! Happy coding! :)",
        author: "Héctor Meillon",
        date: "Sat Feb 03 2024"
    },

    {
        id: 2,
        title: "Finishing the website functionality!", 
        description: "This project was being really challenging, It became easy at the beggining but then, I struggled in some points. I didn't knew how to get the id from each post without the user seeing it while writing a new post, until I ask Bard how to get the ID via URL, It was easy but then, he said that there was a better practice, by passing the data from the server to the EJS, by making an input inside a form, naming it with postId and the value as <%= post.id %>, and then passing that info again to the server with body-parsing using req.body.postId, it was REALLY helpful since with that information, I could edit and delete post searching into the posts array looking to an exact object with the targeted ID, using posts.findIndex() to find the index of the matching post, posts.splice(postIndex,1) to delete the post that I find using it's index, and targetPost = posts[currentPostIndex] to edit the exact post that match the index. It was a really hard path to get this to work without a database, but it helped me a lot to know all the functions, methods, and the useful arrays are when we try to store data in our website, also some features I didn't know existed (like the hidden input to pass the post id), Bard was really helpful, he understood my goal so it was more easy to implement some features I didn't knew existed. I'll keep updating my journey! Happy February btw!",
        author: "Héctor Meillon",
        date: "Thu Feb 01 2024"
    },

    {
        id: 1,
        title: "Yesterday and today's struggles", 
        description: "Monday I was really hoping this to work properly, I succesfully created a blog where you can create posts, I was trying to figure out how to edit and delete post but it got really tedious, then my website keep crashing due different parts of my code, so I reverted the changes and keep trying to make it work only with posts. Therefore I try with the help of Google Bard (Google's chat gpt), I have some ideas and ask him many ways to create different things so I can implement them in my code.My main target today was to create an array that can store infinite IDs for each post (I know that we dont need that since we are not using any database to store our posts), but I wanted to have unlimited numbers rather than a set of them (Originally I made an array with 20 numbers and each time a user created a post, it .pop() the last number and also retrieved that last number), but now I used the const newPostID = currentPostID++; and it retrieves the number inside the variable and then it adds 1, so the next post will have a different number. Then with the help of each post IDs, I created along side Bard a button that redirect the user to see the full post with <a href=/posts/<%= post.id %>, and inside the app.js it handle the request and redirect the to post-details.ejs so it can see the full post. At the moment it's getting harder to figure out how to do this blog since I don't have any database knowledge, and everything is being stored inside an array. This is a difficult project, a very difficult one.",
        author: "Héctor Meillon",
        date: "Mon Jan 31 2024"
    },

    {
        id: 0,
        title: "Today's learning!", 
        description: "I was really overwhelmed because I wasn't able to make this project to work, I making some interesting changes to it while learning, I'll keep this updated!",
        author: "Héctor Meillon",
        date: "Mon Jan 29 2024"
    }
];

//To clarify that there are static files I'm using inside EJS files.
app.use(express.static("public"));

//Middleware for parsing bodies from URL thanks to body-parser NPM.
app.use(bodyParser.urlencoded({ extended: true }));

//This is how it handle when the user enters the website, rendering the home page (index.ejs).
app.get("/", (req, res) => {
    res.render("index.ejs", {
        posts: postsDataBase,
    });
});

//This is how it handles when the user wants to create a new post, rendering the Write a Post page (post.ejs).
app.get("/postablog", (req, res) => {
    res.render("post.ejs");
});

//This is how it handles when the user click the "Post" button in the post.ejs, taking all the information the user entered, passing the data with body-parser, creating a const names newPost that will be pushed inside the postsDataBase array, so once the home page is rendered, it will show all the posts the user has made.
app.post("/submit", (req, res) => {
    
    const newPostID = currentPostID++;
    const newPostTitle = req.body.title;
    const newPostDesc = req.body.description;
    const newAuthor = req.body.author;
    const newPostDate = newDate;
    
    const newPost = {
        id: newPostID,
        title: newPostTitle,
        description: newPostDesc,
        author: newAuthor,
        date: newPostDate,
    };
    postsDataBase.unshift(newPost);

    res.render("index.ejs", {
        posts: postsDataBase,
    });
});

//This is how it handles when the user click the "read more" of each post in the home page, rendering a full webpage showing the info of the selected post, the url below has the :title, that will help to pass the current post title and showing it in the URL, it is just to make fancier, is the first time I use it.
app.post("/posts/:title/read-more", (req, res) => {
    //To get the post ID thanks to the the form with the hidden name and value postId.
    const currentPostId = req.body.postId;

    // It will find a post inside postsDataBase array that matches with the current Post ID (currentPostId), and stores the full object (id, title, etc.) inside const matchingPost.
    const matchingPost = postsDataBase.find((targetPost) => targetPost.id === parseInt(currentPostId));

    //If the current Post ID matches with the target Post ID, it will render the Post details webpage.
    if (matchingPost) {
      res.render("post-details.ejs", { post: matchingPost });
    } else {
      // Handle the case where the post is not found.
      res.status(404);
    }
});

//This is how it handles when the user wants to edit a post, same as above, it passed the post title in the URL, and get the value from the hidden input and post unique ID. Once this button is clicked the user is redirected to post-editing.ejs, where all the information of the current and targeted post is rendered aswell.
app.post("/posts/:title/edit", (req, res) => {
    
    const currentPostId = req.body.postId;
  
    const matchingPost = postsDataBase.find((targetPost) => targetPost.id === parseInt(currentPostId));

    if (matchingPost) {
      res.render("post-editing.ejs", { post: matchingPost });
    } else {
      res.status(404);
    }
});

//This is how it handles once the user finshes editing the post, where it passes the current post ID, uses it to find it index inside the postsDataBase array, used the index to target the post and replace all the old info with the new info thanks to body-parser.
app.post("/save", (req, res) => {

    //Getting the post ID, looking for the post (inside the postsDataBase array) with the same ID as the current post and then targeting it with array[] putting the const with the index inside the [].
    const currentPostId = req.body.postId;
    const currentPostIndex = postsDataBase.findIndex(obj => obj.id === parseInt(currentPostId));
    const targetPost = postsDataBase[currentPostIndex];
    
    //Once it targets the wanted to edit post, it replaces all the old info with the current info the user entered in post-editing.ejs.
    targetPost.title = req.body.title;
    targetPost.description = req.body.description;
    targetPost.author = req.body.author;

    res.render("index.ejs", {
        posts: postsDataBase,
    });
});

//This is how it handles when the user click the delete button. It is similar to editing but way easier, since it do not need to parse all the information. Here just passes the id, uses findIndex to find inside the postsDataBase array to get the index of the post with the same ID, then once the post is found, uses .splice() method to erase the index that we got in currentPostIndex.
app.post("/posts/delete", (req, res) => {

    //Finding the index checking every post inside postsDataBase array to find the post with the exact same id.
    const currentPostId = req.body.postId;
    const currentPostIndex = postsDataBase.findIndex(obj => obj.id === parseInt(currentPostId));

    //Once found, it splices the array from the index we got and how many objects to remove, in this case we declared 1, because we only need and want to erase the current post.
    if (currentPostId) {
        postsDataBase.splice(currentPostIndex, 1);
        res.render("index.ejs", {
            posts: postsDataBase,
        });
      } else {
        res.status(404);
      }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });