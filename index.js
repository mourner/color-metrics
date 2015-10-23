var metrics = require('./metrics');

var len = 25;
var colors = [];

// function randomizeColors() {
//     colors = [];
//     for (var i = 0; i < 500; i++) colors.push(randomColor());
// }

function refresh(color) {
    showColors('rgb', metrics.distRGB, color);
    showColors('riergb', metrics.distRieRGB, color);
    showColors('yiq', metrics.distYIQ, color);
    showColors('ciede2000', metrics.distCIEDE2000, color);
}

for (var r = 15; r <= 255; r += 30)
for (var g = 15; g <= 255; g += 30)
for (var b = 15; b <= 255; b += 30) colors.push([r, g, b]);

console.log(colors.length);

// randomizeColors();
refresh();

function showColors(id, compareFn, color) {
    console.time(id);
    var sorted = sortedColors(compareFn, color);
    console.timeEnd(id);

    var container = document.getElementById(id);

    container.innerHTML = '';

    for (var i = 0; i < len; i++) {
        var div = document.createElement('div');
        div.className = 'color';
        div.style.width = (100 / len) + '%';
        div.style.backgroundColor = 'rgb(' + sorted[i].join() + ')';
        div.onclick = onClick;
        container.appendChild(div);
    }
}

function onClick() {
    var c = this.style.backgroundColor.match(/rgb\((\d+), ?(\d+), ?(\d+)\)/);
    refresh([+c[1], +c[2], +c[3]]);
}

function sortedColors(compareFn, color) {
    var unsorted = colors.slice();
    var last = color || [200, 200, 200];
    var sorted = [];

    while (sorted.length < len) {
        var minDist = Infinity,
            minIndex;
        for (var i = 0; i < unsorted.length; i++) {
            var c = unsorted[i];
            var dist = compareFn(last[0], last[1], last[2], c[0], c[1], c[2]);
            if (dist < minDist) {
                minIndex = i;
                minDist = dist;
            }
        }
        sorted.push(unsorted[minIndex]);
        last = unsorted[minIndex];
        unsorted.splice(minIndex, 1);
    }
    return sorted;
}

function randomColor() {
    return [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)];
}
