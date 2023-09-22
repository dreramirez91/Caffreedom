from django.urls import path
from .api_views import api_list_caffeine_intake, UserList, UserDetail

urlpatterns = [
    path("list_caffeine", api_list_caffeine_intake, name="api_list_caffeine_intake"),
    path("", UserList.as_view(), name='user-list'),
    path('/<int:pk>/', UserDetail.as_view(), name='user-detail')
    ]
