from random import random
import requests
import json
import random


URL = 'http://localhost:3000/report-a-bug?bug='

DOMAINS = ['.print.mit.edu', '.google.com',
           '.apple.com', '.ashika.edu', '.mit.edu']
NAMES = ['ARRAffinity', 'TEST', 'TEST2', 'TEST3', 'TEST4']


class RandomRequest:
    def __init__(self):
        self.domain = random.choice(DOMAINS)
        self.hostOnly = bool(random.getrandbits(1))
        self.httpOnly = bool(random.getrandbits(1))
        self.name = random.choice(NAMES)+str(random.randint(0, 9))
        self.path = '/'
        self.sameSite = bool(random.getrandbits(1))
        self.secure = bool(random.getrandbits(1))
        self.session = bool(random.getrandbits(1))
        self.storeId = "0"
        self.value = ''.join(random.choice(
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') for i in range(64))

    def jsonify(self):
        return json.dumps(self.__dict__)


def main():
    for i in range(0, 100):
        r = RandomRequest()
        res = requests.get(URL+r.jsonify())
        print(i+1, res.text)


main()
