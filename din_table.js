/**
* Independent code, not REDIPS related.
* Read JSON from server (LOCALHOST or Calm4)via AJAX
**/
var urlJSON   = "http://localhost/json/students.json";
var tableId   = "table1";
var colorEven = "#eee";
var colorOdd  = "#e0e0e0";
var rowLetters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];
var hallCols = { "DIPA" : 8, "MAHI" : 7, "NERU" : 4, "PADHANA" : 6, "SACCA" : 8, "SOBHANA" : 6};
var sp = {};
var legend = {};
var emptyId = "000000";


/**
* HTML+CSS output for each student 
**/
function prettyPrintStd(std){
	var cushion = "";
	if(std.id === emptyId)
		cushion = prettyPrintEmpty();
	else{
		cushion  = "<div id='" + std.id  + "' class='redips-drag t1'>"; 
		cushion += "<div style='font-weight: bold;text-align: left;'>" + std.id + "</div>";
		cushion += "<div style='text-align: left;'>" + std.gname + " " + std.fname + "</div>";
		cushion += "<div class='" + std.ON + "'>" + std.nSat + "/" + std.nSv + "</div>";
		//<textarea cols='20' rows='5'>this is textarea</textarea>
		cushion += "</div>";
	}
	return cushion;
}
/**
* HTML+CSS output for empty seats 
**/
function prettyPrintEmpty(){
	var cushion = "<div id='" + emptyId + "' class='redips-drag t2' >EMPTY</div>";
	return cushion;
}
/**
* Returns an HTML table compliying with REDIPS library. 
* When arrStd.length and ncols values are such that there are not enough students to fill up the table (ajax from CALM), 
* empty places will be populated. When loading students from a persisted-table, then everything should be square
* @param arrStd Array of students. Should be ordered top-down (from oldest to newest)
* @param colWidth Width in px for each col (This value will depend on the A4 proportions and number of cols of Dhamma Hall)
* @param ncols
**/
function createTable(arrStd, ncols){
	var numStd = arrStd.length;
	var numStdInLastRow = numStd % ncols; //Num students on last row
	var numEmptiesInLastRow = ncols - numStdInLastRow; //Never used when reading from persisted array. Only used 
	//when reading first time from CALM ajax 
	var nrows = Math.floor(numStd / ncols); //Num FULL rows
	var color = colorEven;
	var table = colgroup = tfoot = "";	
	
	//COLGROUP + TFOOT
	colgroup = "<colgroup><col width=\"20\" />";
	tfoot    = "<tfoot><tr style='background-color: " + colorOdd +";' ><td style='height:20px'></td>";
	
	for( var i =0; i<ncols; i++){
		colgroup += "<col width='100'/>"; //colWidth HARDCODED 
		tfoot += "<td style='height:20px' class='redips-mark' >" + (i+1) + "</td>\n";
	}
	colgroup += "</colgroup>";
	tfoot += "</tr></tfoot>";
	
	//ACTUAL CELLs DATA
	for(i=0; i<nrows; i++){ //EACH ROW
		var tr = "<tr style='background:" + ((color==colorEven)? color=colorOdd: color=colorEven) + "'>\n";
		tr += "<td class='redips-mark' >" + rowLetters[i] + "</td>\n";
		var tmp = arrStd.splice(0,ncols);
		for( var j=0; j< ncols; j++) { //EACH SEAT OF CURRENT ROW
			tr += "<td >" + prettyPrintStd(tmp[j]) + "</td>\n"; //Students
		}			
		table = tr + "</tr>\n" + table;
	}
	//Last row: Filled with remaining students + fillinp up with EMPTYes
	if(numStdInLastRow != 0){
		var tr = "<tr style='background:" + ((color==colorEven)? color=colorOdd: color=colorEven) + "'>\n";
		tr += "<td class='redips-mark' >" + rowLetters[nrows] + "</td>\n";
		for(i=0; i < numStdInLastRow; i++){//arrStd: Leftover students
			tr += "<td>" + prettyPrintStd(arrStd[i]) + "</td>\n"; //Last row on the back
		}
		for(i=0; i< numEmptiesInLastRow; i++){ //EMPTYes
			tr += "<td >" + prettyPrintEmpty() + "</td>\n"; 	//Empty
		}
		table = tr + "</tr>\n" + table;
	}
	table = "<table id='table1'>" + colgroup + tfoot + table + "</table>"; //id HARDCODED
	return table;
}		
/**
* New unknown dhamma venue. Send email to start enquiring around the number of columns, and meanwhile return defaultHallCols
* @return defaultHallCols
*/
function setVenue(newVenue){  //TODO codigo ya disponible en feedback.js
	//Ask user for information (nCols) about this new unknown venue and upload it to GoogleForm 
	return  $('input[name=ncol]:checked', '#cols').val() ;
}
function reload(){  //Uses global sp
	g = $('input[name=gender]:checked', '#genders').val(); //"MALE" || "FEMALE"
	var vOld = sp[g]["OLD"].sort(function(a, b) { return b.nSat - a.nSat; }); //order by sat courses
	var vNew = sp[g]["NEW"];
	var vGender = vOld.concat(vNew); //old+new students, just one gender
	//vGender = orderByLastLayout(vGender);
	
	legend.gender = g;
	legend.venue = sp.VENUE;
	legend.cols = $('input[name=ncol]:checked', '#cols').val();
	legend.start = sp.START;
	legend.numOld = vOld.length;
	legend.numNew = vNew.length;
	legend.rows = Math.ceil(vGender.length / legend.cols); 

	//renderLegend(legend); //TODO
	var table = createTable(vGender, legend.cols );
	$('#entry_point').text(''); //Clean previous table
	$('#entry_point').html(table); //Inject table into html label: <span id="entry_point"/> 
	$('#redips-drag').width($('#table1').width()); //http://www.redips.net/javascript/redips-drag-documentation-appendix-a/#redips_drag
	$('#redips-drag').height($('#table1').height()); //http://www.redips.net/javascript/redips-drag-documentation-appendix-a/#redips_drag
	REDIPS.drag.init(); //REDIPS has to reload dinamically generated tables
}
/* TODO improve this function description
* Whenever user modifies the SP, the changes get stored (online DB, extension persistence, etc)
* Meanwhile CALM4 database may have changed (cancelled students/added students)
* getLastLayout 
*/
function getLastLayout(){
	var persisted_data = [["000000"],["OM0002"],["OM0003"],["OM0004"],["000000"],["OM0006"],["OM0007"],["OM0008"],["000000"],["NM0002"],["000000"],["NM0004"],["NM0005"],["NM0008"],["NM0006"],["NM0007"],["000000"],["NM0001"],["OM0001"],["NM0003"],["OM0005"]];
	return persisted_data;
}
/* Recalls the last used layout for this course and sort the students array according to it. 
* Default order to asign sits to students is by "nSat top->down". However, any modification by the user was recorded,
* so now we can rebuild the last used layout. 
* TODO improve explanation 
* Whenever user modifies the SP, the changes get stored (online DB, extension persistence, etc)
* Meanwhile CALM4 database may have changed (cancelled students/added students)
*/
function orderByLastLayout(students){
	var zig = getLastLayout();
	var ordered_result = []; //Ordered according to persisted user's last arrangement
	for(var i=0;i< zig.length; i++){ //ZIG is the ordered pattern (user's last arrangement)
		var j = 0;
		var found = false;
		while(j < students.length && !found){ //to match against unsorted student's array
			if(zig[i][0] === emptyId){ //"000000"
				ordered_result.push({"id": emptyId});
				found = true;
			}
			else if(zig[i][0] === students[j]['id'] ){
				var std = students.splice(j,1) //students.length decreases by 1
				ordered_result.push(std);
				found = true;
			}
			j++;
		}
	}
	console.table(ordered_result);
	return ordered_result;
}

function getStudentsJSON(urlJSON){
	$.ajax({ url: urlJSON, type: "GET", dataType: "json",
		complete: function (data_response) {
			sp = JSON.parse(data_response.responseText); //sp GLOBAL
			//$('input:radio[name="gender"]').filter('[value="Male"]').attr('checked', true);
			$('input[name=ncol]', '#cols').filter('[value="' +hallCols[sp.VENUE.toUpperCase()] + '"]').attr('checked', true); 
			reload();
			console.log(document.documentElement.outerHTML);
		},
		error: function (error) {
			alert(JSON.stringify(error));
		}
	});
}

//EXEC:
getStudentsJSON(urlJSON);