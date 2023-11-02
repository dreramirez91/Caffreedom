from django.urls import path
from .api_views import (
    api_list_caffeine_intake,
    UserList,
    UserDetail,
    signin,
    signout,
    signup,
    api_delete_caffeine_intake,
)

urlpatterns = [
    path("list_caffeine", api_list_caffeine_intake, name="api_list_caffeine_intake"),
    path("", UserList.as_view(), name="user-list"),
    path("<int:pk>/", UserDetail.as_view(), name="user-detail"),
    path("signin", signin, name="signin"),
    path("signout", signout, name="signout"),
    path("signup", signup, name="signup"),
    path(
        "delete",
        api_delete_caffeine_intake,
        name="api_delete_caffeine_intake",
    ),
]
