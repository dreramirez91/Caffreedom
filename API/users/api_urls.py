from django.urls import path
from .api_views import (
    UserList,
    UserDetail,
    signin,
    signout,
    signup,
)

urlpatterns = [
    path("", UserList.as_view(), name="user-list"),
    path("<int:pk>/", UserDetail.as_view(), name="user-detail"),
    path("signin/", signin, name="signin"),
    path("signout/", signout, name="signout"),
    path("signup/", signup, name="signup"),
]
