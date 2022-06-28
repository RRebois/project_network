var page = 0;
var profilePage = 0;
var followingPage = 0;
const maxNumOfChars = 255;

document.addEventListener('DOMContentLoaded', ()=>{
  // Character countdown
  document.querySelector('#compose-content').addEventListener('input', countCharacters);

  // Compose form submit
  document.querySelector('#compose-form').addEventListener('submit', compose_post);
  
  // Pagination allposts
  document.querySelector('#first').addEventListener('click', () => load_mainpage(0));
  document.querySelector('#next').addEventListener('click', ()=> {
    page = page + 1
    load_mainpage(page)
  });
  document.querySelector('#previous').addEventListener('click', () => {
    page = page - 1
    load_mainpage(page)
  });
  document.querySelector('#last').addEventListener('click', () => {
    var value = fetch('posts/allPosts')
    .then(res => res.json())
    .then(result =>{
      value = result.length;
      if (value%10 == 0) {
        value = value/10;
      } else{
        value = Math.trunc(value/10) + 1
      }
      page = value - 1
      load_mainpage(page)
    })
  });
  
  // Pagination follow page
  document.querySelector('#firstFollow').addEventListener('click', () => {
    console.log(`profilePage value is ${profilePage}`)
    profilePage = 0
    load_followPage(document.querySelector('.title').textContent, profilePage)
  });
  document.querySelector('#nextFollow').addEventListener('click', () => {
    console.log(profilePage)
    profilePage += 1
    load_followPage(document.querySelector('.title').textContent, profilePage)
  });
  document.querySelector('#previousFollow').addEventListener('click', () => {
    console.log(profilePage)
    profilePage -= 1
    load_followPage(document.querySelector('.title').textContent, profilePage)
  });
  document.querySelector('#lastFollow').addEventListener('click', () => {
    var value = fetch(`posts/${document.querySelector('.title').textContent}`)
    .then(res => res.json())
    .then(result =>{
      value = result.length;
      if (value%10 == 0) {
        value = value/10;
      } else{
        value = Math.trunc(value/10) + 1
      }
      profilePage = value - 1
      load_followPage(document.querySelector('.title').textContent, profilePage)
    })
  });

  // Pagination following page
  document.querySelector('#firstFollowing').addEventListener('click', () => {
    followingPage = 0
    load_following(document.querySelector('#userName').textContent, followingPage)
  });
  document.querySelector('#nextFollowing').addEventListener('click', () => {
    console.log(followingPage)
    followingPage += 1
    console.log(followingPage)
    load_following(document.querySelector('#userName').textContent, followingPage)
  });
  document.querySelector('#previousFollowing').addEventListener('click', () => {
    console.log(followingPage)
    followingPage -= 1
    load_following(document.querySelector('#userName').textContent, followingPage)
  });
  document.querySelector('#lastFollowing').addEventListener('click', () => {
    var value = fetch('posts/following')
    .then(res => res.json())
    .then(result =>{
      value = result.length;
      if (value%10 == 0) {
        value = value/10;
      } else{
        value = Math.trunc(value/10) + 1
      }
      followingPage = value - 1
      load_following(document.querySelector('#userName').textContent, followingPage)
    })
  });

  // Load the main page with all posts
  load_mainpage(page);
});

function load_following(user, pageNum) {
  console.log(`DATA TO LOD_FOLLOWING: ${user} and ${pageNum}`);
  document.querySelector('#postComment').style.display = 'none';
  document.querySelector('#h3AllPosts').style.display = 'none';
  document.querySelector('#followDiv').style.display = 'block';
  document.querySelector('#allposts').style.display = 'block';
  document.querySelector('#pageControl').style.display = 'block';

  document.querySelector('#first').style.display = 'none';
  document.querySelector('#firstFollow').style.display = 'none';
  document.querySelector('#firstFollowing').style.display = 'block';
  document.querySelector('#next').style.display = 'none';
  document.querySelector('#nextFollow').style.display = 'none';
  document.querySelector('#nextFollowing').style.display = 'block';
  document.querySelector('#previous').style.display = 'none';
  document.querySelector('#previousFollow').style.display = 'none';
  document.querySelector('#previousFollowing').style.display = 'block';
  document.querySelector('#last').style.display = 'none';
  document.querySelector('#lastFollow').style.display = 'none';
  document.querySelector('#lastFollowing').style.display = 'block';

  // Empty div title
  document.querySelector('#followDiv').textContent = '';

  // Create h3 for request.user header:
  const title = document.createElement('h3');
  title.innerHTML = document.querySelector('#userName').textContent;
  followDiv.append(title);

  const dataName = 'following';

  load_posts_user(dataName, pageNum);

  event.preventDefault();
}

function load_followPage(username, pageNum) {
  console.log(`Pagenum for the load_followpage function: ${username} ${pageNum}`);
  document.querySelector('#postComment').style.display = 'none';
  document.querySelector('#h3AllPosts').style.display = 'none';
  document.querySelector('#followDiv').style.display = 'block';
  document.querySelector('#allposts').style.display = 'block';
  document.querySelector('#pageControl').style.display = 'block';

  document.querySelector('#first').style.display = 'none';
  document.querySelector('#firstFollow').style.display = 'block';
  document.querySelector('#firstFollowing').style.display = 'none';
  document.querySelector('#next').style.display = 'none';
  document.querySelector('#nextFollow').style.display = 'block';
  document.querySelector('#nextFollowing').style.display = 'none';
  document.querySelector('#previous').style.display = 'none';
  document.querySelector('#previousFollow').style.display = 'block';
  document.querySelector('#previousFollowing').style.display = 'none';
  document.querySelector('#last').style.display = 'none';
  document.querySelector('#lastFollow').style.display = 'block';
  document.querySelector('#lastFollowing').style.display = 'none';

  // console.log(`${username} has been clicked.`);

  // Get username of user logged in
  const user_connected = document.querySelector('#userName').textContent;
  console.log(`Username logged in: ${user_connected}`);

  // Get logged in user array of following
  let followingArray = fetch(`follow/${user_connected}`)
  .then(response => response.json())
  .then((dataUser) => {
    
    console.log(dataUser.following);
    followingArray = dataUser.following;
    
    console.log(`List of following users: ${followingArray}`);

    // Empty div
    document.querySelector('#followDiv').textContent = '';

    // Create h3 element for username clicked
    const title = document.createElement('h3');
    title.className = 'title';
    title.innerHTML = username;

    document.querySelector('#followDiv').append(title);

    fetch(`follow/${username}`)
    .then(response => response.json())
    .then(data => {
      // data = JSON.stringify(data);
      console.log(data);

      // Followers
      const followersDiv = document.createElement('div');
      followersDiv.className = 'followersDiv';

      // followers count
      const ElementCount = document.createElement('span');
      ElementCount.className = 'ElementCount';
      const ElementFollow = document.createElement('span');
      ElementFollow.className = 'ElementFollow';

      console.log(`followers: ${data.followers} following: ${data.following}`);
      // Following
      const followingDiv = document.createElement('div');
      followingDiv.className = 'followersDiv followingDiv';

      console.log(`data.id: ${data.username}`);
      ElementCount.innerHTML = `${data.followers.length}`;
      ElementFollow.innerHTML = ' followers';
      followersDiv.append(ElementCount);
      followersDiv.append(ElementFollow); 
      followingDiv.innerHTML = `${data.following.length} following`;
      
      // Add follow/unfollow button
      if (username != user_connected){
        let followButton = document.createElement('button');
        followButton.className = 'btn btn-primary lefttop followButton';
        followButton.innerHTML = 'Follow';
        followButton.style.display = 'none';

        let unfollowButton = document.createElement('button');
        unfollowButton.className = 'btn btn-secondary lefttop unfollowButton';
        unfollowButton.innerHTML = 'Unfollow';
        unfollowButton.style.display = 'none';

        // Button either Follow or unfollow
        if (followingArray.includes(username)){
          followButton.style.display = 'none';
          unfollowButton.style.display = 'block';
        } else {
          unfollowButton.style.display = 'none';
          followButton.style.display = 'block';
        }

        followButton.addEventListener('click', () => {
          followButton.style.display = 'none';
          unfollowButton.style.display = 'block';

          followingArray.push(`${username}`);
          
          fetch(`follow/${user_connected}`,{
            method: 'PUT',
            body: JSON.stringify({
              following: followingArray
            })
          })
          load_changes(true);
        });

        unfollowButton.addEventListener('click', () => {
          unfollowButton.style.display = 'none';
          followButton.style.display = 'block';

          for (var i = 0; i < followingArray.length; i++){
            if (followingArray[i] == username){
              followingArray.splice(i, 1);
              i--;
            }
          }

          fetch(`follow/${user_connected}`,{
            method: 'PUT',
            body: JSON.stringify({
              following: followingArray
            })
          })
          load_changes(false);
        });
      
        // Add to main Div
        document.querySelector('#followDiv').append(followersDiv);
        document.querySelector('#followDiv').append(followingDiv);
        document.querySelector('#followDiv').append(followButton);
        document.querySelector('#followDiv').append(unfollowButton);

      }else{
      document.querySelector('#followDiv').append(followersDiv);
      document.querySelector('#followDiv').append(followingDiv);
      }

      load_posts_user(username, pageNum);
    })
  });
  // Prevent default:
  event.preventDefault();
}

function load_changes(value){
  console.log(`Follower count: ${value}`);
  if (value == true){
    let count = parseInt(document.querySelector('.ElementCount').textContent) + 1;
    document.querySelector('.ElementCount').innerHTML = count;
  } else{
    let count = parseInt(document.querySelector('.ElementCount').textContent) - 1;
    document.querySelector('.ElementCount').innerHTML = count;
  }
}

function load_posts_user(username, pageNum){
  document.querySelector('#divposts').textContent = '';
console.log(`Checking THE USERNAME AND PAGENUM VALES: USERNAME: ${username} AND PAGE VALUE/ ${pageNum}`);
  if (username != 'following'){
    // add user posts
    // Fetch posts per page
    fetch(`posts/${username}/${pageNum}`)
    .then(response => {    /* IF statement checks server response: .catch() does not do this! */
        if (response.ok) { console.log("HTTP request successful") }
        else { console.log("HTTP request unsuccessful") }
        return response
    })
    .then(response => response.json())
    .then(postsP => {
      console.log('THIS IS THE WAY TAKEN!!!!!! when cliking a username')
        let maxP = fetch(`posts/${username}`)
        .then (response => response.json())
        .then (result =>{
          maxP = result.length;
          if (maxP% 10 == 0){
            maxP = maxP/10
          }
          else {
            maxP = Math.trunc(maxP/10) +1
          }
        display_post(postsP,profilePage,maxP, 1);
        });
    })
      .catch(error => console.log(error))
  } else {
    // Fetch posts per page
    fetch(`posts/following/${pageNum}`)
    .then(response => response.json())
    .then(postsP => {
        console.log('THIS IS THE WAY TAKEN!!!!!! when cliking following')
        let maxP = fetch(`posts/${username}`)
        .then (response => response.json())
        .then (result =>{
          maxP = result.length;
          if (maxP% 10 == 0){
            maxP = maxP/10
          }
          else {
            maxP = Math.trunc(maxP/10) +1
          }
        display_post(postsP,followingPage,maxP, 2);
        });
    })
      .catch(error => console.log(error))
  }

}

// https://stackabuse.com/character-counter-for-text-areas-with-vanilla-javascript/
function countCharacters(){
  let numOfEnteredChars = document.querySelector('#compose-content').value.length;
  let counter = maxNumOfChars - numOfEnteredChars;
  characterCounter = document.getElementById('char_count');
  characterCounter.textContent = counter + "/255";

  if (counter < 25) {
    characterCounter.style.color = "red";
  } else if (counter < 125) {
      characterCounter.style.color = "orange";
  } else {
      characterCounter.style.color = "black";
  }
};

function compose_post(){
  content = document.querySelector('#compose-content').value;

  // J'ai rajouté method="Post" sans action='{url etc...}' dans index.html et ça a marché.
  // ajout de csrf_token et ça url ne change plus :)
  // J'ai ensuite enlevé le method="POST" et ça marche toujours!! ah non ça rajoute le crsf tokken et le content à l'url.. 
  fetch('/post', {
      method: 'POST',
      body: JSON.stringify({
          content: content
      })
  })
  .then(response => {    /* IF statement checks server response: .catch() does not do this! */
      if (response.ok) { console.log("HTTP request successful") }
      else { console.log("HTTP request unsuccessful") }
      return response
  })
  .then (response => response.json())
  .then(result => {
      console.log(result);
  })
  .catch(error => console.log(error))
    
}

function load_mainpage(pageN){
  // hides and reveals specific
  document.querySelector('#postComment').style.display = 'block';
  document.querySelector('#h3AllPosts').style.display = 'block';
  document.querySelector('#followDiv').style.display = 'none';
  document.querySelector('#allposts').style.display = 'block';
  document.querySelector('#pageControl').style.display = 'block';

  document.querySelector('#first').style.display = 'block';
  document.querySelector('#firstFollow').style.display = 'none';
  document.querySelector('#firstFollowing').style.display = 'none';
  document.querySelector('#next').style.display = 'block';
  document.querySelector('#nextFollow').style.display = 'none';
  document.querySelector('#nextFollowing').style.display = 'none';
  document.querySelector('#previous').style.display = 'block';
  document.querySelector('#previousFollow').style.display = 'none';
  document.querySelector('#previousFollowing').style.display = 'none';
  document.querySelector('#last').style.display = 'block';
  document.querySelector('#lastFollow').style.display = 'none';
  document.querySelector('#lastFollowing').style.display = 'none';

  document.querySelector('#divposts').textContent = '';
  page = pageN;
  console.log(`pageN: ${pageN}`);
     
  // Fetch posts per page
  fetch(`posts/allPosts/${pageN}`)
  .then(response => {    /* IF statement checks server response: .catch() does not do this! */
      if (response.ok) { console.log("HTTP request successful") }
      else { console.log("HTTP request unsuccessful") }
      return response
  })
  .then(response => response.json())
  .then(postsP => {

      let maxP = fetch('posts/allPosts')
      .then (response => response.json())
      .then (result =>{
        maxP = result.length;
        if (maxP% 10 == 0){
          maxP = maxP/10
        }
        else {
          maxP = Math.trunc(maxP/10) +1
        }

      display_post(postsP,page,maxP, 0);
      });
  })
    .catch(error => console.log(error))
}









function display_post(posts, page, maxP, value){
  console.log(`page N°: ${page} and maxP: ${JSON.stringify(maxP)} and value: ${value}`)//posts: ${JSON.stringify(posts)}`)
  
  if (value == 0){
    // Displays the "First" button
    if (maxP != 0) {
      if ((page == 0) || (page == 1)){
        document.querySelector("#first").style.display = 'none';
      }
      else {
        document.querySelector("#first").style.display = 'block';
      }
    }

    // Displays the "Last" button
    if (maxP != 0) {
      if ((page == (maxP-1)) || (page == (maxP-2))){
        document.querySelector("#last").style.display = 'none';
      }
      else {
        document.querySelector("#last").style.display = 'block';
      }
    }

    // Pagination on the first page
    if (page == 0) {
      if (maxP < 2) {
        document.querySelector("#previous").style.display = 'none';
        document.querySelector("#next").style.display = 'none';
      }
      else {
        document.querySelector("#previous").style.display = 'none';
        document.querySelector("#next").style.display = 'block';
      }
    }

    // Pagination on the last page
    else if (page == (maxP-1)) {
      document.querySelector("#previous").style.display = 'block';
      document.querySelector("#next").style.display = 'none';
    }

    // pagination of core pages
    else {
      document.querySelector("#previous").style.display = 'block';
      document.querySelector("#next").style.display = 'block';
    }
  }

  else if (value == 1) {
    // Displays the "First" button
    if (maxP != 0) {
      if ((page == 0) || (page == 1)){
        document.querySelector("#firstFollow").style.display = 'none';
      }
      else {
        document.querySelector("#firstFollow").style.display = 'block';
      }
    }

    // Displays the "Last" button
    if (maxP != 0) {
      if ((page == (maxP-1)) || (page == (maxP-2))){
        document.querySelector("#lastFollow").style.display = 'none';
      }
      else {
        document.querySelector("#lastFollow").style.display = 'block';
      }
    }

    // Pagination on the first page
    if (page == 0) {
      if (maxP < 2) {
        document.querySelector("#previousFollow").style.display = 'none';
        document.querySelector("#nextFollow").style.display = 'none';
      }
      else {
        document.querySelector("#previousFollow").style.display = 'none';
        document.querySelector("#nextFollow").style.display = 'block';
      }
    }

    // Pagination on the last page
    else if (page == (maxP-1)) {
      document.querySelector("#previousFollow").style.display = 'block';
      document.querySelector("#nextFollow").style.display = 'none';
    }

    // pagination of core pages
    else {
      document.querySelector("#previousFollow").style.display = 'block';
      document.querySelector("#nextFollow").style.display = 'block';
    }
  }

  else if (value == 2){
    // Displays the "First" button
    if (maxP != 0) {
      if ((page == 0) || (page == 1)){
        document.querySelector("#firstFollowing").style.display = 'none';
      }
      else {
        document.querySelector("#firstFollowing").style.display = 'block';
      }
    }

    // Displays the "Last" button
    if (maxP != 0) {
      if ((page == (maxP-1)) || (page == (maxP-2))){
        document.querySelector("#lastFollowing").style.display = 'none';
      }
      else {
        document.querySelector("#lastFollowing").style.display = 'block';
      }
    }

    // Pagination on the first page
    if (page == 0) {
      if (maxP < 2) {
        document.querySelector("#previousFollowing").style.display = 'none';
        document.querySelector("#nextFollowing").style.display = 'none';
      }
      else {
        document.querySelector("#previousFollowing").style.display = 'none';
        document.querySelector("#nextFollowing").style.display = 'block';
      }
    }

    // Pagination on the last page
    else if (page == (maxP-1)) {
      document.querySelector("#previousFollowing").style.display = 'block';
      document.querySelector("#nextFollowing").style.display = 'none';
    }

    // pagination of core pages
    else {
      document.querySelector("#previousFollowing").style.display = 'block';
      document.querySelector("#nextFollowing").style.display = 'block';
    }
  }
 
  document.querySelector('#compose-content').innerHTML = "";

  posts.forEach(posts =>{
    // Get username of user logged in
    const user_connected = document.querySelector('#userName').textContent;

    console.log(`AAAAAAAA likers array: ${posts.likers.length}`);
    // Creation of a div that will englobe all the info
    const postDiv = document.createElement('div');

    postDiv.className = 'elementPost';

    // Create div for each element:
    const postUser = document.createElement('div');
    postUser.className = 'postUser';
    const postContent = document.createElement('div');
    postContent.className = 'postContent';
    const postLike = document.createElement('div');
    postLike.className = 'postLike';

    // Create some elements for the User and time :
    const elementUser = document.createElement('span');
    const elementTime = document.createElement('span');

    // Then span for user's username
    elementUser.innerHTML = `${posts.poster}`;
    elementUser.className = 'elementUser';
    
    // Add Event Listener right away, otherwise it will not work
    elementUser.addEventListener('click', () => {
      load_followPage(`${posts.poster}`, 0);
    });
      
    // Pass the timestamp to the relativeDays function
    const setTime = timeSince(new Date(`${posts.timestamp}`).getTime());

    
    
    
    // saves the return value insite the 2nd span
    elementTime.innerHTML = `${setTime} ago`;
    elementTime.className = 'elementTime';

    // Edit button
    if (user_connected == `${posts.poster}`){
      const elementEdit = document.createElement('div');
      const elementEditFont = document.createElement('span');
    
      elementEdit.className = 'elementEdit';
      elementEditFont.className = 'fa-regular fa-pen-to-square';
      elementEdit.append(elementEditFont);

      postUser.append(elementUser, elementTime, elementEdit);
      elementEdit.addEventListener('click', () => {editPost(`${posts.id}`,`${posts.content}`)});
    } else {
      postUser.append(elementUser, elementTime);
    }

    postContent.innerHTML = `${posts.content}`;
    postContent.setAttribute('id', `${posts.id}content`);

    // Number of likes
    const likeCount = document.createElement('span');
    likeCount.innerHTML = `${posts.likers.length}`;
    likeCount.className = 'thumbs-upCount';
    likeCount.setAttribute('id',`${posts.id}`);

    // Like button
    const like = document.createElement('div');
    like.className = 'thumbs-up';

    // Likes unicode font-awesome:
    const iconeUPsolid = document.createElement('span');
    const iconeUPregular = document.createElement('span');

    iconeUPsolid.setAttribute('id', `${posts.id}us`);
    iconeUPsolid.className = 'fa-solid fa-thumbs-up';

    iconeUPregular.setAttribute('id', `${posts.id}ur`);
    iconeUPregular.className = 'fa-regular fa-thumbs-up boder';
    
    like.append(iconeUPsolid, iconeUPregular);
    if (posts.likers.includes(user_connected)){
      iconeUPsolid.style.display = 'block';
      iconeUPregular.style.display = 'none';
    } else {
      iconeUPsolid.style.display = 'none';
      iconeUPregular.style.display = 'block';
    }



    // Create a div to display error messages:
    const message = document.createElement('div');
    message.className = 'message';
    message.innerHTML = 'Error: You cannot like and dislike the same post';
    message.style.display = 'none';




    like.addEventListener('click', ()=>{
      console.log('This element has been clicked');

      if(posts.likers.includes(user_connected)){ //TODO
        //alert('Error: You cannot like a post twice');
        
        // Remove user from likers array
        for (var i = 0; i < posts.likers.length; i++){
          if (posts.likers[i] == user_connected){
            posts.likers.splice(i, 1);
            i--;
          }
        }

        // Update database
        fetch(`post/${posts.id}`,{
          method: 'PUT',
          body: JSON.stringify({
            likers: posts.likers
          })
        })
        
        // Update number of likes without reloading the page
        var newLikeCount = parseInt(document.getElementById(`${posts.id}`).textContent) - 1;
        console.log(`New number of likes is: ${newLikeCount}`);

        document.getElementById(`${posts.id}`).innerHTML = newLikeCount;
        document.getElementById(`${posts.id}us`).style.display = 'none';
        document.getElementById(`${posts.id}ur`).style.display = 'block';
      }
      else if (posts.haters.includes(user_connected)){
        if (message.style.display != 'block'){
          message.style.display = 'block';
          setTimeout(() => {
            message.style.display = 'none'
          }, '3000')
        }
      }
      else{
        posts.likers.push(user_connected);
        fetch(`post/${posts.id}`,{
          method: 'PUT',
          body: JSON.stringify({
            likers: posts.likers
          })
        })
        var newLikeCount = parseInt(document.getElementById(`${posts.id}`).textContent) + 1;
        console.log(`New number of likes is: ${newLikeCount}`);

        document.getElementById(`${posts.id}`).innerHTML = newLikeCount;
        document.getElementById(`${posts.id}us`).style.display = 'block';
        document.getElementById(`${posts.id}ur`).style.display = 'none';
      }
    });
      


    // Number of dislikes
    const dislikeCount = document.createElement('span');
    dislikeCount.innerHTML = `${posts.haters.length}`;
    dislikeCount.className = 'thumbs-downCount';
    dislikeCount.setAttribute('id', `${posts.id}dislike`);

    // Dislilke button
    const dislike = document.createElement('div');
    dislike.className = 'thumbs-down';

    // Disike unicode font-awesome:
    const iconeDownsolid = document.createElement('span');
    const iconeDownregular = document.createElement('span');

    iconeDownsolid.setAttribute('id',`${posts.id}ds`);
    iconeDownregular.setAttribute('id',`${posts.id}dr`);

    iconeDownsolid.className = 'fa-solid fa-thumbs-down fa-flip-horizontal';
    iconeDownregular.className = 'fa-regular fa-thumbs-down fa-flip-horizontal';

    if (posts.haters.includes(user_connected)){
      iconeDownsolid.style.display = 'block';
      iconeDownregular.style.display = 'none';
    } else {
      iconeDownsolid.style.display = 'none';
      iconeDownregular.style.display = 'block';
    }
    dislike.append(iconeDownsolid, iconeDownregular);

    dislike.addEventListener('click', ()=>{
      
      if(posts.haters.includes(user_connected)){ 
        // Remove user from likers array
        for (var i = 0; i < posts.haters.length; i++){
          if (posts.haters[i] == user_connected){
            posts.haters.splice(i, 1);
            i--;
          }
        }

        // Update database
        fetch(`post/${posts.id}`,{
          method: 'PUT',
          body: JSON.stringify({
            haters: posts.haters
          })
        })
        
        // Update number of likes without reloading the page
        var newLikeCount = parseInt(document.getElementById(`${posts.id}dislike`).textContent) - 1;
        console.log(`New number of likes is: ${newLikeCount}`);

        document.getElementById(`${posts.id}dislike`).innerHTML = newLikeCount;
        document.getElementById(`${posts.id}ds`).style.display = 'none';
        document.getElementById(`${posts.id}dr`).style.display = 'block';
      }
      else if (posts.likers.includes(user_connected)){
        if (message.style.display != 'block'){
          message.style.display = 'block';
          setTimeout(()=>{
            message.style.display = 'none';
          }, '3000')
        }
      }
      else{
        posts.haters.push(user_connected);
        fetch(`post/${posts.id}`,{
          method: 'PUT',
          body: JSON.stringify({
            haters: posts.haters
          })
        })
        var newLikeCount = parseInt(document.getElementById(`${posts.id}dislike`).textContent) + 1;
        console.log(`New number of likes is: ${newLikeCount}`);

        document.getElementById(`${posts.id}dislike`).innerHTML = newLikeCount;
        document.getElementById(`${posts.id}ds`).style.display = 'block';
        document.getElementById(`${posts.id}dr`).style.display = 'none';
      }
    });

    postLike.append(likeCount, like, dislike, dislikeCount);
    
    
    postDiv.append(postUser, postContent, postLike, message);


    document.querySelector('#divposts').append(postDiv);
  })
  // Prevent default:
  //event.preventDefault();
  //load_mainpage(page);
}



function editPost(idValue, content){
  console.log(`Edit values passed by post id: ${idValue} and content: ${content}`);

  // Create a Textarea and add the post content to it
  const newContent = document.getElementById(`${idValue}content`);
  const editArea = document.createElement('textarea');
  editArea.className = 'text'
  editArea.setAttribute('id', `${idValue}textarea`);
  editArea.textContent = newContent.textContent;
  setTimeout(() => {
    document.getElementById(`${idValue}textarea`).focus();
  }, 0)

  // Empty initial post content
  newContent.innerHTML = '';
  
  // Div for buttons
  const buttons = document.createElement('div');
  buttons.className = 'buttons';

  // Add save and cancel buttons
  const saveDiv = document.createElement('div');
  const save = document.createElement('span');
  save.className = 'fa-regular fa-floppy-disk';
  saveDiv.append(save);

  saveDiv.addEventListener('click', () => { 
    const newValuetest = document.getElementById(`${idValue}textarea`).value;
    saveChanges(idValue, newValuetest);
  });
  
  const cancelDiv = document.createElement('div');
  const cancel = document.createElement('span');
  cancel.className = 'fa-solid fa-ban'
  cancelDiv.append(cancel);

  cancelDiv.addEventListener('click', () => cancelChanges(idValue, content));

  // Add new content
  buttons.append(saveDiv, cancelDiv);
  newContent.append(editArea, buttons);
}





function cancelChanges(idValue, content){
  console.log('Cancel changes clicked');
  document.getElementById(`${idValue}content`).innerHTML = content;
}

function saveChanges(idValue, content){
  console.log(`TextArea content: ${content}`);

  fetch(`post/${idValue}`,{
    method: 'PUT',
    body: JSON.stringify({
      content: content
    })
  })
  document.getElementById(`${idValue}content`).innerHTML = content;
}




function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
var aDay = 24*60*60*1000;