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

    var data = {"OkPercent": 99.08256880733946, "KoPercent": 0.9174311926605505};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9128440366972477, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.25, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.25, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.75, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 218, 2, 0.9174311926605505, 377.9816513761468, 1, 2485, 265.0, 725.3999999999996, 1096.5499999999997, 1693.8600000000001, 3.866619368570415, 11.008256612495565, 5.964202177190493], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 0, 0.0, 283.5, 276, 291, 283.5, 291.0, 291.0, 291.0, 0.2295684113865932, 0.44590973657024796, 0.6308647555096419], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 260.5, 259, 262, 260.5, 262.0, 262.0, 262.0, 0.2304147465437788, 0.1503096198156682, 0.1685357862903226], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 259.5, 259, 260, 259.5, 260.0, 260.0, 260.0, 0.1774622892635315, 0.11316687000887311, 0.1327501109139308], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 257, 259, 258.0, 259.0, 259.0, 259.0, 0.23110700254217703, 0.1507612086896233, 0.17603853709267392], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 932.0, 876, 988, 932.0, 988.0, 988.0, 988.0, 0.17174753112924002, 0.13535181408329755, 0.20009258265349936], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 0, 0.0, 266.5, 264, 269, 266.5, 269.0, 269.0, 269.0, 0.23070711731456917, 0.12684385453916253, 0.6132663802053293], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 0, 0.0, 417.5, 391, 444, 417.5, 444.0, 444.0, 444.0, 0.2298058140870964, 0.1752718171894749, 0.6591207773181662], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 258.5, 257, 260, 258.5, 260.0, 260.0, 260.0, 0.253324889170361, 0.16525490816972768, 0.21646413869537684], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 923.5, 887, 960, 923.5, 960.0, 960.0, 960.0, 0.16467682173734047, 0.2849680938657884, 0.11176796006587074], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 258.5, 257, 260, 258.5, 260.0, 260.0, 260.0, 0.23113371085172774, 0.15077863168843175, 0.1968248006471744], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 0, 0.0, 264.5, 264, 265, 264.5, 265.0, 265.0, 265.0, 0.2528764698444809, 0.15162710203565558, 0.6875079023896826], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 0, 0.0, 272.5, 271, 274, 272.5, 274.0, 274.0, 274.0, 0.23532180256500765, 0.45708502470878926, 0.6466753441581362], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 0, 0.0, 267.0, 266, 268, 267.0, 268.0, 268.0, 268.0, 0.2308669052291354, 0.1269317066835969, 0.6136911289391666], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 258.0, 257, 259, 258.0, 259.0, 259.0, 259.0, 0.23512814483893724, 0.15338437573477545, 0.1765757259581472], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 0, 0.0, 305.0, 301, 309, 305.0, 309.0, 309.0, 309.0, 0.23004370830457788, 0.49221266103059574, 0.6198150304807913], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 0.23001725129384704, 0.15005031627372054, 0.1958740655549166], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 258.5, 257, 260, 258.5, 260.0, 260.0, 260.0, 0.23649048125812935, 0.1542730873832328, 0.2004626345039612], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1094.5, 1082, 1107, 1094.5, 1107.0, 1107.0, 1107.0, 0.1631986944104447, 0.10199918400652794, 0.11873342513259894], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 0, 0.0, 265.0, 264, 266, 265.0, 266.0, 266.0, 266.0, 0.2327475852438031, 0.12796571337134877, 0.6186903584312813], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 2, 0, 0.0, 1181.0, 1022, 1340, 1181.0, 1340.0, 1340.0, 1340.0, 0.23150827642088204, 0.14424050816066675, 0.6357434309526566], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 286.5, 280, 293, 286.5, 293.0, 293.0, 293.0, 0.17502406580904875, 0.12870422026778683, 0.20698646845191215], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 265, 266, 265.5, 266.0, 266.0, 266.0, 0.17761989342806395, 0.09765625, 0.13841862788632328], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 266.5, 259, 274, 266.5, 274.0, 274.0, 274.0, 0.17738359201773835, 0.11311668514412417, 0.13269124168514412], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.23479690068091102, 0.15316829067856302, 0.17884920169053767], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.23113371085172774, 0.14739288397087713, 0.1728988501097885], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 258.5, 257, 260, 258.5, 260.0, 260.0, 260.0, 0.23145469274389538, 0.1509880222196505, 0.20274888612429118], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 258.0, 257, 259, 258.0, 259.0, 259.0, 259.0, 0.2524933720489837, 0.16471247317257923, 0.19208236018179523], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 2, 0, 0.0, 257.5, 257, 258, 257.5, 258.0, 258.0, 258.0, 0.25329280648429586, 0.16523397922998986, 0.1926905236828774], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 268.0, 264, 272, 268.0, 272.0, 272.0, 272.0, 0.23529411764705882, 0.1293658088235294, 0.6254595588235294], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 0, 0.0, 270.0, 265, 275, 270.0, 275.0, 275.0, 275.0, 0.23463162834350068, 0.12900156909901456, 0.6236985276865322], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 258, 265, 261.5, 265.0, 265.0, 265.0, 0.23272050267628577, 0.1518137654177333, 0.17726757039795207], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 266.0, 265, 267, 266.0, 267.0, 267.0, 267.0, 0.2303086135421465, 0.12662475529709813, 0.6122070762321511], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.23296447291788003, 0.1519729178800233, 0.17449585032032613], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 2, 0, 0.0, 259.0, 258, 260, 259.0, 260.0, 260.0, 260.0, 0.25393600812595224, 0.16565356780091417, 0.2159943975368207], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 267.5, 265, 270, 267.5, 270.0, 270.0, 270.0, 0.17738359201773835, 0.09752633037694013, 0.13823447893569846], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 0, 0.0, 468.5, 455, 482, 468.5, 482.0, 482.0, 482.0, 0.2249971875351558, 0.16017866182922716, 0.6549966953538081], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 0, 0.0, 1501.0, 1288, 1714, 1501.0, 1714.0, 1714.0, 1714.0, 0.21378941742383753, 0.13424472207375734, 0.6232045029396045], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 0.25246149962130776, 0.16469168139358747, 0.21424711247159808], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 261.5, 258, 265, 261.5, 265.0, 265.0, 265.0, 0.18125793003443902, 0.11558733233641472, 0.1341733505528367], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.23609963404556722, 0.154018120646913, 0.17730529158304806], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 259.5, 259, 260, 259.5, 260.0, 260.0, 260.0, 0.23150827642088204, 0.1510229771964348, 0.1948829436277347], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 259.0, 258, 260, 259.0, 260.0, 260.0, 260.0, 0.1775883502042266, 0.11324725847984372, 0.1314570014207068], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.0, 259, 261, 260.0, 261.0, 261.0, 261.0, 0.17769880053309642, 0.11331769213682807, 0.1329270324300311], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 259.0, 257, 261, 259.0, 261.0, 261.0, 261.0, 0.23537719195010004, 0.15354684006119806, 0.17929122043074025], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 258.0, 257, 259, 258.0, 259.0, 259.0, 259.0, 0.23105360443622922, 0.15072637476894638, 0.16900307590110905], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 0, 0.0, 264.5, 264, 265, 264.5, 265.0, 265.0, 265.0, 0.25300442757748265, 0.1391030202403542, 0.6725371600253004], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 2, 0, 0.0, 395.0, 386, 404, 395.0, 404.0, 404.0, 404.0, 0.2493143854400399, 0.15533454874096234, 0.6904839815507354], "isController": false}, {"data": ["ST14-090-GET-id", 2, 0, 0.0, 1595.5, 1583, 1608, 1595.5, 1608.0, 1608.0, 1608.0, 0.2162863631448037, 21.31265545582351, 0.5747218692548934], "isController": false}, {"data": ["eProtect/paypage", 2, 0, 0.0, 1602.0, 719, 2485, 1602.0, 2485.0, 2485.0, 2485.0, 0.12854296548621374, 0.0589992126743364, 0.15892128350151039], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 0.2360160490913382, 0.12976273011564787, 0.6273785992447486], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 300.5, 258, 343, 300.5, 343.0, 343.0, 343.0, 0.23781212841854935, 0.15513525564803804, 0.20204741379310345], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 2, 0, 0.0, 1319.0, 1309, 1329, 1319.0, 1329.0, 1329.0, 1329.0, 0.2229902999219534, 21.974235038744567, 0.5925357481324562], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 297.5, 295, 300, 297.5, 300.0, 300.0, 300.0, 0.17705382436260625, 0.12103288774787536, 0.1559595210694051], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 258.5, 257, 260, 258.5, 260.0, 260.0, 260.0, 0.17776197671318106, 0.11335797929072972, 0.13158552573104615], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 0.2300966405890474, 0.1754936291992637, 0.6046777927979752], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 259.0, 258, 260, 259.0, 260.0, 260.0, 260.0, 0.2363507445048452, 0.1541819309855826, 0.17749386965256442], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 0.25303643724696356, 0.13912061930668015, 0.672622248228745], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 2, 0, 0.0, 293.5, 3, 584, 293.5, 584.0, 584.0, 584.0, 0.16232448664881097, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 2, 0, 0.0, 13.5, 1, 26, 13.5, 26.0, 26.0, 26.0, 0.17040129504984236, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 257, 260, 258.5, 260.0, 260.0, 260.0, 0.2308136180034622, 0.15056982111944606, 0.17581506058857474], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 264, 267, 265.5, 267.0, 267.0, 267.0, 0.2358490566037736, 0.12967091686320753, 0.6269346992924528], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 259.0, 258, 260, 259.0, 260.0, 260.0, 260.0, 0.2362111727884729, 0.15409088224873035, 0.17992647927246957], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.1832508704416346, 0.10880520432472054, 0.12473228193146418], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 0, 0.0, 270.5, 270, 271, 270.5, 271.0, 271.0, 271.0, 0.23076035537094727, 1.7992096457828546, 0.6064219885773624], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 265.0, 264, 266, 265.0, 266.0, 266.0, 266.0, 0.18112660749864154, 0.09958425783372578, 0.14115139920304293], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 634.5, 613, 656, 634.5, 656.0, 656.0, 656.0, 0.22136137244050913, 0.15975200608743775, 0.615661317100166], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 0, 0.0, 289.0, 284, 294, 289.0, 294.0, 294.0, 294.0, 0.25211143325349805, 0.1720955975040968, 0.6893672003025337], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 264.5, 261, 268, 264.5, 268.0, 268.0, 268.0, 0.17741506253880954, 0.1131367537478932, 0.1313287279340016], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.2532286654849329, 0.1651921372499367, 0.19239443530007597], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 258.5, 257, 260, 258.5, 260.0, 260.0, 260.0, 0.2333177788147457, 0.15220339477368178, 0.17521618350443305], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 2, 0, 0.0, 91.0, 1, 181, 91.0, 181.0, 181.0, 181.0, 0.17076502732240437, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 0, 0.0, 280.0, 279, 281, 280.0, 281.0, 281.0, 281.0, 0.23565453045834805, 0.2957188199599387, 0.635392733003417], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 913.0, 908, 918, 913.0, 918.0, 918.0, 918.0, 0.1653849334325643, 0.282963284544778, 0.13954353758372612], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 257, 259, 258.0, 259.0, 259.0, 259.0, 0.1811922449719152, 0.11554544527994201, 0.13554029262547562], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 257, 259, 258.0, 259.0, 259.0, 259.0, 0.23778385447628106, 0.1551168113185115, 0.18112442040185472], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.2532286654849329, 0.1651921372499367, 0.19288902253735124], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 283.5, 282, 285, 283.5, 285.0, 285.0, 285.0, 0.1770224818551956, 0.11945560054876969, 0.1542031775535493], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 0, 0.0, 576.0, 574, 578, 576.0, 578.0, 578.0, 578.0, 0.22294058633374206, 0.1428213131200535, 0.6294152686434066], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 2, 0, 0.0, 266.5, 266, 267, 266.5, 267.0, 267.0, 267.0, 0.2536783358701167, 0.13947353817858954, 0.6743285451547437], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 2, 0, 0.0, 418.0, 411, 425, 418.0, 425.0, 425.0, 425.0, 0.25936973155232784, 0.16159950071326676, 0.7178259953313448], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 259.0, 258, 260, 259.0, 260.0, 260.0, 260.0, 0.23004370830457788, 0.15006757533931445, 0.19657055152979064], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 590.5, 487, 694, 590.5, 694.0, 694.0, 694.0, 0.17424638438752396, 0.11724195199512111, 0.1657382601498519], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 258.0, 257, 259, 258.0, 259.0, 259.0, 259.0, 0.2358490566037736, 0.1538546580188679, 0.1771171137971698], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 268.5, 267, 270, 268.5, 270.0, 270.0, 270.0, 0.17744654422855113, 0.09756094179753348, 0.1382835373968592], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 493.5, 488, 499, 493.5, 499.0, 499.0, 499.0, 0.17946877243359657, 0.8354762091708543, 0.1714066986719311], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 0, 0.0, 688.5, 667, 710, 688.5, 710.0, 710.0, 710.0, 0.2256317689530686, 0.14168088616877256, 0.6445048087770757], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 0, 0.0, 268.5, 267, 270, 268.5, 270.0, 270.0, 270.0, 0.235626767200754, 0.1486473550895382, 0.6735151831998115], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 436.0, 433, 439, 436.0, 439.0, 439.0, 439.0, 0.23044129508007835, 0.1753064149095518, 0.6343886824518954], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 0, 0.0, 427.5, 399, 456, 427.5, 456.0, 456.0, 456.0, 0.22747952684258418, 0.17327542083712466, 0.6302338063011829], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 0, 0.0, 270.5, 270, 271, 270.5, 271.0, 271.0, 271.0, 0.2361275088547816, 0.14896325265643445, 0.6636474321133412], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 258.33333333333337, 257, 259, 258.5, 259.0, 259.0, 259.0, 0.6702412868632708, 0.4372277144772118, 0.5229714728552279], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 266.5, 266, 267, 266.5, 267.0, 267.0, 267.0, 0.25220680958385877, 0.1871847414880202, 0.8098203026481715], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 0, 0.0, 270.0, 269, 271, 270.0, 271.0, 271.0, 271.0, 0.2358490566037736, 0.1487875884433962, 0.6543429392688679], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.23044129508007835, 0.15032693858739485, 0.17553145523677843], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 265, 266, 265.5, 266.0, 266.0, 266.0, 0.23761435190685518, 0.13064148449566354, 0.6316272127836522], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 0, 0.0, 788.5, 783, 794, 788.5, 794.0, 794.0, 794.0, 0.2195630694917115, 6.313295916126908, 0.5808558156768031], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 257, 259, 258.0, 259.0, 259.0, 259.0, 0.23598820058997053, 0.15394542772861358, 0.1797566371681416], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 0.2539037704709915, 0.16563253776818587, 0.19340326266345056], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 258.0, 257, 259, 258.0, 259.0, 259.0, 259.0, 0.23632281696797824, 0.1541637126314546, 0.18901209677419356], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.23576564894494872, 0.15380024755393137, 0.2007691854296829], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 0, 0.0, 264.5, 264, 265, 264.5, 265.0, 265.0, 265.0, 0.45987583352494826, 0.2820332260289722, 1.2309762301678546], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 266.3333333333333, 264, 268, 266.0, 268.0, 268.0, 268.0, 0.652670510170782, 0.3588413058849125, 1.7566014902643317], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1158.5, 1096, 1221, 1158.5, 1221.0, 1221.0, 1221.0, 0.1584032947885316, 0.2717915907650879, 0.11802901750356408], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 261.5, 259, 264, 261.5, 264.0, 264.0, 264.0, 0.23105360443622922, 0.15072637476894638, 0.17351584161275416], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2, 100.0, 0.9174311926605505], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 218, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
