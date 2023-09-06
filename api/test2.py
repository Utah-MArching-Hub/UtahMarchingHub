import json
from datetime import datetime
from http.server import BaseHTTPRequestHandler
 
class handler(BaseHTTPRequestHandler):
 
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write('Hello, world!'.encode('utf-8'))
        return


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