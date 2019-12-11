var ibmdb = require('ibm_db');


// Retrieve event information by searching the shortname
 function fetchEventByShortname(dsn, eventname) {
    try {
       var conn=ibmdb.openSync(dsn);
       // Search for exact match only, could be extended with lIKE
       var data=conn.querySync("select shortname, location, begindate, enddate, contact from events where shortname=? fetch first 10 rows only", [eventname]);
       conn.closeSync();
       var resString="Data: \n";
       for (var i=0;i<data.length;i++) {
         resString+="name: "+data[i]['SHORTNAME']+" location: "+data[i]['LOCATION']+" info: "+data[i]['CONTACT']+" Start: "+data[i]['BEGINDATE']+" End: "+data[i]['ENDDATE']+"\n";
       }
       // Return both generated string and data
       return {result : resString, data : data, input: eventname};
    } catch (e) {
        return { dberror : e }
    }
   }
   

// Retrieve event information by searching the dates
 function fetchEventByDates(dsn, eventdates) {
    try {
       var conn=ibmdb.openSync(dsn);
       // Base data is timestamp
       var data=conn.querySync("select shortname, location, begindate, enddate, contact from events where begindate between ? and ?", eventdates.split(","));
       conn.closeSync();
       var resString="Data: \n";
       for (var i=0;i<data.length;i++) {
         resString+="name: "+data[i]['SHORTNAME']+" location: "+data[i]['LOCATION']+" info: "+data[i]['CONTACT']+" Start: "+data[i]['BEGINDATE']+" End: "+data[i]['ENDDATE']+"\n"
       }
       // Return both generated string and data
       return {result: resString, data: data, input: eventdates};
    } catch (e) {
        return { dberror : e }
    }
   }

// Insert a new event record
 function insertEvent(dsn, eventValues) {
    try {
       var conn=ibmdb.openSync(dsn);
       // The timestamp value is derived from date and time values passed in
       var data=conn.querySync("insert into events(shortname, location, begindate, enddate, contact) values(?,?,timestamp_format(?||' '||?,'YYYY-MM-DD HH24:MI:SS'),timestamp_format(?||' '||?,'YYYY-MM-DD HH24:MI:SS'),?)", eventValues);
       conn.closeSync();
       return {result: data, input: eventValues};
    } catch (e) {
        return { dberror : e }
    }
   }
   

function main(params) {
    dsn=params.__bx_creds[Object.keys(params.__bx_creds)[0]].dsn;

    switch(params.actionname) {
        case "insert":
            return insertEvent(dsn,params.eventValues.split(","));
        case "searchByDates":
            return fetchEventByDates(dsn,params.eventdates);
        case "searchByName":
            return fetchEventByShortname(dsn,params.eventname);
        default:
            return { dberror: "No action defined", actionname: params.actionname}
    }
}
