from django import forms

class newPostForm(forms.Form):
    content = forms.CharField(max_length=255 ,widget = forms.Textarea(
        attrs={'placeholder':'Share your thoughts with the World! (max 255 characters)', 'id': 'compose-content', 
        'autofocus': 'autofocus'}))