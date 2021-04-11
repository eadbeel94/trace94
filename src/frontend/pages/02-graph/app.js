/** @namespace Frontend/02-graph */
//import '../app.scss';

/** 
 * Call Modal class from boostrap native
 * @const {class} Modal
 * @memberof Frontend/02-graph
 */
import Modal from 'bootstrap.native/dist/components/modal-native.esm.js';
/** 
 * Call pikaday class from pikaday
 * @const {class} Pikaday
 * @memberof Frontend/02-graph
 */
import Plotly from 'plotly.js-basic-dist';
/**
 * Call local methods from service
 * @typedef {object} service
 * @property {Function} modalShow show an Bootstrap modal in specify area
 * @property {Function} mBodyBTN1 return string with a button for a Modal
 * @property {Function} genData re arenge data from apo for plotly configuration
 * @property {Function} genLayout adjust object for change layout plotly configuration
 * @property {String} IP2 get IP URL value
 * @memberof Frontend/02-graph
 */
const { modalShow , mBodyBTN1 , genData, genLayout , IP2 } = require('../../js/service.js');
/** 
 * IP o URL for operation fetch
 * @type {String}
 * @memberof Frontend/01-table
 */ 
 const IP= '/APItrace'; //IP2;
/** 
 * Variable that will contain HTML graph area
 * @type {HTMLElement}
 * @memberof Frontend/02-graph
 */
let $sec_graph;
document.querySelector('title').innerText+= `(${ window.location.search.substr(4) })`;

/**
 * Send query to backend and get all values X and Y and after show respective graph
 * @callback DOMContentLoaded 
 * @memberof Frontend/02-graph
 */
document.addEventListener("DOMContentLoaded", () => { 
  fetch(`${IP}/graph1${window.location.search}`)
    .then(res0 => { return res0.json() })
    .catch(err =>  modalShow( Modal, "sec_modal", 1, mBodyBTN1(err) ) )
    .then( res => {  
      if(res.hasOwnProperty('status')){
        if(res.status){
          $sec_graph= document.getElementById('sec_graph');
          Plotly.newPlot( $sec_graph, genData( res.items , res.result ) , genLayout( true ) );
        };  
      };
    });
});
/**
 * If user change window when modal graph is open, then change graph's size 
 * @callback window-resize 
 * @memberof Frontend/02-graph
 */
window.addEventListener('resize', () =>{
  $sec_graph != undefined && Plotly.relayout( $sec_graph, { height: sec_graph.clientHeight, width: (document.querySelector('body').clientWidth)*0.95 });
});