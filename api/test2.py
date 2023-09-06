import json
from datetime import datetime


def run():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print('Ive ran')
    try:
        with open('api/time.json', 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = []
    
    data.append(current_time)
    
    with open('api/time.json', 'w') as file:
        json.dump(data, file)