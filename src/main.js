// VARIABLES DECLARATIONS
/*  
  I wanted to implement the possibility to choose the month of year
  so I made this and show first the current month. Right now, it's manually put the February 19th 2019 like in the screenshot and I'll use the JSON the fetch the data 
*/
var $days = [];
var $lines = [];
const colorscheme = [
  '#00b8b4',
  '#00d3cd',
  '#ffa24c',
  '#fbd100',
  '#54c0f2',
  '#894268'
];
const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
// Pick the day of 19th February 2019 for the example
const today = new Date(2019, 1, 19);
const todayDay = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();
var selectMonth = todayMonth;
var selectYear = todayYear;

// STARTING CODE
/* Code to prep the gantt view and collapse all the extend tasks */
showGanttMonth(todayMonth, todayYear);
$('.gantt-secondrow').addClass('ht0');

// EVENTS HANDLERS
$('#nav-goprev').click(() => {
  selectMonth = checkMonth(selectMonth - 1);
  showGanttMonth(selectMonth, selectYear);
});
$('#nav-gotoday').click(() => {
  selectMonth = todayMonth;
  selectYear = todayYear;
  showGanttMonth(selectMonth, selectYear);
});
$('#nav-gonext').click(() => {
  selectMonth = checkMonth(selectMonth + 1);
  showGanttMonth(selectMonth, selectYear);
});

//  Functions
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
  return [start, ...range(start + 1, end)];
}
function intersect(arrA, arrB) {
  return arrA.filter(x => arrB.includes(x));
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
  $('.gantt-row__days').append(`<div class="gantt-row__first"></div>`);

  // START SHOWING GANTT VIEW

  // DISPLAY THE MONTH AND VERTICAL LINES
  const selectMonthName = month[selectMonth];
  const nbDays = daysInMonth(selectMonth, selectYear);

  $('.maingrid-item__month').append(`${selectMonthName} ${selectYear}`);

  for (let i = 1; i <= nbDays; i++) {
    $days.push(`<span>${i}</span>`);
    $lines.push(`<span></span>`);
  }
  $('.gantt-row__days').css({
    gridTemplateColumns: `250px repeat(${nbDays}, minmax(20px, 1fr))`
  });
  $('.gantt-row__lines').css({
    gridTemplateColumns: `252px repeat(${nbDays}, minmax(20px, 1fr))`
  });

  $('.gantt-row__days').append($days);
  $('.gantt-row__lines').append($lines);

  if (selectMonth === todayMonth && selectYear === todayYear) {
    $(`.gantt-row__lines span:nth-child(${todayDay + 1})`).addClass('marker');
  }
  // SHOW THE TASKS
  // FETCH DATA from DATA_GANTT.JSON AND DISPLAY
  fetch('./assets/data_gantt.json')
    .then(res => res.json())
    .then(data => {
      const tasksList = [];
      data.records.forEach(t => {
        const newTask = {
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
      });
      // MODIFY THE DATA for FAV and STRIPES to reflet the screenshot
      tasksList.find(task => task.id == 6).stripes = true;
      tasksList.find(task => task.id == 5).fav = true;
      tasksList.find(task => task.id == 5).favColor = '#f9ad2d';
      tasksList.find(task => task.id == 2).fav = true;
      tasksList.find(task => task.id == 2).favColor = '#ea5f5c';
      tasksList.find(task => task.id == 14).fav = true;
      tasksList.find(task => task.id == 14).favColor = '#00a843';

      // SEPARATE tasks by group
      let tasksGroups = tasksList.reduce((acc, curr) => {
        acc[curr.group] = [...(acc[curr.group] || []), curr];
        return acc;
      }, {});

      // Iterating Tasks Group to HTML
      Object.keys(tasksGroups).forEach(group => {
        $('#gantt-view').append(`
          <div id="${group.toLowerCase()}-group" class="gantt-view-group">
            <div class="gantt-row gantt-firstrow">
              <div class="gantt-row__first">
                <div class="rowline-button">
                  <i class="far fa-minus-square"></i>
                  <i class="far fa-plus-square d-none"></i>
                  ${group}
                </div>
              </div>
              <ul id="${group.toLowerCase()}-compress" class="gantt-row__bars gantt-row__compress">

              </ul>
            </div>
            <div class="gantt-row gantt-secondrow">
              <div class="gantt-row__first"></div>
              <ul class="gantt-row__bars gantt-row__extend">
              </ul>
            </div>
          </div>
        `);

        // ADD GRID COORDINATES BY TASK
        tasksGroups[group].forEach(task => {
          const startDateTask = new Date(task.startdate);
          const endDateTask = new Date(task.stopdate);

          // CALCULATION from DATE to GRID-COLUMN
          let startLine = null;
          let endLine = null;
          // START DATE GRID
          if (startDateTask.getHours() < 11) {
            // why split in half at 11 and not 12 ?
            startLine = startDateTask.getDate() * 2 - 1;
          } else if (
            startDateTask.getHours() >= 11 &&
            startDateTask.getHours() < 23
          ) {
            startLine = startDateTask.getDate() * 2;
          } else {
            startLine = startDateTask.getDate() * 2 + 1;
          }
          // STOP DATE GRID
          if (endDateTask.getHours() < 11) {
            // why split in half at 11 and not 12 ?
            endLine = endDateTask.getDate() * 2;
          } else if (
            endDateTask.getHours() >= 11 &&
            endDateTask.getHours() < 23
          ) {
            endLine = endDateTask.getDate() * 2 + 1;
          } else {
            endLine = endDateTask.getDate() * 2 + 2;
          }
          task.gridstart = startLine;
          task.gridstop = endLine;
        });
        // SORTING tasks by grid start coordinates then by date
        tasksGroups[group].sort((a, b) => {
          if (a.gridstart === b.gridstart) {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
          }
          aDate = new Date(a.startdate);
          bDate = new Date(b.startdate);
          if (aDate < bDate) return -1;
          if (aDate > bDate) return 1;
        });
        // CALCULATE THE GRAY TASKS OVERLAPSES
        let grayTasks = [];
        const nbDays = daysInMonth(selectMonth, selectYear);
        var taskArray = [];
        tasksGroups[group].forEach(task => {
          const startDateTask = new Date(task.startdate);
          if (startDateTask.getMonth() === selectMonth) {
            taskArray.push(range(task.gridstart, task.gridstop - 1));
          }
        });

        // CREATE ARRAY OF COUNTER
        for (let i = 0; i < nbDays * 2; i++) {
          taskArray.forEach(arr => {
            arr.forEach(n => {
              if (i === n) {
                grayTasks[i - 1] += 1;
              }
            });
          });
          grayTasks.push(0);
        }
        // FIND THE START & STOP OF GROUPS and APPEND
        let prevN = 0;
        grayTasks.forEach((n, i) => {
          $(`#${group.toLowerCase()}-compress`).append(`
              <li id="graybar-${i +
                1}" class="bar-compress" style="background-color:rgba(100,100,100, .${n})">${n}
              </li>
            `);
          if (n !== 0 && prevN === 0) {
            $(`#graybar-${i + 1}`).addClass('first-graybar');
          } else if (n === 0 && prevN !== 0) {
            $(`#graybar-${i}`).addClass('last-graybar');
          }

          prevN = n;
        });

        //  APPEND THE TASKS IN GANTT GRID
        tasksGroups[group].forEach(task => {
          const startDateTask = new Date(task.startdate);
          if (startDateTask.getMonth() === selectMonth) {
            $(`#${group.toLowerCase()}-group ul.gantt-row__extend`).append(`
            <li class="pop" data-container="body" data-toggle="popover" data-placement="bottom" style="grid-column: ${
              task.gridstart
            }/${task.gridstop};">
              <div class="bar-text">${task.name}</div>
              <div class="bar-favmark" style="background-color: ${
                task.fav ? task.favColor : 'none'
              }"></div> 
              <div class="bar-fill ${
                task.stripes ? 'stripes' : ''
              }" style="background-color: ${colorscheme[task.color]}; width: ${
              task.progress
            }%;"></div>
              <div class="bar-bg" style="background-color: ${
                colorscheme[task.color]
              }; filter: brightness(1.1)"></div>
            </li>
          `);
          }
        });
      });

      // TOGGLE COLLAPSE / EXPAND SECOND ROW
      $('.rowline-button').click(e => {
        const secondRow = $(e.currentTarget)
          .parent()
          .parent()
          .next();
        $(e.currentTarget)
          .children()
          .toggleClass('d-none');
        $(secondRow).toggleClass('ht0');
      });

      // POPOVER for each tasks to create "plan existing and create button"
      $('.pop')
        .popover({
          trigger: 'manual',
          html: true,
          animation: false,
          sanitize: false,
          content: () => {
            return $('#popover_content_wrapper').html();
          }
        })
        .on('mouseenter', function() {
          var _this = this;
          $(this).popover('show');
          $('.popover').on('mouseleave', function() {
            $(_this).popover('hide');
          });
          $('.task-button').click(function(e) {
            console.log($(this).data('event'), 'on', e.currentTarget);
          });
        })
        .on('mouseleave', function() {
          var _this = this;
          setTimeout(function() {
            if (!$('.popover:hover').length) {
              $(_this).popover('hide');
            }
          }, 100);
        });
    })
    .catch(err => {
      console.log(err);
    });
}
