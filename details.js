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

const elemCancelTask		= document.getElementById('btn_details_cancel');
const elemDeleteTask		= document.getElementById('btn_details_delete');

/* clears the form data */
function details_form_clear() {
  elemDetailsId.value = -2;			// indicate undef, for catching errors
  elemFormDetailDate.value = '';
  elemFormDetailStart.value = '';
  elemFormDetailEnd.value = '';
  elemFormDetailBreak.value = '00:00';
  elemFormDetailNotes.value = '';
  elemCancelTask.disabled = true;
  elemDeleteTask.disabled = true;
}

/* hides the details form */
function details_form_hide() {
  elemSecDetails.style.display = 'none';	// hide details form again
}

/* show the details form */
function details_form_show(hasCancel, hasDelete) {
  elemSecDetails.style.display = 'block';	// show details form
  elemCancelTask.disabled = !hasCancel;
  elemDeleteTask.disabled = !hasDelete;
}

/* safety check - abort opening new form, is old one is not closed first! */
function isFormShown() {
  if (elemSecDetails.style.display != 'block') {
    return false;
  } else {
    alert ('details form already open, close it first');
    return true;
  }
}

/* event: creates a new empty task */
function task_new() {
  if (isFormShown()) { return false; }

  details_form_clear();
  elemDetailsId.value = -1;			// indicate new Task

  details_form_show(true, false);		// has Cancel button
  return true;
}

/* event: edits existing task */
function task_edit(evt) {
  if (isFormShown()) { return false; }
  
  const target = evt.target;
  const tr = target.parentElement;
  const rowIdx = tr.rowIndex - 1;
  const td  = tr.children;

  elemDetailsId.value = rowIdx;			// 0 = first <tr>
  elemFormDetailDate.value = td[0].innerHTML;
  elemFormDetailStart.value = td[1].innerHTML;
  elemFormDetailEnd.value = td[2].innerHTML;
  elemFormDetailBreak.value = min_to_human(calc_minutes(td[1].innerHTML, td[2].innerHTML, td[3].innerHTML));	// calculte break as start-end-time_worked
  elemFormDetailNotes.value = td[4].innerHTML;

  details_form_show(true, true);		// has Cancel and Delete buttons
  return true;
}


/* event: cancels current task */
function task_cancel() {
  details_form_clear();
  details_form_hide();
}

/* event: deletes current task */
function task_delete() {
  if (confirm ('Really DELETE?')) {
    const id = elemFormDetailId.value;
    const m = get_default_month_DB();
    let tasks = get_tasks_month_DB(m);

    console.debug ('Deleting task '+id, tasks);
    tasks.splice(id,1);
    set_tasks_month_DB(m, tasks);

    details_form_hide();
    show_list(m);
    return true;
  }
  return false;
}

/* event: add new task details to DB */
function task_done(evt) {
  evt.preventDefault();			// or we'll try to GET/POST the Form...

  const id = elemFormDetailId.value;
  const m = get_default_month_DB();
  let tasks = get_tasks_month_DB(m);

  if (id == -1) {
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
      console.debug ('Updating task '+id, tasks);
      tasks[id][0] = elemFormDetailDate.value;
      tasks[id][1] = elemFormDetailStart.value;
      tasks[id][2] = elemFormDetailEnd.value;
      tasks[id][3] = elemFormDetailBreak.value;
      tasks[id][4] = elemFormDetailNotes.value;
      set_tasks_month_DB(m, tasks);
  }

  details_form_hide();
  show_list(m);
  return false;
}
