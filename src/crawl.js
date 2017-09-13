var rp = require('request-promise')
var user = 'medien'
var password = 'A4MV!ds2017rl'
var url = 'https://service.bundeswahlleiter.de/medien/daten/'
var fs = require('fs')
var xmlparse = require('pixl-xml')
var localdatadir = './data/daten/'
var dataoutdir = './data/data-out/'
var monster = [];
var constituencyWinners = [];
var seats = [];
var bundSummary = {};
var tidy = {}

//var base64encodedData = new Buffer(user + ':' + password).toString('base64');
//TODO take this out into a config file or something for security reasons
var shortcut = 'bWVkaWVuOkE0TVYhZHMyMDE3cmw='



var wahlkreislisting = fs.readdirSync(localdatadir).filter(function (f) { return f.substring(0, 4) == 'erg3' })

var dedupedwahlkreislisting = wahlkreislisting.filter(function (w) {
    var matches = wahlkreislisting.filter(function (m) {
        return m.substring(0, 10) == w.substring(0, 10);
    })
    matches.sort().reverse();
    matches.forEach(function (m) {
        if (matches.indexOf(m) != 0 && w == m) {
            w = 'X' + w;
        }
    })
    return w.substring(0, 1) != 'X';
})

function formatPartyList(listinput, targetArray) {
    if (!targetArray) {
        var ownArray = []
    };
    listinput.forEach(function (p) {
        if (Array.isArray(p.Stimmergebnis) == true) {
            p.listVote = p.Stimmergebnis.find(function (a) {
                return a.Stimmart == 'LISTE';
            });
        } else if (p.Stimmergebnis.Stimmart == 'LISTE') {
            p.listVote = p.Stimmergebnis;
        }
        if (p.listVote != undefined) {
            var zs =
                {
                    party: p.Name,
                    percent: p.listVote.Prozent,
                    percentChange: p.listVote.ProzentDifferenz
                }
            if (targetArray) {
                targetArray.push(zs);
            } else {
                ownArray.push(zs);
            };
        }

    })
    return ownArray;


}

dedupedwahlkreislisting.forEach(function (f) {
    var kreis = {};
    kreis.zweitstimmen = [];
    kreis.filename = f;
    kreis.id = kreis.filename.substring(7, 10);
    kreis.raw = xmlparse.parse(fs.readFileSync(localdatadir + f, 'utf8'));
    kreis.result = kreis.raw.Gebietsergebnis[2];
    kreis.partyresults = kreis.result.Gruppenergebnis.filter(function (g) {
        return g.Gruppenart == "PARTEI";
    });

    formatPartyList(kreis.partyresults, kreis.zweitstimmen);
    kreis.constituencyWinner = kreis.result.Direktergebnis.Gewinner[0].Gruppe;
    monster.push(kreis);
    constituencyWinners.push({
        id: kreis.id,
        winner: kreis.constituencyWinner
    })
    seats.push({
        id: kreis.id,
        constituencyWinner: kreis.constituencyWinner,
        zweitstimmen: kreis.zweitstimmen
    })
    fs.writeFileSync(dataoutdir + kreis.id + '.json', JSON.stringify(kreis))
})

var latestdate = Math.max.apply(Math, monster.map(function (o) { return parseInt(o.raw.WahlMetadaten.File.ErstellungszeitMillis); }))
var latestentry = monster.find(function (o) {
    return parseInt(o.raw.WahlMetadaten.File.ErstellungszeitMillis) == latestdate
})

bundSummary = {
    declared: latestentry.raw.WahlMetadaten.Lauf.Stimmeingabe.Eingabestand.AuswertungseinheitenEingegangen,
    parties: formatPartyList(latestentry.raw.Gebietsergebnis[0].Gruppenergebnis.filter(function (g) {
        return g.Gruppenart == "PARTEI";
    }))
}

tidy = {
    bundSummary,
    seats
}


fs.writeFileSync(dataoutdir + 'monster.json', JSON.stringify(monster));
fs.writeFileSync(dataoutdir + 'tidy.json', JSON.stringify(tidy));
