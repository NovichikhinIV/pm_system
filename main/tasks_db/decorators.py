from functools import wraps
from rest_framework.exceptions import AuthenticationFailed
from .helpers import extract_token
from .service.auth_service import Auth


def is_authorized(function):
    @wraps(function)
    def decorator(*args, **kwargs):
        token = args[0].request.headers.get('Authorization', None)
        if not token:
            raise AuthenticationFailed('Token not provided')

        token = extract_token(args[0].request.headers)

        if Auth().is_authorized(token=token):
            return function(*args, **kwargs)
        else:
            raise AuthenticationFailed('Unauthenticated')

    return decorator
