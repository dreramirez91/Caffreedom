from django.urls import path
from .api_views import signin, signout, signup, api_user

urlpatterns = [
    path("", api_user, name="api_user"),
    path("signin/", signin, name="signin"),
    path("signout/", signout, name="signout"),
    path("signup/", signup, name="signup"),
]
