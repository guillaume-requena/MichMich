from api import app
from api import test
from flask import request
import time

@app.route('/time')
def getCurrentTime():
    return {'time': 2}