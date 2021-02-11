import requests
from urllib.parse import urlencode, urlparse , parse_qsl
import numpy as np 
import json 
import os 

api_key = os.environ.get('API_KEY')


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
        'radius' : radius,
        #'rankby' : 'distance',
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