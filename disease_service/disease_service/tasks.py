from .celery import app as celery_app
import random
import string


@celery_app.task
def add(x, y):
    return x + y


@celery_app.task
def random_string(length):
    """Generate a random string of specified length."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))  
