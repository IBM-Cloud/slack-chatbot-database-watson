const {Client} = require('pg');
var rp = require('request-promise');

/**
  * Retrieve event information by searching the dates
  *
  * Written by Henrik Loeser
  */

function fetchEventByDates(dbURI, eventdates) {
  const client=new Client({
    connectionString: dbURI,
    ssl: true
  });



  return client.connect()
     .then(() =>
          client.query(
            "select shortname, location, begindate, enddate, contact from events where begindate between $1::timestamp and $2::timestamp",
            eventdates))
     .then(res => myres=res)
     .then(() => client.end())
     .then(() => {
        resString='';
        for (var i=0;i<myres.rowCount;i++) {
          resString+="name: "+myres.rows[i]['shortname']+" location: "+myres.rows[i]['location']+" info: "+myres.rows[i]['contact']+" Start: "+myres.rows[i]['begindate']+" End: "+myres.rows[i]['enddate']+"\n"
        };
        return {"result": resString, "data" : myres.rows} })
     .catch(e => {return {"error": e}})
}

function main({eventdates, __bx_creds: {'databases-for-postgresql': {connection}}}) {
	return fetchEventByDates(dbURI=connection['postgres']['composed'][0],eventdates);
}
