#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jul 24 10:24:59 2019

@author: guillaume
"""

import json

def toList(data_dict):
    pallets = []
    L, W = 0, 0
    print(data_dict)
    for i in range (len(data_dict["pallets"])):
        pallets.append([data_dict["pallets"][i]["type"]["length"] , data_dict["pallets"][i]["type"]["width"]])
    L = data_dict["truck"]["length"]
    W = data_dict["truck"]["width"]
    print(pallets)
    print(L)
    print(W)
    return pallets, L, W
