import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import *
from .forms import newPostForm


def index(request):
    form = newPostForm()
    return render(request, "network/index.html",{
        "form": form
    })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def compose(request):
    # Compose a new post must be via POST:
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    # Take in the data the user submitted and save it as form
#    if request.method == "POST":
#        dataForm = form(request.POST)
#    
#        # Check if form data is valid (server-side)
#        if dataForm.is_valid():
#            # Isolate the task from the 'cleaned' version of form data
#            content = dataForm.cleaned_data["content"]
            
    data = json.loads(request.body)
    content = data.get("content", "")
    
    addPost = newPost(poster = request.user, content=content)
    addPost.save()

    JsonResponse({"message": "New post created successfully"}, status=201)
    return HttpResponseRedirect(reverse("index"))

def collect(request):
    posts = newPost.objects.all()
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe = False)

def posts(request, id):
    return 0
def follow(request):
    return 0