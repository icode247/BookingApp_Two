from django.shortcuts import render
from django.http import JsonResponse

from amadeus import Client, ResponseError, Location

amadeus = Client(
    client_id='Your App API KEY',
    client_secret='Your App Secret Key '
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
            response = amadeus.shopping.flight_offers_search.get(
                originLocationCode=originCode, destinationLocationCode=destinationCode, departureDate=departureDate, adults=1)
            context = {
                "data": response.data
            }
            return JsonResponse(context)

        except ResponseError as error:
            print(error)
    return JsonResponse({"error": "Invalid request method"})


def price_offer(req):
    if req.method == "GET":
        try:
            flight = req.POST['flight']
            response = amadeus.shopping.flight_offers.pricing.post(flight)
            print(response.data)
            return JsonResponse(response.data)

        except ResponseError as error:
            print(error)
    return JsonResponse({"error": "Invalid request method"})



def book_flight(req):
   if req.method == "POST":
      try:
        flight = req.POST['flight']
        traveler = req.POST['traveler']
        booking = amadeus.booking.flight_orders.post(flight, traveler)
        return JsonResponse(booking)
      except ResponseError as error:
        print(error)
   return JsonResponse({"error": "Invalid request method"})