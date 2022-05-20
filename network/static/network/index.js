document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelector('#compose-form').addEventListener('submit', newPost);
    
    // By default, load index page with all posts:
    //load_posts();
});

function load_posts(){
    // fetch mails from mailbox
    fetch('posts')
    .then(response => response.json())
    .then(posts => {
        // Print emails
        console.log(posts);  
        
        //emails.forEach(display_email);
    });
}


function newPost(){
    // Find what the user is submitting
    content = document.querySelector('#compose-content').value;
    
    // Fetch API via POST
    fetch('/post', {
        method: 'POST',
        body: JSON.stringify({
            content: content
        })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
    
}
