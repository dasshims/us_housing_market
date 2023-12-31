let data, margin, svg, lx, ly, region_name, guide_count=1;
const data_link = 'data/State_zhvi_uc_sfrcondo_tier.csv';

const events = {
    2000: "<-- the Dot.com (or Technology) Bubble",
    2003: "<-- Iraq War post 9/11",
    2007: "<-- Sub-Prime Housing Crisis",
    2009: "<-- Global Recession & the Collapse of Wall Street",
    2015: "<-- Chinese stock market crash",
    2016: "<-- Brexit",
    2017: "<-- Bitcoin skyrocketed",
    2020: "<-- Covid hit",
    2021: "Fed cuts Interest rate",
    2023: "<-- 2022-23 Inflation"
}

const acts = {
    2000: '<strong style="color: #1e1c1c">The dot-com bubble :</strong> ' +
        '<br> In the early 2000s, <strong style="color: crimson">the dot-com bubble burst triggered a mild downturn </strong>in the housing sector. '+
        'While not as severe as later recessions to come, it led to a slowdown in home price appreciation and a brief decrease in housing sales also fueled by <strong style="color: crimson">9/11 terroists attack. </strong>'+
        'However, after that the US housing market was on a steady ascent. Economic conditions were favorable, with steady job growth, low-interest rates, ' +
        'and increasing demand for housing.',
    2008: '<strong>The great recession:</strong> ' +
        '<br> The narrative took an unexpected turn in 2008. A financial storm brewed, known as the Great Recession. ' +
        'A perfect storm of <strong style="color: crimson">subprime mortgage crisis, housing bubble, and banking failures</strong> struck the housing market with great force. ' +
        'Foreclosures soared, leading to a glut of unsold homes. ' +
        'Homeowners, once hopeful, faced distressing situations as housing prices plummeted. ' +
        'The once thriving housing market now lay in ruins, leaving countless families with homes worth far less than their mortgages.',
    2020: '<strong>Covid Pandemic:</strong> <br> As the years went by, the housing market gradually recovered from the scars of the Great Recession. ' +
        'But the year 2020 unleashed a wave of economic uncertainties due to <strong style="color: crimson"> covid </strong>. Businesses shuttered, jobs were lost, and the housing market braced for impact. ' +
        'Government-mandated lockdowns and fear of the <strong style="color: crimson">virus led to a slowdown in real estate activity. </strong>' +
        'However, <strong style="color: crimson">record-low interest rates</strong> and a shift towards remote work sparked a housing boom as demand for homes in suburban and rural areas surged, driving up prices and creating a seller\'s market in many regions.'
}

region_name = (new URL(document.location)).searchParams.get("state");

margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 1050 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

async function hideControls() {
    const el_control = document.getElementById('controls');
    console.log(el_control)
    el_control.visibility = 'hidden';
}

async function unHideControls() {
    const element_prev = document.getElementById('controls');
    element_prev.style.visibility = 'visible';
}

async function drawAxisDuringInitialLoad(){
    data = await d3.csv(data_link, function (d) {
        return {date: d3.timeParse("%Y-%m-%d")(d.year), value: d.price, RegionName: d.RegionName, year: d.year}
    });

    await drawAxisForLineChart();
}

async function drawAxisForLineChart() {
    d3.selectAll('svg').selectAll("#x-axis").remove();
    d3.selectAll('svg').selectAll("#y-axis").remove();
    d3.selectAll('svg').selectAll("#x-axis-dash").remove();
    d3.selectAll('svg').selectAll("#y-axis-dash").remove();
    d3.selectAll('svg').selectAll('#cue-text').remove();
    d3.selectAll('svg').selectAll('#x-axis-label').remove();
    d3.selectAll('svg').selectAll('#y-axis-label').remove();

    // data = await d3.csv(data_link, function (d) {
    //     return {date: d3.timeParse("%Y-%m-%d")(d.year), value: d.price, RegionName: d.RegionName, year: d.year}
    // });

    const max_price = d3.max(data, function (d) {
        return d.value;
    })
    const min_price = d3.min(data, function (d) {
        return d.value;
    })
    const max_year = d3.max(data, function (d) {
        return d.year;
    })

    svg = d3.select("#side_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right + 400)
        .attr("height", height + margin.top + margin.bottom + 100)
        .append("g")
        .attr("transform",
            "translate(" + 120 + "," + 40 + ")");
    //"translate(" + margin.left + "," + margin.top + ")");

    lx = d3.scaleTime()
        // .domain(d3.extent(data, function (d) {
        //     return d.date;
        // }))
        .domain([new Date("2000-01-31"), new Date(max_year)])
        .range([0, width + 25]);
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(lx))
        .attr("stroke-width", "1")
        .style("text-anchor", "centre")
        .attr("stroke", "#555353")
        .attr("opacity", "1")
        .style('text-align', 'right')
        .attr('font-family', 'Courier New')
        .attr('font-size', 13)

    ly = d3.scaleLinear()
        .domain([100000, max_price])
        .range([height, 10]);
    svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(ly))
        .attr("stroke-width", "1")
        .style("text-anchor", "end")
        .attr("stroke", "#555353")
        .attr("opacity", "1")
        .attr('font-family', 'Courier New')
        .attr('font-size', 13)

    // Adds the grids
    const INNER_WIDTH = width + 30;
    const INNER_HEIGHT = height - margin.top - margin.bottom + 60;

    const yAxisGrid = d3.axisLeft(ly).tickSize(-INNER_WIDTH).tickFormat('').ticks(10);
    svg.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('id', 'x-axis-dash')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid)
        .attr("stroke-dasharray", "3,3")
        .attr("opacity", ".1")

    const xAxisGrid = d3.axisBottom(lx).tickSize(-INNER_HEIGHT).tickFormat('').ticks(10);
    svg.append('g')
        .attr('id', 'y-axis-dash')
        .data(data)
        .attr('transform', 'translate(0,' + INNER_HEIGHT + ')')
        .call(xAxisGrid)
        .attr("stroke-dasharray", "3,3")
        .attr("opacity", ".1")
        .attr("stroke", function (d) {
            console.log(d.date.getFullYear());
            const red_years = [2020, 2008, 2000]
            if (red_years.includes(d.date.getFullYear())) {
                console.log("match");
                return "#ee1313"
            } else {
                return "#949494"
            }

        })

    svg.append("text")
        .attr("id", "x-axis-label")
        .attr("text-anchor", "start")
        .attr("x", 300)
        .attr("y", height + 50)
        .text("Year")
        .attr("stroke-width", "1")
        .style("text-anchor", "end")
        .attr("stroke", "#555353")
        .attr("opacity", "1")
        .attr('font-family', 'Courier New')
        .attr('font-size', 13)

    svg.append("text")
        .attr("id", "y-axis-label")
        .attr("text-anchor", "end")
        .attr("y", -90)
        .attr("x", -120)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Price in Dollars")
        .attr("stroke-width", "1")
        .style("text-anchor", "end")
        .attr("stroke", "#555353")
        .attr("opacity", "1")
        .attr('font-family', 'Courier New')
        .attr('font-size', 13)
}

async function drawLineChart(region_name, trigger_year) {
    console.log("Inside drawLineChart. RegionName :" + region_name + " year " + trigger_year)

    await addDescriptionForScene(trigger_year)

    if (trigger_year == 2000) {
        year = 2007
    } else if (trigger_year == 2008) {
        year = 2018
    } else {
        year = 2023
    }

    if (region_name == 'ALL') {
        drawAllStates()
    }

    data = await d3.csv(data_link, function (d) {
        return {date: d3.timeParse("%Y-%m-%d")(d.year), value: d.price, RegionName: d.RegionName, year: d.year}
    });

    data = data = data.sort(function (a, b) {
        return d3.ascending(a.date, b.date);
    })

    data = await data.filter(function (d) {
        return d.RegionName == region_name
            && d.date != undefined
            //&& d.date.getFullYear() >= trigger_year - 1
            && d.date.getFullYear() <= year
    })

    await clearLineChart();
    await drawAxisForLineChart();
    await addPaths();
    await addDots();
    //await unHideControls();
    //await addAnnotations();

    await new Promise(r => setTimeout(r, 1000));

    let next_button_name = 'Scene 2'
    if (trigger_year == 2000) {
        const button_2008 = document.getElementById('2008')
        button_2008.style.backgroundColor = 'lightgreen'
        button_2008.disabled = false;
    } else if (trigger_year == 2008) {
        const button_2020 = document.getElementById('2020')
        button_2020.disabled = false;
        button_2020.style.backgroundColor = 'lightgreen'
        button_2020.disabled = false;
        next_button_name = 'Scene 3'
    } else if (trigger_year == 2020) {
        const state_dropdown = document.getElementById('state-dropdown')
        state_dropdown.hidden = false;
        const lable_state_dropdown = document.getElementById('lable-state-dropdown')
        lable_state_dropdown.hidden = false;
    }

    const max_date = d3.max(data, function (d) {
        return d.date;
    })

    region_name = region_name == 'US' ? 'United States Average' : region_name;
    const modal = document.querySelector('#modal')
    modal.classList.add('active')
    const modal_body = document.querySelector('#modal')
    modal_body.style.fontSize = 14;
    modal_body.style.fontWeight = 300;
    modal_body.style.fontFamily = 'Courier New';
    modal_body.style.color = 'black';
    modal_body.style.textAlign = 'left'
    modal_body.style.backgroundColor = 'lightgreen'
    if (trigger_year == 2000) {
        modal_body.innerHTML = 'Showing <strong> Scene 1 </strong> for Region: <strong>'+region_name+'</strong>.' +
            '<br>Click <strong> Scene 2 </strong> button to go to next scene!'
    } else if (trigger_year == 2008) {
        modal_body.innerHTML = 'Showing <strong> Scene 2 </strong> for Region: <strong>'+region_name+'</strong>.' +
            '<br>Click <strong> Scene 3 </strong> button to go to next scene!'
    } else if (trigger_year == 2020) {
        modal_body.innerHTML = '<strong>Scene 3 </strong> for Region: <strong>'+region_name+'</strong> finished!! ' +
            '<br> You can explore more in the data using the <strong>Explore Your State</strong> drop-down list.' +
            '<br> Use the <strong>Clear</strong> button to clear the current chart and <strong>Relead</strong> button to reset!'
    }
    if (max_date.getFullYear() == 2023) {

    } else {

    }

    await new Promise(r => setTimeout(r, 2000));
    const event_el = document.getElementById('events');
    event_el.style.backgroundColor = 'beige'
}

async function addPaths() {
    let paths = svg.append("path")
        .datum(data)
        .attr("id", "line-chart")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("transform", "translate(0,0)")
        .attr("d", d3.line()
            .x(function (d) {
                return lx(d.date)
            })
            .y(function (d) {
                return ly(d.value)
            })
        )
        .attr("stroke-width", "2")
        .attr("opacity", ".8");

    const length = paths.node().getTotalLength();

    paths.attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
        .transition()
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .duration(5000)
        .style("stroke", "steelblue");


    await new Promise(r => setTimeout(r, 4000));
    svg.append('g')
        .classed('labels-group', true)
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr("id", "annotations")
        .attr("x", function (d) {
            return lx(d.date) + 10;
        })
        .attr("y", function (d) {
            return ly(d.value) + 5;
        })
        .text(function (d, i) {
            const curr_year = d.date.getFullYear()
            if (d.date.getMonth() == 2) {
                return events[curr_year]
            }
        })
        .attr("transform", "translate(0,0)")
        .style("text-anchor", "centre")
        .attr("stroke", "dark grey")
        .attr("opacity", "1")
        .style('text-align', 'right')
        .attr('font-family', 'Courier New')
        .attr('font-size', 13)
}

async function clearLineChart() {
    d3.selectAll('svg').selectAll("#line-chart").remove();
    d3.selectAll('svg').selectAll("#line-chart-dots").remove();
    d3.selectAll('svg').selectAll("#annotations").remove();
    d3.selectAll('svg').selectAll("#description-text").remove();
    // d3.selectAll('svg').selectAll("#year-text").remove();
}

async function addDescriptionForScene(year) {
    const event_el = document.getElementById('events');
    event_el.innerHTML += acts[year] + '<br>'
    event_el.scrollTop = event_el.scrollHeight;
    event_el.style.overflow = 'auto';
    event_el.style.fontSize = 14;
    event_el.style.fontWeight = 400;
    event_el.style.fontFamily = 'Courier New';
    event_el.style.color = 'black';
    event_el.style.backgroundColor = 'lightgreen'
}

function getStateFromDropDown() {
    let selectElement = document.getElementById('state-dropdown')
    return selectElement.value;
}

async function drawAllStates() {

    const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

    states.forEach(async state => {
        await clearLineChart();
        await drawLineChart(state);
    })
}

async function addDots() {
    let dots = svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", "line-chart-dots")
        .attr("cx", function (d) {
            return lx(d.date);
        })
        .attr("cy", height);

    dots.transition()
        .duration(0)
        .attr("cx", function (d) {
            return lx(d.date);
        })
        .attr("cy", function (d) {
            return ly(d.value);
        })
        .attr("r", 4)
        .attr("transform", "translate(0,0)")
        .style("fill", "#e6f5ff")
        .attr('opacity', .3)
        .delay(function (d, i) {
            return (i * 20)
        });

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "0")
        .style("visibility", "hidden")
        .style("boarder", "black")
        .text("");

    dots.on("mouseover", function (d, i) {
        d3.select(this)
            .transition()
            .duration('50')
            .attr('opacity', '.8');
        tooltip.html("<br><strong>" + d.RegionName + "</strong>"
            + "<p>Date: " + d.year
            + "<p> Housing Price: " + Math.trunc(d.value));
        tooltip.style('top', d3.event.pageY + 12 + 'px')
        tooltip.style('left', d3.event.pageX + 25 + 'px')
        tooltip.style("opacity", .8)
        tooltip.style('background-color', 'lightgreen')
        tooltip.style('left-padding', 5)

        return tooltip.style("visibility", "visible");
    });

    dots.on("mouseout", function () {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', .1);
        return tooltip.style("visibility", "hidden");
    });
}


async function addAnnotations() {
    const type = d3.annotationLabel
    const annotations = [{
        note: {
            label: "Housing market slows down after Sub-Prime Housing Crisis",
            bgPadding: 20,
            title: "2008"
        },
        //can use x, y directly instead of data
        data: {date: "2008-12-31", close: 185.02},
        className: "show-bg",
        // x: 100,
        y: 50,
        dy: 100,
        dx: 100
        // dy: 137,
        // dx: 162
    }]

    const parseTime = d3.timeParse("%Y-%m-%d")
    const timeFormat = d3.timeFormat("%d-%b-%y")

    const makeAnnotations = d3.annotation()
        .editMode(true)
        .notePadding(15)
        .type(type)
        .accessors({
            x: function (d) {
                console.log(lx(parseTime('2008-12-31')));
                return 100; //lx(parseTime('2008-12-31'))
            },
            y: 50 // function(d) { console.log(d.price); console.log(y(d.price)); return y(d.price)}
        })
        .annotations(annotations)

    /*    const makeAnnotations = d3.annotation()
            .editMode(true)
            //also can set and override in the note.padding property
            //of the annotation object
            .notePadding(15)
            .type(type)
            //accessors & accessorsInverse not needed
            //if using x, y in annotations JSON
            .accessors({
                x: d => x(parseTime(d.date)),
                y: d => y(d.close)
            })
            .accessorsInverse({
                date: d => timeFormat(x.invert(d.x)),
                close: d => y.invert(d.y)
            })
            .annotations(annotations)
            .append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations)*/

    svg.append("g")
        .call(makeAnnotations)
}


function showPopup() {
    console.log("Inside show popup")
    var popup = document.getElementById("myPopup");
    console.log(popup)
    popup.classList.toggle("show");
    popup.hidden = false;

    d3.select('svg')
        .append('text')
        .attr('x', 300)
        .attr('y', 12)
        .attr("class", "box")
        .attr("id", "year-text")
        .attr('text-anchor', 'left')
        .style('font-family', 'Courier New')
        .style('font-size', 16)
        .style('font-weight', 200)
        .style('overflow-wrap', 'break-word')
        .style("color", "#333333")
        .text('Click on button to move to the next scene');
}

function openModal(trigger_year) {
    const modal = document.querySelector('#modal')
    if (modal == null) {
        console.log("model is null")
        return;
    }
    modal.classList.add('active')
    const modal_body = document.querySelector('#modal-body')
    modal_body.body = acts[trigger_year];
}

function closeModal(id) {
    console.log(id)
    let modal = document.querySelector('#' + id)
    modal.classList.remove('active')
}

function closedisplayGuides() {
    if (guide_count < 3) {
        let modal = document.querySelector('#modal_buttons')
        modal.classList.remove('active')
        guide_count = guide_count +1;
        displayGuides(guide_count);
    } else {
        let modal = document.querySelector('#modal_buttons')
        modal.classList.remove('active')
        guide_count = guide_count +1;

        const state_dropdown = document.getElementById('state-dropdown')
        state_dropdown.hidden = true;
        const lable_state_dropdown = document.getElementById('lable-state-dropdown')
        lable_state_dropdown.hidden = true;

        drawLineChart('US', 2000);
    }
}

async function displayGuides(){
    const modal = document.querySelector('#modal_buttons')
    modal.classList.add('active')


    const modal_body = document.querySelector('#modal_buttons_body')
    modal_body.style.fontSize = 14;
    modal_body.style.fontWeight = 400;
    modal_body.style.fontFamily = 'Courier New';
    modal_body.style.color = 'white';
    modal_body.style.textAlign = 'left'
    modal_body.style.backgroundColor = 'red'
    if (guide_count == 1){
        modal_body.innerHTML = 'You can navigate the Scenes here'
        modal.style.top = 160
        modal.style.left = 250
    } else if (guide_count == 2){
        modal_body.innerHTML = "Author's Observations will be be played here"
        modal.style.top = 260
        modal.style.left = 470
    } else {
        modal_body.innerHTML = "Your controls and Parameters will be here"
        modal.style.top = 160
        modal.style.left = 560
        const state_dropdown = document.getElementById('state-dropdown')
        state_dropdown.hidden = false;
        const lable_state_dropdown = document.getElementById('lable-state-dropdown')
        lable_state_dropdown.hidden = false;
    }

}