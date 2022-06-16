var page = 0;


// Fetch ALL posts
let maxP = fetch('posts')
.then (response => response.json())
.then (posts =>{
  maxP = posts.length;
  if (maxP%10 == 0){
    maxP = maxP/10
  } else{
    maxP = Math.trunc(maxP/10) + 1
  }
  console.log(`maxP value: ${maxP}`);
})

document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('#compose-form').addEventListener('submit', compose_post);
    document.querySelector('#first').addEventListener('Click', load_mainpage(0));
    document.querySelector('#next').addEventListener('Click', load_mainpage(page+1));
    document.querySelector('#next').addEventListener('Click', load_mainpage(page+1));
    document.querySelector('#last').addEventListener('Click', load_mainpage(maxP));
    
    // Load the main page with all posts
    load_mainpage(0);
});

function compose_post(){
    content = document.querySelector('#compose-content').value;
    // J'ai rajouté method="Post" sans action='{url etc...}' et ça a marché.
    // ajout de csrf_token et ça url ne change plus :)
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
  console.log(`pageN: ${pageN}`)
  page = pageN
  // Fetch posts per page
  fetch(`posts/${pageN}`)
  .then(response => {    /* IF statement checks server response: .catch() does not do this! */
      if (response.ok) { console.log("HTTP request successful") }
      else { console.log("HTTP request unsuccessful") }
      return response
  })
  .then(response => response.json())
  .then(postsP => {
      console.log(`posts length: ${postsP.length}`);

      display_post(postsP,page,maxP);
  })
  .catch(error => console.log(error))
}

function display_post(posts, page, maxP){

  console.log(`posts: ${posts}, page N°: ${page} and maxP: ${maxP}`)
    
  if ((page == 0) && ((page+1) != maxP)){
    document.querySelector("#first").style.display = 'none';
    document.querySelector("#previous").style.display = 'none';
  }
  else if (page == 0 && (page+1) == maxP){
    document.querySelector("#first").style.display = 'none';
    document.querySelector("#previous").style.display = 'none';
    document.querySelector("#last").style.display = 'none';
    document.querySelector("#next").style.display = 'none';
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
  const postLike = document.createElement('div');

  // Create some span elements:
  const elementUser = document.createElement('span');
  const elementTime = document.createElement('span');

  // First span for user's username
  elementUser.innerHTML = `${posts.poster}`;
  elementUser.className = 'elementUser';

  // Pass the timestamp to the relativeDays function
  const setTime = timeSince(new Date(`${posts.timestamp}`).getTime());
  
  // saves the return value insite the 2nd span
  elementTime.innerHTML = `${setTime} ago`;
  elementTime.className = 'elementTime';

  postUser.append(elementUser);
  postUser.append(elementTime);

  postContent.innerHTML = `${posts.content}`;

  postLike.innerHTML = '\u2661 \u{1F5A4}';
  //postLike.className = '\U2661';

  postDiv.append(postUser);
  postDiv.append(postContent);
  postDiv.append(postLike);

  document.querySelector('#allposts').append(postDiv);
  })
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