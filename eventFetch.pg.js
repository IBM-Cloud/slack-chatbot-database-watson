const {Client} = require('pg');
var rp = require('request-promise');

/**
  * Retrieve event information by searching the shortname
  *
  * Written by Henrik Loeser
  */

function fetchEventByShortname(connection, eventname) {

  const client=new Client({
    connectionString: connection['postgres']['composed'][0],
    ssl: true
  });



  return client.connect()
     .then(() =>
          client.query(
            "select shortname, location, begindate, enddate, contact from events where shortname=$1::text LIMIT 10",
            eventname))
     .then(res => myres=res)
     .then(() => client.end())
     .then(() => {return {"result": myres} })
     .catch(e => {return {"error": e}})

}

function main({eventname, __bx_creds: {'databases-for-postgresql': {connection}}}) {
	return fetchEventByShortname(connection,eventname);
}
