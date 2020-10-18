/*
    Module: main app loader

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

/* init input field handlers */
elemFormMonth.addEventListener('submit', add_month, false);
elemMonthList.addEventListener('change', change_default_month);
 
/* try to enable persistent storage */
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((val) => {
    console.log('has persistent storage:', val);
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
change_default_month(get_default_month());
