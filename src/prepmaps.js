import cheerio from 'cheerio'
import fs from 'fs'
import maptemplate from './src/templates/wahlkreisewithlabels.html!text'
import rp from 'request-promise'

function cleannumber(input) {
    if (typeof input == "string") {
        input = input.replace(/,/g, "");
        return parseFloat(input);
    }
    if (typeof input == "number") {
        return input;
    }
}

 function cleanup(constituencies) {
     constituencies.forEach(function(constituency){
    switch (constituency.constituencyWinner) {
        case '2' : constituency.constituencyWinnerParty = "CDU";
        break;
        case '1' : constituency.constituencyWinnerParty = "SPD";
        break;
        case '34' : constituency.constituencyWinnerParty = "linke";
        break;
        case '5' : constituency.constituencyWinnerParty = "greens";
        break;
        case '3' : constituency.constituencyWinnerParty = "CSU";
        break;
        default : "undeclared"
    }
    })

} 

export default async function prepmaps(seats) {

    cleanup(seats);
    var $ = cheerio.load(maptemplate);
    var wks = Array.from($('path'));
    // Add class for constituency winner
    wks.forEach(function (w) {
        var result = seats.find(function (r) { return cleannumber(r.id) == $(w).attr('id') });
        if (result != undefined) {
            $(w).addClass(`gv-const-winner-${result.constituencyWinnerParty}`)
            $(w).attr('data-name', `${result.Wahlkreisname}`)
        }

    })
     // Add class for SPD share
     wks.forEach(function (w) {
        var result = seats.find(function (r) {
            return cleannumber(r.id) == $(w).attr('id')
        });
        if (result != undefined){
        var spdvote = result.zweitstimmen.find(function(z){
            return z.party == 'SPD';
        })
        var spdshare = spdvote.percent;

            $(w).attr('data-spdshare', `${spdshare}`)

            if (spdshare >= 40) {
                $(w).addClass('gv-spd-band-4');
            } else if (spdshare < 40 && spdshare >= 30) {
                $(w).addClass('gv-spd-band-3');
            } else if (spdshare < 30 && spdshare >= 20) {
                $(w).addClass('gv-spd-band-2');
            } else {
                $(w).addClass('gv-spd-band-1')
            }

        }

    })  
     //Add class for AfD share
 wks.forEach(function (w) {
        var result = seats.find(function (r) {
            return cleannumber(r.id) == $(w).attr('id')
        });
      
        if (result != undefined){
        var afdvote = result.zweitstimmen.find(function(z){
            return z.party == 'AfD';
        })
        var afdshare = afdvote.percent;

            $(w).attr('data-afdshare', `${afdshare}`)

            if (afdshare >= 40) {
                $(w).addClass('gv-afd-band-4');
            } else if (afdshare < 40 && afdshare >= 30) {
                $(w).addClass('gv-afd-band-3');
            } else if (afdshare < 30 && afdshare >= 20) {
                $(w).addClass('gv-afd-band-2');
            } else {
                $(w).addClass('gv-afd-band-1')
            }

        }

    })  

    /* commenting out population density stuff
    var demographics = await rp({
        uri: 'https://interactive.guim.co.uk/docsdata-test/15ntsjQYzDuH4HMMpp28cpN3lCLpkIpsDl3r5ADlLC8k.json',
        json: true
    });
    var pd = demographics.sheets.popdensity;
    wks.forEach(function(w){
        var demodata = pd.find(function(d) {return cleannumber(d.wkr) == $(w).attr('id');})
        $(w).attr('data-density',demodata.popdensity);
        var opacityvalue;
        switch (demodata.quartilevalue) {
            case "1": opacityvalue = .25;
            break;
            case "2": opacityvalue =.5;
            break;
            case "3": opacityvalue = .75;
            break;
            case "4": opacityvalue = 1;
            break;
        }
        $(w).css('opacity',opacityvalue);
    })
    */
    fs.writeFileSync("./.build/resultsmap.html", $.html())
    return $.html();
}
