from django.urls import path
from .views import test
from .views import search_location
urlpatterns = [
    path('', test, name='test-map'),
    path('search-location/', search_location, name='search_location')
    # localhost:8000/
]