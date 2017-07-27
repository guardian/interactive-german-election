import mainTemplate from './src/templates/main.html!text'
import rp from "request-promise"
import config from '../config.json'
import mustache from 'mustache'

export async function render() {

    var data = await rp({
        uri: config.docDataJson,
        json: true
    })
    var html = mustache.render(mainTemplate,data.sheets); 
    return html;
}
