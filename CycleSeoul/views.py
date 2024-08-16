from django.shortcuts import render
from django.http import JsonResponse
from .models import Location

# Create your views here.
def test(request):
    
    return render(request, "CycleSeoul/NaverMap.html")

def search_location(request):
    query = request.GET.get('query')
    if query:
        try:
            location = Location.objects.get(name__icontains=query)
            data = {
                'status': 'success',
                'location': {
                    'lat': location.latitude,
                    'lng': location.longitude
                }
            }
        except Location.DoesNotExist:
            data = {
                'status': 'fail',
                'message': 'Location not found'
            }
    else:
        data = {
            'status': 'fail',
            'message': 'No query provided'
        }
    
    return JsonResponse(data)