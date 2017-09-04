import mainTemplate from './src/templates/main.html!text'
import coalitionTemplate from './src/templates/coalition.html!text'
import rp from "request-promise"
import config from '../config.json'
import mustache from 'mustache'
import prepmaps from './prepmaps.js'
import testdata from './tidy.json'
import constituency_winners from './constituencyWinners.json'



function twodecimals(input) {
    return Math.round(input * 100) / 100;
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
    console.log(seats);
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

function prepSummaryData(testdata) {

    var summary = testdata.bundSummary;
    //    console.log(summary.parties);

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
            p.seatsdisplay = twodecimals(p.seatspercent);

        };
        switch (p.party) {
            case "DIE LINKE": p.displayname = "Die Linke";
                break;
            case "GRÜNE": p.displayname = "Greens";
                break;
            case "CDUCSU": p.displayname = "CDU/CSU";
                break;
            default: p.displayname = p.party;
        }
        p.votesdisplay = twodecimals(p.percent);

    })

    return summary;
}

export async function render() {

    var data = await rp({
        uri: config.docDataJson,
        json: true
    })
    await prepmaps(constituency_winners, data.sheets.raw);
    var preppeddata = prepSummaryData(testdata);
    var coalitions = createCoalitions(testdata.seats);
    var templatedata = {
        "seats": preppeddata.parties,
        "coalitions" : coalitions,
        "copy": data.sheets.copy
    }
    var html = mustache.render(mainTemplate, templatedata, partialTemplates);
    return html;
}
