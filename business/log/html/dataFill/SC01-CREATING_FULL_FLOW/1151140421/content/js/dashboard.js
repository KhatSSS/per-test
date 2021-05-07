/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.32142857142857, "KoPercent": 2.6785714285714284};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8638392857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.25, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.75, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.25, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.75, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Request"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 6, 2.6785714285714284, 453.02232142857144, 1, 4852, 281.0, 875.5, 1631.25, 3934.25, 1.6692749087115284, 3.159757154035323, 2.496649456926746], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 0, 0.0, 4407.0, 3962, 4852, 4407.0, 4852.0, 4852.0, 4852.0, 0.03391267486222976, 0.022288310724883426, 0.09422027342094108], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 0, 0.0, 291.0, 290, 292, 291.0, 292.0, 292.0, 292.0, 0.03506126956857108, 0.06810240739442175, 0.09665816796101187], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.03507356680637637, 0.022880022096347086, 0.02596265980393876], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 277.5, 277, 278, 277.5, 278.0, 278.0, 278.0, 0.035042839871743205, 0.022346654722898745, 0.02652168056699315], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 275.5, 274, 277, 275.5, 277.0, 277.0, 277.0, 0.035064957834388205, 0.02287440608727668, 0.027017823956379194], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 910.5, 902, 919, 910.5, 919.0, 919.0, 919.0, 0.03466865433618194, 0.027321878954393385, 0.04069504151571357], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 0, 0.0, 284.5, 282, 287, 284.5, 287.0, 287.0, 287.0, 0.035058811155713715, 0.01927549871158869, 0.09350157545532631], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 0, 0.0, 473.0, 440, 506, 473.0, 506.0, 506.0, 506.0, 0.034812880765883375, 0.02655162097476066, 0.10015502610966057], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 1329.0, 919, 1739, 1329.0, 1739.0, 1739.0, 1739.0, 0.03363832077502691, 0.05747093964444295, 0.023126345532831], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.03505512418277742, 0.022867991166108707, 0.030159730864284088], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 0, 0.0, 282.0, 280, 284, 282.0, 284.0, 284.0, 284.0, 0.03618337735644245, 0.02169589228208561, 0.09869157515287477], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.25, 1, 22, 3.0, 22.0, 22.0, 22.0, 0.04621339032984807, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 0, 0.0, 288.0, 286, 290, 288.0, 290.0, 290.0, 290.0, 0.035501908227567235, 0.06895829635217893, 0.09787293645158428], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 0, 0.0, 283.5, 281, 286, 283.5, 286.0, 286.0, 286.0, 0.03505819660636657, 0.01927516082947693, 0.09349993645701865], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 0.034946706272933774, 0.022797265420234143, 0.026551306133146952], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 282.5, 282, 283, 282.5, 283.0, 283.0, 283.0, 0.035074797004612336, 0.023154846460076112, 0.09412650602409639], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.035068646876260275, 0.02287681261068542, 0.030171365134751275], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 277.5, 274, 281, 277.5, 281.0, 281.0, 281.0, 0.03600748955782803, 0.02348926076623938, 0.030838445646694513], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 277.5, 276, 279, 277.5, 279.0, 279.0, 279.0, 0.03676335428844527, 0.023982344399102972, 0.028326451692952465], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1147.5, 1136, 1159, 1147.5, 1159.0, 1159.0, 1159.0, 0.03447206039504981, 0.021545037746906134, 0.02538274759557379], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 287.0, 285, 289, 287.0, 289.0, 289.0, 289.0, 0.03617094388078057, 0.023560565984844375, 0.09643230155715914], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 0, 0.0, 287.5, 286, 289, 287.5, 289.0, 289.0, 289.0, 0.035077872877788685, 0.019285978935737337, 0.09355241291918058], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 299.0, 297, 301, 299.0, 301.0, 301.0, 301.0, 0.03499195185107425, 0.02573138646861222, 0.041689630135068934], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 282.0, 280, 284, 282.0, 284.0, 284.0, 284.0, 0.03501216672793796, 0.019249853386551826, 0.027592596239693293], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.0350385423966363, 0.022343914243167486, 0.02651842808339173], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.03495098124879856, 0.022800054174020937, 0.026930004106740298], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.0350809492904878, 0.022370956920594272, 0.026550523144656293], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.035077872877788685, 0.022882831135119967, 0.030350581415742952], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.03617356074445188, 0.02359759626688853, 0.028967109189893106], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 695.5, 285, 1106, 695.5, 1106.0, 1106.0, 1106.0, 0.03499501321061749, 0.019240422302321918, 0.09333142683417613], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.036757948906451024, 0.02397881823194266, 0.031588862341481345], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 0, 0.0, 282.5, 281, 284, 282.5, 284.0, 284.0, 284.0, 0.0349454850433324, 0.019213191483785294, 0.09319933559896562], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 0, 0.0, 283.5, 281, 286, 283.5, 286.0, 286.0, 286.0, 0.03675592229798026, 0.02020857837281532, 0.09802775761307041], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 278.5, 278, 279, 278.5, 279.0, 279.0, 279.0, 0.03508156463778284, 0.022885239431678653, 0.027030619628135417], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 284.0, 282, 286, 284.0, 286.0, 286.0, 286.0, 0.03507110666877093, 0.01928225884230277, 0.09353436749259122], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 279.0, 278, 280, 279.0, 280.0, 280.0, 280.0, 0.035084026242851625, 0.022886845244360243, 0.026587113637161], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 284.5, 284, 285, 284.5, 285.0, 285.0, 285.0, 0.0350385423966363, 0.019264354852838124, 0.027613382533286615], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 0, 0.0, 465.5, 465, 466, 465.5, 466.0, 466.0, 466.0, 0.034950370473927024, 0.02488166022997344, 0.10205235128617364], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 0, 0.0, 1881.5, 1739, 2024, 1881.5, 2024.0, 2024.0, 2024.0, 0.03509202884564771, 0.022035326706788552, 0.10260306090221606], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.036170289724020685, 0.023595462437154123, 0.031013197634463054], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.03505020942500131, 0.02235135425246666, 0.026253428348609383], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 277.5, 274, 281, 277.5, 281.0, 281.0, 281.0, 0.036027597139408785, 0.0235023778214112, 0.02737252985787113], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.0350754121360926, 0.022881225885654156, 0.0298346523149772], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 279.0, 274, 284, 279.0, 284.0, 284.0, 284.0, 0.03503117774819589, 0.02233921784137883, 0.0262391731766272], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 278.0, 275, 281, 278.0, 281.0, 281.0, 281.0, 0.035017683930384846, 0.02233061289701299, 0.0265026416465315], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.03500175008750438, 0.022833172908645432, 0.02696912189359468], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.03506126956857108, 0.02287200007012254, 0.025953556965797733], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 0, 0.0, 284.0, 283, 285, 284.0, 285.0, 285.0, 285.0, 0.036196474463387265, 0.019900991330944365, 0.0965357146088971], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 285.5, 284, 287, 285.5, 287.0, 287.0, 287.0, 0.03616767333357445, 0.025536355293138992, 0.09755382201887952], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 0, 0.0, 287.0, 285, 289, 287.0, 289.0, 289.0, 289.0, 0.03601527047468127, 0.01980136452856011, 0.09605244498667435], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.036017216229357635, 0.023495605899620017, 0.03091712213438023], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 324.5, 317, 332, 324.5, 332.0, 332.0, 332.0, 0.03499562554680665, 0.02392279090113736, 0.03113380358705162], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.035012779664577574, 0.02232748546969644, 0.026225392580791988], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 290.5, 289, 292, 290.5, 292.0, 292.0, 292.0, 0.035062498904296906, 0.026742003558843642, 0.09244994828281412], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.03617617798679569, 0.023599303608573756, 0.027838699466401377], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.03617356074445188, 0.02359759626688853, 0.03122795673642135], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 277.0, 274, 280, 277.0, 280.0, 280.0, 280.0, 0.03601527047468127, 0.023494336598717858, 0.02736316448174026], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 0, 0.0, 283.5, 280, 287, 283.5, 287.0, 287.0, 287.0, 0.036170289724020685, 0.01988659483849966, 0.09646588011357471], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 329.25, 1, 1308, 4.0, 1308.0, 1308.0, 1308.0, 0.04552542025653574, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.03506618742877181, 0.02287520820548786, 0.027018771368457966], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 0, 0.0, 699.0, 284, 1114, 699.0, 1114.0, 1114.0, 1114.0, 0.035494347525156615, 0.019514958649085132, 0.09466314755000266], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.036022405936492495, 0.02349899137263378, 0.02775554519911385], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.03505819660636657, 0.02081580423503015, 0.024170983207123825], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 0, 0.0, 289.5, 286, 293, 289.5, 293.0, 293.0, 293.0, 0.03505020942500131, 0.2725632984875835, 0.09241754438232769], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 281.0, 279, 283, 281.0, 283.0, 283.0, 283.0, 0.03505082369435682, 0.019271107167893445, 0.027623061251314404], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 649.0, 645, 653, 649.0, 653.0, 653.0, 653.0, 0.034849276877504796, 0.025150015246558632, 0.09723084378811639], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 0, 0.0, 307.5, 306, 309, 307.5, 309.0, 309.0, 309.0, 0.03617748674999548, 0.024695374256100428, 0.09924078152415751], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.035042839871743205, 0.022346654722898745, 0.026247908380495157], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.036199750221723476, 0.02361468080870242, 0.027821487719234737], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.034913153530592655, 0.02277537749847255, 0.026525813912891685], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 46.25, 2, 177, 3.0, 177.0, 177.0, 177.0, 0.046224071185069625, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 0, 0.0, 292.5, 290, 295, 292.5, 295.0, 295.0, 295.0, 0.036010731197896974, 0.045189247645798444, 0.09741184122868615], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 1352.5, 935, 1770, 1352.5, 1770.0, 1770.0, 1770.0, 0.03409943394939644, 0.05809224855929891, 0.029071099450999113], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 277.0, 275, 279, 277.0, 279.0, 279.0, 279.0, 0.035055738624412816, 0.02235488019701325, 0.026531442806562434], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.03602305475504323, 0.02349941462536023, 0.02775604511887608], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.036178795607894214, 0.023601011197337242, 0.027876044662723178], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 295.0, 293, 297, 295.0, 297.0, 297.0, 297.0, 0.035029337069795954, 0.023637960854715825, 0.030821711620982573], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 0, 0.0, 595.5, 586, 605, 595.5, 605.0, 605.0, 605.0, 0.034865072170699396, 0.0223354368593543, 0.09873897392092602], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 0, 0.0, 3126.5, 2402, 3851, 3126.5, 3851.0, 3851.0, 3851.0, 0.03537256150404131, 3.531504654808016, 0.09744726172158258], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.03506680225830207, 0.022875609285689238, 0.03027251288704983], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 597.0, 563, 631, 597.0, 631.0, 631.0, 631.0, 0.03483713638738896, 0.023440221651280266, 0.03344229010625327], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.035503798906482996, 0.023160681317901013, 0.026974565966058368], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 282.0, 281, 283, 282.0, 283.0, 283.0, 283.0, 0.03503363228699551, 0.01926165525154148, 0.02760951294492713], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 500.5, 498, 503, 500.5, 503.0, 503.0, 503.0, 0.03492107836289985, 0.16256716851166364, 0.03365928158611538], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 0, 0.0, 662.5, 649, 676, 662.5, 676.0, 676.0, 676.0, 0.03576601870562778, 0.02245854494894401, 0.10247802625225774], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 0, 0.0, 288.5, 284, 293, 288.5, 293.0, 293.0, 293.0, 0.03549182800660148, 0.022390352433852106, 0.10176172561267768], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 484.0, 439, 529, 484.0, 529.0, 529.0, 529.0, 0.034849276877504796, 0.026511315124586165, 0.09624390137654644], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 0, 0.0, 420.0, 401, 439, 420.0, 439.0, 439.0, 439.0, 0.03498277098528974, 0.026647032586451173, 0.09722750607825646], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 0, 0.0, 286.5, 284, 289, 286.5, 289.0, 289.0, 289.0, 0.0360055448539075, 0.022714435523070554, 0.10151172655588961], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 276.66666666666663, 274, 279, 277.0, 279.0, 279.0, 279.0, 0.10641316685584562, 0.06941796431611805, 0.08396663947219069], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 0, 0.0, 687.5, 680, 695, 687.5, 695.0, 695.0, 695.0, 0.03590664272890485, 0.021740350089766606, 0.11410177289048473], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 0, 0.0, 286.5, 285, 288, 286.5, 288.0, 288.0, 288.0, 0.0360185135159472, 0.0227226169250995, 0.10024683937543898], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.035077872877788685, 0.022882831135119967, 0.027027775098218045], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 0, 0.0, 284.0, 281, 287, 284.0, 287.0, 287.0, 287.0, 0.03601527047468127, 0.01980136452856011, 0.09605244498667435], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 0, 0.0, 708.5, 568, 849, 708.5, 849.0, 849.0, 849.0, 0.03473729917498915, 0.9988330438558402, 0.09220310464611375], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 280.0, 278, 282, 280.0, 282.0, 282.0, 282.0, 0.03549560741858195, 0.02315533765196557, 0.02734964282545035], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.03601786486097105, 0.023496029030399077, 0.029123820414925804], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.03550632012498225, 0.023162326019031388, 0.030547917998153668], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 0, 0.0, 281.75, 279, 284, 282.0, 284.0, 284.0, 284.0, 0.07127837770412344, 0.04371369257635696, 0.1914214244983784], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 285.0, 282, 291, 284.0, 291.0, 291.0, 291.0, 0.10417390096534482, 0.05727529906590736, 0.2812898790714633], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1688.5, 1244, 2133, 1688.5, 2133.0, 2133.0, 2133.0, 0.03291585062786985, 0.05607588029328023, 0.024815465512417503], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1570.0, 645, 2642, 1496.5, 2642.0, 2642.0, 2642.0, 0.044193035177656007, 0.020283912630369452, 0.055025507667491605], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 276.5, 275, 278, 276.5, 278.0, 278.0, 278.0, 0.035060040319046366, 0.022871198176877904, 0.026637413445525462], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 4, 66.66666666666667, 1.7857142857142858], "isController": false}, {"data": ["403/Forbidden", 2, 33.333333333333336, 0.8928571428571429], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 6, "500/Internal Server Error", 4, "403/Forbidden", 2, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, "403/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
