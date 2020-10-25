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

const ver = 'v1.06a';

console.debug ('main.js', ver, 'starting')

const elemVersion = document.getElementById('ver');
const elemRefresh = document.getElementById('btn_refresh_app');

/* creates a new task */
function force_refresh() {
  console.debug ('Starting force_refresh');
  elemVersion.innerHTML = 'Updating&hellip;';
  caches.delete("Hours-v1");
  elemVersion.innerHTML = ver;
  console.debug ('Finishing force_refresh with window.reload()');
  window.location.reload(true);
}

/* init input field handlers */
elemFormMonth.addEventListener	('submit', add_month, false);
elemMonthList.addEventListener	('change', change_default_month);
elemNewTask.addEventListener	('click',  add_task_new);
elemFormDetails.addEventListener('submit', add_task_done, false);
elemRefresh.addEventListener	('click',  force_refresh); 
elemRefresh.disabled = false;
 
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
change_default_month();

/* update version in HTML */
elemVersion.innerHTML = ver;

console.debug ('main.js', ver, 'finished')
