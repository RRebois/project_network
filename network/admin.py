from django.contrib import admin
from .models import *

class LikeAdmin(admin.ModelAdmin):
    filter_horizontal = ('likers', 'haters',)

class UserAdmin(admin.ModelAdmin):
    filter_horizontal = ('following',)

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(newPost)
admin.site.register(Like, LikeAdmin)