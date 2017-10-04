#! /bin/python

#import os.path
import os
#import time
# tornado imports
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import json
import random
#from websocket import create_connection

# define a port for serving requests. Heroku uses 5000
from tornado.options import define, options
define("port", default=5000, help="run on the given port", type=int)

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')

class WebSocketHandler(tornado.websocket.WebSocketHandler):
    connections = set()

    def open(self):
        self.connections.add(self)
        self.user_dict = {}
        self.user_id = 0
        self.write_message('start_app')
        pass

    def on_message(self, message):
        #first message should be the userAgent string
        fingerprint_dict = {}
        #parse fingerprint metrics in websocket message
        if('userAgent' in message):
            fingerprint = message.split('::')
            agent_index = message.index('userAgent')
            fingerprint_dict['userAgent'] = fingerprint[agent_index + 1]

        self.user_dict['fingerprint'] = fingerprint_dict

        #if fingerprint is different assign a unique user_id, and append to json file, then write user_id back to be printed to screen,
        #check if fingerprint is different
        if(os.path.isfile('users_fingerprint.json')):
            with open('users_fingerprint.json') as json_data:
                total_user_fdict = json.load(json_data)
            unique_id = 1
            for user in total_user_fdict:
                user_len = len(user)
                user_id = user['user_id'] #if not unique return this to javascript
                #check if all fingerprint metrics are the same
                for key, value in user['fingerprint'].iteritems():
                    fingerprint_same = 1
                    if (fingerprint_dict[key] == value):
                        fingerprint_same += 1
                        pass
                if fingerprint_same == user_len:
                    #not a unique user_id stop and write_message
                    self.write_message('user_Id::' + user_id)
                    print("Sending a known user_Id")
                    unique_id = 0
                    break
            if(unique_id == 1):
                #is a unique user_id
                #store and write out user_id
                self.user_id = ''.join(random.choice('0123456789ABCDEF') for i in range(10)) #TODO give it the actual id
                self.user_dict['user_id'] = self.user_id
                self.write_message('user_Id::' + self.user_id)
                print("Sending a unique user_Id")

                total_user_fdict.append(self.user_dict)
                with open('users_fingerprint.json', 'w') as f:
                    json.dump(total_user_fdict, f,sort_keys=True, indent=4)

        else:
            #file was just created and no stored fingerprints thus store it.
            self.user_id = ''.join(random.choice('0123456789ABCDEF') for i in range(10)) #TODO give it the actual id
            self.user_dict['user_id'] = self.user_id
            with open('users_fingerprint.json', 'a+') as f:
                json.dump([self.user_dict], f, sort_keys=True, indent=4)
            self.write_message('user_Id::' + self.user_id)
            print("Sending the very first userId")



        #if not send back the detected fingerprints user_id
        #if(self.user
        '''
        with open('users_fingerprint.json', 'a+') as f:
            json.dump(self.user_dict, f, sort_keys=True, indent=4)
        '''

        '''
        for con in self.connections:
            if(con != self):
                con.write_message(message)
        #self.write_message(message)
        '''
        pass

    def on_close(self):
        self.connections.remove(self)
        pass

'''
def client():
    print 'Ima client'
    #ws = create_connection("ws://rsvalme.herokuapp.com/websocket")
    ws = create_connection("ws://localhost:5000/websocket")


    ws.send("start_app")
    response = ws.recv()
    print response
    ws.close()
'''

if __name__ == '__main__':
    tornado.options.parse_command_line()
    app = tornado.web.Application(
        handlers=[(r'/', IndexHandler),
        (r"/websocket", WebSocketHandler),
        (r'/(.*)', tornado.web.StaticFileHandler,
            {'path': os.path.dirname(__file__)})],
        debug=True
        )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    # set debug to False when running on production/Heroku!
    tornado.ioloop.IOLoop.instance().start()
