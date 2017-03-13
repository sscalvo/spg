/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips_init variable
var redipsInit;
var p = function (){;} //Empty function for avoid "undefined" error the first time

// redips initialization
redipsInit = function () {
	// reference to the REDIPS.drag library and message line
	var	rd = REDIPS.drag,
		msg = document.getElementById('message');
		
	// how to display disabled elements
	rd.style.borderDisabled = 'solid';	// border style for disabled element will not be changed (default is dotted)
	rd.style.opacityDisabled = 60;		// disabled elements will have opacity effect
	// initialization
	rd.init();
	// only "smile" can be placed to the marked cell
	//rd.mark.exception.d8 = 'smile';
	// prepare handlers
	var previousClickedCell = null;
	var pcc_bgColor = null;
	
	//EVENTS
	rd.event.switched = function () {
		p();
		msg.innerHTML = 'Switched' + rd.obj.getAttribute('id');
	};
	rd.event.clicked = function (currentCell) {
		msg.innerHTML = 'CLICKED - previousClickedCell ' + previousClickedCell + ' pcc_bgColor: ' + pcc_bgColor;
		if(previousClickedCell != null)	
			previousClickedCell.bgColor = pcc_bgColor; 
		previousClickedCell = currentCell;
		pcc_bgColor = currentCell.bgColor;
		currentCell.bgColor = "Yellow";
	};
	rd.event.dblClicked = function () {
		msg.innerHTML = 'Dblclicked';
	};
	rd.event.moved  = function () {
		
		msg.innerHTML = 'MOVED - previousClickedCell: ';/*  + previousClickedCell + ' pcc_bgColor: ' + pcc_bgColor  ;*/
		previousClickedCell.bgColor = pcc_bgColor; 
		//previousClickedCell = currentCell;
		//pcc_bgColor = currentCell.bgColor;
		//currentCell.bgColor = pcc_bgColor; */
	};
	rd.event.notMoved = function () {
		msg.innerHTML = 'Not moved';
	};
	rd.event.dropped = function (targetCell) {
		msg.innerHTML = 'DROPPED - previousClickedCell ' + previousClickedCell + ' pcc_bgColor: ' + pcc_bgColor  ;
		previousClickedCell.bgColor = pcc_bgColor; 
		previousClickedCell = targetCell;
		pcc_bgColor = targetCell.bgColor;
		targetCell.bgColor = "Yellow";
	};
	rd.event.clonedEnd1 = function () {
		msg.innerHTML = 'Cloned end1';
	};
	rd.event.clonedEnd2 = function () {
		msg.innerHTML = 'Cloned end2';
	};
	rd.event.notCloned = function () {
		msg.innerHTML = 'Not cloned';
	};
	rd.event.deleted = function (cloned) {
		// if cloned element is directly moved to the trash
		if (cloned) {
			// set id of original element (read from redips property)
			// var id_original = rd.obj.redips.id_original;
			msg.innerHTML = 'Deleted (c)';
		}
		else {
			msg.innerHTML = 'Deleted';
		}
	};
	rd.event.undeleted = function () {
		msg.innerHTML = 'Undeleted';
	};
	rd.event.cloned = function () {
		// display message
		msg.innerHTML = 'Cloned';
		// append 'd' to the element text (Clone -> Cloned)
		rd.obj.innerHTML += 'd';
	};
	rd.event.changed = function (currentCell) {
		// display current row and current cell
		previousClickedCell.bgColor = pcc_bgColor; 
		previousClickedCell = currentCell;
		pcc_bgColor = currentCell.bgColor;
		currentCell.bgColor = "Yellow";
		// get target and source position (method returns positions as array)
		var pos = rd.getPosition();
		msg.innerHTML = 'CHANGED: ' + pos[1] + ' ' + pos[2] ;
	};
};


// toggles trash_ask parameter defined at the top
function toggleConfirm(chk) {
	if (chk.checked === true) {
		REDIPS.drag.trash.question = 'Are you sure you want to delete DIV element?';
	}
	else {
		REDIPS.drag.trash.question = null;
	}
}


// toggles delete_cloned parameter defined at the top
function toggleDeleteCloned(chk) {
	REDIPS.drag.clone.drop = !chk.checked;
}


// enables / disables dragging
function toggleDragging(chk) {
	REDIPS.drag.enableDrag(chk.checked);
}

//A tricky way to let din_table.js have access to rd.event.switched
function asingEventHandlerForSwitch(handler){
	p = handler;
}

// function sets drop_option parameter defined at the top
function setMode(radioButton) {
	REDIPS.drag.dropMode = radioButton.value;
}

/** From http://www.redips.net/javascript/save-text-fields-redips-drag/
* How to save values from input fields (embedded in DIV element). Source below will 
* search for input text fields/textareas and append values to query string and JSON object. Please 
* pay attention to the highlighted line inputField = cn.getElementsByTagName(‘input’).
*/
function saveUpDown (tbl, type) {
    var query = '',      // define query parameter
        tbl_start,       // table loop starts from tbl_start parameter
        tbl_end,         // table loop ends on tbl_end parameter
        tbl_rows,        // number of table rows
        cells,           // number of cells in the current row
        tbl_cell,        // reference to the table cell
        cn,              // reference to the child node
        id, r, c, d, i,  // variables used in for loops
        inputField,      // input field reference inside DIV element
        textAreaField,      // textarea field reference inside DIV element
        JSONarray,       // array of values for JSON object
        JSONobj = [],    // prepare JSON object
        pname = REDIPS.drag.saveParamName; // set parameter name (default is 'p')
    // if input parameter is string, then set reference to the table
    if (typeof(tbl) === 'string') {
        tbl = document.getElementById(tbl);
    }
    // tbl should be reference to the TABLE object
    if (tbl !== undefined && typeof(tbl) === 'object' && tbl.nodeName === 'TABLE') {
        // define number of table rows
        tbl_rows = tbl.rows.length;
        // iterate through each table row
        for (r = 0; r < tbl_rows; r++) {
            // set the number of cells in the current row
            cells = tbl.rows[r].cells.length;
            // iterate through each table cell
            for (c = 0; c < cells; c++) {
                // set reference to the table cell
                tbl_cell = tbl.rows[r].cells[c];
                // if cells is not empty (no matter is it allowed or denied table cell) 
                if (tbl_cell.childNodes.length > 0) {
                    // cell can contain many DIV elements
                    for (d = 0; d < tbl_cell.childNodes.length; d++) {
                        // set reference to the child node
                        cn = tbl_cell.childNodes[d];
                        // childNode should be DIV with containing drag class name
                        // and yes, it should be uppercase
                        if (cn.nodeName === 'DIV' && cn.className.indexOf('drag') > -1) {
                            // prepare query string
                            query += pname + '[]=' + cn.id + '_' + r + '_' + c;
                            // initialize JSONarray array
                            JSONarray = [cn.id, r, c];
                            // try to find input elements inside DIV element
                            inputField = cn.getElementsByTagName('input');
							textAreaField = cn.getElementsByTagName('textarea');
                            // loop goes through all found textarea elements
                            for (i = 0; i < textAreaField.length; i++) {
                                query += '_' + textAreaField[i].value;
                                JSONarray.push(textAreaField[i].value);
                            }
                            // loop goes through all found input elements
                            for (i = 0; i < inputField.length; i++) {
                                query += '_' + inputField[i].value;
                                JSONarray.push(inputField[i].value);
                            }
                            // add '&' to the data set
                            query += '&';
                            // push values for DIV element as Array to the Array
                            JSONobj.push(JSONarray);
                        }
                    }
                }
            }
        }
        // prepare query string in JSON format (only if array is not empty)
        if (type === 'json' && JSONobj.length > 0) {
            query = JSON.stringify(JSONobj);
        }
        else {
            // cut last '&' from query string
            query = query.substring(0, query.length - 1);
        }
    }
    // return prepared parameters (if tables are empty, returned value could be empty too) 
    return query;
};


/** From http://www.redips.net/javascript/save-text-fields-redips-drag/
* How to save values from input fields (embedded in DIV element). Source below will 
* search for input text fields/textareas and append values to query string and JSON object. Please 
* pay attention to the highlighted line inputField = cn.getElementsByTagName(‘input’).
*/
function saveIdDownUp (tbl, type) {
    var query = '',      // define query parameter
        tbl_start,       // table loop starts from tbl_start parameter
        tbl_end,         // table loop ends on tbl_end parameter
        tbl_rows,        // number of table rows
        cells,           // number of cells in the current row
        tbl_cell,        // reference to the table cell
        cn,              // reference to the child node
        id, r, c, d, i,  // variables used in for loops
        inputField,      // input field reference inside DIV element
        textAreaField,      // textarea field reference inside DIV element
        JSONarray,       // array of values for JSON object
        JSONobj = [],    // prepare JSON object
        pname = REDIPS.drag.saveParamName; // set parameter name (default is 'p')
    // if input parameter is string, then set reference to the table
    if (typeof(tbl) === 'string') {
        tbl = document.getElementById(tbl);
    }
    // tbl should be reference to the TABLE object
    if (tbl !== undefined && typeof(tbl) === 'object' && tbl.nodeName === 'TABLE') {
        // define number of table rows
        tbl_rows = tbl.rows.length;
        // iterate through each table row
        for (r = tbl_rows-1; r >=0 ; r--) {
            // set the number of cells in the current row
            cells = tbl.rows[r].cells.length;
            // iterate through each table cell
            for (c = 0; c < cells; c++) {
                // set reference to the table cell
                tbl_cell = tbl.rows[r].cells[c];
                // if cells is not empty (no matter is it allowed or denied table cell) 
                if (tbl_cell.childNodes.length > 0) {
                    // cell can contain many DIV elements
                    for (d = 0; d < tbl_cell.childNodes.length; d++) {
                        // set reference to the child node
                        cn = tbl_cell.childNodes[d];
                        // childNode should be DIV with containing drag class name
                        // and yes, it should be uppercase
                        if (cn.nodeName === 'DIV' && cn.className.indexOf('drag') > -1) {
                            // prepare query string
                            query += pname + '[]=' + cn.id + '_' + r + '_' + c;
                            // initialize JSONarray array
                            JSONarray = [cn.id];
                            // try to find input elements inside DIV element
                            inputField = cn.getElementsByTagName('input');
							textAreaField = cn.getElementsByTagName('textarea');
                            // loop goes through all found textarea elements
                            for (i = 0; i < textAreaField.length; i++) {
                                query += '_' + textAreaField[i].value;
                                JSONarray.push(textAreaField[i].value);
                            }
                            // loop goes through all found input elements
                            for (i = 0; i < inputField.length; i++) {
                                query += '_' + inputField[i].value;
                                JSONarray.push(inputField[i].value);
                            }
                            // add '&' to the data set
                            query += '&';
                            // push values for DIV element as Array to the Array
                            JSONobj.push(JSONarray);
                        }
                    }
                }
            }
        }
        // prepare query string in JSON format (only if array is not empty)
        if (type === 'json' && JSONobj.length > 0) {
            query = JSON.stringify(JSONobj);
        }
        else {
            // cut last '&' from query string
            query = query.substring(0, query.length - 1);
        }
	}
    // return prepared parameters (if tables are empty, returned value could be empty too) 
    return query;
};

// show prepared content for saving
function save(type) {
	// define table_content variable
	var table_content;
	// prepare table content of first table in JSON format or as plain query string (depends on value of "type" variable)
	//table_content = REDIPS.drag.saveContent('table1', type); //Without INPUTs
	table_content = saveIdDownUp('table1', type);  //With INPUTs
	// if content doesn't exist
	if (!table_content) {
		alert('Table is empty!');
	}
	// display query string
	else if (type === 'json') {
		//window.open('/my/multiple-parameters-json.php?p=' + table_content, 'Mypop', 'width=350,height=260,scrollbars=yes');
		document.getElementById("jason").innerHTML = table_content;
		//alert( table_content);
	}
	else {
		//window.open('/my/multiple-parameters.php?' + table_content, 'Mypop', 'width=350,height=160,scrollbars=yes');
		window.open('multiple-parameters.php?' + table_content, 'Mypop', 'width=350,height=260,scrollbars=yes');
	}
	return table_content;
}


// add onload event listener
if (window.addEventListener) {
	//alert("load: antes redipsInit");
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	alert("onload: antes redipsInit");
	window.attachEvent('onload', redipsInit);
}