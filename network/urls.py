from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    # To create API's we need to create urls that will be the entry points of our api
    # when we fetch at url post, if to post a comment: aka via the POST request.
    # then we need urls to GET the data

    path("post", views.compose, name="compose"), # POST API: create new post
    path("posts/<str:word>", views.collect, name="collect"), # GET API all posts/userposts
    path("posts/<str:word>/<int:page>", views.postsUser, name="postsUser"), # GET API 10 posts for pagination ALL POSTS/User posts
    path("follow/<str:word>", views.follow, name="follow"), # Access user follows
    path("post/<int:post_id>", views.post, name="post") # API to acces data of 1 post
]
