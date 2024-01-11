from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout, login
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from django.http import JsonResponse
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import json


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


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


@api_view(["POST"])
def signout(request):
    logout(request)
    return JsonResponse({"Logout": "Success"})


@api_view(["POST"])
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if len(username) < 7:
        return Response(
            {"error": "Username must be at least 7 characters"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    elif username.isalpha():
        return Response(
            {"error": "Username contain at least one number"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    elif username.isdigit():
        return Response(
            {"error": "Username contain at least one letter"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    try:
        validate_password(password)
    except ValidationError as e:
        return Response(
            {"error": e.messages}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    password_confirmation = request.data.get("password_confirmation")
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        user = None
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


@api_view(["DELETE"])
def delete(request):
    username = request.data.get("username")
    user = Token.objects.get(key=request.META.get("HTTP_AUTHORIZATION")).user
    if username == str(user):
        number_deleted, _ = user.delete()
        return JsonResponse({"Delete": number_deleted}, status=status.HTTP_200_OK)
    else:
        return JsonResponse(
            {"Error": "Please check the spelling of your username."},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET"])
def get_username(request):
    print(request.META.get("HTTP_AUTHORIZATION"))
    user = Token.objects.get(key=request.META.get("HTTP_AUTHORIZATION")).user
    print("\n\n", user, "\n\n")
    return JsonResponse({"username": str(user)}, status=status.HTTP_200_OK)
