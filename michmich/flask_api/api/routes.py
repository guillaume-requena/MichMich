from api import app
from flask import request
import json 
from api import get_places 
import pandas as pd

@app.route('/test', methods=['POST'])
def testAPI():
    dico_commute = {0:'walking',1:'transit',2:'driving',3:'cycling'}
    data = request.get_json()
    adresses = [data['addresses'][i]['address'] for i in range(len(data['addresses']))]
    modes_transport = [data['addresses'][i]['commuteType'] for i in range(len(data['addresses']))]
    modes_transport = [dico_commute[modes_transport[i]] for i in range(len(modes_transport))]
    activity = data['activity']
    res = get_places.mich_mich(adresses, modes_transport, what = activity)
    df_results = pd.DataFrame(res['results'])
    col = ['business_status', 'geometry', 'name', 'permanently_closed','place_id', 'rating','user_ratings_total', 'vicinity', 'opening_hours','price_level']
    df_results = df_results[col]
    return df_results.to_json(orient="index")
    # return res
    #{'res1': adresses, 'res2': modes_transport, 'res3':activity}
