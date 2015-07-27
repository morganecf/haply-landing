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
		### NAME AND MESSAGE DISABLED FOR NOW 

		#name = request.POST.get('name')
		email = request.POST.get('email')
		#message = request.POST.get('message')
		#beta = request.POST.get('beta') or 'no'

		# If they want to beta test or not 
		# if beta and beta == 'on':
		# 	beta = 'yes' 

		## SINCE NAME IS DISABLED, REPLACE WITH FIRST PART OF EMAIL 
		name = email.split('@')[0]

		# Save to a text file on the server 
		fname = '_'.join(name.split()) + '.txt'
		fpath = os.path.join(os.path.abspath('.'), 'preorder-info', fname)
		f = open(fpath, 'w')
		#f.write('Name: ' + str(name) + '\n')
		f.write('Email: ' + str(email) + '\n')
		#f.write('Message: ' + str(message) + '\n')
		#f.write('Wants to beta test? ' + beta + '\n')
		f.close()

		# Send me and them an email 
		#body = "Hi " + str(name.split()[0]) + "!\n\n"
		body = "Hi " + str(name) + "!\n\n"
		body += "Thank you for your interest in Haply! We'll send you an email once the Haplet is ready for pre-order.\n\n"
		body += "If you've got a second, please fill out our short survey - we greatly appreciate any feedback on our idea. It should only take a couple minutes.\n"
		body += "http://goo.gl/forms/hJTAip7P8i"
		body += "\n\nThank you!\n"
		#body += "\n\nEmail us back with 'unsubscribe' if you don't want to receive any more emails from us.\n"

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

# To view our brochure
def brochure(request):
	return render(request, 'brochure.html')

# To view the startup fair demo
def life_aquatic(request):
	return render(request, 'life-aquatic.html')

# To view the ripple test effect
def ripple_test(request):
	return render(request, 'test.html')

