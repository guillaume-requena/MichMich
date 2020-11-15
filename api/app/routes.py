from app import app
from app import optim_load_quantity
from app import optim_load
from flask import request
from flask import render_template
from flask import Blueprint, jsonify
import json


@app.route('/optim-load', methods=['POST'])
def pallet():
    forms = []

    return jsonify({'form':forms})


@app.route('../public/index', methods=['GET'])
def normal():
    return render_template("index.html")
