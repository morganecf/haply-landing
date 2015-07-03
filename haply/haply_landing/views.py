from django.shortcuts import render

# The landing page 
def index(request):
	return render(request, 'index.html')

