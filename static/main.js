// ReachView code is placed under the GPL license.
// Written by Egor Fedorov (egor.fedorov@emlid.com)
// Copyright (c) 2015, Emlid Limited
// All rights reserved.

// If you are interested in using ReachView code as a part of a
// closed source project, please contact Emlid Limited (info@emlid.com).

// This file is part of ReachView.

// ReachView is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ReachView is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ReachView.  If not, see <http://www.gnu.org/licenses/>.

// ####################### HANDLE WINDOW FOCUS/UNFOCUS #######################

var defaultConfigs = ['reach_single_default.conf', 'reach_kinematic_default.conf', 'reach_base_default.conf'];

var isActive = true;

// ############################### MAIN ###############################

$(document).ready(function () {

	if(window.location.hash != '')
		window.location.href = "/";

    // We don't want to do extra work like updating the graph in background
    window.onfocus = true;
    window.onblur = false;

    // SocketIO namespace:
    namespace = "/test";

    // initiate SocketIO connection
    socket = io.connect("http://" + document.domain + ":" + location.port + namespace);

    // say hello on connect
    socket.on("connect", function () {
        socket.emit("browser connected", {data: "I'm connected"});
    });

    // Current active tab
    var active_tab = "Status";

    $("a.tab").click(function () {
        active_tab = $(this).text();

        console.log("Active tab = " + active_tab);
    });

    var chartdata = [{'value':'', 'color':'rgba(255,0,0,0.5)'}, {'value':'', 'color':'rgba(255,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}];
    var chartdata1 = [{'value':'', 'color':'rgba(255,0,0,0.5)'}, {'value':'', 'color':'rgba(255,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}];
    var labeldata = ['', '', '', '', '', '', '', '', '', ''];

    var margin = {top: 30, right: 10, bottom: 30, left: 40};
    //  the size of the overall svg element
    var width = $("#bar-chart").width() - margin.left - margin.right,
        height = 55*5,
        barWidth = width*0.08,
        barOffset = width*0.02;

    var svg = d3.select('#bar-chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style('background', '#dff0d8');

    var yScale = d3.scale.linear()
    .domain([0, 55])
    .range([0, height])
 
    var xScale = d3.scale.ordinal()
        .rangeBands([0, width])

    var verticalGuideScale = d3.scale.linear()
        .domain([0, 55])
        .range([height, 0])
     
    var vAxis = d3.svg.axis()
        .scale(verticalGuideScale)
        .orient('left')
        .ticks(10)
        .tickSize(-width, 0, 0)
     
    var verticalGuide = d3.select('svg').append('g')
    vAxis(verticalGuide)
    verticalGuide.attr('transform', 'translate(' + 30 + ', ' + margin.top + ')')
    verticalGuide.selectAll('path')
        .style({fill: 'none', stroke: "black"})
    verticalGuide.selectAll('line')
        .style({stroke: "rgba(0,0,0,0.2)"})
     

    var hAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
     
    var horizontalGuide = d3.select('svg').append('g')
    hAxis(horizontalGuide)
    horizontalGuide.attr('transform', 'translate(' + 30 + ', ' + (height + margin.top) + ')')
    horizontalGuide.selectAll('path')
        .style({fill: 'none', stroke: "black"})
    horizontalGuide.selectAll('line')
        .style({stroke: "black"});

         var margin = {top: 30, right: 10, bottom: 30, left: 40};
    //  the size of the overall svg element
    var width = $("#bar-chart").width() - margin.left - margin.right,
        height = 55*5,
        barWidth = width*0.08,
        barOffset = width*0.02;

    var roverBars = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .selectAll('rect').data(chartdata)
        .enter().append('rect')
        .style("fill", function(data) { return data.color; })
        .style({stroke: "black"})
        .attr('width', barWidth)
        .attr('height', function (data) {
            return 5*data.value;
        })
        .attr('x', function (data, i) {
            return i * (barWidth + barOffset);
        })
        .attr('y', function (data) {
            return (height - 5*data.value);
        });

    var baseBars = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .selectAll('rect').data(chartdata1)
        .enter().append('rect')
        .style("fill", function(data) { return data.color; })
        .style({stroke: "black"})
        .attr('width', barWidth)
        .attr('height', function (data) {
            return 5*data.value;
        })
        .attr('x', function (data, i) {
            return i * (barWidth + barOffset);
        })
        .attr('y', function (data) {
            return (height - 5*data.value);
        });



    var labels = svg.append("g")
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr("class", "labels")
        .selectAll("text")
        .data(labeldata)
        .enter()
        .append("text")
        .attr("dx", function(d, i) {
            return (i * (barWidth + barOffset)) + barWidth/2-14
        })
        .attr("dy", height + 20)
        .text(function(d) {
            return d;
        });

    $(window).resize(function() {
        var width = $("#bar-chart").width() - margin.left - margin.right;
        
        var barWidth = width*0.08;
        var barOffset = width*0.02;
        svg.attr('width', width + margin.left + margin.right)
        
        roverBars.attr("width", barWidth)
        .attr('x', function (data, i) {
            return i * (barWidth + barOffset);
        })
        baseBars.attr("width", barWidth)
        .attr('x', function (data, i) {
            return i * (barWidth + barOffset);
        })
        labels.attr("dx", function(d, i) {
            return (i * (barWidth + barOffset)) + barWidth/2-14
        })
        vAxis.tickSize(-width, 0, 0)
        vAxis(verticalGuide)

        xScale.rangeBands([0, width])
        hAxis.scale(xScale)
        hAxis(horizontalGuide)
    });

    console.log("SAT GRAPH DEBUG");
    // console.dir(satellite_graph);

    // ####################### HANDLE REACH MODES, START AND STOP MESSAGES #######################

    // handle data broadcast

    socket.on("current state", function(msg) {
        // check if the browser tab and app tab are active

        if(typeof msg.state == "undefined")
            msg.state = 'base';

        console.log("Got message containing Reach state. Currently in " + msg.state + " mode");
        console.log("Current rover config is " + msg.rover.current_config);

        // add current configs to the dropdown menu

        var select_options = $("#config_select");
        var select_options_hidden = $('#config_select_hidden');
        var delete_options_hidden = $('#config_delete_hidden');
        var available_configs_list = $('.available_configs');
        var to_append = "";

        for (var i = 0; i < msg.available_configs.length; i++) {
            if(jQuery.inArray( msg.available_configs[i], defaultConfigs ) >= 0)
                to_append += "<option value='" + msg.available_configs[i] + "' class='default_config'>" + msg.available_configs[i] + "</option>";
            else
                to_append += "<option value='" + msg.available_configs[i] + "' class='extra_config'>" + msg.available_configs[i] + "</option>";
        }

        select_options.html(to_append).trigger("create");
        delete_options_hidden.html(to_append).trigger("create");
        select_options_hidden.html('<option value="custom">New config title</option>' + to_append).trigger("create");

        delete_options_hidden.find('.default_config').remove();

        available_configs_list.val(msg.rover.current_config);

        if (msg.state == "rover") {
            $('input:radio[name="radio_base_rover"]').filter('[value="rover"]').next().click();
        } else if (msg.state == "base") {
            $('input:radio[name="radio_base_rover"]').filter('[value="base"]').next().click();
        }

        if(jQuery.inArray( msg.rover.current_config, defaultConfigs ) >= 0)
            $('#reset_config_button').removeClass('ui-disabled');
        else
            $('#reset_config_button').addClass('ui-disabled');

        if(select_options.find('.extra_config').length != 0)
            $('#delete_config_button').removeClass('ui-disabled');
        else
            $('#delete_config_button').addClass('ui-disabled');

        if(msg.started == 'yes'){
            $('#start_button').css('display', 'none');
            $('#stop_button').css('display', 'inline-block');
            cleanStatus(msg.state, "started");
        }
        else{
            $('#stop_button').css('display', 'none');
            $('#start_button').css('display', 'inline-block');
        }

    });

    socket.on("available configs", function(msg) {
        var select_options = $("#config_select");
        var select_options_hidden = $('#config_select_hidden');
        var delete_options_hidden = $('#config_delete_hidden');
        var available_configs_list = $('.available_configs');
        var oldVal = select_options.val();
        var oldNum = select_options.children('option').length;
        var to_append = "";

        for (var i = 0; i < msg.available_configs.length; i++) {
            if(jQuery.inArray( msg.available_configs[i], defaultConfigs ) >= 0)
                to_append += "<option value='" + msg.available_configs[i] + "' class='default_config'>" + msg.available_configs[i] + "</option>";
            else
                to_append += "<option value='" + msg.available_configs[i] + "' class='extra_config'>" + msg.available_configs[i] + "</option>";
        }

        select_options.html(to_append).trigger("create");
        delete_options_hidden.html(to_append).trigger("create");
        select_options_hidden.html('<option value="custom">New config title</option>' + to_append).trigger("create");
        delete_options_hidden.find('.default_config').remove();

        var newNum = select_options.children('option').length;
    
        if(newNum<oldNum){
            available_configs_list.val('reach_single_default.conf');
            available_configs_list.parent().find('span').html('reach_single_default.conf');
        }
        else if(newNum >= oldNum){
            available_configs_list.val(oldVal);
            available_configs_list.parent().find('span').html(oldVal);
        }

        delete_options_hidden.val(delete_options_hidden.find('option:first-child').val());
        delete_options_hidden.parent().find('span').html(delete_options_hidden.find('option:first-child').val());

        available_configs_list.change();
    });

    // ####################### HANDLE SATELLITE LEVEL BROADCAST #######################

    socket.on("satellite broadcast rover", function(msg) {
        // check if the browser tab and app tab are active
        if ((active_tab == "Status") && (isActive == true)) {
            console.log('');
            console.log('');
            console.log("rover satellite msg received");
            console.log(msg);
            console.log('');
            console.log('');
            
            updateSatelliteGraphRover(msg, roverBars, height, labels);
        
        }
    });

    socket.on("satellite broadcast base", function(msg) {
        // check if the browser tab and app tab are active
        if ((active_tab == "Status") && (isActive == true)) {
            console.log('');
            console.log('');
            console.log("base satellite msg received");
            console.log(msg);
            console.log('');
            console.log('');
            updateSatelliteGraphBase(msg);
        }
    });

    // ####################### HANDLE COORDINATE MESSAGES #######################

    socket.on("coordinate broadcast", function(msg) {
        // check if the browser tab and app tab
        if ((active_tab == "Status") && (isActive == true)) {
            console.log("coordinate msg received");
            updateCoordinateGrid(msg);
        }
    });

    socket.on("current config rover", function(msg) {
    	showRover(msg);
    });

    socket.on("current config base", function(msg) {
    	showBase(msg);
    });

    // end of document.ready
});