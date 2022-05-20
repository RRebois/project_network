from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass
    
    def __str__(self):
        return f"{self.username}"

class newPost(models.Model):
    poster = models.ForeignKey("User", on_delete=models.CASCADE)
    content = models.TextField(blank = True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Poster: {self.poster.username}, posted content {self.content} on {self.timestamp}."

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

class Follow(models.Model):
    followed = models.ForeignKey("User", on_delete=models.CASCADE, related_name="head")
    followers = models.ManyToManyField("User", related_name="tails")

    def __str__(self):
        return f"follower: {self.follower.username} followed by {self.followed.username} {self.link}."
    
    def serialize(self):
        return {
            "id": self.id,
            "followed": self.followed,
            "followers": [user.username for user in self.followers.all()]
        }
