import mainTemplate from './src/templates/main.html!text'
import coalitionTemplate from './src/templates/coalition.html!text'
import rp from "request-promise"
import config from '../config.json'
import mustache from 'mustache'
import prepmaps from './prepmaps.js'

function twodecimals(input) {
    return Math.round(input * 10) / 10;
}

var partialTemplates = {
    "coalitions": coalitionTemplate
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

function createCoalitions(data, permutations) {
    var coalitions = [];
    permutations.forEach(function (p) {
        p.parties = p.parties.replace("CDU,","CDU-CSU,")
        var partyArray = p.parties.split(",");
        var outcome = {
            "heading": p.name,
            "gloss": p.longname,
            "filteredlist": data.filter(function (d) {
                return partyArray.indexOf(d.party) >= 0;
            })

        }
        coalitions.push(outcome);
    })
    return coalitions;
}



function getLefts(seats) {
    seats.map(function (p) {
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
    await prepmaps(data.sheets.constituency_winners, data.sheets.raw);
    data.sheets.seats = getLefts(data.sheets.seats);
    var coalitions = createCoalitions(data.sheets.seats, data.sheets.permutations);
    var templatedata = {
        "seats" : data.sheets.seats,
        "coalitions" : coalitions,
        "copy" : data.sheets.copy
    }
    console.log(coalitions[0].filteredlist);
    var html = mustache.render(mainTemplate, templatedata, partialTemplates);
    return html;
}
