$.fn.dtable = function (options) {

    var settings = $.extend({
        pageLimit: 10,
        header: true,
        pages: true,
        filter: true
    }, options)

    var table = this;
    tableParent = table.parent()
    var currentPage, pageLimit, numberPages, numberRows, tbody, bodyRows, filterable, paginatable, headers

    currentPage = 1
    pageLimit = settings.pageLimit
    filterable = settings.filter
    paginatable = settings.pages
    headers = settings.header
    tbody = table.children('tbody')[0]
    bodyRows = tbody.rows
    numberRows = bodyRows.length
    numberPages = Math.ceil(numberRows / pageLimit)

    if (filterable) {
        var newDiv = document.createElement("DIV")
        newDiv.classList.add('input-group')
        newDiv.classList.add('py-1')
        newDiv.style.cssText = 'width:50%; float:right;'
        var input = document.createElement("INPUT")
        input.classList.add('form-control')
        input.setAttribute('placeholder', 'filter')
        input.classList.add('table-filter')
        newDiv.appendChild(input)
        table.remove()
        tableParent.append(newDiv)
        tableParent.append(table)
    }

    if (headers) {
        var headerCells = table[0].rows[0].cells
        for (var i = 0; i < headerCells.length; i++) {
            var sorticon = document.createElement("I")
            sorticon.classList.add("fas")
            sorticon.classList.add("fa-sort")
            sorticon.classList.add('px-1')
            headerCells[i].appendChild(sorticon)
            headerCells[i].style.cursor = 'pointer'
            headerCells[i].classList.add("dtable-col")
            headerCells[i].setAttribute("data-sorted", "none")
        }
    }

    if (paginatable) {
        //add pagination buttons
        var buttonHolder = document.createElement("NAV")
        buttonHolder.style.float = 'right'
        var ul = document.createElement("UL")
        ul.classList.add("pagination")
        var prev = document.createElement("LI")
        prev.classList.add("page-item")
        var prevlink = document.createElement("A")
        prevlink.classList.add("btn")
        prevlink.classList.add("btn-outline-primary")
        // prevlink.classList.add("page-link")
        prevlink.classList.add("prev-page")
        prevlink.setAttribute('href', '#')
        prevlink.innerHTML = "<"
        prev.append(prevlink)

        var next = document.createElement("LI")
        next.classList.add("page-item")
        var nextlink = document.createElement("A")
        nextlink.classList.add("btn")
        nextlink.classList.add("btn-outline-primary")
        nextlink.classList.add("next-page")
        nextlink.setAttribute('href', '#')
        nextlink.innerHTML = ">"
        next.append(nextlink)

        ul.append(prev)

        //span container for page number buttons on pagination
        var numbtns = document.createElement("SPAN")
        numbtns.style.cssText = "display: inline-flex;"
        //add pages to pagination
        for (var i = 1; i < numberPages + 1; i++) {
            var p = document.createElement("LI")
            p.classList.add('page-item')
            p.addEventListener('click', goToPage.bind(this, i))
            var plink = document.createElement("A")
            plink.classList.add('btn')
            plink.classList.add("btn-outline-primary")
            plink.setAttribute("href", '#')
            plink.innerHTML = i
            p.append(plink)
            numbtns.append(p)
        }
        ul.append(numbtns)
        ul.append(next)
        buttonHolder.append(ul)
        tableParent.append(buttonHolder)

        paginate();
    }

    function paginate() {

        if (filterable) {
            var filterInput = table.parent().children("div").children("input")
            var filterValue = filterInput[0].value
        }
        var filteredRows = []
        for (var i = 0; i < bodyRows.length; i++) {
            bodyRows[i].style.display = 'none'
        }

        if (filterable) {
            if (filterValue != "") {
                numberRows = 0
                for (var i = 0; i < bodyRows.length; i++) {
                    if (bodyRows[i].innerText.toLowerCase().includes(filterValue.toLowerCase())) {
                        numberRows++
                        filteredRows.push(bodyRows[i])
                    }
                }

            } else {
                numberRows = bodyRows.length
                filteredRows = bodyRows
            }
        } else {
            numberRows = bodyRows.length
            filteredRows = bodyRows
        }
        numberPages = Math.ceil(numberRows / pageLimit)
        renumberPagination()

        var loopUntil
        if (currentPage * pageLimit < filteredRows.length) {
            loopUntil = currentPage * pageLimit
        } else {
            loopUntil = filteredRows.length
        }

        for (var i = (currentPage - 1) * pageLimit; i < loopUntil; i++) {

            if (filterable) {
                if (filteredRows[i].innerText.toLowerCase().includes(filterValue.toLowerCase())) {
                    filteredRows[i].style.display = ''
                }
            } else {
                filteredRows[i].style.display = ''
            }
        }


    }

    function renumberPagination() {
        var child = numbtns.lastElementChild
        while (child) {
            numbtns.removeChild(child)
            child = numbtns.lastElementChild
        }

        if (currentPage == 1) {
            prevlink.classList.add("disabled")
        } else {
            prevlink.classList.remove("disabled")
        }

        if (currentPage == numberPages) {
            nextlink.classList.add("disabled")
        } else {
            nextlink.classList.remove("disabled")
        }

        for (var i = 1; i < numberPages + 1; i++) {
            var p = document.createElement("LI")
            p.classList.add('page-item')
            p.classList.add('page-num-btn')
            p.setAttribute('number',i)
            var plink = document.createElement("A")
            plink.classList.add('btn')
            plink.classList.add("btn-outline-primary")
            if (i == currentPage) {
                plink.classList.add("active")
            }
            plink.setAttribute("href", '#')
            plink.innerHTML = i
            p.append(plink)
            numbtns.append(p)
        }
    }

    function goToPage(page) {
        currentPage = page
        paginate()
    }

    $(document).ready(function () {

        $(document).on('click', '.page-num-btn', function(event){
            event.preventDefault();
            let n = $(this).attr('number')
            console.log(n)
            goToPage(n)
        })

        $(document).on('click', '.next-page', function (event) {
            event.preventDefault();
            if (currentPage < numberPages) {
                currentPage++;
            } else {
                currentPage = numberPages
            }
            paginate()
        })

        $(document).on('click', '.prev-page', function (event) {
            event.preventDefault();
            if (currentPage > 1) {
                currentPage--
            } else {
                currentPage = 1
            }
            paginate()

        })


        //handler for filtering table by keyword
        $(document).on('keyup', '.table-filter', function () {
            currentPage = 1
            paginate()
        })

        //handler for sorting tables
        $(document).on('click', '.dtable-col', function () {
            var table, rows, switching, i, x, y, shouldSwitch;
            switching = true;

            table = this.parentElement.parentElement.parentElement

            var sortedAsc = false
            var ths = table.rows[0].cells
            var colidx = 0
            for (var i = 0; i < ths.length; i++) {
                if (this == ths[i]) colidx = i
            }

            if (this.getAttribute("data-sorted") === "asc") {
                this.setAttribute("data-sorted", "desc")
                sortedAsc = true
            } else {
                this.setAttribute("data-sorted", "asc")
            }

            while (switching) {
                switching = false;
                rows = table.rows
                if (sortedAsc) {
                    for (i = 1; i < rows.length; i++) {
                        shouldSwitch = false;

                        x = rows[i].getElementsByTagName("TD")[colidx];
                        y = rows[i + 1].getElementsByTagName("TD")[colidx];

                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                } else {
                    for (i = 1; i < rows.length; i++) {
                        shouldSwitch = false;

                        x = rows[i].getElementsByTagName("TD")[colidx];
                        y = rows[i + 1].getElementsByTagName("TD")[colidx];

                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }

            }
        })
    })
}
