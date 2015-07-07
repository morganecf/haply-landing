from django.shortcuts import render

# The landing page 
def index(request):
	if request.method == 'POST':
		print 'post'
	return render(request, 'index.html')

# The success page 
def bye(request):
	if request.method == 'POST':
		print 'post'
		print request.POST
	return render(request, 'bye.html')

# To view the simulation
def simulation(request):
	return render(request, 'ball-test.html')