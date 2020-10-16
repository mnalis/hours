/*
    Hours - simple time tracking PWA, inspired by PalmOS hours.prc
    Copyright (C) 2020 Matija Nalis <mnalis-git@voyager.hr>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict';

const elemMonthValue = document.getElementById('month_input');
const elemFormMonth = document.getElementById('form_month');
const elemMonthList = document.getElementById('month_list');

const KEY_MONTHS='_MONTHS';
const KEY_LASTMONTH='_LASTMONTH';


/* show list of months in DB */
function showMonths() {
  const months = get_months().sort();
  console.debug ('showMonths:', months);
  var monthList = '';
  for (var i = 0, month; month = months[i]; i++) {
    monthList += '<li>' + month + '</li>';
  }
  elemMonthList.innerHTML = monthList;
}


/* set default month to use */
function set_last_month(month) {
  return addToDB(KEY_LASTMONTH, month);
}

/* add new month to DB */
function add_month(evt) {
  evt.preventDefault();			// or we'll try to GET/POST the Form...
  //if (!elemMonthValue.checkValidity()) return false;
  var months = get_months();
  var v=elemMonthValue.value;
  if (months.indexOf(v) > -1) return false;	// do not allow duplicates
  console.debug ('Adding month', v);
  set_last_month(v);
  months.push(v);
  set_months(months);
  /* clear field and prepare to enter new value */
  elemMonthValue.value = '';
  elemMonthValue.focus();
  return false;
}

/* return array of months from DB */
function get_months() {
  return JSON.parse(getFromDB(KEY_MONTHS)) || [];
}

/* save array of months to DB */
function set_months(months) {
  return addToDB(KEY_MONTHS, JSON.stringify(months));
}

/* Returns value from Local Storage */
function getFromDB(key) {
  return localStorage.getItem(key);
}

/* Add to Local Storage, with error handling */
function addToDB(key, val) {
  try {
    //console.debug('addToDB', key, '=', val);
    localStorage.setItem(key, val);
  } catch (ex) {
    console.error(`*** LocalStorage: '${ex.name}' ***`, ex);
    alert('Oops: Error writing to LocalStorage, check console.');
    return false;
  }
  showMonths();
}



/*
 * MAIN
 */

/* init input field handlers */
elemFormMonth.addEventListener('submit', add_month, false);
 
/* try to enable persistent storage */
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((val) => {
    console.log('has persistent storage', val);
  });
}


/* register Service Worker */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
} else {
  console.error('ABORT: service workers not supported');
}

/* show current list of months on startup */
showMonths();
