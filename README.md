# JQuery Data Tables

a lightweight single-file JQuery plugin to transform your HTML tables into sort-able, paginate-able, filterable tables


# Requirements

requires the following:

 - JQuery
 - Bootstrap
 - FontAwesome 5

## Installation

simply download the `table.js` file and put it in your project
`<script src="table.js"></script>` dont forget to reference in your project

## Usage

call `.dtable` on your table using an `id` 
wrap your table in a `<div>`

`<div>
	<table id="my-table">...</table></div>`
	`<script>$("#my-table").dtable()</script>`

## Options

the following options are available for customization:

 - pageLimit: how many rows to show per page (default 10)
 - header: table has header (default true)
 - pages: table with pages (default true)
 - filter: table with filter (default true)

example
 `<script>$("#my-table").dtable({pageLimit: 5, header: false})</script>`

