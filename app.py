# Custom extension for IBM Watson Assistant which provides a
# REST API around a single database table (EVENTS).
#
# The code demonstrates how a simple REST API can be developed and
# then deployed as serverless app to IBM Cloud Code Engine.
#
# See the README and related tutorial for details.
#
# Written by Henrik Loeser (data-henrik), hloeser@de.ibm.com
# (C) 2022 by IBM

import os
import ast
from dotenv import load_dotenv
from apiflask import APIFlask, Schema, HTTPTokenAuth, PaginationSchema, pagination_builder, abort
from apiflask.fields import Integer, String, Boolean, Date, List, Nested
from apiflask.validators import Length, Range
# Database access using SQLAlchemy
from flask_sqlalchemy import SQLAlchemy

# Set how this API should be titled and the current version
API_TITLE='Events API for Watson Assistant'
API_VERSION='1.0.1'

# create the app
app = APIFlask(__name__, title=API_TITLE, version=API_VERSION)

# load .env if present
load_dotenv()

# the secret API key, plus we need a username in that record
API_TOKEN="{{'{0}':'appuser'}}".format(os.getenv('API_TOKEN'))
#convert to dict:
tokens=ast.literal_eval(API_TOKEN)

# database URI
DB2_URI=os.getenv('DB2_URI')
# optional table arguments, e.g., to set another table schema
ENV_TABLE_ARGS=os.getenv('TABLE_ARGS')
TABLE_ARGS=None
if ENV_TABLE_ARGS:
    TABLE_ARGS=ast.literal_eval(ENV_TABLE_ARGS)


# specify a generic SERVERS scheme for OpenAPI to allow both local testing
# and deployment on Code Engine with configuration within Watson Assistant
app.config['SERVERS'] = [
    {
        'description': 'Code Engine deployment',
        'url': 'https://{appname}.{projectid}.{region}.codeengine.appdomain.cloud',
        'variables':
        {
            "appname":
            {
                "default": "myapp",
                "description": "application name"
            },
            "projectid":
            {
                "default": "projectid",
                "description": "the Code Engine project ID"
            },
            "region":
            {
                "default": "us-south",
                "description": "the deployment region, e.g., us-south"
            }
        }
    },
    {
        'description': 'local test',
        'url': 'http://127.0.0.1:{port}',
        'variables':
        {
            'port':
            {
                'default': "5000",
                'description': 'local port to use'
            }
        }
    }
]


# set how we want the authentication API key to be passed
auth=HTTPTokenAuth(scheme='ApiKey', header='API_TOKEN')

# configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI']=DB2_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Initialize SQLAlchemy for our database
db = SQLAlchemy(app)


# sample records to be inserted after table recreation
sample_events=[
    {
        "shortname":"Think 2022",
        "location": "Boston, US",
        "begindate":"2022-05-10",
        "enddate":"2022-05-11",
        "contact": "https://www.ibm.com/events/think/"
    },
    {
        "shortname":"IDUG EMEA 2022",
        "location": "Edinburgh, Scotland",
        "begindate":"2022-10-22",
        "enddate":"2022-10-26",
        "contact": "https://www.idug.org"
    },

]


# Schema for table "EVENTS"
# Set default schema to "EVENTS"
class EventModel(db.Model):
    __tablename__ = 'EVENTS'
    __table_args__ = TABLE_ARGS
    eid = db.Column('EID',db.Integer, primary_key=True)
    shortname = db.Column('SHORTNAME',db.String(20))
    location= db.Column('LOCATION',db.String(60))
    begindate = db.Column('BEGINDATE', db.Date)
    enddate = db.Column('ENDDATE', db.Date)
    contact = db.Column('CONTACT',db.String(255))

# the Python output for Events
class EventOutSchema(Schema):
    eid = Integer()
    shortname = String()
    location = String()
    begindate = Date()
    enddate = Date()
    contact = String()

# the Python input for Events
class EventInSchema(Schema):
    shortname = String(required=True, validate=Length(0, 20))
    location = String(required=True, validate=Length(0, 60))
    begindate = Date(required=True)
    enddate = Date(required=True)
    contact = String(required=True, validate=Length(0, 255))

# use with pagination
class EventQuerySchema(Schema):
    page = Integer(load_default=1)
    per_page = Integer(load_default=20, validate=Range(max=30))

class EventsOutSchema(Schema):
    events = List(Nested(EventOutSchema))
    pagination = Nested(PaginationSchema)

# register a callback to verify the token
@auth.verify_token  
def verify_token(token):
    if token in tokens:
        return tokens[token]
    else:
        return None

# retrieve a single event record by EID
@app.get('/events/eid/<int:eid>')
@app.output(EventOutSchema)
@app.auth_required(auth)
def get_event_eid(eid):
    """Event record by EID
    Retrieve a single event record by its EID
    """
    return EventModel.query.get_or_404(eid)

# retrieve a single event record by name
@app.get('/events/name/<string:short_name>')
@app.output(EventOutSchema)
@app.auth_required(auth)
def get_event_name(short_name):
    """Event record by name
    Retrieve a single event record by its short name
    """
    search="%{}%".format(short_name)
    return EventModel.query.filter(EventModel.shortname.like(search)).first()


# get all events
@app.get('/events')
@app.input(EventQuerySchema, 'query')
#@app.input(EventInSchema(partial=True), location='query')
@app.output(EventsOutSchema)
@app.auth_required(auth)
def get_events(query):
    """all events
    Retrieve all event records
    """
    pagination = EventModel.query.paginate(
        page=query['page'],
        per_page=query['per_page']
    )
    return {
        'events': pagination.items,
        'pagination': pagination_builder(pagination)
    }

# create an event record
@app.post('/events')
@app.input(EventInSchema, location='json')
@app.output(EventOutSchema, 201)
@app.auth_required(auth)
def create_event(data):
    """Insert a new event record
    Insert a new event record with the given attributes. Its new EID is returned.
    """
    event = EventModel(**data)
    db.session.add(event)
    db.session.commit()
    return event


# delete an event record
@app.delete('/events/eid/<int:eid>')
@app.output({}, 204)
@app.auth_required(auth)
def delete_event(eid):
    """Delete an event record by EID
    Delete a single event record identified by its EID.
    """
    event = EventModel.query.get_or_404(eid)
    db.session.delete(event)
    db.session.commit()
    return ''

# (re-)create the event table with sample records
@app.post('/database/recreate')
@app.input({'confirmation': Boolean(load_default=False)}, location='query')
#@app.output({}, 201)
@app.auth_required(auth)
def create_database(query):
    """Recreate the database schema
    Recreate the database schema and insert sample data.
    Request must be confirmed by passing query parameter.
    """
    if query['confirmation'] is True:
        db.drop_all()
        db.create_all()
        for e in sample_events:
            event = EventModel(**e)
            db.session.add(event)
        db.session.commit()
    else:
        abort(400, message='confirmation is missing',
            detail={"error":"check the API for how to confirm"})
        return {"message": "error: confirmation is missing"}
    return {"message":"database recreated"}


# default "homepage", also needed for health check by Code Engine
@app.get('/')
def print_default():
    """ Greeting
    health check
    """
    # returning a dict equals to use jsonify()
    return {'message': 'This is the Events API server'}


# Start the actual app
# Get the PORT from environment or use the default
port = os.getenv('PORT', '5000')
if __name__ == "__main__":
    app.run(host='0.0.0.0',port=int(port))
