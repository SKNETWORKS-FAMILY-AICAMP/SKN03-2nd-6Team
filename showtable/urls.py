from django.urls import path
from .views import showindex

urlpatterns = [
    path('', showindex, name = "showtable-index" )
]
