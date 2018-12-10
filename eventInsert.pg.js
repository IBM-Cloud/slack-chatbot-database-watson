const {Client} = require('pg');
var rp = require('request-promise');

/**
  * Insert a new event record
  *
  * Written by Henrik Loeser
  */

function insertEvent(connection, eventValues) {
  const client=new Client({
    connectionString: connection['postgres']['composed'][0],
    ssl: true
  });

  return client.connect()
     .then(() =>
          client.query(
            "insert into events(shortname, location, begindate, enddate, contact) values($1::text,$2::text, ($3::date + $4::time),($5::date + $6::time),$7::text)",
            eventValues))
     .then(res => myres=res)
     .then(() => client.end())
     .then(() => {return {"result": myres} })
     .catch(e => {return {"dberror": e}})
}

function main({eventValues, __bx_creds: {'databases-for-postgresql': {connection}}}) {
	return insertEvent(connection,eventValues);
}
