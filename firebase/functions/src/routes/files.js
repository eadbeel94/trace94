/** @namespace Backend/route/files */

const router = require("express").Router();
const jsonex= require('json2xls');
const m= require('moment');

const { storage } = require("firebase-admin");
const bucket = storage().bucket();

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Create a Array with files information
 * @function listFiles
 * @memberof Backend/route/files
 * @param {Array<File>} blobs Files array was getting from firebase bucket query
 * @returns {{names: Array<String>, conts: Array<Blob> }} return Object that include information graph and your respective names
 */
const listFiles= async ( blobs= [] )=>{
  const files= { names: [] , conts: [] };
  for (const i in blobs) {
    files.conts.push( blobs[i].download() );
    const fullp= blobs[i].metadata.name.split("/");
    files.names.push( fullp[1] );
  };
  files.conts= await Promise.all( files.conts );
  /*
  for (const i in blobs) {
    //const down= await blobs[i].download();
    const fullp= blobs[i].metadata.name.split("/");
    files.names.push( fullp[1] );
    //files.conts.push( down.toString() );
  }
  */
  return files;
};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Get list using client criterion.
 *
 * @name filter1
 * @path {POST} /trace/filter1
 * @body {String} [fr] from date where start search
 * @body {String} [to] to date where end search
 * @body {String} [st] compare OK or NOK file state
 * @response {boolean} status if query complety successfully
 * @response {Array<Object>} items list getting from firebase bucket files
 * @memberof Backend/route/files
 */
router.post('/filter1', async (req,res)=>{
  //console.log('filter1');
  let status= false;
  let items= [];
  try {
    if( req.body.fr && req.body.to ){
      const compState= ( rcvClient , stateFile )=> rcvClient.length > 0 ? rcvClient == stateFile : true;

      let myblobs= await bucket.getFiles({ prefix: 'trace/' }); 
      myblobs= myblobs[0].filter( el => el.metadata.contentType == "application/vnd.ms-excel" );

      const myfiles= await listFiles( myblobs );
      items= myfiles.conts.map( (el,ind)=>{
        const file= el.toString().split('\n')
                      .map( r=> r.replace(';','') )
                      .filter( (el,ind) => 5 > ind );
        if( 
          m( file[0] + file[1] , 'D-MMM-YY;LTS;' ).isBetween( req.body.fr , req.body.to ) && 
          compState( req.body.st , file[3] ) 
        ){
          return {
            date: file[0],
            hour: file[1],
            sn: file[2],
            stat: file[3],
            prog: file[4],
            fname: myfiles.names[ind]
          }
        }
      });

      items= items.filter( el => el ).sort( (a,b)=>{
        const newA= a.date + ";" +  a.hour + ";";
        const newB= b.date + ";" +  b.hour + ";";
        if(m( m( newA ,'D-MMM-YY;LTS;') ).isBefore( m(newB ,'D-MMM-YY;LTS;') )) return 1; 
        if(m( m( newA ,'D-MMM-YY;LTS;') ).isAfter( m(newB ,'D-MMM-YY;LTS;') )) return -1; 
      });

      status= items.length > 0;
    };
  } catch (err) { console.log(err); status= false; };
  res.json({ status, items });
});

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Get graph X and Y values.
 *
 * @name graph1
 * @path {GET} /trace/graph1
 * @query {String} [gn] Get filename
 * @response {boolean} status if query complety successfully
 * @response {Array<Object>} items list getting from firebase bucket files
 * @response {String} File status word OK or NOK 
 * @memberof Backend/route/files
 */
router.get('/graph1', async (req,res)=>{
  //console.log('graph1');
  let status= false;
  let items= [];
  let result= "";
  try {
    if( req.query.gn ){

      const myblobs= await bucket.getFiles({ prefix: `trace/${req.query.gn}` }); 
      const myfiles= await listFiles( myblobs[0] );
      if( myfiles.conts[0] ){
        const graph= myfiles.conts[0].toString().split('\n');
        result= graph[3].replace(';','');
        items= graph.filter( (r,i)=>{ return i>4 });
      }
      status= items.length > 0;
    };
  } catch (err) { console.log(err); status= false; };
  res.json({ status, items, result });
});

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Get list using search word client.
 *
 * @name search1
 * @path {GET} /trace/search1
 * @query {String} [s] client search word
 * @response {boolean} status if query complety successfully
 * @response {Array<Object>} items list getting from firebase bucket files
 * @memberof Backend/route/files
 */
router.get('/search1', async (req,res)=>{
  //console.log('search1');
  let status= false;
  let items= [];
  try {
    if( req.query.s ){

      let myblobs= await bucket.getFiles({ prefix: `trace/graph-${ req.query.s.toUpperCase() }` }); 
      myblobs= myblobs[0].filter( el => el.metadata.contentType == "application/vnd.ms-excel" );

      const myfiles= await listFiles( myblobs );
      items= myfiles.conts.map( (el,ind)=>{
        const file= el.toString().split('\n')
                      .map( r=> r.replace(';','') )
                      .filter( (el,ind) => 5 > ind );
        return {
          date: file[0],
          hour: file[1],
          sn: file[2],
          stat: file[3],
          prog: file[4],
          fname: myfiles.names[ind]
        }
      });

      items= items.filter( el => el ).sort( (a,b)=>{
        const newA= a.date + ";" +  a.hour + ";";
        const newB= b.date + ";" +  b.hour + ";";
        if(m( m( newA ,'D-MMM-YY;LTS;') ).isBefore( m(newB ,'D-MMM-YY;LTS;') )) return 1; 
        if(m( m( newA ,'D-MMM-YY;LTS;') ).isAfter( m(newB ,'D-MMM-YY;LTS;') )) return -1; 
      });

      status= items.length > 0;
    };
  } catch (err) { console.log(err); status= false; };
  res.json({ status, items });
});

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

router.use( jsonex.middleware );
/**
 * Get excel export list.
 *
 * @name gentable1
 * @path {POST} /trace/gentable1
 * @body {Object} All rows from client table 
 * @response {blob} excel file like blob type
 * @memberof Backend/route/files
 */
router.post('/gentable1', async (req,res)=>{
  //console.log('gentable1');
  try {
    if( req.body ){
      const files= { names: [] , conts: [] };

      Array.from( req.body ).forEach( name =>{ files.names.push( name );  files.conts.push( bucket.file(`trace/${ name }`).download() ) });
      files.conts= await Promise.all( files.conts );

      const myjson= files.conts.map( f =>{
        const file= f.toString()
                        .split('\n')
                        .filter( (f,i) =>{ return 5 > i })
                        .map( f => { return f.replace(';','') });
        return {
          "DATE":       file[0],
          "HOUR":       file[1],
          "S-NUM":      file[2],
          "STATUS":     file[3],
          "PROG-NUM":   file[4]
        };
      });
      res.xls('data.xlsx', myjson);
    }
  } catch (err) { console.log(err.message); status= false; };
});

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

module.exports = router;