from api import app
from flask import request
import time

@app.route('/time')
def getCurrentTime():
    return {'time': 2}

@app.route('/test', methods=['POST'])
def testAPI():
    data = request.get_json()
    return data
