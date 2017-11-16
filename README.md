# sec-filer
Retrieve a Company's filings from SEC

## Introduction

The mission of the [U.S. Securities and Exchange Commission](https://www.sec.gov/Article/whatwedo.html) is to protect investors, maintain fair, orderly, and efficient markets, and facilitate capital formation.

As part of their mission, to meet the SEC's requirements for disclosure, a company issuing securities or whose securities are publicly traded must make available all information, whether it is positive or negative, that might be relevant to an investor's decision to buy, sell, or hold the security.

SEC operates and mantains the Electronic Data Gathering Analysis and Retrieval (EDGAR) system, responsible of receiving, processing, and disseminating the submitted financial statements. The EDGAR database is made available for public access


## Sec-Filer

Sec-Filer (this project) is a simple web application that enables the retireval of the different documents filed by Companies to the Security & Exchange Comission in order to fulfill SEC's requirements, using the trading symbol of the Company.

The application's UI is built on React and uses a reduced and simple Flask backend on the server side that takes care of retrieving the Company metadata from edgar-online and the filings from the EDGAR database directly.


## Install

The project contains everything to bring up your own Sec-Filer instance. You'll need to have python 2.7 with pip 9.0.1 (or higher) and Node 6.11 with npm 5.2 (or higher) installed. It is recommended to create a virtual environment with "virtualenv" for your instance of Sec-Filer.

1. Create an isolated and separated python virtual environment with `virtualenv {env} --no-site-packages`:
		
	`$ virtualenv {name-venv} --no-site-packages`

2. Activate the virtual environment

	`$ source {name-venv}/bin/activate`

3. Install the python dependencies listed in requirements.txt to set up the Backend:

	`$ pip install -r requirements.txt`

4. Install the npm packages listed under package.json to set up the React environment:

	`$ npm install`

## Setup

To bring up a Sec-Filer instance as it is, you just need to :

1. Modify the Constants.js file under app/static/scripts/jsx/ and modify the *OTHER_INSTANCE* constant to contain your server domain, and then map *OTHER_INSTANCE* to *EC2_INUSE*

2. Sec-Filer uses a 3rd party API called [edgar-online](http://developer.edgar-online.com) to retrieve the metadata of a Company based on the Trading Symbol. You will need to create an account in order to obtain an *appkey* that will be used on your API calls to *edgar-online*. Once you have your *appkey*, create `keys.py` file under `app/` folder and add the following line:

	```python
	(...)
	EDGARONLINE_APPKEY = {YOUR-KEY}
	(...)
	```

3. Recompile using **gulp** in order to generate the correpsonding `\*.js` files. For this you just need to run the gulp command once you have performed the changes above (*A `gulpfile.js` configuration file is included for your convenience*)

		$ gulp

*NOTE: In case you wanna make additional changes to your local instance, **gulp** will also be used for the precompilation of `\*jsx` files into `\*.js` to be consumed by the application.*


## Run

#### Development Environment

Flask is not meant to be used in production environments directly as a server application. It is highly recommended to run your Flask application behind other well known web servers (e.g Apache, nginx, ...) in case you wanna deploy in Production (see below).

To run the application in a development environment, it will be enough to:

1. Modify the IP address in `app.run(host='X.X.X.X')` under app/filer.py to adapt it to the IP where you will be bringing your instance app

2. By default, Flask runs in port 5000. If you wanna use a different port, you can use any >1024. To configure the port where to bring up the instance, add the port parameter to your `app.run()` statement:

	```python
	if __name__ == "__main__":    
			app.debug = True          
			app.run(host='X.X.X.X', port=NNNN)
	```

#### Production Environment

FInd the steps below to deploy your Flask backend application on a Production Environment behin an apache web server. For the instructions shown here we are using a EC2 instance (t2.micro) with an **Amazon Linux AMI**. THe instructions may differ slightly depending on the OS you are using.

1. Install the Web Server Gateway Interface (WSGI) that will be the interface between the apache web server and the flask web application

	`$ sudo yum install mod24_wsgi-python27`

2. Create a \*.wsgi configuration file for your web application by using the information of your environment (**NOTE**: *replace `APPLICATION-ABSOLUTE-PATH` below with your path*)

	```python
	import sys

	sys.path.append('APPLICATION-ABSOLUTE-PATH')

	from filer import app as application
	```

3. Create the `/etc/httpd/conf.d/vhost.conf` file with the specifics of your instance (**NOTE**: *replace `APPLICATION-ABSOLUTE-PATH` below with your path*)

	```xml
	<virtualhost *:80>
		ServerName my.filer

		WSGIDaemonProcess filer user=ec2-user group=www threads=5 home=APPLICATION-ABSOLUTE-PATH
		WSGIScriptAlias / APPLICATION-ABSOLUTE-PATH/filer.wsgi

		<directory APPLICATION-ABSOLUTE-PATH>
					WSGIProcessGroup filer
				WSGIApplicationGroup %{GLOBAL}
					WSGIScriptReloading On
					Order deny,allow
					Allow from all
		</directory>
	</virtualhost> 
	```

4. Modify the /etc/hosts file
	
	`127.0.0.1   my.filer`
	
5. Start the httpd service
	
	`sudo service httpd start`

6. Configure the httpd process to run on server boot up
	
	`sudo chkconfig httpd on`

Now your flask application will be running behing port 80 on apache server.

## Others

This is a small project that could serve as a starting point of bigger applications. Please contact me with suggestions, proposals or questions. Also feel free to modify the project yourself. 
