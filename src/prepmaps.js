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



export default async function prepmaps(constituency, raw) {
    var $ = cheerio.load(maptemplate);
    var wks = Array.from($('path'));
    // Add class for constituency winner
    wks.forEach(function (w) {
        var result = constituency.find(function (r) { return cleannumber(r.Wkr) == $(w).attr('id') });
        if (result != undefined) {
            $(w).addClass(`gv-const-winner-${result.constituency_winner}`)
            $(w).attr('data-name', `${result.Wahlkreisname}`)
        }

    })
    // Add class for SPD share
    wks.forEach(function (w) {
        var rawresult = raw.find(function (r) {
            return cleannumber(r.wkr) == $(w).attr('id')
        });
        if (rawresult != undefined) {
            var spdshare = 100 * (rawresult.SPD_Zweitstimmen / rawresult.Gültige_Zweitstimmen);

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
