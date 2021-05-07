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

    var data = {"OkPercent": 61.607142857142854, "KoPercent": 38.392857142857146};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.515625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.25, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.75, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 449.5714285714288, 1, 2196, 268.0, 1041.0, 1154.75, 1983.0, 1.4131243927981123, 0.8415007408651601, 1.0804571086780979], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 247.0, 245, 249, 247.0, 249.0, 249.0, 249.0, 0.028571020413994085, 0.02142826531049556, 0.02472062899101441], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1320.0, 1036, 1604, 1320.0, 1604.0, 1604.0, 1604.0, 0.027200892189263807, 0.007225236987773199, 0.02382734403688441], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1704.0, 1212, 2196, 1704.0, 2196.0, 2196.0, 2196.0, 0.026789182528095153, 0.017475755789812076, 0.0188623052761295], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.0, 255, 275, 265.0, 275.0, 275.0, 275.0, 0.027302263357632348, 0.017410525363802658, 0.019676826521418625], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 252.5, 242, 263, 252.5, 263.0, 263.0, 263.0, 0.02771311384547168, 0.018078476610131913, 0.02035181798026826], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 271.5, 261, 282, 271.5, 282.0, 282.0, 282.0, 0.027213846405050892, 0.016676453729657648, 0.030987641512001306], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 242.5, 239, 246, 242.5, 246.0, 246.0, 246.0, 0.027728867137133115, 0.007365480333300984, 0.022258914830784588], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 255.0, 246, 264, 255.0, 264.0, 264.0, 264.0, 0.027749642723349937, 0.020812232042512455, 0.02699086343013334], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 896.5, 890, 903, 896.5, 903.0, 903.0, 903.0, 0.026908846283215607, 0.04611818869828456, 0.017527539522367977], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1023.0, 979, 1067, 1023.0, 1067.0, 1067.0, 1067.0, 0.02744726693839461, 0.017905053041843356, 0.02216688452934799], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 278.5, 266, 291, 278.5, 291.0, 291.0, 291.0, 0.028517245804400213, 0.02138793435330016, 0.023699390800336506], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 6.75, 1, 20, 3.0, 20.0, 20.0, 20.0, 0.03652400997105472, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1057.5, 1030, 1085, 1057.5, 1085.0, 1085.0, 1085.0, 0.027489897462682465, 0.007302004013525029, 0.024080505882838055], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 253.5, 241, 266, 253.5, 266.0, 266.0, 266.0, 0.027703900709219857, 0.007358848625886525, 0.022238873420877662], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1020.0, 976, 1064, 1020.0, 1064.0, 1064.0, 1064.0, 0.027458571879676538, 0.01791242774963274, 0.019869923596523745], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 267.5, 258, 277, 267.5, 277.0, 277.0, 277.0, 0.027170221437304715, 0.020377666077978536, 0.02043073291672327], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 989.0, 978, 1000, 989.0, 1000.0, 1000.0, 1000.0, 0.027434842249657063, 0.017896947873799723, 0.022156850137174208], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 626.5, 286, 967, 626.5, 967.0, 967.0, 967.0, 0.027893224735711694, 0.018195970823686927, 0.022418089802237036], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 240.5, 240, 241, 240.5, 241.0, 241.0, 241.0, 0.028572653113704872, 0.018639191679643414, 0.020983042130377015], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1301.0, 1112, 1490, 1301.0, 1490.0, 1490.0, 1490.0, 0.026835551738943753, 0.016772219836839845, 0.018790127535959638], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 244.5, 244, 245, 244.5, 245.0, 245.0, 245.0, 0.02857387776095094, 0.021430408320713204, 0.021988491870731777], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 252.5, 252, 253, 252.5, 253.0, 253.0, 253.0, 0.02770428446759291, 0.0073589505617043674, 0.022239181476915403], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 286.5, 283, 290, 286.5, 290.0, 290.0, 290.0, 0.027274710888064588, 0.020482668625900063, 0.0314564780847698], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 273.0, 264, 282, 273.0, 282.0, 282.0, 282.0, 0.027253154552639467, 0.014983912122203145, 0.020014035374594612], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 264.5, 256, 273, 264.5, 273.0, 273.0, 273.0, 0.02728996957168393, 0.01740268567413047, 0.019667966351467517], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 241, 258, 249.5, 258.0, 258.0, 258.0, 0.027745023236456962, 0.018099292501907473, 0.020375251439273084], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 264.5, 255, 274, 264.5, 274.0, 274.0, 274.0, 0.027197193249656634, 0.017343522648462676, 0.01960110216625644], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 265.0, 256, 274, 265.0, 274.0, 274.0, 274.0, 0.027164316953250212, 0.017720472387471816, 0.02164656507212126], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 242.5, 241, 244, 242.5, 244.0, 244.0, 244.0, 0.02857346953353811, 0.018639724266019002, 0.021848658832773767], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 247.0, 240, 254, 247.0, 254.0, 254.0, 254.0, 0.027785881993359175, 0.007380624904486031, 0.02230468261576293], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 997.5, 968, 1027, 997.5, 1027.0, 1027.0, 1027.0, 0.0278955590270029, 0.018197493584021424, 0.022501691168266013], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 248.5, 240, 257, 248.5, 257.0, 257.0, 257.0, 0.027738866312533805, 0.007368136364266793, 0.02226694151260038], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 726.5, 240, 1213, 726.5, 1213.0, 1213.0, 1213.0, 0.028181318603897478, 0.007485662754160268, 0.022622113176175514], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.0, 253, 255, 254.0, 255.0, 255.0, 255.0, 0.02770313322436768, 0.0180719658143336, 0.02034448846164501], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 263.5, 254, 273, 263.5, 273.0, 273.0, 273.0, 0.027137410276937272, 0.007208374604811463, 0.021784132077775818], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1106.5, 1028, 1185, 1106.5, 1185.0, 1185.0, 1185.0, 0.02741002658772579, 0.017880759531836748, 0.01978125942219664], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 275.0, 266, 284, 275.0, 284.0, 284.0, 284.0, 0.027291831554815644, 0.015005176919298055, 0.02004243879806774], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 247.0, 246, 248, 247.0, 248.0, 248.0, 248.0, 0.027722333111554667, 0.020791749833666, 0.02796598642991794], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 633.5, 247, 1020, 633.5, 1020.0, 1020.0, 1020.0, 0.028130186503136517, 0.021097639877352387, 0.028432366240963177], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 241.5, 241, 242, 241.5, 242.0, 242.0, 242.0, 0.028574286000028575, 0.018640256882831142, 0.022993370765647995], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 265.0, 255, 275, 265.0, 275.0, 275.0, 275.0, 0.02722421866492432, 0.017360756629097245, 0.02039157784765327], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1017.0, 969, 1065, 1017.0, 1065.0, 1065.0, 1065.0, 0.0276365244306876, 0.018028513984081364, 0.019998695901503428], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 264.5, 255, 274, 264.5, 274.0, 274.0, 274.0, 0.027157677475422304, 0.017716141165607515, 0.021667795407636737], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 265.0, 255, 275, 265.0, 275.0, 275.0, 275.0, 0.027275454818209095, 0.01739342968387748, 0.019444416032512343], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.0, 256, 274, 265.0, 274.0, 274.0, 274.0, 0.027262813522355506, 0.01738536838876772, 0.019648394901853872], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 241, 258, 249.5, 258.0, 258.0, 258.0, 0.027778935233412502, 0.01812141478117144, 0.02040015556203731], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1005.0, 973, 1037, 1005.0, 1037.0, 1037.0, 1037.0, 0.027452541419021866, 0.017908493816315048, 0.019329377307729264], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 247.0, 239, 255, 247.0, 255.0, 255.0, 255.0, 0.02844262411650099, 0.0075550720309455754, 0.02283187209351935], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 984.0, 984, 984, 984.0, 984.0, 984.0, 984.0, 0.028273746412768426, 0.021205309809576318, 0.022641085994599717], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 246.0, 239, 253, 246.0, 253.0, 253.0, 253.0, 0.02797124555956477, 0.0074298621017593915, 0.022453480322228752], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 989.0, 971, 1007, 989.0, 1007.0, 1007.0, 1007.0, 0.027846620812564397, 0.018165569045696304, 0.02243502165074768], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 271.5, 263, 280, 271.5, 280.0, 280.0, 280.0, 0.02726615860724462, 0.016708510279341796, 0.022313516516475576], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 267.5, 261, 274, 267.5, 274.0, 274.0, 274.0, 0.02724832763389147, 0.017376130805596805, 0.019425077317129662], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 277.5, 262, 293, 277.5, 293.0, 293.0, 293.0, 0.027489897462682465, 0.007302004013525029, 0.021234871965802565], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 240.5, 240, 241, 240.5, 241.0, 241.0, 241.0, 0.028575102513180267, 0.018640789530082438, 0.02095693553456873], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 240.5, 240, 241, 240.5, 241.0, 241.0, 241.0, 0.028574694250771516, 0.01864052320265173, 0.023161129129043317], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 268.0, 254, 282, 268.0, 282.0, 282.0, 282.0, 0.02791619558086624, 0.018210955710955712, 0.020201075122482308], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 274.0, 263, 285, 274.0, 285.0, 285.0, 285.0, 0.028555519067947857, 0.007585059752423649, 0.022922496751809705], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 365.5, 2, 1452, 4.0, 1452.0, 1452.0, 1452.0, 0.036047077483193045, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.5, 241, 248, 244.5, 248.0, 248.0, 248.0, 0.027725023219706945, 0.018086245615980705, 0.02036056392697229], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 288.0, 272, 304, 288.0, 304.0, 304.0, 304.0, 0.027892835725143995, 0.007409034489491374, 0.022390538052801136], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 247.5, 240, 255, 247.5, 255.0, 255.0, 255.0, 0.02796537886097012, 0.018243040116335978, 0.020537075101024933], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 264.5, 255, 274, 264.5, 274.0, 274.0, 274.0, 0.02720977375073126, 0.016155803164496687, 0.01875986354298464], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 246.5, 238, 255, 246.5, 255.0, 255.0, 255.0, 0.027756574838664907, 0.007372840191520366, 0.021440869821664005], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 275.5, 268, 283, 275.5, 283.0, 283.0, 283.0, 0.027226812965408333, 0.014969429394067278, 0.019994690771471747], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 268.0, 259, 277, 268.0, 277.0, 277.0, 277.0, 0.027149935518903143, 0.020362451639177354, 0.023809220796850605], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 285.5, 269, 302, 285.5, 302.0, 302.0, 302.0, 0.02847542570761433, 0.021356569280710745, 0.023887100276211628], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 265.0, 256, 274, 265.0, 274.0, 274.0, 274.0, 0.027288852503752216, 0.017401973325146675, 0.01945396711693273], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1112.5, 1066, 1159, 1112.5, 1159.0, 1159.0, 1159.0, 0.028119507908611598, 0.018343585237258347, 0.020595342706502637], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1012.0, 979, 1045, 1012.0, 1045.0, 1045.0, 1045.0, 0.02747705665769083, 0.0179244861790405, 0.019883299788426664], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 42.25, 1, 160, 4.0, 160.0, 160.0, 160.0, 0.036530347586257284, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1029.5, 1029, 1030, 1029.5, 1030.0, 1030.0, 1030.0, 0.027670554379556993, 0.007349991007069827, 0.02310383202589964], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 912.0, 910, 914, 912.0, 914.0, 914.0, 914.0, 0.026906312220847012, 0.0470597706909541, 0.02196648146155088], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 264.5, 256, 273, 264.5, 273.0, 273.0, 273.0, 0.027237195113647198, 0.017369031649620722, 0.019629931634640264], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.0, 254, 282, 268.0, 282.0, 282.0, 282.0, 0.02815236057543425, 0.018365016469130937, 0.020674389797584528], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 274.0, 263, 285, 274.0, 285.0, 285.0, 285.0, 0.028546552290147156, 0.018622164970525684, 0.020963874338076817], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 291.0, 281, 301, 291.0, 301.0, 301.0, 301.0, 0.02727954715951715, 0.016769995055582076, 0.02205807133601582], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 257.5, 247, 268, 257.5, 268.0, 268.0, 268.0, 0.027719259341390398, 0.0207894445060428, 0.02541834425934139], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 251.0, 244, 258, 251.0, 258.0, 258.0, 258.0, 0.028203971119133576, 0.02115297833935018, 0.023742014750676894], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 241.0, 240, 242, 241.0, 242.0, 242.0, 242.0, 0.02772387025228722, 0.01808549348489049, 0.022471496395896868], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 272.5, 262, 283, 272.5, 283.0, 283.0, 283.0, 0.027241275981366966, 0.016706563785447708, 0.024208555803753844], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 288.5, 272, 305, 288.5, 305.0, 305.0, 305.0, 0.027852825669164135, 0.018169616745118793, 0.02015521857504944], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 275.0, 265, 285, 275.0, 285.0, 285.0, 285.0, 0.02727917507774565, 0.014998218328877735, 0.02003314419771946], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 370.0, 361, 379, 370.0, 379.0, 379.0, 379.0, 0.02716394800820351, 0.018277304860988497, 0.025519255843644315], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 272.5, 259, 286, 272.5, 286.0, 286.0, 286.0, 0.028161081385525203, 0.021120811039143903, 0.02681352963953816], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 292.5, 275, 310, 292.5, 310.0, 310.0, 310.0, 0.027864467231386535, 0.020898350423539904, 0.026830434267721803], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 251.5, 245, 258, 251.5, 258.0, 258.0, 258.0, 0.027771991946122333, 0.02082899395959175, 0.02381231340692911], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 257.5, 257, 258, 257.5, 258.0, 258.0, 258.0, 0.027701598382226654, 0.020776198786669992, 0.024211846242278182], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 273.5, 260, 287, 273.5, 287.0, 287.0, 287.0, 0.02790334282046989, 0.02092750711535242, 0.02656812426753725], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 273.8333333333333, 262, 285, 274.0, 285.0, 285.0, 285.0, 0.08419989054014229, 0.054927272344545953, 0.06339659727192355], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 0.028573061317789587, 0.02142979598834219, 0.0361348773501343], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 256.0, 244, 268, 256.0, 268.0, 268.0, 268.0, 0.027954043552399856, 0.020965532664299888, 0.024568983590976434], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 264.5, 254, 275, 264.5, 275.0, 275.0, 275.0, 0.027144039847450497, 0.017707244744235285, 0.01993390426297146], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 267.0, 253, 281, 267.0, 281.0, 281.0, 281.0, 0.028142061124556764, 0.00747523498621039, 0.02259059984803287], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 271.5, 253, 290, 271.5, 290.0, 290.0, 290.0, 0.027765052128885373, 0.007375091971735177, 0.021935475754168227], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 290.0, 272, 308, 290.0, 308.0, 308.0, 308.0, 0.02787922718782235, 0.01818683961080599, 0.02047380746605704], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1087.0, 1032, 1142, 1087.0, 1142.0, 1142.0, 1142.0, 0.02762698050916525, 0.01802228806652577, 0.021178886425483125], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1168.5, 1101, 1236, 1168.5, 1236.0, 1236.0, 1236.0, 0.027483853236223717, 0.017928919884567816, 0.022196432252301775], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 277.25, 266, 289, 277.0, 289.0, 289.0, 289.0, 0.056374552526989315, 0.042280914395241995, 0.04448304535332751], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 269.16666666666663, 258, 279, 270.0, 279.0, 279.0, 279.0, 0.08095199546668826, 0.060713996600016196, 0.0638761839229337], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1499.5, 1079, 1920, 1499.5, 1920.0, 1920.0, 1920.0, 0.026481648217785075, 0.04525672302844129, 0.019007823671945343], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1190.0, 613, 2004, 1071.5, 2004.0, 2004.0, 2004.0, 0.03540418300422195, 0.016249966808578434, 0.044082356767952136], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 1028.5, 1023, 1034, 1028.5, 1034.0, 1034.0, 1034.0, 0.027407021678954147, 0.017878799298380245, 0.01983262017979006], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 36, 41.86046511627907, 16.071428571428573], "isController": false}, {"data": ["500/Internal Server Error", 2, 2.3255813953488373, 0.8928571428571429], "isController": false}, {"data": ["401/Unauthorized", 48, 55.81395348837209, 21.428571428571427], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 86, "401/Unauthorized", 48, "400/Bad Request", 36, "500/Internal Server Error", 2, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, "401/Unauthorized", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, "401/Unauthorized", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
