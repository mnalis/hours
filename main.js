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

const elemMonthValue = document.getElementById('month_input');
const elemAddMonth = document.getElementById('add_month');

const KEY_MONTHS='MONTHS';
const KEY_LASTMONTH='LASTMONTH';


/* show list of months in DB */
function showMonths() {
  const months = localStorage.getItem(KEY_MONTHS);
  console.log ('showMonths:', months);
  
}


/* set default month to use */
function set_last_month(month) {
  return addToDB(KEY_LASTMONTH, month);
}

/* add new month to DB */
function add_month() {
  //if (!elemMonthValue.checkValidity()) return false;
  set_last_month(elemMonthValue.value);
  return addToDB(KEY_MONTHS, elemMonthValue.value);
}

/* Add to Local Storage, with error handling */
function addToDB(key, val) {
  try {
    console.debug('addToDB', key, '=', val);
    localStorage.setItem(key, val);
  } catch (ex) {
    console.error(`*** LocalStorage: '${ex.name}' ***`, ex);
    alert('Oops: Error writing to LocalStorage, check console.');
    return false;
  }
}



/*
 * MAIN
 */

/* init input field handlers */
elemAddMonth.addEventListener('submit', add_month);
 
/* try to enable persistent storage */
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((val) => {
    console.log('has persistent storage', val);
  });
}


/* register Service Worker */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
} else {
  console.error("ABORT: service workers not supported");
}

/* show current list of months on startup */
showMonths();
