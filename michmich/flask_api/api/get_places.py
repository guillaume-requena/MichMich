#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import api.smallest_circle as smallest_circle
import pandas as pd
import numpy as np

from api.geometry import normalize, deplace, distance 
from api.google_apis import extract_lat_lng, nearbysearch, get_time_and_distance_between_two_points
from api.google_apis import get_duration_and_distances
from api.ranking import global_note, list_rank

coefficients = {
    'GLOBAL':{'rank_rating':1,'rank_user_ratings_total':1,'rank_price_level':1,'rank_distance_to_center':1.5},
    'ECONOMIC':{'rank_rating':1,'rank_user_ratings_total':1,'rank_price_level':2.5,'rank_distance_to_center':1.5},
    'POPULARITY':{'rank_rating':2.5,'rank_user_ratings_total':2,'rank_price_level':1,'rank_distance_to_center':1.5}
}


def mich_mich(adresses, modes_transport, what = 'Bar',ranking='GLOBAL',plot=False):
    '''
    main function
    '''
    # first coordinates calcul
    n = len(adresses)
    points = np.array([extract_lat_lng(adr) for adr in adresses])
    
    # first center calcul
    lat, lng, _ = smallest_circle.make_circle(points)
    center = np.array([lat,lng])
    
    
    # first durations calcul
    durations, distances = get_duration_and_distances(points,center,modes_transport)
    max_duration = durations.max()
    second_max_duration = sorted(durations)[-2]
    new_points = points
    cpteur=1
    
    if max_duration<=1.2*second_max_duration:
        new_lat, new_lng = lat, lng

    # 10 tests to improve the duration for everyone 
    while max_duration>1.2*second_max_duration and cpteur<10:
        cpteur+=1
        poids = normalize(durations)
        new_points = np.array([deplace(center,new_points[i],poids[i]) for i in range(len(poids))])
        new_lat, new_lng, _ = smallest_circle.make_circle(new_points)
        center = np.array([new_lat,new_lng])
        durations, distances = get_duration_and_distances(points,center,modes_transport)
        max_duration = durations.max()
        second_max_duration = sorted(durations)[-2]
       
    radius = distances.max()/6
    results =  nearbysearch(new_lat, new_lng, radius=radius, what='bar')
    df_results = pd.DataFrame(results['results'])
    
    #Research around the center with a growing radius
    cpteur_tentatives = 1
    while len(results)==0 and cpteur_tentatives<10:
        print(radius)
        cpteur_tentatives+=1
        radius*=1.5
        results =  nearbysearch(new_lat, new_lng, radius, what)
        df_results = pd.DataFrame(results['results'])
    
    coef = []
    col_ranking = []
    df_results = df_results.fillna(5)
    df_results['lat'] = df_results.geometry.apply(lambda x : x['location']['lat'])
    df_results['lng'] = df_results.geometry.apply(lambda x : x['location']['lng'])
    df_results['distance_to_center']=df_results.apply(lambda row : distance(center,[row.lat,row.lng]),axis=1)
    df_results['rank_distance_to_center'] = list_rank(df_results.distance_to_center.values)
    
    metrics = ['distance_to_center','rating','user_ratings_total','price_level']
    for metric in metrics:
        if metric in df_results.columns:
            if metric=='rating' or metric=='user_ratings_total':
                df_results[f'rank_{metric}'] = list_rank(df_results[metric].values,asc=False)
            else:
                df_results[f'rank_{metric}'] = list_rank(df_results[metric].values)
            col_ranking.append(f'rank_{metric}')
            coef.append(coefficients[ranking][f'rank_{metric}'])
            
    df_results['global_note'] = df_results.apply(lambda row : global_note(row,col_ranking,coef),axis=1)
    df_results = df_results.sort_values(by='global_note',ascending=False).reset_index()
    return df_results


