from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authentication import BasicAuthentication
from .models import CaffeineIntake
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, get_user, logout, login
from rest_framework import generics, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from django.http import JsonResponse
from common.json import ModelEncoder
from django.core.handlers.wsgi import WSGIRequest
from django.contrib.sessions.models import Session
from django.db.utils import IntegrityError
import json


class CaffeineIntakesEncoder(ModelEncoder):
    model = CaffeineIntake
    properties = ["id", "amount", "date", "caffeine", "type", "measurement"]


@csrf_exempt
@require_http_methods(["GET", "POST"])
def api_list_caffeine_intake(request):
    if request.method == "GET":
        user = Token.objects.get(key=request.META.get("HTTP_AUTHENTICATION")).user
        intakes = user.caffeine_intakes.all()
        return JsonResponse({"intakes": intakes}, encoder=CaffeineIntakesEncoder)
    elif request.method == "POST":
        user = Token.objects.get(key=request.META.get("HTTP_AUTHENTICATION")).user
        data = json.loads(request.body)
        caffeine = data["caffeine"]
        date = data["date"]
        type = data["type"]
        measurement = data["measurement"]
        amount = data["amount"]
        user.caffeine_intakes.create(
            amount=amount,
            date=date,
            type=type,
            caffeine=caffeine,
            measurement=measurement,
        )
        intakes = user.caffeine_intakes.all()
        return JsonResponse({"intakes": intakes}, encoder=CaffeineIntakesEncoder)


@csrf_exempt
@require_http_methods(["POST"])
def api_delete_caffeine_intake(request):
    data = json.loads(request.body)
    print("DATA FOR DELETE => ", data)
    user = Token.objects.get(key=request.META.get("HTTP_AUTHENTICATION")).user
    id = data["id"]
    intake = get_object_or_404(user.caffeine_intakes, id=id)
    intake.delete()
    return JsonResponse({"Delete": "Success"})


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@csrf_exempt
@api_view(["POST"])
def signin(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None and password is None:
        return Response(
            {"error": "Please provide a username & password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
    else:
        return Response({"Error": "Invalid username"}, status=status.HTTP_404_NOT_FOUND)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
def signout(request):
    logout(request)
    return JsonResponse({"Logout": "Success"})


@csrf_exempt
@api_view(["POST"])
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = User.objects.create_user(username=username, password=password)
    user.save()
    login(request, user)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key}, status=status.HTTP_200_OK)
