from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from amadeus import Client, ResponseError, Location

amadeus = Client(
    client_id='CoArtPgeKZ5667oYQFCkFCBsv5PeV43Q',
    client_secret='PbkxxwJuP5xL5aqX'
)


def select_destination(req, param):
    if req.method == "GET":
        try:
            print(param)
            response = amadeus.reference_data.locations.get(
                keyword=param, subType=Location.ANY)
            context = {
                "data": response.data
            }
            return JsonResponse(context)

        except ResponseError as error:
            print(error)
    return JsonResponse({"error": "Invalid request method"})


def search_offers(req):
    if req.method == "GET":
        try:
            originCode = req.GET["originCode"]
            destinationCode = req.GET["destinationCode"]
            departureDate = req.GET["departureDate"]
            print(originCode, destinationCode, departureDate)
            response = amadeus.shopping.flight_offers_search.get(
                originLocationCode=originCode, destinationLocationCode=destinationCode, departureDate=departureDate, adults=1)
            context = {
                "data": response.data
            }
            return JsonResponse(context)

        except ResponseError as error:
            print(error)
    else:
        return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def price_offer(req):
    if req.method == "POST":
        try:
            data = json.loads(req.body)
            flight = data.get("flight")
            response = amadeus.shopping.flight_offers.pricing.post(flight)
 
            return JsonResponse(response.data)

        except ResponseError as error:
            print(error)
    else:
       return JsonResponse({"error": "Invalid request method"})

@csrf_exempt
def book_flight(req):
    if req.method == "POST":
        try: 
            data = json.loads(req.body)
            flight = data.get('flight')
            traveler = data.get('traveler')
            booking = amadeus.booking.flight_orders.post(flight, traveler)
            return JsonResponse(booking)
        except ResponseError as error:
            print(error)
    else:
       return JsonResponse({"error": "Invalid request method"})
