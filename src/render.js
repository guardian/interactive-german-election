import mainTemplate from './src/templates/main.html!text'
import rp from "request-promise"
import config from '../config.json'
import mustache from 'mustache'
import prepmaps from './prepmaps.js'

function twodecimals(input) {
    return Math.round(input * 10) / 10;
}

function cleannumber(input) {
    if (typeof input == "string") {
        input = input.replace(/,/g, "");
        return parseFloat(input);
    }
    if (typeof input == "number") {
        return input;
    }
}

function getLefts(seats) {
    seats.map(function(p){
        p.seats == 0 ? p.excluded = true : p.excluded = false;
        p.displayseatshare = twodecimals(p.seats_share);
    })
    var cumulativeleft = 0;
    for (var i = 0; i < seats.length; i++) {
        seats[i].left = cumulativeleft;
        cumulativeleft += cleannumber(seats[i].seats_share); 
    }
    return seats;
}

export async function render() {

    var data = await rp({
        uri: config.docDataJson,
        json: true
    })
    await prepmaps(data.sheets.constituency_winners);
    data.sheets.seats = getLefts(data.sheets.seats);
    var html = mustache.render(mainTemplate,data.sheets); 
    return html;
}
