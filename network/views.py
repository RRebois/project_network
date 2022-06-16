import time, math, json
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from .models import *
from .forms import newPostForm

def pages(request, page):
    data = newPost.objects.all()
    count = len(data) 

    if count%10 == 0:
        maxP = count/10
    else:
        maxP = int(math.trunc(count/10) + 1)
    
    if page >= maxP:
        return JsonResponse({"error": "Data does not exist"}, status=404)

    # Get start and end points
    start = 0 + 10 * page

    # Posts left:
    postsLeft = count - start 

    if postsLeft >= 10:
        end = start + 10
    else:
        end = start + postsLeft
   
    print(f"end: {end}")
    # Generate list of posts
    posts = []
    for i in range(start, end):
        posts.append(data[i])

    # Artificially delay speed of response
    #time.sleep(1)
    return JsonResponse([post.serialize() for post in posts], safe=False)

def collect(request):
    # Return all posts 
    posts = newPost.objects.all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

def postsUser(request, word, page):
    try:
        userPosting = User.objects.get(username=word)
    except User.DoesNotExist:
        return JsonResponse({"error": "This user does not exists."}, status=404)
    
    #return all posts filter by user
    data = newPost.objects.filter(poster = User.objects.get(username=word))
    count = len(data)

    if count%10 == 0:
        maxP = count/10
    else:
        maxP = int(math.trunc(count/10) + 1)
    
    if page >= maxP:
        return JsonResponse({"error": "Data does not exist"}, status=404)
    
    # Get start and end points
    start = 0 + 10 * page

    # Posts left:
    postsLeft = count - start 

    if postsLeft >= 10:
        end = start + 10
    else:
        end = start + postsLeft
   
    print(f"end: {end}")
    
    # Generate list of posts
    posts = []
    for i in range(start, end):
        posts.append(data[i])
    
    return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
def follow(request, word):
    #  Query for requested user's profile:
    try:
        follows = User.objects.get(username=word)
    except User.DoesNotExist:
        return JsonResponse({"error": "This user does not exists and therefore has no followers."}, status=404)
    
    # Return user's profile data:
    if request.method == "GET":
        return JsonResponse(follows.serialize())
    
    # Update weither user follows/unfollows another user:
    elif request.method == "PUT":
        data = json.loads(request.body)

        
        followingList = data["following"]

        print(f"data to Update: {followingList}")
        print(f"length of data to Update: {len(followingList)}")

        users = User.objects.filter(username__in=followingList)

        print(f"users to add: {users.all()}")

        # To modify an array it has to be done via set()
        follows.following.set(users)
        
        follows.save()
        return HttpResponse(status=204)
    
    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@csrf_exempt
def compose(request):
    # Two options here, the first one is to use a Django form but then the url changes to /?content=hi
    # to avoid we can make a normal django post and HttpResponseRedirect(reverse('index'))

    if request.method != "POST":
        return JsonResponse({"error": "POST request only!"}, status=400)

    # Get contents of new post
    data = json.loads(request.body)
    content = data.get("content", "")

    if content == "":
        return JsonResponse({"error": "Cannot post an empty message."}, status=400)

    addPost = newPost(poster=request.user, content=content)
    addPost.save()

    return JsonResponse({"message": "Post saved successfully."}, status=201)

def index(request):
    form = newPostForm()
    listPosts = newPost.objects.all()
#    count = len(listPosts)
 #   if count%10 == 0:
  #      pages = count/10
  #  else:
   #     pages = int(math.trunc(count/10) + 1)
    #
    #pageCount = []
    #for i in range(1,pages+1):
     #   pageCount.append(i)

    return render(request, "network/index.html",{
        "form": form
        #"count": pageCount
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