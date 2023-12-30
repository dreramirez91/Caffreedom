from django.urls import path
from .api_views import (
    api_list_caffeine_intake,
    api_delete_caffeine_intake,
    api_edit_caffeine_intake,
)

urlpatterns = [
    path("list_caffeine/", api_list_caffeine_intake, name="api_list_caffeine_intake"),
    path(
        "delete/",
        api_delete_caffeine_intake,
        name="api_delete_caffeine_intake",
    ),
    path(
        "edit/",
        api_edit_caffeine_intake,
        name="api_edit_caffeine_intake",
    ),
]
