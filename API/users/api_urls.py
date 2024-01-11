from django.urls import path
from .api_views import (
    signin,
    signout,
    signup,
    delete,
    get_username,
)

urlpatterns = [
    path("get_username/", get_username, name="get_username"),
    path("signin/", signin, name="signin"),
    path("signout/", signout, name="signout"),
    path("signup/", signup, name="signup"),
    path("delete/", delete, name="delete"),
]
