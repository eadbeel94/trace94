/** @namespace Frontend/service */

/** 
 * common message loading. 
 * @constant {string} messWait 
 * @memberof Frontend/service 
 */
const messWait= `Please wait <br/> <div class="spinner-border text-info mt-3" role="status"><span class="sr-only">Loading...</span></div>`;
/**
 * Create a Html Bootstrap-Modal
 * @function modalShow
 * @memberof Frontend/service
 * @param {object} Modal Bootstrap Modal class
 * @param {string} id HTML tag id where filled with this Modal
 * @param {number} type css style type 1 or type 2
 * @param {string} body modal body with HTML tags and text
 * @returns {{native: Element, modal: HTMLElement, $confirmed: Element }} return modal method object, modal body element and confirmed button element
 */
const modalShow= ( Modal , id="" , type=1 , body="" ) =>{            //Create a Html Modal empty
  const modal= document.getElementById(`${id}`);  
  const random= Math.floor(Math.random() * 100);
  modal.innerHTML= `
    <div id="modal${random}" class="modal fade modalT${type}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <section class="modal-content rounded-0">${body}</section>
      </div>
    </div>`;
  const native= new Modal(`#modal${random}`);             //native.setContent(body)
  native.show();
  const $confirmed= modal.querySelector('.confirmed');
  return { native , modal , $confirmed };
};
/**
 * Create a Html Bootstrap-Modal
 * @function modalGraph
 * @memberof Frontend/service
 * @param {object} Modal Bootstrap Modal class
 * @param {string} id HTML tag id where filled with this Modal
 * @returns {{native: Element, modal: HTMLElement, $areaGraph: Element }} return modal method object, modal body element and areaGraph HTML element
 */
const modalGraph= ( Modal , id="" ) =>{            //Create a Html Modal empty
  const modal= document.getElementById(`${id}`);  
  const random= Math.floor(Math.random() * 100);
  modal.innerHTML= `
    <div id="modal${random}" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document" style="min-width: 90vw;">
        <section class="modal-content rounded-0 bg-transparent">
          <div class="modal-body text-center p-0" style="min-height: 90vh; background-color: var(--color3)">
            <button type="button" class="close close2 text-light" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>   
            <section class="card bg-transparent h-100 rounded-0"> </section>
          </div>
        </section>
      </div>
    </div>`;
  const native= new Modal(`#modal${random}`);             //native.setContent(body)
  native.show();
  const $areaGraph= modal.querySelector('section .card');
  return { native , modal , $areaGraph };
};
/**
 * Create a Html Modal body with a button
 * @function mBodyBTN1
 * @memberof Frontend/service
 * @param {string} message string HTML tags and text
 * @returns {string} return HTML modal body
 */
const mBodyBTN1= ( message="" )=>{ 
  return `
    <div class="modal-header">
      <h5 class="modal-title text-center w-100 pt-2">INVENTORY</h5>
      <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
    <div class="modal-body text-center">
      ${message}
    </div>
    <div class="modal-footer">
      <div class="btn-group btn-block" role="group">
        <button type="button" class="btn w-100" data-dismiss="modal">OK</button>
      </div>
    </div>`;
};
/**
 * Create a Html Modal body with 2 buttons
 * @function mBodyBTN2
 * @memberof Frontend/service
 * @param {string} message string HTML tags and text
 * @param {string} textL text button left
 * @param {string} textR text button rigth
 * @returns {string} return HTML modal body
 */
const mBodyBTN2= ( message="" , textL= "YES" , textR= "CANCEL" )=>{
  return `
    <div class="modal-header">
      <h5 class="modal-title text-center w-100 pt-2">INVENTORY</h5>
      <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
    <div class="modal-body text-center">
      ${message}
    </div>
    <div class="modal-footer">
      <div class="btn-group btn-block" role="group">
        <button type="button" class="btn w-50 confirmed">${textL}</button>
        <button type="button" class="btn w-50" data-dismiss="modal">${textR}</button>
      </div>
    </div>`;
};
/**
 * Create a Html Table with files' information
 * @function genTable
 * @memberof Frontend/service
 * @param {Array<object>} list Array of object with each file data
 * @returns {string} return HTML table
 */
const genTable= ( list=[] )=>{
  return list.map( (r,i) =>{
    return `
      <tr id="${ r.fname }" style="color:  ${ ( r.stat == "NOK" ? 'var(--nred)' : ( r.stat == "OK" ? 'var(--ngre)' : '' )) } ">
        <th scope="row">${ i+1 }</th>
        <td>${ r.date }</td>
        <td>${ r.hour }</td>
        <td>${ r.sn }</td>
        <td>${ r.stat }</td>
        <td>${ r.prog }</td>
      </tr>`;
  }).join('');
};
/**
 * Re-arenge file X and Y data for graph into Plotly 
 * @function genData
 * @memberof Frontend/service
 * @param {Array<Array>} infoXY Array of arrays with X  and Y data
 * @param {string} result archive status for change color graph
 * @returns {Array<object>} return Array of object with plotly adjust
 */
const genData= ( infoXY=[], result="" ) =>{
  const info= [[],[]];
  infoXY.forEach( r =>{
    const xy= r.split(' ').map( r2 =>{ return r2.replace(';','') });
    xy.length == 2 && info[0].push( xy[0] );
    xy.length == 2 && info[1].push( xy[1] );
  });
  return [{
    x: info[1], y: info[0], 
    type: 'scatter', hoverlabel: {font: { family: 'teko1' , size: 25 }, namelength: 0},
    line: { color: result == "OK" ? '#66fecb' : '#f22d41', width: 2 }
  }];
};
/**
 * Plotly style configurator
 * @function genLayout
 * @memberof Frontend/service
 * @param {boolean} type Change width and heigth space graph
 * @returns {object} return object with plotly configuration
 */
const genLayout= ( type=1 ) =>{
  return {
    title: `Parts - time Graph`, 
    showlegend: false,
    paper_bgcolor:'transparent', 
    plot_bgcolor:'transparent',
    font: { 
      size: 24, 
      family: 'teko1', 
      color: '#A0CDE7'
    },
    height: type ? document.querySelector('body').clientHeight - 25 : document.querySelector('body').clientHeight, 
    width: type ? (document.querySelector('body').clientWidth) * 0.97 : (document.querySelector('body').clientWidth)*0.89,
    margin: { 
      l: 70,r: 30,b: 80, t: 80, pad: 7 
    },
    xaxis: { 
      gridcolor: 'transparent', 
      zerolinecolor: 'transparent', 
      title: "time [s]", 
      tickfont: { color: '#A0CDE7' }
    },
    yaxis: { 
      //range: [-1, 100],
      gridcolor: 'transparent',  
      zerolinecolor: 'transparent', 
      title: "Parts", 
      tickfont: { color: '#A0CDE7' }
    },
    shapes: [{
      type: 'line', layer: 'below', xref: 'paper', line: { color: '#A0CDE7' },
      x0: 0, x1: 1, y0: -0, y1: -0
    },{
      type: 'line', layer: 'below', yref: 'paper', line: { color: '#A0CDE7' },
      x0: 0, x1: 0, y0: 0, y1: 1
    }]
  }
};
/**
 * Get mouse position
 * @function getPosition
 * @memberof Frontend/service
 * @param {Event} ev Mouse event
 * @returns {{x: number, y: number}} return object with mouse position
 */
const getPosition= (ev)=>{
  let posx = 0;
  let posy = 0;
  //if (!ev) let ev = window.event;
  if (ev.pageX || ev.pageY) {
    posx = ev.pageX; posy = ev.pageY;
  } else if (ev.clientX || ev.clientY) {
    posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  };
  return { x: posx, y: posy };
};
/** 
 * Variable contain IP for using any fetch
 * @type {string}
 * @memberof Frontend/01-table
 * @todo I need to change in production
 */ 
const IP= '/APItrace/';//'http://localhost:5001/driveshop5/us-central1/trace';

module.exports= { modalShow , modalGraph , mBodyBTN1 , mBodyBTN2 , messWait , genTable , genData , genLayout , getPosition , IP };
