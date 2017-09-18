import mainTemplate from './src/templates/main.html!text'
import coalitionTemplate from './src/templates/coalition.html!text'
import mapsTemplate from './src/templates/maps.html!text'
import rp from "request-promise"
import baseconfig from '../config.json'
import exitpollconfig from '../exitpollconfig.json'

const config = process.argv[3] == '--exitpoll' ? exitpollconfig : baseconfig;

import mustache from 'mustache'
import prepmaps from './prepmaps.js'
import crawl from './crawl.js'

//uncomment the following to use a precooked tidy json and not crawl the local data for each build
//import data2 from './src/data/data-out/tidy.json!text'
//var data = JSON.parse(data2)



var partialTemplates = {
    "coalitions": coalitionTemplate,
    "maps" : mapsTemplate
}

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
        cleannumber(p.percent) < 5 ? p.excluded = true : p.excluded = false;
        p.displayseatshare = twodecimals(p.percent);
    })
    var cumulativeleft = 0;
    for (var i = 0; i < seats.length; i++) {
        seats[i].left = cumulativeleft;
        cumulativeleft += cleannumber(seats[i].percent);
    }
    return seats;
}

function prepSummaryData(data) {

    var summary = data.bundSummary;
    var cdu = summary.parties.find(function (p) {
        return p.party == 'CDU'
    });
    var csu = summary.parties.find(function (p) {
        return p.party == 'CSU'
    });
    var combinedpercent = cleannumber(cdu.percent) + cleannumber(csu.percent);
    var combinedpercentchange = cleannumber(cdu.percentChange) + cleannumber(csu.percentChange)
    var cducsu = {
        party: "CDUCSU",
        percent: combinedpercent,
        percentChange: combinedpercentchange
    }
    // Add combined party to list
    summary.parties.unshift(cducsu);
    // Remove individual parties from list
    summary.parties = summary.parties.filter(function (p) {
        return p.party !== 'CSU' && p.party !== 'CDU' && cleannumber(p.percent) > 2.5;
    })
    var bundestagtotal = 0;
    summary.parties.forEach(function (p) {
        if (cleannumber(p.percent) >= 5) {
            bundestagtotal += cleannumber(p.percent);
        }
    })
    summary.parties.map(function (p) {
        p.partyclass = p.party.replace(" ", "").toLowerCase();
        if (cleannumber(p.percent) >= 5) {
            p.seatspercent = 100 * (cleannumber(p.percent) / cleannumber(bundestagtotal))
            p.seatsdisplay = twodecimals(p.seatspercent).toFixed(1);

        };
        switch (p.party) {
            case "DIE LINKE": p.displayname = "Die Linke";
                break;
            case "GRÜNE": p.displayname = "Grüne";
                break;
            case "CDUCSU": p.displayname = "CDU/CSU";
                break;
            default: p.displayname = p.party;
        }
        switch (p.party) {
            case "DIE LINKE": p.gloss = "Radical left";
            p.seats2013 = 10.1;
                break;
            case "GRÜNE": p.gloss = "Greens";
            p.seats2013 = 10.0;
                break;
            case "CDUCSU": p.gloss = "Conservatives";
            p.seats2013 = 49.3;
                break;
            case "SPD": p.gloss = "Social democrats";
            p.seats2013 = 30.6;
                break;
            case "FDP": p.gloss = "Liberals";
            p.seats2013 = 0;
                break;
            case "AfD": p.gloss = "Anti-immigrant";
            p.seats2013 = 0;
                break;

                default: p.displayname = p.party;
        }

        p.votesdisplay = twodecimals(p.percent).toFixed(1);
        p.changedisplay = p.percentChange >= 0 ? '+' + twodecimals(p.percentChange): twodecimals(p.percentChange);

    })

    return summary;
}

export async function render() {

    var docsdata = await rp({
        uri: config.docDataJson,
        json: true
    })
    var data = await crawl();
    await prepmaps(data.seats,docsdata.sheets.wk_names);
    var preppeddata = prepSummaryData(data);
    if (config.exitpoll == true) {
        var coalitions = createCoalitions(docsdata.sheets.exitpoll,docsdata.sheets.permutations);
        var seats = docsdata.sheets.exitpoll;    
     }
    else {
        var coalitions = createCoalitions(data.bundSummary.parties,docsdata.sheets.permutations);
        var seats = preppeddata.parties;    
    }
    var templatedata = {
        "declared" : data.bundSummary.declared,
        "seats": seats,
        "coalitions" : coalitions,
        "copy": docsdata.sheets.copy,
    }
    if (config.exitpoll == true) { 
        templatedata.exitpoll = true };
    var html = mustache.render(mainTemplate, templatedata, partialTemplates);
    return html;
}
