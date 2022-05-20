from django import forms

class newPostForm(forms.Form):
    content = forms.CharField(widget = forms.Textarea(attrs={'placeholder':'Share your thoughts with the World!', 'id': 'compose-content','rows':'5', 'cols':'5'}) )