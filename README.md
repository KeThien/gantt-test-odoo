# Odoo test by Ke Thien

## Introduction

[**DEMO**](https://nostalgic-hawking-eeafec.netlify.com/) deployed on Netlify
If you want, you can copy the git project. [Instruction here](#getting-started)

It's part of the hiring process where I got some directives and recreate like in the screenshot

## Notes

I decided to generate the gantt view page with the json api that come with the brief and not just make the html css.

I wanted to use Vue.js framework but I change my mind to a more classic method. With gulp as an automation build and dev server tool because I thought the brief didn't mention the use of a framework.

So I installed gulp package (yarn / npm) with Bootstrap 4 along with jQuery, Sass, Fontawesome and more.

The HTML / CSS structure was made in CSS GRID and Bootstrap
The gantt bars was also made with CSS GRID and generated by javascript for each grid placement.
I needed to use grid-auto-flow to make the bars packed up like in the screenshot
I used "fetch" for the json API to sort tasks by date and then by id to be in order.

In index.html, there is still some tags of the structure for the bars but get removed by the function .empty() by the js file (and jQuery). It was made like this to reset the gantt view when we want to change the month (via buttons).

In the main.js file, I add manually for the demo purpose that why can fav a task and select a color. There is also the possibility to add the stripes class.

I made a second input "Secondary" in the json to show that it works with the API if there is multiple group (but it's better with an id than the way I did with the group name)

## Difficulties

One of my difficult task was to generate the tags html for each tasks bar and put it in the grid.
The vertical lines of the grid needed to be dynamic because I wanted to make the app possible to change the month and take the right number of days in the month.

I had some really difficulties with the gray tasks bars because I didn't find out who to properly made it. I made some guess right now and it's not perfect, but you can see the number of overlaping bars.

Make the popover to work was another challenge because the popovers with bootstrap are made to be activated with a click of a button and not on hover

## My comments

### What do you find good/bad about this screen ?

I like the colors and it's very clear to read. Except for the gray tasks bar, e.g. the 1's are very light.
For the colorscheme I don't know what it means. Is it per person or customizable ?

### What would you improve/ change on it ?

Change the hover on tasks with the "plan existing" and "create" button with a on click button. Because when hovering fast open multiple popover.
Maybe add tag legend for each custom color (like in trello).

For the purpose of the test, I would prefer to have more explicit type of names of tasks than "a", "b" or "agrnlgkrlgrlgklrgk...". Like "task 1", "task 2", etc.

## Technology

SASS
· Babel
· Bootstrap
· Gulp
· JQuery
· PopperJS
· Browsersync

## Getting Started

### Dependencies

_**Note:** if you've previously installed Gulp globally, run `npm rm --global gulp` to remove it. [Details here.](https://medium.com/gulpjs/gulp-sips-command-line-interface-e53411d4467)_

Make sure these are installed first.

- [Node.js](http://nodejs.org)
- [Gulp Command Line Utility](http://gulpjs.com)

  `npm install --global gulp-cli`

### Quick Start

1. Clone the repo :

   `git clone https://github.com/KeThien/gantt-test-odoo.git`

2. In bash/terminal/command line, `cd gantt-test-odoo.git` into project directory.
3. Run `npm install` to install required files and dependencies.
4. Launch the `development environment` with :

   `gulp`

   then, navigate to http://localhost:3000

Note: **For Production, Use:**

```
gulp build
```

This will build files and assets to `dist` directory.
