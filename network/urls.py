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
    path("post", views.compose, name="compose"), # POST API
    path("posts", views.collect, name="collect"), # GET API
    path("posts/<int:post_id>", views.posts, name="posts"),
    path("follow", views.follow, name="follow"),
]
