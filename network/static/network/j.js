var page = 0;
var profilePage = 0;

document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelector('#compose-form').addEventListener('submit', compose_post);
  
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
    load_followPage(document.querySelector('.title').textContent,profilePage)
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
      load_followPage(document.querySelector('.title').textContent,profilePage)
    })
  });
  
    
    // Load the main page with all posts
    load_mainpage(page);
});

function load_followPage(username, pageNum) {
  console.log(`Pagenum for the load_followpage function: ${username} ${pageNum}`);
  document.querySelector('#postComment').style.display = 'none';
  document.querySelector('#h3AllPosts').style.display = 'none';
  document.querySelector('#followDiv').style.display = 'block';
  document.querySelector('#allposts').style.display = 'block';
  document.querySelector('#pageControl').style.display = 'block';

  document.querySelector('#first').style.display = 'none';
  document.querySelector('#firstFollow').style.display = 'block';
  document.querySelector('#next').style.display = 'none';
  document.querySelector('#nextFollow').style.display = 'block';
  document.querySelector('#previous').style.display = 'none';
  document.querySelector('#previousFollow').style.display = 'block';
  document.querySelector('#last').style.display = 'none';
  document.querySelector('#lastFollow').style.display = 'block';

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

      console.log(`followers: ${data.followers} following: ${data.following}`);
      // Following
      const followingDiv = document.createElement('div');
      followingDiv.className = 'followersDiv';

      console.log(`data.id: ${data.username}`);
      followersDiv.innerHTML = `${data.followers.length} followers`;
      followingDiv.innerHTML = `${data.following.length} following`;
      
      // Add follow/unfollow button
      if (username != user_connected){
        let followButton = document.createElement('button');
        followButton.className = 'btn btn-primary left';
        followButton.innerHTML = 'Follow';
        followButton.style.display = 'none';

        let unfollowButton = document.createElement('button');
        unfollowButton.className = 'btn btn-secondary left';
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

        followButton.addEventListener('click', ()=> {
          followButton.style.display = 'none';
          unfollowButton.style.display = 'block';

          followingArray.push(`${username}`);
          
          fetch(`follow/${user_connected}`,{
            method: 'PUT',
            body: JSON.stringify({
              following: followingArray
            })
          })
          load_changes(followingArray.length);
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
          load_changes(followingArray.length);
        });
      
        // Add to main Div
        document.querySelector('#followDiv').append(followersDiv);
        document.querySelector('#followDiv').append(followingDiv);
        document.querySelector('#followDiv').append(followButton);
        document.querySelector('#followDiv').append(unfollowButton);

      }else{
      document.querySelector('#followDiv').append(followersDiv);
      document.querySelector('#followDiv').append(followingDiv);}
    })
  });

  // add user posts
  document.querySelector('#divposts').textContent = '';
  
  // Fetch posts per page
  fetch(`posts/${username}/${pageNum}`)
  .then(response => {    /* IF statement checks server response: .catch() does not do this! */
      if (response.ok) { console.log("HTTP request successful") }
      else { console.log("HTTP request unsuccessful") }
      return response
  })
  .then(response => response.json())
  .then(postsP => {

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
      display_post(postsP,profilePage,maxP, false);
      });
  })
    .catch(error => console.log(error))

  // Prevent default:
  event.preventDefault();
}

function load_changes(count){
    document.querySelector('.followersDiv').innerHTML = `${count} followers`;
  }

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
  document.querySelector('#next').style.display = 'block';
  document.querySelector('#nextFollow').style.display = 'none';
  document.querySelector('#previous').style.display = 'block';
  document.querySelector('#previousFollow').style.display = 'none';
  document.querySelector('#last').style.display = 'block';
  document.querySelector('#lastFollow').style.display = 'none';

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

      display_post(postsP,page,maxP, true);
      });
  })
    .catch(error => console.log(error))
}









function display_post(posts, page, maxP, boolvalue){
  console.log(`posts: ${JSON.stringify(posts)}, page N°: ${page} and maxP: ${JSON.stringify(maxP)}`)
  
  if (boolvalue){
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

  else{
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
 
  document.querySelector('#compose-content').innerHTML = "";

  posts.forEach(posts =>{
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

  // Create some elements for the User and time:
  const elementUser = document.createElement('a');
  const elementTime = document.createElement('span');

  // Then span for user's username
  elementUser.innerHTML = `${posts.poster}`;
  elementUser.className = 'elementUser';
  elementUser.href = "";
  // Add Event Listener right away, otherwise it will not work
  elementUser.addEventListener('click', () => {
    load_followPage(`${posts.poster}`, 0);
  });
    
  // Pass the timestamp to the relativeDays function
  const setTime = timeSince(new Date(`${posts.timestamp}`).getTime());
  
  // saves the return value insite the 2nd span
  elementTime.innerHTML = `${setTime} ago`;
  elementTime.className = 'elementTime';

  postUser.append(elementUser);
  postUser.append(elementTime);

  postContent.innerHTML = `${posts.content}`;

  const likeHeart = document.createElement('span');
  likeHeart.className = 'likeHeart';
  likeHeart.innerHTML = '\u2661';
  const dislikeHeart = document.createElement('span');
  dislikeHeart.className = 'dislikeHeart';
  dislikeHeart.innerHTML = '\u2661'//'\u{1F5A4}';

  postLike.append(likeHeart);
  postLike.append(dislikeHeart); 

  postDiv.append(postUser);
  postDiv.append(postContent);
  postDiv.append(postLike);

  document.querySelector('#divposts').append(postDiv);
  })
  // Prevent default:
  // event.preventDefault();
  //load_mainpage(page);
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