import os
import smtplib
from django.conf import settings
from django.shortcuts import render

# The landing page 
def index(request):
	return render(request, 'index.html')

# The post-form page 
def bye(request):
	if request.method == 'POST':
		name = request.POST.get('name')
		email = request.POST.get('email')
		message = request.POST.get('message')
		beta = request.POST.get('beta') or 'no'

		# If they want to beta test or not 
		if beta and beta == 'on':
			beta = 'yes' 

		# Save to a text file on the server 
		fname = '_'.join(name.split()) + '.txt'
		fpath = os.path.join(os.path.abspath('.'), 'preorder-info', fname)
		f = open(fpath, 'w')
		f.write('Name: ' + str(name) + '\n')
		f.write('Email: ' + str(email) + '\n')
		f.write('Message: ' + str(message) + '\n')
		f.write('Wants to beta test? ' + beta + '\n')
		f.close()

		# Send me and them an email 
		body = "Test"

		message = "\r\n".join([
		  "From:" + settings.HAPLY_EMAIL,
		  "To:" + email,
		  "Subject: Your Haply Pre-Order",
		  "",
		  body 
		  ])
		server = smtplib.SMTP("smtp.gmail.com", 587)
		server.ehlo()
		server.starttls()
		server.login(settings.HAPLY_EMAIL, settings.HAPLY_PASSWORD)
		server.sendmail(settings.HAPLY_EMAIL, [email, "morganeciot@gmail.com"], message)

		return render(request, 'bye.html')

	return render(request, 'index.html')


# To view the simulation
def simulation(request):
	return render(request, 'ball-test.html')