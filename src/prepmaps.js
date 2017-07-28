import cheerio from 'cheerio'
import fs from 'fs'
import maptemplate from './src/templates/wahlkreise.html!text'
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

export default async function prepmaps(data) {
    var demographics = await rp({
        uri: 'https://interactive.guim.co.uk/docsdata-test/15ntsjQYzDuH4HMMpp28cpN3lCLpkIpsDl3r5ADlLC8k.json',
        json: true
    });
    var pd = demographics.sheets.popdensity;
    var $ = cheerio.load(maptemplate);
    var wks = Array.from($('path'));
    wks.forEach(function(w){
        var result = data.find(function(r) {return cleannumber(r.Wkr) == $(w).attr('id')});
        $(w).addClass(`gv-const-winner-${result.constituency_winner}`)
    })
    /* commenting out population density stuff
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
