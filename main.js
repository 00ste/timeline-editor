let events = [];

function init_canvas() {
    let canvas = document.getElementById("canvas_timeline");
    let context = canvas.getContext("2d");

    canvas.width  = 1000;
    canvas.height = 400;

    return { 'canvas': canvas, 'context': context };
}

function draw_timeline(canvas, context) {
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.stroke();
}

function draw_all(canvas, context) {
    draw_timeline(canvas, context);
}

function main() {
    let c = init_canvas();
    draw_all(c['canvas'], c['context']);
}

function add_event_handler() {
    // Get values of fields
    let name  = document.getElementById("input_event_name" ).value;
    let date  = document.getElementById("input_event_date" ).value;
    let color = document.getElementById("input_event_color").value;
    console.log(`Adding event with name = ${name}, date = ${date.toString()}, color " ${color}`);

    // Add to inner list
    events.push({ 'name': name, 'date': date, 'color': color });

    // Add to table
    document.getElementById("tbody_events").innerHTML += `<tr> <td>${name}</td> <td>${date.toString()}</td> <td><div style="margin: 1em; backgroundColor: ${color}"-></div></td> </tr>`;
}