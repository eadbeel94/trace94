const fs= require('fs');
const { join }= require('path');

const orgPath= './www';
const desPath= '../firebase/public';

(async ()=>{

  const getFolders= path => fs.readdirSync(join( __dirname , path ) , { withFileTypes: true }).map( el => el.isDirectory() && `${ path }/${ el.name }` ).filter( el=>el );

  const getSubfolders= ( folders= [] )=>{
    for (const i in folders) {
      const getPaths= getFolders(folders[i])
      if(getPaths.length > 0) folders= folders.concat(getPaths)
    }
    return folders;
  };

  const notRepeat= ( list=[] )=>{
    let main= list;
    let sec= [];
    sec= [...sec , ...main.splice( 0 , 1 )]
    
    for (const i in main) {
      let found= false;
      for (const j in sec) //console.log( 38, i , j )
        if( sec[j] == main[i] ) found= true;  //main.splice( i , 1 ); //break;
      if(!found) sec= [ ...sec , main[i] ]
    };    //console.log( 47 , main );   //console.log( 48 , sec  );
    return sec;
  };

  const genFolders= ( paths= [] )=>{
    let count= 0;
    for (let i = 0; i < paths.length; i++) {
      try {
        const dest= join( __dirname , desPath , paths[i]  );
        fs.mkdirSync( dest );
        count++;
        //console.log( 38 , 'Folder create successfully -> ', paths[i] )
      } catch (err) {  /*console.log( 40 , err.toString() )*/  };
    }
    console.log( 45, count, 'Folders created of' , paths.length );
  }

  let mypaths= getFolders( orgPath );
  let myfiles= [];

  for (let i = 0; i <= 3; i++) mypaths= getSubfolders( mypaths );
  mypaths= [ orgPath , ...notRepeat( mypaths ) ];
  
  mypaths.forEach( el=>{
    const files= fs.readdirSync(join( __dirname , el ) , { withFileTypes: true }).map( el2 => el2.isFile() && `${ el }/${ el2.name }`.replace( orgPath , '' ) ).filter( el3 => el3 );
    myfiles= [ ...myfiles , ...files ];
  });

  mypaths= mypaths.map( el=> el.replace( orgPath , '' ) );
  true && genFolders( mypaths );

  let count= 0
  for (const i in myfiles) {
    try {
      const src= join( __dirname , orgPath , myfiles[i] )
      const dest= join( __dirname, desPath , myfiles[i]  );
      fs.copyFileSync( src, dest );
      count++;
      //console.log( 62 , 'Copy successfully -> ', myfiles[i] );
    } catch (err) {  console.log( 64 , err.toString() )   };
  };

  console.log( 65, count, 'files copied of' , myfiles.length )
})();



/*
const getFolders= ( path )=>{
  return fs.readdirSync(join( __dirname , path ) , { withFileTypes: true }).map( el => el.isDirectory() && `${ path }/${ el.name }` ).filter( el=>el );
  const list= { folders: [] , paths: [] }
  fs.readdirSync(join( __dirname , path ) , { withFileTypes: true }).forEach( el=>{
    list[ el.isDirectory() ? 'folders' : 'files' ].push( `${ path }/${ el.name }` );
  })
  return list
}
*/

/*
fs.readdirSync( orgPath , {withFileTypes: true} ).forEach( (el,ind)=>{
  console.log( ind, el.isDirectory() )

  try {  
    const src= join( orgPath , el )
    const dest= join( desPath , el );
    fs.copyFileSync( src, dest );
    console.log( 10 , ind, 'Copy successfully -> ', el )
  } catch (err) {  console.log( 10, ind , err.toString() )   }
});
*/

/*
try {
  const src= join( orgPath , './index.html' )
  const dest= join( desPath , './index.html'  );
  fs.copyFileSync( src, dest );
} catch (err) {  console.log( 10 , err.toString() )   }
*/