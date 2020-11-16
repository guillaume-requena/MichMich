from api import app
from flask import request
import json 
from api import get_places 

@app.route('/test', methods=['POST'])
def testAPI():
    dico_commute = {0:'walking',1:'transit',2:'driving',3:'cycling'}
    data = request.get_json()
    # data = {data['activity']}
    adresses = [data['addresses'][i]['address'] for i in range(len(data['addresses']))]
    modes_transport = [data['addresses'][i]['commuteType'] for i in range(len(data['addresses']))]
    modes_transport = [dico_commute[modes_transport[i]] for i in range(len(modes_transport))]
    # modes_transports[-1]=0
    adresses[-1]='24 boulevard du général Leclerc, Neuilly'
    activity = data['activity']
    res = get_places.mich_mich(adresses, modes_transport, what = activity)
    return res
