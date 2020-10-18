/*
    Module: show list of tasks for specified month category

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

const elemSecList = document.getElementById('sec_list');
const elemTableList = document.getElementById('table_body');
const elemNewTask = document.getElementById('btn_new_task');
const elemShowTotals = document.getElementById('btn_totals');

/* returns number of minutes worked between start and end,
   taking into account possible midnight wrap and break times */
function calc_minutes(start, end, breaks) {
    let [s_h, s_m] = start.split(':');
    let [e_h, e_m] = end.split(':');
    let [b_h, b_m] = breaks.split(':');

    let s_total = Number(s_h) * 60 + Number(s_m);
    let e_total = Number(e_h) * 60 + Number(e_m);
    let b_total = Number(b_h) * 60 + Number(b_m);

    let diff_min = e_total - s_total;
    if (diff_min < 0) diff_min += 24*60;	 	// handle midnight wrap
    diff_min -= b_total;
    return diff_min;
}

// zeroleads the hours:minutes
function format_time(h, m) {
    return ('0'+h).slice(-2) + ':' + ('0'+m).slice(-2);
}

/* returns human readable difference between start and end times, excluding break times */
function time_diff(start, end, breaks) {
    let diff_min = calc_minutes(start, end, breaks);
    if (diff_min < 0) console.error ('worked less than 0 minutes: ' + diff_min)

    let diff_h = Math.floor ( diff_min / 60 );
    let diff_m = diff_min % 60;

    return format_time(diff_h, diff_m);
}

/* build table rows for specified months */
function build_list(month) {
    let tasks = get_tasks_month_DB(month);

    let rows = '';
    for (let i = 0, task; task = tasks[i]; i++) {
        rows += '<tr>';
        rows += '<td>' + task[0] + '</td>';			// date
        rows += '<td>' + task[1] + '</td>';			// start time
        rows += '<td>' + task[2] + '</td>';			// end time
        rows += '<td>' + time_diff(task[1], task[2], task[3]) + '</td>';	// time worked: end-start-breaks
        rows += '<td>' + task[4] + '</td>';			// notes
        rows += '</tr> ';
    }

    return rows;
}

/* show list of tasks for specified month */
function show_list(month) {
    console.debug ('show_list:', month);
    //console.debug ('table_body before:', elemTableList.innerHTML);
    elemTableList.innerHTML = build_list(month);
    //console.debug ('table_body after:', elemTableList.innerHTML);
    elemSecList.style.display = 'block';			// unhide table
}
