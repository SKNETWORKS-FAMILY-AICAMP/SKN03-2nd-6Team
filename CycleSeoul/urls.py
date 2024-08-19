from django.urls import path
from .views import search_location
urlpatterns = [
    path('', search_location, name='search-location')
]