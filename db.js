/*
    Module: database access functions (permanent Local Storage)

    part of: Hours - simple time tracking PWA, inspired by PalmOS hours.prc
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

const KEY_MONTHS='_MONTHS';
const KEY_LASTMONTH='_LASTMONTH';


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


/* set default month to use */
function set_default_month(month) {
  return addToDB(KEY_LASTMONTH, month);
}
/* returns default month to use */
function get_default_month() {
   return getFromDB(KEY_LASTMONTH);
}

/* return array of months from DB */
function get_months() {
  return JSON.parse(getFromDB(KEY_MONTHS)) || [];
}

/* save array of months to DB */
function set_months(months) {
  return addToDB(KEY_MONTHS, JSON.stringify(months));
}
