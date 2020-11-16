#!/usr/bin/env python3
# -*- coding: utf-8 -*-


# # import pandas as pd
import numpy as np
import requests
from urllib.parse import urlencode, urlparse , parse_qsl


api_key = 'AIzaSyCEUIo5QkTQbHL8eBolEF6C4i0fSsnarFk'


def extract_lat_lng(address_or_postalcode, data_type = 'json'):
    '''
    extracts the lat and the lng from an adress
    '''
    endpoint = f"https://maps.googleapis.com/maps/api/geocode/{data_type}"
    params = {'address' : address_or_postalcode , "key" : api_key}
    url_params = urlencode(params)
    url = f"{endpoint}?{url_params}"
    r = requests.get(url)
    if r.status_code not in range(200,299):
        return {}
    latlng = {}
    try:
        latlng = r.json()['results'][0]['geometry']['location']
    except :
        pass
    return [latlng.get('lat'),latlng.get('lng')]



def nearbysearch(lat, lng, radius, what = 'Bar'):
    '''
    returns the places corresponding to arg 'what' in a region of radius meters arround the point (lat,lng)
    '''
    places_endpoint_2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params_2 = {
        "key" : api_key, 
        "location" : f"{lat},{lng}",
        "radius" : radius,
        "keyword" : what
    }
    params_2_encoded = urlencode(params_2)
    places_url = f"{places_endpoint_2}?{params_2_encoded}"
    r2 = requests.get(places_url)
    return r2.json()


def get_time_and_distance_between_two_points(pt1,pt2,mode='transit'):
    '''
    returns the time in seconds between pt1 and pt2 according to the transport mode 'mode'
    mode can be : 
                    - driving 
                    - walking 
                    - bicycling 
                    - transit 
    '''
    lat1, lng1 = pt1[0],pt1[1]
    lat2, lng2 = pt2[0],pt2[1]
    detail_base_endpoint = 'https://maps.googleapis.com/maps/api/directions/json'
    detail_params = {
        "origin": str(lat1)+','+str(lng1),
        "destination" : str(lat2)+','+str(lng2),
        "key": api_key,
        "transit_mode" : "rail",
        "mode":mode
    }
    detail_params_encoded = urlencode(detail_params)
    detail_url = f"{detail_base_endpoint}?{detail_params_encoded}"
    r = requests.get(detail_url)
    rep = r.json()
    duration = rep['routes'][0]['legs'][0]['duration']['value']
    distance = rep['routes'][0]['legs'][0]['distance']['value']
    return duration/60,distance



def normalize(vect):
    vect = np.array(vect)
    return vect/vect.sum()

def distance(p1,p2):
    return ((p1[0]-p2[0])**2+(p1[1]-p2[1])**2)**0.5

def get_middle(points,coeff):
    n = len(points)
    res = []
    distances = []
    for i in range(n):
        for j in range(i+1,n):
            point_middle = (np.array(points[i])*coeff[i]+np.array(points[j])*coeff[j])/(coeff[i]+coeff[j])
            res.append(point_middle)
            distances.append(distance(points[i],point_middle))
    return np.array(res),np.array(distances)

def centre_gravite(points,coef_sum=[]):
    '''
    returns the centre de gravite of the points 
    '''
    points = np.array(points)
    coef_sum =np.array(coef_sum)
    if len(coef_sum)==0:
        coef_sum=np.array([1/len(points)]*len(points))
    x = np.array(points[:,0]*coef_sum).sum()
    y = np.array(points[:,1]*coef_sum).sum()
    return [x,y]



def get_duration_and_distances(points,center,modes_transport):
    n = len(points)
    durations = []
    distances = []
    for i in range(n):
        p = points[i]
        transport_p = modes_transport[i]
        duration_p, distance_p = get_time_and_distance_between_two_points(p,center,transport_p)
        durations.append(duration_p)
        distances.append(distance_p)
    return np.array(durations),np.array(distances)


def mich_mich(adresses, modes_transport, what = 'Bar'):
    '''
    main function
    '''
    n = len(adresses)

    #Get the point in the middle 
    points = np.array([extract_lat_lng(adr) for adr in adresses])
    lat , lng = centre_gravite(points)
    center = [lat,lng]
    #Verifying that the new point is at an equal distance of everyone
    #If it's not the case, recalculates a new point 
    durations, distances = get_duration_and_distances(points,center,modes_transport)
    
    # Recalculation in function of mode_transport of everyone
    middles , distances = get_middle(points,durations)
    center_adapted = centre_gravite(middles,normalize(distances))
    durations, distances = get_duration_and_distances(points,center_adapted,modes_transport)

    lat, lng = center_adapted[0],center_adapted[1]
    radius = distances.max()/10
    #Get the results of the places at a distance < radius of the center calculated
    results =  nearbysearch(lat, lng, radius, what)

    return results

