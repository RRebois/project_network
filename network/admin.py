from django.contrib import admin
from .models import *

class LikeAdmin(admin.ModelAdmin):
    filter_horizontal = ('likers', 'haters',)

class FollowAdmin(admin.ModelAdmin):
    filter_horizontal = ('followers',)

# Register your models here.
admin.site.register(User)
admin.site.register(newPost)
admin.site.register(Like, LikeAdmin)
admin.site.register(Follow, FollowAdmin)