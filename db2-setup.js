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
    var sampledata="insert into events(shortname,location,begindate,enddate,contact) values('Think 2018','Las Vegas','2018-03-19 00:00:00','2018-03-22 23:59:00','https://www.ibm.com/events/think/'),('IDUG2018','Philadelphia','2018-04-29 00:00:00','2018-05-03 23:59:00','http://www.idug.org/na2018');"
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

function main({mode, __bx_creds: {dashDB:{dsn}}}) {
	return db2Setup(dsn, mode);
}
