var ibmdb = require('ibm_db');
/**
  * Retrieve event information by searching the shortname
  *
  * Written by Henrik Loeser
  */

function fetchEventByShortname(dsn, eventname) {
 try {
    var conn=ibmdb.openSync(dsn);
    // Search for exact match only, could be extended with lIKE
    var data=conn.querySync("select shortname, location, begindate, enddate, contact from events where shortname=? fetch first 10 rows only", eventname);
    conn.closeSync();
    var resString="Date:\n";
    for (var i=0;i<data.length;i++) {
      resString+="name: "+data[i]['SHORTNAME']+" location: "+data[i]['LOCATION']+" info: "+data[i]['CONTACT']+" Start: "+data[i]['BEGINDATE']+" End: "+data[i]['ENDDATE']+"\n";
    }
    // Return both generated string and data
    return {result : resString, data : data};
 } catch (e) {
     return { dberror : e }
 }
}

function main(params) {
  dsn=params.__bx_creds[Object.keys(params.__bx_creds)[0]].dsn;
	return fetchEventByShortname(dsn,params.eventname);
}

