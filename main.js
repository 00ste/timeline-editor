let events = [];

let canvas = document.getElementById("canvas_timeline");
let context = canvas.getContext("2d");

canvas.width  = 1000;
canvas.height = 400;

X_MIN = -canvas.width  / 2;
X_MAX =  canvas.width  / 2;
Y_MIN = -canvas.height / 2;
Y_MAX =  canvas.height / 2;

// The scale is the number of days that are visible on the timeline.
let scale  = 120.0;
let scroll_speed = 0.03;
// The offset is the x coordinate of today on the screen.
let offset = 0.0;

// Levels of precision
const PRECISION_DD  = 0;    // Days are indicated as lines and labelled
const PRECISION_DM  = 1;    // Days are indicated as lines but only months are labelled
const PRECISION_MM  = 2;    // Months are indicated as lines and labelled
const PRECISION_MY  = 3;    // Months are indicated as lines but only years are labelled
const PRECISION_YY  = 4;    // Years are indicated as lines and labelled
const PRECISION_Y5Y = 5;    // Years are indicated as lines but only one year every 5 years is labelled
const PRECISION_LEVELS = 6;

// ====================== UTILITY FUNCTIONS ======================

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.date_text_yyyymmdd = function() {
    return `${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()}`;
}

Date.prototype.date_text_yyyymm = function() {
    return `${this.getFullYear()}-${this.getMonth() + 1}`;
}

function draw_line(start_x, start_y, end_x, end_y) {
    context.moveTo(start_x + canvas.width / 2, start_y + canvas.height / 2);
    context.lineTo(end_x   + canvas.width / 2, end_y   + canvas.height / 2);
    context.stroke();
}

function draw_text(text, x, y) {
    context.fillText(text, x + canvas.width / 2, y + canvas.height / 2);
}

// ====================== DRAW FUNCTIONS ======================

function draw_timeline() {
    // Draw timeline
    context.fillStyle   = "black";
    context.strokeStyle = "black";
    draw_line(X_MIN, 0, X_MAX, 0);

    // Determine scale
    let day_step   = canvas.width / scale;
    let month_step = 28  * day_step;
    let year_step  = 365 * day_step;

    // Draw scale
    context.font = "0.8em system-ui";

    // Calculate left-most line of scale
    let start = offset;
    let date = new Date();
    while (start - day_step >= X_MIN) {
        start -= day_step;
        date = date.addDays(-1);
    }

    // Draw lines of scale from left to right
    // PRECISION_DD
    if (day_step > 60) {
        console.log(`Precision level DD`);
        for (let x = start; x < X_MAX; x += day_step) {
            draw_line(x, 5, x, -5);
            draw_text(date.date_text_yyyymmdd(), x, 20);

            date = date.addDays(1);
        }
    }
    // PRECISION_DM
    else if (day_step > 45) {
        console.log(`Precision level DM`);
        for (let x = start; x < X_MAX; x += day_step) {
            if (date.getDate() == 1) {
                draw_line(x, 5, x, -5);
                draw_text(date.date_text_yyyymm(), x, 20);
            }
            else {
                draw_line(x, 3, x, -3);
            }

            date = date.addDays(1);
        }
    }
    // PRECISION_MM
    else if (month_step > 60) {
        console.log(`Precision level MM`);
        for (let x = start; x < X_MAX; x += day_step) {
            if (date.getDate() == 1) {
                draw_line(x, 5, x, -5);
                draw_text(date.date_text_yyyymm(), x, 20);
            }

            date = date.addDays(1);
        }
    }
    // PRECISION_MY
    else if (month_step > 45) {
        console.log(`Precision level MY`);
        for (let x = start; x < X_MAX; x += day_step) {
            if (date.getDate() == 1) {
                if (date.getMonth() == 0) {
                    draw_line(x, 5, x, -5);
                    draw_text(date.getFullYear(), x, 20);
                }
                else {
                    draw_line(x, 3, x, -3);
                }
            }

            date = date.addDays(1);
        }
    }
    else if (year_step > 60) {
        console.log(`Precision level YY`);
        for (let x = start; x < X_MAX; x += day_step) {
            if (date.getDate() == 1 && date.getMonth() == 0) {
                draw_line(x, 5, x, -5);
                draw_text(date.getFullYear(), x, 20);
            }

            date = date.addDays(1);
        }
    }
    // PRECISION_Y5Y
    else {
        console.log(`Precision level Y5Y`);
        for (let x = start; x < X_MAX; x += day_step) {
            if (date.getDate() == 1 && date.getMonth() == 0) {
                if (date.getFullYear() % 5 == 0) {
                    draw_line(x, 5, x, -5);
                    draw_text(date.getFullYear(), x, 20);
                }
                else {
                    draw_line(x, 3, x, -3);
                }
            }

            date = date.addDays(1);
        }
    }

    date = date.addDays(1);
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

canvas.addEventListener('wheel', (e) => {
    scale += scroll_speed * e.deltaY;
    console.log(`Scroll with deltaY = ${e.deltaY}, new scale is ${scale}`);
    draw_all();
});