
var xhr = new XMLHttpRequest;

xhr.open('GET','<%= path %>/resultsmap.html',false);
xhr.send();
var maphtml = xhr.responseText;

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



var mapdivs = [].slice.apply(document.querySelectorAll('.gv-elex-map-graphic'));
mapdivs.forEach(function(mapdiv) {
    mapdiv.innerHTML = maphtml;
    
})

var depts = document.querySelectorAll("path");
var tooltip = document.querySelector(".gv-fe-tooltip");

Array.from(depts).forEach(dept => {
    dept.addEventListener("mouseover", function(event){
        var deptname = dept.getAttribute('data-name');
        var deptspd = dept.getAttribute('data-spdshare');
        var deptafd = dept.getAttribute('data-afdshare');
        var deptcdu = dept.getAttribute('data-cdushare');
        
        tooltip.innerHTML = dept.getAttribute('data-name') + '<br/ >SPD: ' + deptspd + '<br/ >AfD: ' + deptafd + '<br/ >CDU/CSU: ' + deptcdu;
        tooltip.style.top = (event.layerY) + "px";
        tooltip.style.left = (event.layerX) + "px";
        tooltip.style.display = "block";
    })
})
