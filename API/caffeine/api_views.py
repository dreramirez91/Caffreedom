from django.shortcuts import get_object_or_404
from .models import CaffeineIntake
from django.views.decorators.http import require_http_methods
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from common.json import ModelEncoder, DecimalEncoder
import json
from decimal import Decimal


class CaffeineIntakesEncoder(ModelEncoder):
    model = CaffeineIntake
    properties = ["id", "amount", "date", "caffeine", "type", "measurement", "notes"]
    encoders = {"amount": DecimalEncoder()}


@require_http_methods(["GET", "POST", "PATCH", "DELETE"])
def api_caffeine(request):
    if request.method == "GET":
        user = Token.objects.get(key=request.META.get("HTTP_AUTHORIZATION")).user
        intakes = user.caffeine_intakes.all().order_by("-date")
        return JsonResponse({"intakes": intakes}, encoder=CaffeineIntakesEncoder)
    elif request.method == "POST":
        user = Token.objects.get(key=request.META.get("HTTP_AUTHORIZATION")).user
        data = json.loads(request.body)
        amount = Decimal(data["amount"])
        caffeine = data["caffeine"]
        date = data["date"]
        notes = data["notes"]
        type = data["type"]
        measurement = data["measurement"]
        amount = data["amount"]
        user.caffeine_intakes.create(
            amount=amount,
            date=date,
            type=type,
            notes=notes,
            caffeine=caffeine,
            measurement=measurement,
        )
        intakes = user.caffeine_intakes.all()
        return JsonResponse({"intakes": intakes}, encoder=CaffeineIntakesEncoder)
    elif request.method == "PATCH":
        user = Token.objects.get(key=request.META.get("HTTP_AUTHORIZATION")).user
        data = json.loads(request.body)
        if "notes" in data.keys():
            notes = data["notes"]
            id = data["id"]
            CaffeineIntake.objects.filter(id=id).update(notes=notes)
        else:
            amount = data["amount"]
            id = data["id"]
            caffeine = data["caffeine"]
            CaffeineIntake.objects.filter(id=id).update(
                amount=amount, caffeine=caffeine
            )
        intakes = user.caffeine_intakes.all()
        return JsonResponse({"intakes": intakes}, encoder=CaffeineIntakesEncoder)
    elif request.method == "DELETE":
        data = json.loads(request.body)
        user = Token.objects.get(key=request.META.get("HTTP_AUTHORIZATION")).user
        id = data["id"]
        intake = get_object_or_404(user.caffeine_intakes, id=id)
        intake.delete()
        return JsonResponse({"Delete": "Success"})
