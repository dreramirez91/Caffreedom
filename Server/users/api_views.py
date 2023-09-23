from django.shortcuts import render, get_object_or_404
from rest_framework.authentication import BasicAuthentication
from .models import Profile, CaffeineIntake
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from .serializers import UserSerializer 
from django.http import JsonResponse
from common.json import ModelEncoder


class CaffeineIntakesEncoder(ModelEncoder):
    model = CaffeineIntake
    properties = ["amount", "date"]
    
 
@require_http_methods(["GET", "POST"])
def api_list_caffeine_intake(request):
    permission_classes = [IsAuthenticated,]
    print("REQUEST DATA", request.user)
    if request.method == "GET":
        user_id = request.user.id
        profile = Profile.objects.get(id=user_id)
        print("PROFILE =>", profile)
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
    
    
@csrf_exempt
@api_view(['POST'])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None and password is None:
        return Response({'error': 'Please provide a username & password'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_404_NOT_FOUND)
    
    token, _ = Token.objects.get_or_create(user=user)
    return Response ({'token': token.key}, status=status.HTTP_200_OK)
