/** @namespace Frontend/01-table */
//import './style.css';
/** 
 * Call moment function from moment
 * @const {function} moment
 * @memberof Frontend/01-table
 */
import moment from 'moment';
/** 
 * Call pikaday class from pikaday
 * @const {class} Pikaday
 * @memberof Frontend/11-table
 */
import Pikaday from 'pikaday';
/** 
 * Call Plotly module from Plotly basic
 * @const {module} Plotly
 * @memberof Frontend/11-table
 */
import Plotly from 'plotly.js-basic-dist';
/** 
 * Call Modal class from boostrap native
 * @const {class} Modal
 * @memberof Frontend/11-table
 */
import Modal from 'bootstrap.native/dist/components/modal-native.esm.js';

/**
 * Call local methods from service
 * @typedef {object} service
 * @property {Function} modalShow show an Bootstrap modal in specify area
 * @property {Function} modalGraph show an Bootstrap modal with graph area
 * @property {Function} mBodyBTN1 return string with a button for a Modal
 * @property {Function} mBodyBTN2 return string with two button for a Modal
 * @property {Function} genTable fill HMTL Table using api information
 * @property {Function} genData re arenge data from apo for plotly configuration
 * @property {Function} genLayout adjust object for change layout plotly configuration
 * @property {Function} getPosition get position X and Y from mouse
 * @property {String} messWait show common message please wait
 * @property {String} prod environment type project run
 * @property {String} IP get IP URL value
 * @memberof Frontend/01-table
 */
const { 
  modalShow, 
  modalGraph, 
  mBodyBTN1, 
  mBodyBTN2, 
  genTable, 
  genData, 
  genLayout, 
  getPosition, 
  messWait,
  prod,
  IP
} = require('../../js/service.js');
/** 
 * HTML form that contain two first date inputs and first button
 * @type {HTMLElement}
 * @memberof Frontend/01-table
 */ 
const $frm_date= document.getElementById('frm_date');
/** 
 * HTML form that contain input and button right for generate search
 * @type {HTMLElement}
 * @memberof Frontend/01-table
 */ 
const $frm_search= document.getElementById('frm_search');
/** 
 * HTML space where will create rows for each file founded
 * @type {HTMLElement}
 * @memberof Frontend/01-table
 */ 
const $spc_tfill= document.getElementById('spc_tfill');
/** 
 * HTML input that use select first date
 * @type {HTMLElement}
 * @memberof Frontend/01-table
 */ 
const $inp_dateto= document.getElementById('inp_dateto');
/** 
 * HTML input that use select last date
 * @type {HTMLElement}
 * @memberof Frontend/01-table
 */ 
const $inp_datefr= document.getElementById('inp_datefr');
/** 
 * HTML label where show max count files founded
 * @type {HTMLElement}
 * @memberof Frontend/01-table
 */ 
const $lbl_total= document.getElementById('lbl_total');
/** 
 * HTML section that include all button into table
 * @type {Element}
 * @memberof Frontend/01-table
 */
const $sec_tabHead= document.querySelector("#sec_table1 thead");
/** 
 * HTML section that include all button into table head
 * @type {HTMLElement}
 * @memberof Frontend/01-table
 */
const $sec_headBtns= $sec_tabHead.getElementsByTagName("button");
/** 
 * HTML button that use for download table into excel file
 * @type {HTMLElement}
 * @memberof Frontend/01-table
 */  
const $btn_down= document.getElementById('btn_down');
/** 
 * HTML Element que include nav square for show custom secondary mouse option
 * @type {Element}
 * @memberof Frontend/01-table
 */  
const $menu = document.querySelector("#context-menu");
/** 
 * Variable contain current state of menu
 * @type {number}
 * @memberof Frontend/01-table
 */ 
let menuState = 0;
/** 
 * Variable contain menu's position
 * @type {number}
 * @memberof Frontend/01-table
 */ 
let menuPosition;
/** 
 * Variable that will contain HTML graph area
 * @type {HTMLElement}
 * @memberof Frontend/01-table
 */
let $sec_graph;
/** 
 * Variable will fill with group files
 * @type {Array}
 * @memberof Frontend/01-table
 */
let dataGraphs= [];
/** 
 * Variable with first input date configuration
 * @const {object} pik1
 * @memberof Frontend/01-table
 */
const pik1= new Pikaday({ field: $inp_dateto, onClose : function() { $inp_dateto.value= moment(this.toString()).isValid() ? moment(this.toString()).format('DD MMM YYYY') : ''; }});
/** 
 * Variable with second input date configuration
 * @const {object} pik2
 * @memberof Frontend/01-table
 */
const pik2= new Pikaday({ field: $inp_datefr, onClose : function() { $inp_datefr.value= moment(this.toString()).isValid() ? moment(this.toString()).format('DD MMM YYYY') : ''; }});

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * User press filter button, then send two dates to backend and get files for fill table
 * @function getFilterList
 * @memberof Frontend/01-table
 * @param {Event} ev Submit click event button press
 */
 const getFilterList= (ev) => {
  ev.preventDefault();

  const { $confirmed }= modalShow( Modal, "sec_modal", 1, mBodyBTN2('Query process will take any time, Do you wanna continue?') );
  $confirmed.addEventListener('click', ()=>{
    const { native }= modalShow( Modal, "sec_modal", undefined, mBodyBTN1(messWait) );  //Show modal with please wait message
    Array.from( $sec_headBtns ).forEach( r =>{
      r.classList.remove("active");
      r.children[0].classList.remove("fa-arrow-up");
      r.children[0].classList.remove("fa-arrow-down");
    });
    $sec_headBtns[0].classList.add("active");
    $sec_headBtns[0].children[0].classList.add("fa-arrow-up");
    
    const send= {
      fr: moment(ev.target[0].value).isValid() && moment( ev.target[0].value ).format(),
      to: moment(ev.target[2].value).isValid() ? moment( ev.target[2].value ).format() : moment().format(),
      st: ev.target[1].checked && ev.target[3].checked ? '' : ( ev.target[1].checked ? 'OK' : ( ev.target[3].checked ? 'NOK' : '' ) )
    }

    fetch(`${IP}/api/trace/filter1`,{ 
        method: 'POST', 
        body: JSON.stringify(send), 
        headers:{ 'Content-Type': 'application/json'  } 
      })
      .then( res0 => res0.ok ? res0.json() : Promise.reject( `Status -> ${ res0.status } ** Code error -> ${ res0.statusText }`) )
      .then( res => {   //Show modal with information
        setTimeout(() => native.hide(), 1000);
        //modalShow( Modal , "sec_modal" , undefined, mBodyBTN1(res.status ? `Article deleted successfully` : `Error`) )
        if(res.hasOwnProperty('status')){
          if(res.status){
            dataGraphs= res.items;
            $lbl_total.innerText= `TOTAL: ${ dataGraphs.length } elements`;
            $spc_tfill.innerHTML= genTable( dataGraphs );
          };  
        };

      })
      .catch(err =>  modalShow( Modal, "sec_modal", 1, mBodyBTN1(err) ) )
  });
};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * User press search button, then send query to backend and get files for fill table
 * @function getSearchList
 * @memberof Frontend/01-table
 * @param {Event} ev Submit click event button press
 */
const getSearchList= (ev) => {
  ev.preventDefault();
  Array.from( $sec_headBtns ).forEach( r =>{
    r.classList.remove("active");
    r.children[0].classList.remove("fa-arrow-up");
    r.children[0].classList.remove("fa-arrow-down");
  });
  $sec_headBtns[0].classList.add("active");
  $sec_headBtns[0].children[0].classList.add("fa-arrow-up");

  const { $confirmed }= modalShow( Modal, "sec_modal", 1, mBodyBTN2('Query process will take any time, Do you wanna continue?') );
  $confirmed.addEventListener('click', ()=>{
    const { native }= modalShow( Modal, "sec_modal", undefined, mBodyBTN1(messWait) );  //Show modal with please wait message
    
    fetch(`${IP}/api/trace/search1?s=${ ev.target[0].value }`)
      .then( res0 => res0.ok ? res0.json() : Promise.reject( `Status -> ${ res0.status } ** Code error -> ${ res0.statusText }`) )
      .then( res => {   //Show modal with information
        setTimeout(() => native.hide(), 1000);
        if(res.hasOwnProperty('status')){
          if(res.status){
            dataGraphs= res.items;
            $lbl_total.innerText= `TOTAL: ${ dataGraphs.length } elements`;
            $spc_tfill.innerHTML= genTable( dataGraphs );
          };  
        };
      })
      .catch(err =>  modalShow( Modal, "sec_modal", 1, mBodyBTN1(err) ) )

  });
};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * User press double click in any row then show modal with an graph
 * @function openGraph
 * @param {Event} ev click event button press
 * @memberof Frontend/01-table
 */
 const openGraph= (ev) => {
  if(ev.target.tagName == 'TD'){
    const row= ev.path[1].id;
    fetch(`${IP}/api/trace/graph1?gn=${row}`)
      .then( res0 => res0.ok ? res0.json() : Promise.reject( `Status -> ${ res0.status } ** Code error -> ${ res0.statusText }`) )
      .then( res => {  
        if(res.hasOwnProperty('status')){
          if(res.status){
            const { modal, $areaGraph }= modalGraph( Modal , "sec_modalG" );
            $sec_graph= $areaGraph;
            Plotly.newPlot( $sec_graph, genData( res.items , res.result ) , genLayout( false ) );
            modal.querySelector('button.close2').addEventListener('click', ()=>{ $sec_graph= undefined; } );
          };  
        };

      })
      .catch(err =>  modalShow( Modal, "sec_modal", 1, mBodyBTN1(err) ) )
  }
};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * User press secondary button in any row then show message "open graph in new tab"
 * @function showTap
 * @param {Event} ev click event button press
 * @memberof Frontend/01-table
 */
const showTab= (ev) => {
  ev.preventDefault();
  if( menuState !== 1 ){  
    if(ev.path[1].tagName == "TR"){
      menuState = 1; 
      menuPosition = getPosition(ev);
      $menu.style.left = menuPosition.x + "px";
      $menu.style.top = menuPosition.y + "px";
      document.querySelector('#context-menu li').innerHTML = `
      <a href="${ prod ? '/projects/trace94' : '' }/pages/chart?gn=${ ev.path[1].id }" class="context-menu__link px-2 py-1" data-action="View" target="_blank">
        <i class="fas fa-chalkboard"></i> Open graph in new tab
      </a>`;
      $menu.classList.add('d-block');
      document.querySelector('#context-menu a').addEventListener('click', ()=>{ menuState = 0; $menu.classList.remove('d-block');   })
    }
  }else {          
    menuState = 0; $menu.classList.remove('d-block');  
  };
};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * User press any button in table headder, then re-arenge element into table based button pressed criterion
 * @function orderList
 * @memberof Frontend/01-table
 */
const orderList= (ev) => {
  if(ev.target.type == "button"){
    let pos;
    Array.from( $sec_headBtns ).forEach( (r,i) =>{
      if( r != ev.target ){
        r.classList.remove("active");
        r.children[0].classList.remove("fa-arrow-up");
        r.children[0].classList.remove("fa-arrow-down");
      }
      r == ev.target && ( pos= i );
    });
    ev.target.classList.add("active");
    if(ev.target.children[0].classList.length > 1){
      if(ev.target.children[0].classList[1] == "fa-arrow-up"){
        ev.target.children[0].classList.remove("fa-arrow-up");
        ev.target.children[0].classList.add("fa-arrow-down");
      }else if(ev.target.children[0].classList[1] == "fa-arrow-down"){
        ev.target.children[0].classList.remove("fa-arrow-down");
        ev.target.children[0].classList.add("fa-arrow-up");
      }
    }else
      ev.target.children[0].classList.add("fa-arrow-up");

    dataGraphs= dataGraphs.sort((a,b)=>{
      if($sec_headBtns[pos].children[0].classList[1] == "fa-arrow-down"){
        if(pos >= 2){
          let counter= 0;
          for (const key in a) {
            if( pos == counter ){
              if(a[key] > b[key]){ return -1; }
              if(a[key] < b[key]){ return 1; }
            };
            counter++;
          };
        }else if(pos == 1){
          if(moment( moment(a.hour,"LTS") ).isBefore( moment(b.hour,"LTS") )){ return -1; }
          if(moment( moment(a.hour,"LTS") ).isAfter( moment(b.hour,"LTS") )){ return 1; }
        }else if(pos == 0){
          if(moment( moment(a.date,"D-MMM-YY") ).isBefore( moment(b.date,"D-MMM-YY") )){ return -1; }
          if(moment( moment(a.date,"D-MMM-YY") ).isAfter( moment(b.date,"D-MMM-YY") )){ return 1; }
        }
      }else if($sec_headBtns[pos].children[0].classList[1] == "fa-arrow-up"){
        if(pos >= 2){
          let counter= 0;
          for (const key in a) {
            if( pos == counter ){
              if(a[key] < b[key]){ return -1; }
              if(a[key] > b[key]){ return 1; }
            };
            counter++;
          };
        }else if(pos == 1){
          if(moment( moment(a.hour,"LTS") ).isAfter( moment(b.hour,"LTS") )){ return -1; }
          if(moment( moment(a.hour,"LTS") ).isBefore( moment(b.hour,"LTS") )){ return 1; }
        }else if(pos == 0){
          if(moment( moment(a.date,"D-MMM-YY") ).isAfter( moment(b.date,"D-MMM-YY") )){ return -1; }
          if(moment( moment(a.date,"D-MMM-YY") ).isBefore( moment(b.date,"D-MMM-YY") )){ return 1; }
        };
      };
      return 0;
    });
    $spc_tfill.innerHTML= genTable( dataGraphs );
  };
};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * User press this button, download table content into excel file
 * @function downList
 * @memberof Frontend/01-table
 */
const downList= () => {
  const { $confirmed }= modalShow( Modal, "sec_modal", 1, mBodyBTN2('Query process will take any time, Do you wanna continue?') );
  $confirmed.addEventListener('click', ()=>{
    const { native }= modalShow( Modal, "sec_modal", undefined, mBodyBTN1(messWait) );  //Show modal with please wait message

    const send= dataGraphs.map( r =>{ return r.fname; });
    fetch(`${IP}/api/trace/gentable1`, { 
        method: 'POST', 
        body: JSON.stringify(send), 
        headers:{ 'Content-Type': 'application/json'  } 
      })
      .then( res0 => res0.ok ? res0.blob() : Promise.reject( `Status -> ${ res0.status } ** Code error -> ${ res0.statusText }`) )
      .then( res => {
        const eblob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        location.href = window.URL.createObjectURL(eblob);

        setTimeout(() => native.hide(), 1000);
      })
      .catch( err => modalShow( Modal, "sec_modal", 1, mBodyBTN1(err) ) )
     
  });
};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * If user change window when modal graph is open, then change graph's size 
 * @function resizeGraph
 * @memberof Frontend/01-table
 */
 const resizeGraph= () => {
  $sec_graph && Plotly.relayout( $sec_graph, { height: $sec_graph.clientHeight, width: (document.querySelector('body').clientWidth)*0.89 });
};

/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Execute segment code when page end load and load graphs from first march to currenty date
 * @function main
 * @memberof Frontend/01-table
 */
const main= () => {
  const { native }= modalShow( Modal, "sec_modal", undefined, mBodyBTN1(messWait) );  //Show modal with please wait message

  const send= {
    fr: "2021-03-01T00:00:00-06:00",
    st: "",
    to: moment().format()
  }

  fetch(`${IP}/api/trace/filter1`,{  
      method: 'POST', 
      body: JSON.stringify(send), 
      headers:{ 'Content-Type': 'application/json'  } 
    })
    .then( res0 => res0.ok ? res0.json() : Promise.reject( `Status -> ${ res0.status } ** Code error -> ${ res0.statusText }`) )
    .then( res => {   //Show modal with information
      setTimeout(() => native.hide(), 1000);
      //modalShow( Modal , "sec_modal" , undefined, mBodyBTN1(res.status ? `Article deleted successfully` : `Error`) )
      if(res.hasOwnProperty('status')){
        if(res.status){
          dataGraphs= res.items;
          $lbl_total.innerText= `TOTAL: ${ dataGraphs.length } elements`;
          $spc_tfill.innerHTML= genTable( dataGraphs );
        };  
      };

    })
    .catch(err =>  modalShow( Modal, "sec_modal", 1, mBodyBTN1(err) ) )

  $frm_date.onsubmit= (ev) => getFilterList(ev);
  $frm_search.onsubmit= (ev) => getSearchList(ev);
  $spc_tfill.ondblclick= (ev) => openGraph(ev);
  document.oncontextmenu= (ev) => showTab(ev);
  $sec_tabHead.onclick= (ev) => orderList(ev);
  $btn_down.onclick= downList;  
};

window.onload= main;
window.onresize= resizeGraph;