from django.shortcuts import render, get_object_or_404
from rest_framework.authentication import BasicAuthentication
from .models import Profile, CaffeineIntake
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer 
from django.http import JsonResponse
from common.json import ModelEncoder
import json

class CaffeineIntakesEncoder(ModelEncoder):
    model = CaffeineIntake
    properties = ["amount", "date"]
    
 
@login_required
@require_http_methods(["GET", "POST"])
def api_list_caffeine_intake(request):
    if request.method == "GET":
        user_id = request.user.id
        profile = Profile.objects.get(id=user_id)
        intakes = profile.caffeine_intakes.all()
        print("Intakes =>", intakes)
        return JsonResponse(
            {"intakes": intakes},
            encoder=CaffeineIntakesEncoder
        )

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    