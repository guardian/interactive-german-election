
var xhr = new XMLHttpRequest;

xhr.open('GET','<%= path %>/resultsmap.html',false);
xhr.send();

var maphtml = xhr.responseText;

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
        tooltip.innerHTML = dept.getAttribute('data-name') + ': SPD share ' + deptspd;
        tooltip.style.top = (event.layerY) + "px";
        tooltip.style.left = (event.layerX) + "px";
        tooltip.style.display = "block";
    })
})
