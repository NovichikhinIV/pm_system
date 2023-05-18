import requests
import json
from rest_framework.exceptions import AuthenticationFailed


class Auth(): 
    def is_authorized(self, token):
        BASE_URL = 'http://auth:8001/api/token/verify/'
        res = requests.post(BASE_URL, data=json.dumps({"token": token}), headers={'Content-type': 'application/json'})
        if (res.status_code) == 200:
            return True
        return False
    
    def get_user(self, token):
        BASE_URL = 'http://auth:8001/api/token/decode/'
        headers = {
            'Authorization': 'Bearer {}'.format(token),
        }
        res = requests.post(BASE_URL, headers=headers)
        if (res.status_code) == 200:
            return json.loads(res.text)
        else:
            raise AuthenticationFailed('Unauthenticated')