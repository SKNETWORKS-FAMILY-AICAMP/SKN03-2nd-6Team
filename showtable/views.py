# Create your views here.
from django.shortcuts import render

# Create your views here.
def showindex(req):
    return render(req, "showtable/index.html")