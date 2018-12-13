const {Client} = require('pg');
var rp = require('request-promise');
/**
  * Set up the necessary PostgreSQL table, insert some data or clean up
  *
  * Written by Henrik Loeser
  */

function dbSetup(dbURI, mode) {
 
    var tabledef="create table events "+
                 "(eid int not null generated always as identity (start with 1000 increment by 1),"+
                  "shortname varchar(20) not null,"+
                  "location varchar(60) not null,"+
                  "begindate timestamp not null,"+
                  "enddate timestamp not null,"+
                  "contact varchar(255) not null);";
    var sampledata="insert into events(shortname,location,begindate,enddate,contact) values('Think 2018','Las Vegas','2018-03-19 00:00:00','2018-03-22 23:59:00','https://www.ibm.com/events/think/'),('IDUG2018','Philadelphia','2018-04-29 00:00:00','2018-05-03 23:59:00','http://www.idug.org/na2018');"
    var tabledrop="drop table events;"
    
    const client=new Client({
      connectionString: dbURI,
      ssl: true
    });

  var myres="error?";
  

  
  return client.connect()
     .then(() =>
        {if (mode=="setup")
        {
          client.query(tabledef)
        } else if (mode=="sampledata")
        {
          client.query(sampledata);
        } else if (mode=="cleanup")
        {
         client.query(tabledrop);
        }})
     .then(res => myres=res)
     .then(() => client.end())
     .then(() => {return {"result": myres} })
     .catch(e => {return {"error": e}})

}

function main({mode, __bx_creds: {'databases-for-postgresql': {connection}}}) {
  	return dbSetup(dbURI=connection['postgres']['composed'][0], mode);
}
