from __future__ import print_function
from flask import Flask, render_template, request, make_response, jsonify, send_file

import sys, os, re, random, logging, stat, time
import requests, json
import pandas as pd

from urllib import urlencode
from lxml import html


app = Flask(__name__)


@app.route("/")
def main():
    return render_template('index.html')


if __name__ == "__main__":
    app.debug = True
    app.run(host='10.0.0.156')
