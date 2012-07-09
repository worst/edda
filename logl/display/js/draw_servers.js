// Copyright 2009-2012 10gen, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


generate_coords = function(count, names) {

    var r = 200;
    var w = canvases["server"].width;
    var centerw = w/2;
    var h = canvases["server"].height;
    var centerh = h/2;

    var xVal = 0;
    var yVal = 0;

    var even = false;

    var prevX = 0;
    var prevY = 0;

    switch(count) {
    case 0:
    return;
    case 1:
    // one centered server
    servers[names[0]] = { "x" : w/2, "y" : h/2, "r" : 50, "on" : false, "type" : "primary" };
    return;
    case 2:
    // two servers, one on either side
    servers[names[0]] = {"x" : w/3, "y" : h/2, "r" : 50, "on" : false, "type" : "primary"};
    servers[names[1]] = {"x" : (0.66)*w, "y" : h/2, "r" : 50, "on" : false, "type" : "primary"};
    return;
    }

    if (count % 2 === 0)
        start_angle = 45;
    else
        start_angle = 90;

    for (var i = 0; i < count; i++) {
        if (i % 2 === 0)
            r /= 2;
        else
            r *= 2;
        r = 200;
        xVal = (r * Math.cos(start_angle * (Math.PI)/180)) + centerw;
        yVal = (r * Math.sin(start_angle * (Math.PI)/180)) + centerh;

        servers[names[i]] = { "x" : xVal, "y" : yVal, "r" : 360/(count*1.5), "on" : false, "type" : "primary"};
        start_angle += 360/count;

    }
    return;
};


primary = function(x, y, r, ctx) {
    // draw a primary server with radius r centered at (x, y)
     // draw a green circle with a yellow stroke
    circle(x, y, r, "#24B314", "#F0E92F", 18, ctx);
    // add the crown
    crown(x, (y - 0.22*r), 0.6*r, 0.5*r, ctx);
};


down = function(x, y, r, ctx) {
    // draw a down server
    ctx.globalAlpha = 0.4; // 40% opacity
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 360, false);
    ctx.lineWidth = 9;
    ctx.strokeStyle = "#9A9A9A";
    ctx.fillStyle = "#515151";
    ctx.fill();
    ctx.globalAlpha = 1; // full opacity
    //ctx.stroke();

    // generate dotted outline
    var a = 0;
    var b = 0.05;
    while (b <= 2) {
    ctx.beginPath();
    ctx.arc(x, y, r, a*Math.PI, b*Math.PI, false);
    ctx.stroke();
    a += 0.08;
    b += 0.08;
        }
};


arbiter = function(x, y, r, ctx) {
    // draw an arbiter centered at (x, y) with radius r

    // draw bottom white circle
    ctx.beginPath();

    ctx.lineWidth = 5;

    ctx.arc(x, y, r, 0, 360, false);
    ctx.fillStyle = "#BFB1A4";
    ctx.fill();

    // draw stripes
    // right stripe
    ctx.fillStyle = "#33312F";
    ctx.beginPath();
    ctx.arc(x, y, r, -0.4 * Math.PI, -0.25 * Math.PI, false);
    ctx.lineTo(x + r * Math.sin(0.25 * Math.PI), y + r * Math.sin(45));
    ctx.arc(x, y, r, 0.25 * Math.PI, 0.4 * Math.PI, false);
    ctx.lineTo(x + r * Math.cos(0.4 * Math.PI), y - r * Math.sin(0.4 * Math.PI));
    ctx.fill();

    // left stripe
    ctx.beginPath();
    ctx.arc(x, y, r, -0.6 * Math.PI, -0.75 * Math.PI, true);
    ctx.lineTo(x - r * Math.sin(0.25 * Math.PI), y + r * Math.sin(45));
    ctx.arc(x, y, r, -1.25*Math.PI, -1.4*Math.PI, true);
    ctx.lineTo(x - r * Math.cos(0.4 * Math.PI), y - r * Math.sin(0.4*Math.PI));
    ctx.fill();

    // top circle, just for outline
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 360, false);
    ctx.strokeStyle = "#1A1007";
    ctx.stroke();

};

circle = function(x, y, r, fill, stroke, wt, ctx) {
    // draw a circle with given qualities
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x,y, r, 0, 360, false);
    ctx.lineWidth = wt;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.fill();
};

user = function(x, y, r, ctx) {
    // draw a user circle with radius r centered at (x, y)
    circle(x, y, r, "#93191C", "#AF434B", 5, ctx);
};

secondary = function(x, y, r, ctx) {
    // draw a secondary server with radius r centered at (x, y)
    // draw a green circle with a
    circle(x, y, r, "#24B314", "#196E0F", 18, ctx);
};

rollback = function(x, y, r, ctx) {
    // draw a blue circle with radius r centered at (x, y)
    circle(x, y, r, "#3D57BF", "#8095E8", 18, ctx);
};

recovering = function(x, y, r, ctx) {
    // draw a RECOVERING server
    circle(x, y, r, "#167D6F", "#4CBAAC", 18, ctx);
};

startup = function(x, y, r, ctx) {
    // draw a server in startup1
    circle(x, y, r, "white", "blue", 18, ctx);
};

startup2 = function(x, y, r, ctx) {
    // draw a server in startup2
    circle(x, y, r, "white", "red", 18, ctx);
};

fatal = function(x, y, r, ctx) {
    // draw a red circle with radius r centered at (x, y)
    // this server is in a FATAL state
    circle(x, y, r, "#FF0000", "#850404", 18, ctx);
};

removed = function(x, y, r, ctx) {
    // draw a removed server
    // empty with a dark brown outline
    circle(x, y, r, "white", "#3B1E0B", 18, ctx);
};

undiscovered = function(x, y, r, ctx) {
    // draw an UNDISCOVERED server
    // brown background, thin black outline
    //    circle(x, y, r, "#4E3629", "3B1E0B", 5, ctx);
    circle(x, y, r, "#4E3629", "#3B1E0B", 5, ctx);
};


unknown = function(x, y, r, ctx) {
    // draw a server in an UNKNOWN state
    // this is a light grey circle with a darker grey outline
    // and a large question mark in the center
    circle(x, y, r, "#BFBFBF", "#737373", 18, ctx);
    ctx.font = "45pt Helvetica";
    ctx.fillStyle = "#737373";
    ctx.fillText("?", x - r/3, y + r/3);
};

lock = function(x, y, r, ctx) {
    // draw a lock over a locked server
};

crown = function(x, y, w, h, ctx) {
    // draw a crown with center spike at (x, y)
    // with width w and height h
    // fill yellow
    ctx.beginPath();
    ctx.moveTo(x, y);
    // right side
    ctx.lineTo(x + w/5, y + h/2);
    ctx.lineTo(x + (2*w/5), y + h/5);
    ctx.lineTo(x + (3*w/5), y + (0.55)*h);
    ctx.lineTo(x + w, y + h/5);
    ctx.lineTo(x + (2*w/3), y + h);
    // left side
    ctx.lineTo(x - (2*w/3), y + h);
    ctx.lineTo(x - w, y + h/5);
    ctx.lineTo(x - (3*w/5), y + 0.55*h);
    ctx.lineTo(x - (2*w/5), y + h/5);
    ctx.lineTo(x - w/5, y + h/2);
    ctx.lineTo(x, y);
    // set fills and line weights
    ctx.lineWidth = 2; // consider setting dynamically for scaling
    ctx.lineJoin = "miter";
    ctx.stroke();
    ctx.fillStyle = "#F0E92F";
    ctx.fill();
};

