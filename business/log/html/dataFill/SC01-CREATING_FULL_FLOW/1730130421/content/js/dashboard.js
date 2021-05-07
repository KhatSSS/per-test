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

    var data = {"OkPercent": 62.5, "KoPercent": 37.5};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5111607142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.25, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 84, 37.5, 470.60267857142856, 1, 5965, 254.5, 1099.5, 1192.5, 2236.0, 1.3399854037304235, 0.849694549504684, 1.0333221356316475], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 267.0, 254, 280, 267.0, 280.0, 280.0, 280.0, 0.024158382354717525, 0.018118786766038144, 0.021303729752255786], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1199.5, 1193, 1206, 1199.5, 1206.0, 1206.0, 1206.0, 0.024594800659140655, 0.0065329939250842375, 0.021952781057084533], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1085.0, 1025, 1145, 1085.0, 1145.0, 1145.0, 1145.0, 0.024660304308155162, 0.016086995388523092, 0.017363358795097532], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.5, 241, 248, 244.5, 248.0, 248.0, 248.0, 0.02500562626590983, 0.015945970655897576, 0.018021632992423296], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.5, 272, 281, 276.5, 281.0, 281.0, 281.0, 0.02449599490483306, 0.01597980917619969, 0.01798924625823678], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 780.5, 745, 816, 780.5, 816.0, 816.0, 816.0, 0.0248000496000992, 0.019544570339140678, 0.029110995721991446], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 252.0, 249, 255, 252.0, 255.0, 255.0, 255.0, 0.024870981782005846, 0.006606354535845302, 0.019964792016414847], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 278.0, 258, 298, 278.0, 298.0, 298.0, 298.0, 0.02463478924937797, 0.01847609193703348, 0.024153641021851056], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 856.5, 824, 889, 856.5, 889.0, 889.0, 889.0, 0.024848733335818208, 0.04262382822691863, 0.0161856495458894], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1120.0, 1103, 1137, 1120.0, 1137.0, 1137.0, 1137.0, 0.02425447798299761, 0.015822257121721098, 0.01999099552504881], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 262.5, 244, 281, 262.5, 281.0, 281.0, 281.0, 0.02419432884931772, 0.01814574663698829, 0.020106810401141973], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 6.75, 1, 21, 2.5, 21.0, 21.0, 21.0, 0.03474423897087565, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1043.0, 1007, 1079, 1043.0, 1079.0, 1079.0, 1079.0, 0.024434046400254116, 0.006490293575067499, 0.021809295322101817], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 275.5, 271, 280, 275.5, 280.0, 280.0, 280.0, 0.024493594924927132, 0.00650611115193377, 0.019661850613564555], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 991.0, 979, 1003, 991.0, 1003.0, 1003.0, 1003.0, 0.024447187962204648, 0.015947970272219437, 0.017690787382806293], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 247.0, 244, 250, 247.0, 250.0, 250.0, 250.0, 0.024946365314573667, 0.01870977398593025, 0.019172645998603004], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1026.0, 1016, 1036, 1026.0, 1036.0, 1036.0, 1036.0, 0.024642073876937485, 0.016075102880658436, 0.020310459328257063], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 248.0, 241, 255, 248.0, 255.0, 255.0, 255.0, 0.024303699022991298, 0.01585436615952948, 0.01993662810479755], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.5, 254, 277, 265.5, 277.0, 277.0, 277.0, 0.024151089214123556, 0.015754812104525916, 0.01773595614162199], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1075.0, 1060, 1090, 1075.0, 1090.0, 1090.0, 1090.0, 0.024748187195287943, 0.015467616997054966, 0.017328564667013144], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 266.5, 252, 281, 266.5, 281.0, 281.0, 281.0, 0.024182334804425366, 0.018136751103319027, 0.01860906232996796], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 247.5, 243, 252, 247.5, 252.0, 252.0, 252.0, 0.024546804619708627, 0.006520244977110104, 0.01970456386464892], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 284.0, 264, 304, 284.0, 304.0, 304.0, 304.0, 0.024982200182370063, 0.01837069993879361, 0.028812478921268595], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 251.5, 248, 255, 251.5, 255.0, 255.0, 255.0, 0.024988130637946974, 0.013738591356605613, 0.01878990292111247], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.5, 241, 248, 244.5, 248.0, 248.0, 248.0, 0.02499937501562461, 0.01594198426289343, 0.01801712769680758], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 273.5, 253, 294, 273.5, 294.0, 294.0, 294.0, 0.02464845146103696, 0.016079263257785827, 0.018101206541699017], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.0, 240, 248, 244.0, 248.0, 248.0, 248.0, 0.024954458113942056, 0.01591334096523844, 0.017984755945399646], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 244.5, 241, 248, 244.5, 248.0, 248.0, 248.0, 0.024945120734384357, 0.016272793604071044, 0.019878143085212532], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 263.0, 249, 277, 263.0, 277.0, 277.0, 277.0, 0.02420779975308044, 0.01579180687017357, 0.018510456256505846], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 242.5, 240, 245, 242.5, 245.0, 245.0, 245.0, 0.02466517031300101, 0.006551685864390894, 0.01979958007547542], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1023.0, 1007, 1039, 1023.0, 1039.0, 1039.0, 1039.0, 0.02391629297458894, 0.015601644245142004, 0.01968890134529148], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 273.0, 253, 293, 273.0, 293.0, 293.0, 293.0, 0.02466121653781181, 0.006550635642856262, 0.019796406244220025], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 262.0, 248, 276, 262.0, 276.0, 276.0, 276.0, 0.02414467489195258, 0.006413429268174904, 0.019381760508969746], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.0, 244, 252, 248.0, 252.0, 252.0, 252.0, 0.024544394673866356, 0.016011382463030004, 0.018024789838620606], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 243.5, 240, 247, 243.5, 247.0, 247.0, 247.0, 0.02493827776253772, 0.006624230030674082, 0.020018812813287115], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1088.0, 1028, 1148, 1088.0, 1148.0, 1148.0, 1148.0, 0.024315222545074344, 0.01586188345713834, 0.01754780220782221], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 252.5, 250, 255, 252.5, 255.0, 255.0, 255.0, 0.025001250062503123, 0.013745804477723887, 0.01879976811340567], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 257.0, 255, 259, 257.0, 259.0, 259.0, 259.0, 0.024872528292500935, 0.018654396219375702, 0.025504057331177714], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 245.5, 245, 246, 245.5, 246.0, 246.0, 246.0, 0.024108294458708518, 0.01808122084403139, 0.024767505635313828], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 264.0, 250, 278, 264.0, 278.0, 278.0, 278.0, 0.024199305479932723, 0.015786265684174863, 0.01987462491076506], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 244.0, 240, 248, 244.0, 248.0, 248.0, 248.0, 0.024978768047159913, 0.015928843295698658, 0.01870968270719888], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1065.5, 997, 1134, 1065.5, 1134.0, 1134.0, 1134.0, 0.02409609522776834, 0.015718937121239503, 0.01743672515993783], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 244.0, 240, 248, 244.0, 248.0, 248.0, 248.0, 0.024943254096929487, 0.016271575914793845, 0.02031511124691327], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 244.5, 241, 248, 244.5, 248.0, 248.0, 248.0, 0.02499562576549104, 0.01593959338365786, 0.01781914727422701], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.0, 241, 247, 244.0, 247.0, 247.0, 247.0, 0.024992502249325203, 0.015937601532040387, 0.018012174472658203], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 243.5, 241, 246, 243.5, 246.0, 246.0, 246.0, 0.024666387114279372, 0.016090963469080684, 0.018114378037048916], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1616.5, 1045, 2188, 1616.5, 2188.0, 2188.0, 2188.0, 0.024285402044830852, 0.015842430240182625, 0.0170993895257061], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 240.5, 240, 241, 240.5, 241.0, 241.0, 241.0, 0.024109747570942933, 0.006404151698531717, 0.019353723147768644], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1072.5, 1020, 1125, 1072.5, 1125.0, 1125.0, 1125.0, 0.023991746839087353, 0.017993810129315516, 0.019212141023487922], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 261.5, 244, 279, 261.5, 279.0, 279.0, 279.0, 0.02428481227840109, 0.006450653261450289, 0.019494253606294625], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1891.0, 1530, 2252, 1891.0, 2252.0, 2252.0, 2252.0, 0.02374056312615735, 0.01548700797682921, 0.019521048976781728], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 278.0, 275, 281, 278.0, 281.0, 281.0, 281.0, 0.024983760555638834, 0.017078742567331235, 0.021324030005496427], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 245.0, 241, 249, 245.0, 249.0, 249.0, 249.0, 0.024987818438511226, 0.015934614687839677, 0.017813581504016792], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 262.5, 245, 280, 262.5, 280.0, 280.0, 280.0, 0.024888933135881128, 0.006611122864218426, 0.019225728623517555], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 263.0, 249, 277, 263.0, 277.0, 277.0, 277.0, 0.02417561164297457, 0.01577080915772169, 0.017730355804564356], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 263.0, 249, 277, 263.0, 277.0, 277.0, 277.0, 0.024167431968679008, 0.015765473198317947, 0.01999005359128039], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 247.5, 240, 255, 247.5, 255.0, 255.0, 255.0, 0.024295137328263747, 0.015848780991484554, 0.017580758554925233], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 257.5, 240, 275, 257.5, 275.0, 275.0, 275.0, 0.024238017330182392, 0.006438223353329698, 0.01945668969278313], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 335.5, 1, 1335, 3.0, 1335.0, 1335.0, 1335.0, 0.03434744154494792, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 251.5, 249, 254, 251.5, 254.0, 254.0, 254.0, 0.02487283761767961, 0.016225640164658182, 0.018265990125483463], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 247.5, 244, 251, 247.5, 251.0, 251.0, 251.0, 0.024355196181105238, 0.006469348985606079, 0.019550753184441903], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.0, 244, 280, 262.0, 280.0, 280.0, 280.0, 0.024295137328263747, 0.015848780991484554, 0.01784174147544369], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 244.0, 241, 247, 244.0, 247.0, 247.0, 247.0, 0.024954146755337067, 0.014816524635981383, 0.017204714462175752], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.02451671426995354, 0.0065122522279564094, 0.01893820408938794], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 252.5, 248, 257, 252.5, 257.0, 257.0, 257.0, 0.024978768047159913, 0.013733443760303742, 0.018782862691712046], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 248.5, 245, 252, 248.5, 252.0, 252.0, 252.0, 0.02494107670628141, 0.018705807529711058, 0.02228621600219482], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 261.5, 243, 280, 261.5, 280.0, 280.0, 280.0, 0.024151964158485188, 0.018113973118863893, 0.02044897746621744], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 245.0, 242, 248, 245.0, 248.0, 248.0, 248.0, 0.025001875140635548, 0.015943578580893566, 0.01782360239517964], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1050.0, 976, 1124, 1050.0, 1124.0, 1124.0, 1124.0, 0.023897717767953162, 0.015589526825188195, 0.01750321125582507], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1118.0, 1045, 1191, 1118.0, 1191.0, 1191.0, 1191.0, 0.02435489959692641, 0.015887766533932465, 0.017624004493478975], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 39.75, 1, 152, 3.0, 152.0, 152.0, 152.0, 0.03474997393751955, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1116.5, 1096, 1137, 1116.5, 1137.0, 1137.0, 1137.0, 0.024036150370156717, 0.006384602442072878, 0.02021008346553216], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 878.0, 846, 910, 878.0, 910.0, 910.0, 910.0, 0.024822827071775203, 0.04345206789663775, 0.020265511164066476], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.0, 240, 248, 244.0, 248.0, 248.0, 248.0, 0.024984072653683277, 0.01593222601841326, 0.01800609923673658], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.0, 241, 255, 248.0, 255.0, 255.0, 255.0, 0.024312266754190827, 0.01585995526542917, 0.017854320897608886], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 241, 276, 258.5, 276.0, 276.0, 276.0, 0.024227153793972285, 0.015804432357786606, 0.017791816067448396], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 261.0, 260, 262, 261.0, 262.0, 262.0, 262.0, 0.024995938160048994, 0.016867376238861184, 0.021090322822541335], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 285.0, 280, 290, 285.0, 290.0, 290.0, 290.0, 0.02449599490483306, 0.018371996178624794, 0.02286930774318399], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 256.5, 251, 262, 256.5, 262.0, 262.0, 262.0, 0.02413127413127413, 0.0180984555984556, 0.020714248009169885], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 252.5, 250, 255, 252.5, 255.0, 255.0, 255.0, 0.024875312496113234, 0.016227254636136366, 0.020575575863484286], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 512.0, 509, 515, 512.0, 515.0, 515.0, 515.0, 0.024902878772786134, 0.016755940893017233, 0.023005979803765318], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 248.5, 245, 252, 248.5, 252.0, 252.0, 252.0, 0.024348672997321647, 0.015883704650596544, 0.017619498721694667], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 252.0, 249, 255, 252.0, 255.0, 255.0, 255.0, 0.024995313378741484, 0.013742540461163532, 0.018795304005498968], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 472.0, 469, 475, 472.0, 475.0, 475.0, 475.0, 0.024883359253499222, 0.11554723950233281, 0.023935653188180403], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 251.5, 244, 259, 251.5, 259.0, 259.0, 259.0, 0.02430694814112614, 0.018230211105844604, 0.023547356011715946], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 253.0, 250, 256, 253.0, 256.0, 256.0, 256.0, 0.02434926586963403, 0.018261949402225523, 0.023635908471109593], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 248.0, 245, 251, 248.0, 251.0, 251.0, 251.0, 0.024666691333358, 0.0185000185000185, 0.021342469259135924], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 252.0, 248, 256, 252.0, 256.0, 256.0, 256.0, 0.024540780642232227, 0.01840558548167417, 0.02166490791072064], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 252.0, 245, 259, 252.0, 259.0, 259.0, 259.0, 0.024298088955303665, 0.01822356671647775, 0.0233252162529917], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 258.8333333333333, 241, 277, 259.0, 277.0, 277.0, 277.0, 0.07164949069153699, 0.046740097443307344, 0.053947028635913115], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 267.5, 253, 282, 267.5, 282.0, 282.0, 282.0, 0.02419023198432473, 0.018142673988243548, 0.03099373472991606], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 266.5, 248, 285, 266.5, 285.0, 285.0, 285.0, 0.024304585059971563, 0.018228438794978673, 0.021551331283646658], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 243.5, 240, 247, 243.5, 247.0, 247.0, 247.0, 0.024940454664488534, 0.01626974972253744, 0.018315646394233765], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 248.0, 241, 255, 248.0, 255.0, 255.0, 255.0, 0.024316700710047663, 0.0064591236261064095, 0.019519851546542163], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 266.5, 251, 282, 266.5, 282.0, 282.0, 282.0, 0.024583312847239292, 0.006529942475047938, 0.01942177743497714], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.0, 244, 252, 248.0, 252.0, 252.0, 252.0, 0.024352823709909162, 0.015886412342011054, 0.01788410491196454], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1040.5, 1035, 1046, 1040.5, 1046.0, 1046.0, 1046.0, 0.02406246616215696, 0.015696999410469578, 0.018587315170181792], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1587.0, 1026, 2148, 1587.0, 2148.0, 2148.0, 2148.0, 0.024119342506723266, 0.015734102338370255, 0.019879614331713317], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 261.5, 243, 280, 261.5, 280.0, 280.0, 280.0, 0.0479443845139638, 0.035958288385472846, 0.03783111590554956], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 247.33333333333334, 243, 251, 247.5, 251.0, 251.0, 251.0, 0.07438723515044818, 0.05579042636283613, 0.06080284748137219], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1180.0, 1166, 1194, 1180.0, 1194.0, 1194.0, 1194.0, 0.02473563787026158, 0.04230905247047183, 0.01775458382289283], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 2396.5, 508, 5965, 1556.5, 5965.0, 5965.0, 5965.0, 0.03381005511038983, 0.01551828701355783, 0.042097480728268584], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 1084.0, 1017, 1151, 1084.0, 1151.0, 1151.0, 1151.0, 0.0242715501025473, 0.01583339401220859, 0.017563690064440966], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 36, 42.857142857142854, 16.071428571428573], "isController": false}, {"data": ["401/Unauthorized", 48, 57.142857142857146, 21.428571428571427], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 84, "401/Unauthorized", 48, "400/Bad Request", 36, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, "401/Unauthorized", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, "401/Unauthorized", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
