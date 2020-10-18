/*
    Module: show/add/edit/delete months categories

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

const elemMonthValue = document.getElementById('month_input');
const elemFormMonth = document.getElementById('form_month');
const elemMonthList = document.getElementById('month_list');
const elemSelectedMonth = document.getElementById('selected_month');


/* build a droplist of months with selected default_month */
function build_months_list(default_month) {
  const months = get_months_DB().sort().reverse();
  //console.debug ('build_months_list:', months, 'default:', default_month);
  let monthList = '';
  for (let i = 0, month; month = months[i]; i++) {
    const selected = (month === default_month) ? ' selected' : '';
    monthList += '<option value="' + month + '"' + selected + '>' + month + '</option>';
  }
  return monthList;
}

/* show list of months in DB */
function showMonths() {
  const last_used = get_default_month_DB();
  elemMonthList.innerHTML = build_months_list(last_used);
}



/* add new month to DB */
function add_month(evt) {
  evt.preventDefault();			// or we'll try to GET/POST the Form...
  //if (!elemMonthValue.checkValidity()) return false;
  let months = get_months_DB();
  const m=elemMonthValue.value;
  if (months.indexOf(m) > -1) return false;	// do not allow duplicates
  console.debug ('Adding month', m);
  months.push(m);
  set_months_DB(months);

  /* update DB and table shown on screen */
  set_default_month_DB(m);
  show_list(m);

  /* clear field and prepare to enter new value */
  elemMonthValue.value = '';
  elemMonthValue.focus();
  return false;
}


/* select new default month, and update display */
function change_default_month() {
  const m = elemMonthList.value;	/* selected element in list */
  if (!m) return;
  console.debug('chaning default month to', m);
  elemSelectedMonth.innerHTML = m;
  set_default_month_DB(m);
  show_list(m);
}
