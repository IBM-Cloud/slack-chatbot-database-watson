var ibmdb = require('ibm_db');
/**
  * Retrieve event information by searching the dates
  *
  * Written by Henrik Loeser
  */

function fetchEventByDates(dsn, eventdates) {
 try {
    var conn=ibmdb.openSync(dsn);
    // Base data is timestamp
    var data=conn.querySync("select shortname, location, begindate, enddate, contact from events where begindate between ? and ?", eventdates);
    conn.closeSync();
    var resString="Data: \n";
    for (var i=0;i<data.length;i++) {
      resString+="name: "+data[i]['SHORTNAME']+" location: "+data[i]['LOCATION']+" info: "+data[i]['CONTACT']+" Start: "+data[i]['BEGINDATE']+" End: "+data[i]['ENDDATE']+"\n"
    }
    // Return both generated string and data
    return {result : resString, data : data};
 } catch (e) {
     return { dberror : e }
 }
}


function main(params) {
  dsn=params.__bx_creds[Object.keys(params.__bx_creds)[0]].dsn;
	return fetchEventByDates(dsn,params.eventdates);
}
