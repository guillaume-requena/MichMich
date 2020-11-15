from api import app

@app.route('/form', methods=['POST'])
def form():
    forms = ['hey', 'oh']

    return ({'form':forms})
