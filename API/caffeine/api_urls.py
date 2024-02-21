from django.urls import path
from .api_views import api_caffeine

urlpatterns = [
    path("", api_caffeine, name="api_caffeine"),
]
