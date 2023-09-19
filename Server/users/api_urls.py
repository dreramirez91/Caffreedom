from django.urls import path
from .api_views import api_list_caffeine_intake

urlpatterns = [
    path("list_caffeine", api_list_caffeine_intake, name="api_list_caffeine_intake")
    ]
