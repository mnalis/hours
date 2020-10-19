/*
    Module: show/add/edit/delete task details

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

const elemSecDetails	= document.getElementById('sec_details');
const elemDetailsId	= document.getElementById('details_id');
const elemFormDetails	= document.getElementById('form_details');

const elemFormDetailId		= document.getElementById('details_id');
const elemFormDetailDate	= document.getElementById('details_date');
const elemFormDetailStart	= document.getElementById('details_start');
const elemFormDetailEnd		= document.getElementById('details_end');
const elemFormDetailBreak	= document.getElementById('details_break');
const elemFormDetailNotes	= document.getElementById('details_notes');

/* creates a new task */
function add_task_new() {
  elemDetailsId.value = -1;			// indicate new Task
  elemSecDetails.style.display = 'block';	// show details form
}

/* add new task details to DB */
function add_task_done(evt) {
  evt.preventDefault();			// or we'll try to GET/POST the Form...

  const id = elemFormDetailId.value;
  const m = get_default_month_DB();
  let tasks = get_tasks_month_DB(m);

  if (id < 0) {
      console.debug ('Adding new task');
      tasks.push ( [
          elemFormDetailDate.value,
          elemFormDetailStart.value,
          elemFormDetailEnd.value,
          elemFormDetailBreak.value,
          elemFormDetailNotes.value,
          ] );
      set_tasks_month_DB(m, tasks);
  } else {
      console.debug ('Updating task '+id);
      alert ('FIXME editing tasks not supported yet');
  }

  elemSecDetails.style.display = 'none';	// hide details form again after submit
  show_list(m);
  return false;
}
