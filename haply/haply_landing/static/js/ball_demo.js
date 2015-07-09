/* This code produces the haplet demo users can play with on the landing page */

$(document).ready(function () {
	// TODO: Once the document has loaded get the canvas size 
	// var width = $("#canvas").width();
	// var height = $("#canvas").height();

	var width = 800, height = 500;

	// This will let us know if the user is moving the stylus around
	//var moving = false;
	
	// The svg canvas we'll be using 
	var svg = d3.selectAll("div.demo").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("id", "svg-canvas");

	/* Create the haplet */

	// Draw the tablet  
	var tablet = function () {
		var tab = {};

		// Variables controlling size
		tab.length = 600;
		tab.width = tab.length / 1.4;
		tab.padding = 35;
		tab.top = {x: (width / 2) - (tab.length / 2), y: 30};
		
		// The black outline of the tablet 
		tab.casing = svg.append("rect")
				.attr("x", tab.top.x)
				.attr("y", tab.top.y)
				.attr("width", tab.length)
				.attr("height", tab.width)
				.attr("rx", 23).attr("ry", 23)
				.style("fill", "black")
				.style("stroke", "grey")
				.style("stroke-width", 2);
		
		// The screen of the tablet 
		tab.screen = svg.append("rect")
					.attr("x", tab.top.x + tab.padding)
					.attr("y", tab.top.y + tab.padding)
					.attr("width", tab.length - (tab.padding * 2))
					.attr("height", tab.width - (tab.padding * 2))
					.style("fill", "white")
					.style("fill", "#282828")
					.style("stroke", "grey")
					.style("stroke-width", 2);
		
		// On button 
		var button_x = tab.top.x + 15;
		var button_y = tab.width / 2 + 30;
		tab.button = svg.append("ellipse")
					.attr("cx", button_x).attr("cy", button_y)
					.attr("rx", 10).attr("ry", 10)
					.style("fill", "black")
					.style("stroke", "grey")
					.style("stroke-width", 2);
		return tab;
	}();

	var balls = function () {
		var game = {};
		
		// Ball colors
		var colors = ["#005878", "#70026D", "#F77416", "#F79A16", "#F7AC16"];
		
		// Create 240 balls of min size 5 and max size 15 
		var nodes = d3.range(240).map(function() { return {radius: Math.random() * 15 + 5}; });
		var root = nodes[0];
		root.radius = 0;
		root.fixed = true;
		
		// Initialize the (linkless) force-directed graph
		var force = d3.layout.force()
		    .gravity(0.05)
		    .charge(function (d, i) { return i ? 0 : -2000; })
		    .nodes(nodes)
		    .size([width, height]);
		
		// Start the force simulation
		force.start();
		
		// Render all the ball circles 
		svg.selectAll("circle")
			.classed("ball", true)
		    .data(nodes.slice(1))
		  	.enter().append("circle")
		    .attr("r", function (d) { return d.radius; })
		    .attr("class", ".ball")
		    .style("fill", function (d, i) { return colors[i % 4]; })
		    .style("opacity", 0.7);
		
		// The step function for the simulation 
		force.on("tick", function(e) {
		  var q = d3.geom.quadtree(nodes);
		  
		  var i = 0, n = nodes.length;
		  while (++i < n) q.visit(collide(nodes[i]));
		  
		  // Update the circle positions, making sure they don't go out of the tablet bounds
		  svg.selectAll("circle")
		      .attr("cx", function (d) { 
		      	return Math.max(tablet.top.x + tablet.padding + d.radius, Math.min(d.x, tablet.top.x + tablet.length - tablet.padding - d.radius)); 
		      })
		      .attr("cy", function (d) { 
		      	return Math.max(tablet.top.y + tablet.padding + d.radius, Math.min(d.y, tablet.top.y + tablet.width - tablet.padding - d.radius)); 
		      });
		});
		

		// Collision detection function - courtesy of Mike Bostock 
		function collide (node) {
		  var r = node.radius + 16,
		      nx1 = node.x - r,
		      nx2 = node.x + r,
		      ny1 = node.y - r,
		      ny2 = node.y + r;
		  return function(quad, x1, y1, x2, y2) {
		    if (quad.point && (quad.point !== node)) {
		      var x = node.x - quad.point.x,
		          y = node.y - quad.point.y,
		          l = Math.sqrt(x * x + y * y),
		          r = node.radius + quad.point.radius;
		      if (l < r) {
		        l = (l - r) / l * .5;
		        node.x -= x *= l;
		        node.y -= y *= l;
		        quad.point.x += x;
		        quad.point.y += y;
		      }
		    }
		    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		  };
		}

		game.force = force;
		game.root = root;
		return game;

	}();
	

	// Draw the haplet 
	var haplet = function () {
		var hap = {};
		
		// Position and size variables 
		hap.arm_size = 220;
		hap.mid = mid = tablet.top.x + (tablet.length / 2);
		var gap = 120, top_offset = 14;
		var axis_length = (Math.sqrt(Math.pow(hap.arm_size, 2) - Math.pow(gap, 2))) * 2;
		hap.start_pos = {x: mid, y: tablet.top.y + top_offset};
		hap.bottom_pos = {x: mid, y: hap.start_pos.y + axis_length};
		
		// Where the joints will be 
		var joint1 = {x: hap.start_pos.x - gap, y: hap.start_pos.y + hap.arm_size - 20};
		var joint2 = {x: hap.start_pos.x + gap, y: hap.start_pos.y + hap.arm_size - 20};
		
		// Draw the arms
		hap.arm1 = svg.append("line")
					.attr("x1", hap.start_pos.x)
					.attr("y1", hap.start_pos.y)
					.attr("x2", joint1.x)
					.attr("y2", joint1.y);
		hap.arm2 = svg.append("line")
					.attr("x1", hap.start_pos.x)
					.attr("y1", hap.start_pos.y)
					.attr("x2", joint2.x)
					.attr("y2", joint2.y);
		hap.arm3 = svg.append("line")
					.attr("x1", joint1.x)
					.attr("y1", joint1.y)
					.attr("x2", hap.bottom_pos.x)
					.attr("y2", hap.bottom_pos.y);
		hap.arm4 = svg.append("line")
					.attr("x1", joint2.x)
					.attr("y1", joint2.y)
					.attr("x2", hap.bottom_pos.x)
					.attr("y2", hap.bottom_pos.y);
		
		// Draw the stylus 
		hap.stylus = svg.append("ellipse")
					.attr("cx", hap.bottom_pos.x)
					.attr("cy", hap.bottom_pos.y)
					.attr("rx", 15)
					.attr("ry", 15)
					.attr("id", "stylus")
					.style("stroke", "grey")
					.style("stroke-width", 2)
					.style("fill", "#DCDCDC")
					.style("opacity", 0.7);
					// We can now move the stylus around 
					// .on("mousedown", function () {
					// 	moving = true;
					// });

		/* Style the components */

		// Arm styling 
		var arm_style = function (arm, color, opacity) {
			return arm.attr("stroke", color)
					.attr("stroke-width", 20)
					.attr("stroke-linecap", "round")
					.style("stroke-opacity", opacity);
		};
		arm_style(hap.arm1, "#DCDCDC", 0.8);
		arm_style(hap.arm2, "#DCDCDC", 0.8);
		arm_style(hap.arm3, "#DCDCDC", 0.7);
		arm_style(hap.arm4, "#DCDCDC", 0.7);
		
		return hap;

	}();
	
	/* Movement functionality */
	
	// Compute distance between joint and center 
	var joint_dist = function (x) {
		return Math.sqrt(Math.pow(haplet.arm_size, 2) - Math.pow(x / 2.0, 2)) || 0;
	};
	
	// Derive the x, y coordinates of where the joint should now be at after rotation
	// given the position of the stylus 
	// var joint_point = function (pos, side) {
	// 	// The distance in x direction between y-axis and stylus pos 
	// 	var x_dist = 1.0 * Math.abs(haplet.mid - pos.x);
	// 	// The distance in the y direction between stylus pos and top 
	// 	var y_dist = 1.0 * Math.abs(haplet.start_pos.y - pos.y);

	// 	// Find the angle between the y-axis and the joint axis 
	// 	var theta = Math.tan(x_dist / y_dist);

	// 	// The length of the device axis 
	// 	var axis = Math.sqrt(Math.pow(x_dist, 2) + Math.pow(y_dist, 2));

	// 	// Find the angle between the device axis and the second arm 
	// 	var alpha = Math.sin((axis / 2.0) / haplet.arm_size);
	// 	// And the complementary angle thing
	// 	var beta = theta - alpha;

	// 	// Now we can find the joint position 
	// 	var x_displacement = haplet.arm_size * Math.sin(beta);
	// 	var y_displacement = haplet.arm_size * Math.cos(beta);

	// 	if (side == "left")
	// 		var new_pos = {x: pos.x - x_displacement, y: pos.y - y_displacement};
	// 	else
	// 		var new_pos = {x: pos.x + x_displacement, y: pos.y - y_displacement};

	// 	return new_pos;
	// };

	var joint_point = function (pos, arm) {
		var x = pos.x - haplet.start_pos.x;
		var y = pos.y - haplet.start_pos.y;

		// If x is negative, flip to get the correct displacement
		var neg = false;
		if (x < 0) {
			neg = true;
			x = -1 * x;
		}

		// Math stuff 
		var t1 = Math.atan(y / x);
		var a = x / Math.cos(t1);

		var cos_arg = Math.abs(a / (2 * haplet.arm_size));
		if (cos_arg > 1) cos_arg = 1;
		else if (cos_arg < -1) cos_arg = -1;

		var t2 = Math.acos(cos_arg);

		var theta1 = t1 - t2;
		var theta2 = t1 + t2;

		// Find the displacement in the x and y direction
		if (arm === "left") {
			var run = haplet.arm_size * Math.cos(theta1);
			var rise = haplet.arm_size * Math.sin(theta1);
		}
		else {
			var run = haplet.arm_size * Math.cos(theta2);
			var rise = haplet.arm_size * Math.sin(theta2);
		}

		// Find the joint x,y coordinates 
		if (neg) var new_x = haplet.start_pos.x - run;
		else var new_x = haplet.start_pos.x + run;
		var new_y = haplet.start_pos.y + rise;

		return {x: new_x, y: new_y};
	};

	// True if we're in the tablet frame 
	var in_tablet = function (coords) {
		var min_x = tablet.top.x + tablet.padding;
		var max_x = tablet.top.x + tablet.length - tablet.padding;
		var min_y = tablet.top.y + tablet.padding;
		var max_y = tablet.top.y + tablet.width - tablet.padding;
		var in_x = coords[0] >= min_x && coords[0] <= max_x;
		var in_y = coords[1] >= min_y && coords[1] <= max_y;
		return in_x && in_y;
	};

	// True if we're below the point we don't want to be above...
	var below = function (coords) {
		return coords[1] >= tablet.top.y + (tablet.width / 6);
	};

	d3.select("#svg-canvas").on("mousemove", function (event) {
		// Only move everything if we've already clicked on the stylus
		// and within the movable frame  
		var coords = d3.mouse(this);

		// Don't move past the halfway line 
		if (in_tablet(coords) && below(coords)) {
			// Move the stylus
			haplet.stylus.attr("cx", coords[0]);
			haplet.stylus.attr("cy", coords[1]);

			var top_joint_pos = joint_point({x: coords[0], y: coords[1]}, "left");
			var bottom_joint_pos = joint_point({x: coords[0], y: coords[1]}, "right");
			
			// Move the joints 
			haplet.arm1.attr("x2", top_joint_pos.x);
			haplet.arm1.attr("y2", top_joint_pos.y);
			haplet.arm3.attr("x1", top_joint_pos.x);
			haplet.arm3.attr("y1", top_joint_pos.y);

			haplet.arm2.attr("x2", bottom_joint_pos.x);
			haplet.arm2.attr("y2", bottom_joint_pos.y);
			haplet.arm4.attr("x1", bottom_joint_pos.x);
			haplet.arm4.attr("y1", bottom_joint_pos.y);
			
			// Move the tip of the arms 
			haplet.arm3.attr("x2", coords[0]);
			haplet.arm3.attr("y2", coords[1]);
			haplet.arm4.attr("x2", coords[0]);
			haplet.arm4.attr("y2", coords[1]);
			
			// Move the balls 
		  	balls.root.px = coords[0];
		  	balls.root.py = coords[1];
		  	balls.force.resume();
		}
	});

	// Mouse up event listener - stop moving
	// d3.select("#svg-canvas").on("mouseup", function () {
	// 	moving = false;
	// });
});