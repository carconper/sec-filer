from __future__ import print_function
from flask import Flask, render_template, request, make_response, jsonify, send_file

import sys, os, re, random, logging, stat, time
import requests, json
import pandas as pd

from urllib import urlencode
from lxml import html

from config import *

app = Flask(__name__)


@app.route("/")
def main():
    """
    Renders the home site and serves it on response to the
    HTTP GET request of index.html

    :return: html rendered home page embedded in a HTTP GET
    response
    """
    return render_template('index.html')


@app.route("/metadata")
def metadata():
    """
    Rest API call that serves the metadata information for the
    requested company. It makes use of a 3rd party API to
    retrieve the company metadata.

    :param: request.args
            - symbol: Trading Symbol of the Company
    :return: Dictionary containing the Company metadata
    transformed to JSON format and embedded in the HTTP GET
    response
    """
    # 1. Extract arguments from HTTP GET request
    arguments = request.args

    # 2. Prepare the arguments to be passed to the edgaronline API
    params = {
            'primarysymbols': arguments['symbol'],
            'appkey': API_APPKEY_EDGARONLINE
    }

    # 3. Made the API call to the edgaronline service
    try:
        r = requests.get(API_COMPANIES_EDGARONLINE, params=params)
    except requests.exceptions.RequestException as e:
        exc_info = sys.exc_info()
        logger.error('Get Company Metadata: %s -- %s',
                     str(e))

    # 4. Parse the response
    info = json.loads(r.text)

    # 5. Handle the case where the requested trading symbol doesnt
    #    correspond to any company
    if info['result']['totalrows'] == 0:
        print("Company doesnt exist", file=sys.stderr)
        return jsonify(status='NOK', company_data=[])

    # 6. Extract the information from the response
    info = info['result']['rows'][0]['values']
    print("Company Metadata:", info, file=sys.stderr)

    # 7. Prepare the reponse to be served to the UI
    aux = {}
    for elem in info:
        aux[elem['field']] = elem['value']
        print(elem['field'], elem['value'], file=sys.stderr)

    return jsonify(status="OK", company_data=aux)


@app.route("/filings")
def filings():
    """
    Rest API call that serves the list of filings corresponding
    to the request company. It retrieves the filing list from the
    EDGAR system, scraps the filing information from the html code
    and returns the metadata of each filing.

    :param: request.args
            - symbol: Trading Symbol of the Company
            - begin: Lookup start point
            - count: number of filings to return
    :return:  An array of dictionaries containing the metadata info
    of each of the requested filings, transofrmed to JSON format
    and embedded in the HTTP GET response
    """

    # 1. Extract arguments from HTTP GET request
    params = request.args
    filings = []

    # 2. Prepare the params needed to perform the search fot the
    #    filings on the EDGAR system
    url_params = {
        'action': 'getcompany',
        'CIK': params['symbol'],
        'start': params['begin'],
        'count': params['count']
    }

    # 3. Perform the request to EDGAR system
    try:
        r = requests.get(SEC_URL_FILINGS, params=url_params)
    except request.exceptions.RequestException as e:
        exc_info = sys.exc_info()
        logger.error('Get Company Metadata: %s -- %s',
                     str(e))

    # 3.1 Handle the cases where the requested company doesnt have
    #     any filings available
    if int(r.headers['content-length']) < 2000:
        print("Company doesnt exist or doesnt have filings", file=sys.stderr)
        return jsonify(status="NOK", filing_list=filings)

    # 4. Prepare to scrap the official URLs of each filing from the
    #    content of the returned html
    tree = html.fromstring(r.content)
    documents = tree.xpath('//a[@id="documentsbutton"]/@href')

    # 5. Extract the metadata of each filing using Pandas
    df = pd.read_html(r.content,attrs = {'class': 'tableFile2'})[0]
    forms = df[0].tolist()
    descriptions = df[2].tolist()
    dates = df[3].tolist()

    # 6. Prepare the information to be served to the UI
    for i in range(1, len(forms)):
        tmp = {
                'form': forms[i],
                'desc': descriptions[i],
                'date':dates[i],
                'link':SEC_URL + documents[i - 1]
                }
        filings.append(tmp)

    return jsonify(status="OK", filing_list=filings)


if __name__ == "__main__":
    app.debug = True
    app.run(host='10.0.0.156')
