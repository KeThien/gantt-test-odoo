"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// VARIABLES DECLARATIONS

/*  
  I wanted to implement the possibility to choose the month of year
  so I made this and show first the current month. Right now, it's manually put the February 19th 2019 like in the screenshot and I'll use the JSON the fetch the data 
*/
var $days = [];
var $lines = [];
var colorscheme = ['#00b8b4', '#00d3cd', '#ffa24c', '#fbd100', '#54c0f2', '#894268'];
var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Pick the day of 19th February 2019 for the example

var today = new Date(2019, 1, 19);
var todayDay = today.getDate();
var todayMonth = today.getMonth();
var todayYear = today.getFullYear();
var selectMonth = todayMonth;
var selectYear = todayYear; // STARTING CODE

/* Code to prep the gantt view and collapse all the extend tasks */

showGanttMonth(todayMonth, todayYear); // $('.gantt-secondrow').addClass('ht0');
// EVENTS HANDLERS

$('#nav-goprev').click(function () {
  selectMonth = checkMonth(selectMonth - 1);
  showGanttMonth(selectMonth, selectYear);
});
$('#nav-gotoday').click(function () {
  selectMonth = todayMonth;
  selectYear = todayYear;
  showGanttMonth(selectMonth, selectYear);
});
$('#nav-gonext').click(function () {
  selectMonth = checkMonth(selectMonth + 1);
  showGanttMonth(selectMonth, selectYear);
}); //  Functions

function checkMonth(selectMonth) {
  if (selectMonth < 0) {
    selectYear--;
    return 11;
  } else if (selectMonth > 11) {
    selectYear++;
    return 0;
  } else {
    return selectMonth;
  }
}

function range(start, end) {
  if (start === end) return [start];
  return [start].concat(_toConsumableArray(range(start + 1, end)));
}

function intersect(arrA, arrB) {
  return arrA.filter(function (x) {
    return arrB.includes(x);
  });
}

function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function showGanttMonth(selectMonth, selectYear) {
  // RESET
  $days = [];
  $lines = [];
  $('.maingrid-item__month').empty();
  $('.gantt-row__days').empty();
  $('.gantt-row__lines').empty();
  $('#gantt-view').empty();
  $('.gantt-row__days').append("<div class=\"gantt-row__first\"></div>"); // START SHOWING GANTT VIEW
  // DISPLAY THE MONTH AND VERTICAL LINES

  var selectMonthName = month[selectMonth];
  var nbDays = daysInMonth(selectMonth, selectYear);
  $('.maingrid-item__month').append("".concat(selectMonthName, " ").concat(selectYear));

  for (var i = 1; i <= nbDays; i++) {
    $days.push("<span>".concat(i, "</span>"));
    $lines.push("<span></span>");
  }

  $('.gantt-row__days').css({
    gridTemplateColumns: "250px repeat(".concat(nbDays, ", minmax(20px, 1fr))")
  });
  $('.gantt-row__lines').css({
    gridTemplateColumns: "252px repeat(".concat(nbDays, ", minmax(20px, 1fr))")
  });
  $('.gantt-row__days').append($days);
  $('.gantt-row__lines').append($lines);

  if (selectMonth === todayMonth && selectYear === todayYear) {
    $(".gantt-row__lines span:nth-child(".concat(todayDay + 1, ")")).addClass('marker');
  } // SHOW THE TASKS
  // FETCH DATA from DATA_GANTT.JSON AND DISPLAY


  fetch('./assets/data_gantt.json').then(function (res) {
    return res.json();
  }).then(function (data) {
    var tasksList = [];
    data.records.forEach(function (t) {
      var newTask = {
        id: t.id,
        startdate: t.x_studio_startdate,
        stopdate: t.x_studio_stopdate,
        group: t.x_studio_g1,
        color: t.x_studio_color,
        name: t.x_name,
        progress: t.x_studio_progress,
        fav: false,
        stripes: false,
        favColor: null
      };
      tasksList.push(newTask);
    }); // MODIFY THE DATA for FAV and STRIPES to reflet the screenshot

    tasksList.find(function (task) {
      return task.id == 6;
    }).stripes = true;
    tasksList.find(function (task) {
      return task.id == 5;
    }).fav = true;
    tasksList.find(function (task) {
      return task.id == 5;
    }).favColor = '#f9ad2d';
    tasksList.find(function (task) {
      return task.id == 2;
    }).fav = true;
    tasksList.find(function (task) {
      return task.id == 2;
    }).favColor = '#ea5f5c';
    tasksList.find(function (task) {
      return task.id == 14;
    }).fav = true;
    tasksList.find(function (task) {
      return task.id == 14;
    }).favColor = '#00a843'; // SEPARATE tasks by group

    var tasksGroups = tasksList.reduce(function (acc, curr) {
      acc[curr.group] = [].concat(_toConsumableArray(acc[curr.group] || []), [curr]);
      return acc;
    }, {}); // Iterating Tasks Group to HTML

    Object.keys(tasksGroups).forEach(function (group) {
      $('#gantt-view').append("\n          <div id=\"".concat(group.toLowerCase(), "-group\" class=\"gantt-view-group\">\n            <div class=\"gantt-row gantt-firstrow\">\n              <div class=\"gantt-row__first\">\n                <div class=\"rowline-button\">\n                  <i class=\"far fa-minus-square\"></i>\n                  <i class=\"far fa-plus-square d-none\"></i>\n                  ").concat(group, "\n                </div>\n              </div>\n              <ul id=\"").concat(group.toLowerCase(), "-compress\" class=\"gantt-row__bars gantt-row__compress\">\n\n              </ul>\n            </div>\n            <div class=\"gantt-row gantt-secondrow\">\n              <div class=\"gantt-row__first\"></div>\n              <ul class=\"gantt-row__bars gantt-row__extend\">\n              </ul>\n            </div>\n          </div>\n        ")); // ADD GRID COORDINATES BY TASK

      tasksGroups[group].forEach(function (task) {
        var startDateTask = new Date(task.startdate);
        var endDateTask = new Date(task.stopdate); // CALCULATION from DATE to GRID-COLUMN

        var startLine = null;
        var endLine = null; // START DATE GRID

        if (startDateTask.getHours() < 11) {
          // why split in half at 11 and not 12 ?
          startLine = startDateTask.getDate() * 2 - 1;
        } else if (startDateTask.getHours() >= 11 && startDateTask.getHours() < 23) {
          startLine = startDateTask.getDate() * 2;
        } else {
          startLine = startDateTask.getDate() * 2 + 1;
        } // STOP DATE GRID


        if (endDateTask.getHours() < 11) {
          // why split in half at 11 and not 12 ?
          endLine = endDateTask.getDate() * 2;
        } else if (endDateTask.getHours() >= 11 && endDateTask.getHours() < 23) {
          endLine = endDateTask.getDate() * 2 + 1;
        } else {
          endLine = endDateTask.getDate() * 2 + 2;
        }

        task.gridstart = startLine;
        task.gridstop = endLine;
      }); // SORTING tasks by grid start coordinates then by date

      tasksGroups[group].sort(function (a, b) {
        if (a.gridstart === b.gridstart) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
        }

        aDate = new Date(a.startdate);
        bDate = new Date(b.startdate);
        if (aDate < bDate) return -1;
        if (aDate > bDate) return 1;
      }); // CALCULATE THE GRAY TASKS OVERLAPSES

      var grayTasks = [];
      var nbDays = daysInMonth(selectMonth, selectYear);
      var taskArray = [];
      tasksGroups[group].forEach(function (task) {
        var startDateTask = new Date(task.startdate);

        if (startDateTask.getMonth() === selectMonth) {
          taskArray.push(range(task.gridstart, task.gridstop - 1));
        }
      }); // CREATE ARRAY OF COUNTER

      var _loop = function _loop(_i) {
        taskArray.forEach(function (arr) {
          arr.forEach(function (n) {
            if (_i === n) {
              grayTasks[_i - 1] += 1;
            }
          });
        });
        grayTasks.push(0);
      };

      for (var _i = 0; _i < nbDays * 2; _i++) {
        _loop(_i);
      } // FIND THE START & STOP OF GROUPS and APPEND


      var prevN = 0;
      grayTasks.forEach(function (n, i) {
        $("#".concat(group.toLowerCase(), "-compress")).append("\n              <li id=\"graybar-".concat(i + 1, "\" class=\"bar-compress\" style=\"background-color:rgba(100,100,100, .").concat(n, ")\">").concat(n, "\n              </li>\n            "));

        if (n !== 0 && prevN === 0) {
          $("#graybar-".concat(i + 1)).addClass('first-graybar');
        } else if (n === 0 && prevN !== 0) {
          $("#graybar-".concat(i)).addClass('last-graybar');
        }

        prevN = n;
      }); //  APPEND THE TASKS IN GANTT GRID

      tasksGroups[group].forEach(function (task) {
        var startDateTask = new Date(task.startdate);

        if (startDateTask.getMonth() === selectMonth) {
          $("#".concat(group.toLowerCase(), "-group ul.gantt-row__extend")).append("\n            <li class=\"pop\" data-container=\"body\" data-toggle=\"popover\" data-placement=\"bottom\" style=\"grid-column: ".concat(task.gridstart, "/").concat(task.gridstop, ";\">\n              <div class=\"bar-text\">").concat(task.name).concat(task.id, "</div>\n              <div class=\"bar-favmark\" style=\"background-color: ").concat(task.fav ? task.favColor : 'none', "\"></div> \n              <div class=\"bar-fill ").concat(task.stripes ? 'stripes' : '', "\" style=\"background-color: ").concat(colorscheme[task.color], "; width: ").concat(task.progress, "%;\"></div>\n              <div class=\"bar-bg\" style=\"background-color: ").concat(colorscheme[task.color], "; filter: brightness(1.1)\"></div>\n            </li>\n          "));
        }
      });
    }); // TOGGLE COLLAPSE / EXPAND SECOND ROW

    $('.rowline-button').click(function (e) {
      var secondRow = $(e.currentTarget).parent().parent().next();
      $(e.currentTarget).children().toggleClass('d-none');
      $(secondRow).toggleClass('ht0');
    }); // POPOVER for each tasks to create "plan existing and create button"

    $('.pop').popover({
      trigger: 'manual',
      html: true,
      animation: false,
      sanitize: false,
      content: function content() {
        return $('#popover_content_wrapper').html();
      }
    }).on('mouseenter', function () {
      var _this = this;

      $(this).popover('show');
      $('.popover').on('mouseleave', function () {
        $(_this).popover('hide');
      });
      $('.task-button').click(function (e) {
        console.log($(this).data('event'), 'on', e.currentTarget);
      });
    }).on('mouseleave', function () {
      var _this = this;

      setTimeout(function () {
        if (!$('.popover:hover').length) {
          $(_this).popover('hide');
        }
      }, 100);
    });
  })["catch"](function (err) {
    console.log(err);
  });
}