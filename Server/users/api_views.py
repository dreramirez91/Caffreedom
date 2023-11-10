from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import CaffeineIntake
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, logout, login
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from django.http import JsonResponse
from common.json import ModelEncoder, DecimalEncoder
import json
from decimal import Decimal


class CaffeineIntakesEncoder(ModelEncoder):
    model = CaffeineIntake
    properties = ["id", "amount", "date", "caffeine", "type", "measurement"]
    encoders = {"amount": DecimalEncoder()}


@csrf_exempt
@require_http_methods(["GET", "POST"])
def api_list_caffeine_intake(request):
    if request.method == "GET":
        user = Token.objects.get(key=request.META.get("HTTP_AUTHENTICATION")).user
        intakes = user.caffeine_intakes.all().order_by("-date")
        return JsonResponse({"intakes": intakes}, encoder=CaffeineIntakesEncoder)
    elif request.method == "POST":
        user = Token.objects.get(key=request.META.get("HTTP_AUTHENTICATION")).user
        data = json.loads(request.body)
        amount = Decimal(data["amount"])
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
@require_http_methods(["PATCH"])
def api_edit_caffeine_intake(request):
    user = Token.objects.get(key=request.META.get("HTTP_AUTHENTICATION")).user
    data = json.loads(request.body)
    print("\n\n\n\nEDIT DATA:", data, "\n\n\n\n")
    amount = data["amount"]
    id = data["id"]
    caffeine = data["caffeine"]
    CaffeineIntake.objects.filter(id=id).update(amount=amount, caffeine=caffeine)
    intakes = user.caffeine_intakes.all()  # perhaps change response
    return JsonResponse({"intakes": intakes}, encoder=CaffeineIntakesEncoder)


@csrf_exempt
@require_http_methods(["DELETE"])
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
    if not username and not password:
        return Response(
            {"error": "Please enter a username & password"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {"error": "Please create an account"}, status=status.HTTP_404_NOT_FOUND
        )
    if user is not None:
        try:
            user = authenticate(username=username, password=password)
            login(request, user)
        except AttributeError:
            return Response(
                {"error": "That password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST,
            )
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
    password_confirmation = request.data.get("password_confirmation")
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        user = None
    print(request.data, "\n\n\n\n")
    if user is not None:
        return Response(
            {"error": "That username is already taken"}, status=status.HTTP_409_CONFLICT
        )
    if password != password_confirmation:
        return Response(
            {"error": "Passwords do not match"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    if password == "":
        return Response(
            {"error": "Please enter a password"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    user = User.objects.create_user(username=username, password=password)
    user.save()
    login(request, user)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key}, status=status.HTTP_200_OK)
