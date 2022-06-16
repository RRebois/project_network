from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("self", related_name="followers", null =True, blank=True, symmetrical = False)
    #following = models.ManyToManyField("self", related_name="head", null =True, blank=True)
    
    def __str__(self):
        return f"{self.username}"
    
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "followers": [user.username for user in self.followers.all()],
            "following": [user.username for user in self.following.all()]
        }

class newPost(models.Model):
    poster = models.ForeignKey("User", on_delete=models.CASCADE)
    content = models.CharField(max_length=255, blank = True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Poster: {self.id} {self.poster.username}, posted content {self.content} on {self.timestamp}."
    
    class Meta:
        ordering = ['-timestamp'] 

    def serialize(self):
        return {
            "id": self.id,
            "poster": self.poster.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

class Like(models.Model):
    likers = models.ManyToManyField("User", related_name="likers", blank = True, null= True)
    haters = models.ManyToManyField("User", related_name="haters", blank = True, null= True)
    postLiked = models.ForeignKey("newPost", on_delete=models.CASCADE)

    def __str__(self):
        return f"post {self.postLiked}."

    def serialize(self):
        return {
            "id": self.id,
            "postLiked": self.postLiked.id,
            "likers": [user.username for user in self.likers.all()],
            "haters": [user.username for user in self.haters.all()]
        }
