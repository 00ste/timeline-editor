let events = [];

let canvas = document.getElementById("canvas_timeline");
let context = canvas.getContext("2d");

canvas.width  = 1000;
canvas.height = 400;

// The scale is the number of days that are visible on the timeline.
let scale  = 650;
// The offset is the x coordinate of today on the screen.
let offset = canvas.width / 2;

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// ====================== DRAW FUNCTIONS ======================

function draw_timeline() {
    context.fillStyle = "black";

    // Draw timeline
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.stroke();

    // Determine scale
    let day_step   = canvas.width / scale;
    let month_step = 28  * day_step;

    // Draw scale
    context.font = "0.8em system-ui";
    if (day_step > 25) {
        let date = new Date();
        console.log(`Day step: ${day_step}, drawing days`);
        for (let x = offset; x < canvas.width; x += day_step) {
            // Line
            context.moveTo(x, canvas.height / 2 + 5);
            context.lineTo(x, canvas.height / 2 - 5);
            context.stroke();

            // Label
            context.fillText(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, x, canvas.height / 2 + 20);

            date = date.addDays(1);
        }
        date = new Date();
        date = date.addDays(-1);
        for (let x = offset - day_step; x > 0; x -= day_step) {
            // Line
            context.moveTo(x, canvas.height / 2 + 5);
            context.lineTo(x, canvas.height / 2 - 5);
            context.stroke();

            // Label
            context.fillText(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, x, canvas.height / 2 + 20);

            date = date.addDays(-1);
        }
        return;
    }
    if (month_step > 45) {
        console.log(`Day step: ${day_step}, month step: ${month_step}, drawing months`);
        let date = new Date();
        for (let x = offset; x < canvas.width; x += day_step) {
            if (date.getDate() == 1) {
                // Line
                context.moveTo(x, canvas.height / 2 + 5);
                context.lineTo(x, canvas.height / 2 - 5);
                context.stroke();

                // Label
                context.fillText(`${date.getFullYear()}-${date.getMonth() + 1}`, x, canvas.height / 2 + 20);
            }
            date = date.addDays(1);
        }
        date = new Date();
        date = date.addDays(-1);
        for (let x = offset; x > 0; x -= day_step) {
            if (date.getDate() == 1) {
                // Line
                context.moveTo(x, canvas.height / 2 + 5);
                context.lineTo(x, canvas.height / 2 - 5);
                context.stroke();

                // Label
                context.fillText(`${date.getFullYear()}-${date.getMonth() + 1}`, x, canvas.height / 2 + 20);
            }
            date = date.addDays(-1);
        }
    }
    else {
        console.log(`Day step: ${day_step}, month step: ${month_step}, drawing years`);
        let date = new Date();
        for (let x = offset; x < canvas.width; x += day_step) {
            if (date.getDate() == 1 && date.getMonth() == 0) {
                // Line
                context.moveTo(x, canvas.height / 2 + 5);
                context.lineTo(x, canvas.height / 2 - 5);
                context.stroke();

                // Label
                context.fillText(`${date.getFullYear()}`, x, canvas.height / 2 + 20);
            }
            date = date.addDays(1);
        }
        date = new Date();
        date = date.addDays(-1);
        for (let x = offset; x > 0; x -= day_step) {
            if (date.getDate() == 1 && date.getMonth() == 0) {
                // Line
                context.moveTo(x, canvas.height / 2 + 5);
                context.lineTo(x, canvas.height / 2 - 5);
                context.stroke();

                // Label
                context.fillText(`${date.getFullYear()}`, x, canvas.height / 2 + 20);
            }
            date = date.addDays(-1);
        }
    }
}

function draw_event(event) {
    // TODO: Implement this
    console.log(`draw_event: drawing event ${event['name']}`);
}

function draw_all() {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    draw_timeline(canvas, context);

    for (let event of events) {
        draw_event(event);
    }
}

// ====================== EVENT HANDLERS ======================

function add_event_handler() {
    // Get values of fields
    let name  = document.getElementById("input_event_name" ).value;
    let date  = document.getElementById("input_event_date" ).value;
    let color = document.getElementById("input_event_color").value;
    console.log(`Adding event with name = ${name}, date = ${date.toString()}, color " ${color}`);

    // Add to inner list
    events.push({ 'name': name, 'date': date, 'color': color });

    // Add to table
    document.getElementById("tbody_events").innerHTML += `
        <tr>
            <td>${name}</td>
            <td>${date.toString()}</td>
            <td style="background-color: ${color}"></td>
        </tr>`;
    
    // Trigger redraw
    draw_all();
}