var ibmdb = require('ibm_db');
/**
  * Set up the necessary Db2 table, insert some data or clean up
  *
  * Written by Henrik Loeser
  */

function db2Setup(dsn, mode) {
 try {
    var tabledef="create table events "+
                 "(eid int not null generated always as identity (start with 1000, increment by 1),"+
                  "shortname varchar(20) not null,"+
                  "location varchar(60) not null,"+
                  "begindate timestamp not null,"+
                  "enddate timestamp not null,"+
                  "contact varchar(255) not null);";
    var sampledata="insert into events(shortname,location,begindate,enddate,contact) values('Think 2019','San Francisco','2019-02-12 00:00:00','2019-02-15 23:59:00','https://www.ibm.com/events/think/'),('IDUG2019','Charlotte','2019-06-02 00:00:00','2019-06-06 23:59:00','http://www.idug.org');"
    var tabledrop="drop table events;"
    var conn=ibmdb.openSync(dsn);
    if (mode=="setup")
    {
        var data=conn.querySync(tabledef);
    } else if (mode=="sampledata")
    {
      var data=conn.querySync(sampledata);
    } else if (mode=="cleanup")
    {
      var data=conn.querySync(tabledrop);
    }
    conn.closeSync();
    return {result : data};
 } catch (e) {
     return { dberror : e }
 }
}

function main(params) {
  dsn=params.__bx_creds[Object.keys(params.__bx_creds)[0]].dsn;
	return db2Setup(dsn, params.mode);
}
