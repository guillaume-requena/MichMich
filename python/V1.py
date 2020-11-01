import pandas as pd
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


def centre_gravite(points,coef_sum=None):
    '''
    returns the centre de gravite of the points 
    '''
    if coef_sum==None:
        coef_sum=len(points)
    points = np.array(points)
    n = len(points)
    x = np.sum(points[:,0])
    y = np.sum(points[:,1])
    return (np.array([x,y]))/coef_sum


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
    #Request 
    detail_params_encoded = urlencode(detail_params)
    detail_url = f"{detail_base_endpoint}?{detail_params_encoded}"
    r = requests.get(detail_url)
    rep = r.json()
    #Get duration and distance
    duration = rep['routes'][0]['legs'][0]['duration']['value']
    distance = rep['routes'][0]['legs'][0]['distance']['value']
    return duration,distance


def normalize(vect):
    vect = np.array(vect)
    return vect/vect.sum()

    
def mich_mich(adresses, modes_transport, what = 'Bar',radius=1000):
    n = len(adresses)
    #Get the point in the middle 
    points = np.array([extract_lat_lng(adr) for adr in adresses])
    center = centre_gravite(points)
    print("center",center)
    #Verifying that the new point is at an equal distance of everyone
    #If it's not the case, recalculates a new point 
    durations = []
    distances = []
    for i in range(n):
        p = points[i]
        transport_p = modes_transport[i]
        duration_p, distance_p = get_time_and_distance_between_two_points(p,center,transport_p)
        durations.append(duration_p)
        distances.append(distance_p)
    durations, distances = np.array(durations), np.array(distances)
    min_duration = durations.min()
    max_duration = durations.max()
    print(durations)
    #Get the results of the places at a distance < radius of the center calculated
    results =  nearbysearch(center[0], center[1], radius, what)
    n = len(results['results'])
    res = [ [results['results'][i]['name'],results['results'][i]['vicinity'], results['results'][i]['rating'] , results['results'][i]['user_ratings_total']]  for i in range(n)]
    res = np.array(res)
    print(res)
    res = np.flip(res[(res[:,2]).argsort()] , axis =0)
    return res


n = int(input("Vous etes combien ? "))
where = input("Vous voulez aller où? ")
adresses = []
transports = []
for i in range(n):
    adresses.append(input(f"Entrez l'adresse n°{str(i)} : "))
    transports.append(input(f"Entrez le moyen de transport n°{str(i)} : "))

print(mich_mich(adresses, transports, what = 'Bar',radius=1000))
