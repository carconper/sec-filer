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
        logger.error('Get Company Metadata: %s -- %s',
                     str(e))
        #raise EdgarRequestError, EdgarRequestError(e), exc_info[2]

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


@app.route("/filings")
def filings():

    SEC_URL = "https://www.sec.gov"
    params = request.args

    r = requests.get("https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=" + params['symbol'] + "&type=&dateb=&owner=exclude&start=" + params['begin'] + "&count=" + params['count'])
    tree = html.fromstring(r.content)
    #print("The text", r.text)
    filings = tree.xpath('//td[@nowrap="nowrap"]/text()')
    #print("The filings: ", filings, file=sys.stderr)

    test = [td.text_content() for td in tree.xpath('//td')]
    #print("The table contents: ", test, file=sys.stderr)
    filings = []
    documents = tree.xpath('//a[@id="documentsbutton"]/@href')
    #print("The documents: ", documents, file=sys.stderr)


    df = pd.read_html(r.content,attrs = {'class': 'tableFile2'})[0]
    df2 = pd.read_html(r.content,attrs = {'class': 'tableFile2'})
    #print("pandas table", df, file=sys.stderr)
    #print("pandas table", df2, file=sys.stderr)
    #print("0 --> ", df[0].tolist(), file=sys.stderr)
    #print("1 --> ", df[1].tolist(), file=sys.stderr)
    #print("2 --> ", df[2].tolist(), file=sys.stderr)
    #print("3 --> ", df[3].tolist(), file=sys.stderr)

    forms = df[0].tolist()
    descriptions = df[2].tolist()
    dates = df[3].tolist()

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
