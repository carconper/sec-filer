from __future__ import print_function
from flask import Flask, render_template, request, make_response, jsonify, send_file

import sys, os, re, random, logging, stat, time
import requests, json
import pandas as pd

from urllib import urlencode
from lxml import html


app = Flask(__name__)

API_COMPANIES = "http://edgaronline.api.mashery.com/v2/companies?"
API_APPKEY_EDGARONLINE = "8w38dwb4dn84r4953wgb75mf"

@app.route("/")
def main():
    return render_template('index.html')


@app.route("/metadata")
def metadata():
    arguments = request.args
    params = {
            'primarysymbols': arguments['symbol'],
            'appkey': API_APPKEY_EDGARONLINE
    }
    try:
        r = requests.get(API_COMPANIES, params=params)
    except requests.exceptions.RequestException as e:
        # Save the backtrace info
        exc_info = sys.exc_info()
        logger.error('Get advertiser list from rewardStyle: %s -- %s',
                     str(e))
        #raise RewardStyleRequestError, RewardStyleRequestError(e), exc_info[2]

    print("Company Metadata:", r.text, file=sys.stderr)

    info = json.loads(r.text)
    print("Company Metadata:", info['result']['rows'][0]['values'], file=sys.stderr)
    info = info['result']['rows'][0]['values']
    print("Company Metadata:", info, file=sys.stderr)
    aux = {}
    for elem in info:
        aux[elem['field']] = elem['value']
        print(elem['field'], elem['value'], file=sys.stderr)

    print("Extracted data:", aux, file=sys.stderr)

    return jsonify(status="OK", company_data=aux)

if __name__ == "__main__":
    app.debug = True
    app.run(host='10.0.0.156')
