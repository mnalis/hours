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

const ver = 'v1.36';

console.debug ('main.js', ver, 'starting')

const elemVersion = document.getElementById('ver');
const elemRefresh = document.getElementById('btn_refresh_app');
const elemBackup = document.getElementById('btn_backup');
const elemImport = document.getElementById('import_file_field'); // FIXME btn_import, import_file_field

/* refreshes App / upgrades PWA */
function force_refresh() {
  console.debug ('Starting force_refresh');
  elemVersion.innerHTML = 'Updating&hellip;';
  caches.delete("Hours-v1");
  elemVersion.innerHTML = ver;
  console.debug ('Finishing force_refresh with window.reload()');
  window.location.reload(true);
}

/* initiale download */
function initiate_download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/* exports LocalStorage for download */
function backup_data() {
  console.debug ('Starting data backup');
  const filename = "hours_backup.json";	// FIXME add date/timestamp in filename
  const content_json = JSON.stringify(localStorage);

  initiate_download (filename, content_json);
}

/* import previously exported LocalStorage */
function import_data(txt) {
  console.debug ('Starting data import');

  const data = JSON.parse(txt);
  localStorage.clear();
  Object.keys(data).forEach(function (k) {
    localStorage.setItem(k, data[k]);
  });

  elemVersion.innerHTML = "Refreshing...";
  console.debug ('Data import complete, refreshing...');
  window.location.reload(true);
}

/* file to import has been selected */
function import_upload_file(event) {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.onload = function(readerEvent) {
    const uri=readerEvent.target.result;
    fetch(uri)
      .then(res => res.blob())
      .then(blob => blob.text())
      .then(import_data);
  }
  reader.readAsDataURL(file);
}

elemVersion.innerHTML = 'Starting up...';

/* init input field handlers */
elemFormMonth.addEventListener		('submit', add_month, false);		// create new month category
elemCurMonthList.addEventListener	('change', change_default_month);	// select month category
elemTableList.addEventListener		('click',  task_edit);			// edit any task
elemFormDetailStartNow.addEventListener	('click',  task_set_now_begin);		// set begin time to now() via button
elemFormDetailEndNow.addEventListener	('click',  task_set_now_end);		// set end time to now() via button
elemNewTask.addEventListener		('click',  task_new);			// start creating new task
elemCancelTask.addEventListener		('click',  task_cancel);		// cancel task
elemDeleteTask.addEventListener		('click',  task_delete);		// delete task
elemMoveTask.addEventListener		('click',  task_move);			// move task to different month category
elemFormDetails.addEventListener	('submit', task_done, false);		// finish creating/updating task
elemBackup.addEventListener		('click',  backup_data); 		// export/backup full localStorage
elemImport.addEventListener		('change', import_upload_file, false);	// import backup of localStorage
elemRefresh.addEventListener		('click',  force_refresh); 		// app refresh/upgrade
elemRefresh.disabled = false;

elemVersion.innerHTML = 'Checking storage...';
 
/* try to enable persistent storage */
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((val) => {
    console.log('has persistent storage:', val);
  });
}


elemVersion.innerHTML = 'Checking Worker...';

/* register Service Worker */
/* FIXME this fails on file:// URL, but script seems to continue to work */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
} else {
  console.error('ABORT: service workers not supported');
}

elemVersion.innerHTML = 'Initializing main...';

/* show current list of months on startup */
showMonths();
elemVersion.innerHTML = 'Setting up default...';
change_default_month();

/* update version in HTML */
elemVersion.innerHTML = ver;

console.debug ('main.js', ver, 'finished')
