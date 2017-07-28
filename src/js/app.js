var xhr = new XMLHttpRequest;

xhr.open('GET','<%= path %>/resultsmap.html',false);
xhr.send();

var maphtml = xhr.responseText;

var mapdiv = document.querySelector('.gv-2013-map');
mapdiv.innerHTML = maphtml;

/*
var depts = document.querySelectorAll(".dept");
var tooltip = document.querySelector(".gv-fe-tooltip");

Array.from(depts).forEach(dept => {
    dept.addEventListener("mouseover", function(event){
        tooltip.innerHTML = dept.getAttribute('data-name');
        tooltip.style.top = (event.layerY) + "px";
        tooltip.style.left = (event.layerX) + "px";
        tooltip.style.display = "block";
    })
})
*/
