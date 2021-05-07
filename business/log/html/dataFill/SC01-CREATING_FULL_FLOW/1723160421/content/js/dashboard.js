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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8967889908256881, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.75, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.25, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.25, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [0.75, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.75, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.75, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 218, 0, 0.0, 405.19724770642205, 1, 3257, 269.0, 887.2, 1103.4499999999998, 2111.900000000001, 3.7158879779092167, 10.524126771651865, 5.731701275845023], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 0, 0.0, 278.5, 273, 284, 278.5, 284.0, 284.0, 284.0, 0.18876828692779613, 0.3666602760736196, 0.5187441009910335], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.18798759281887395, 0.12263253125293731, 0.13750264357552403], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.16803898504453033, 0.1071576730801546, 0.12570103764073265], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 270.0, 268, 272, 270.0, 272.0, 272.0, 272.0, 0.206996481059822, 0.13503286069136824, 0.15767310080728628], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 821.5, 701, 942, 821.5, 942.0, 942.0, 942.0, 0.16178611875101118, 0.12750136507037696, 0.1884871481151917], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 0, 0.0, 268.0, 261, 275, 268.0, 275.0, 275.0, 275.0, 0.20567667626491157, 0.11308200071986836, 0.5467303835870012], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 0, 0.0, 439.0, 429, 449, 439.0, 449.0, 449.0, 449.0, 0.21609940572663427, 0.16481800378173958, 0.619808549432739], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.2625705658395694, 0.1712862675594066, 0.22436449717736642], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 888.0, 887, 889, 888.0, 889.0, 889.0, 889.0, 0.1590077913817777, 0.27515801399268563, 0.10792032715853077], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 262.0, 255, 269, 262.0, 269.0, 269.0, 269.0, 0.20682523267838676, 0.13492114788004136, 0.17612461220268874], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 0, 0.0, 268.0, 261, 275, 268.0, 275.0, 275.0, 275.0, 0.2862458852154, 0.17163571633032776, 0.7782310004293688], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 0, 0.0, 279.0, 270, 288, 279.0, 288.0, 288.0, 288.0, 0.2174149364061311, 0.4223030356560496, 0.5974664365691923], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 0, 0.0, 275.0, 274, 276, 275.0, 276.0, 276.0, 276.0, 0.20693222969477496, 0.11377230988101397, 0.5500678996378686], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 262.0, 254, 270, 262.0, 270.0, 270.0, 270.0, 0.2192982456140351, 0.14305783991228072, 0.16468784265350878], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 0, 0.0, 328.0, 291, 365, 328.0, 365.0, 365.0, 365.0, 0.19015021867275148, 0.406854618273436, 0.5123285676934778], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.18887524789876287, 0.12321158749645858, 0.16083907828879024], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.2302025782688766, 0.15017121316758747, 0.19513265423572743], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1107.5, 1103, 1112, 1107.5, 1112.0, 1112.0, 1112.0, 0.1562744178777934, 0.09767151117362088, 0.11369574347554305], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 0, 0.0, 394.5, 275, 514, 394.5, 514.0, 514.0, 514.0, 0.2222716159146477, 0.12220597632807291, 0.5908431040231162], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 2, 0, 0.0, 1191.5, 1169, 1214, 1191.5, 1214.0, 1214.0, 1214.0, 0.23172285946008575, 0.1443742034526706, 0.6363326960954698], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 287.5, 285, 290, 287.5, 290.0, 290.0, 290.0, 0.16688918558077437, 0.1227222233811749, 0.19736601927570094], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 268.5, 262, 275, 268.5, 275.0, 275.0, 275.0, 0.16636167027116952, 0.0914664261354184, 0.1296451297621028], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.16728002676480427, 0.10667368894279024, 0.1251333012713282], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.21990104452996154, 0.14345107201759208, 0.16750274876305662], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.19282684149633628, 0.12296477294639414, 0.14424351619745468], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.19056693663649357, 0.12431515007146261, 0.16693217008099095], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.26181437360911114, 0.1707929702840686, 0.19917323929833747], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.2630194634402946, 0.17157910310362967, 0.20009000197264598], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 0.21805494984736154, 0.11988763355865677, 0.5796343491059747], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 0, 0.0, 271.0, 266, 276, 271.0, 276.0, 276.0, 276.0, 0.21939447125932426, 0.12062410870996051, 0.5831950691092584], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 612.0, 269, 955, 612.0, 955.0, 955.0, 955.0, 0.20665426741062204, 0.13480961975614794, 0.15741243025418475], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 268.5, 262, 275, 268.5, 275.0, 275.0, 275.0, 0.18809367064798269, 0.10341478181134206, 0.49999118310918844], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.22851919561243145, 0.14907306901279707, 0.17116623343235832], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.26072220049537215, 0.17008049797940294, 0.2217666373354191], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 269.0, 264, 274, 269.0, 274.0, 274.0, 274.0, 0.16777116013757234, 0.09224137027095043, 0.1307435408103347], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 0, 0.0, 913.0, 458, 1368, 913.0, 1368.0, 1368.0, 1368.0, 0.18511662347278787, 0.13178712745279525, 0.5388990767308404], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 0, 0.0, 2526.5, 1796, 3257, 2526.5, 3257.0, 3257.0, 3257.0, 0.19603999215840032, 0.12309933101352676, 0.5714642349539306], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.26133542401672544, 0.17048053051091078, 0.2217778158891938], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.16784155756965424, 0.10703177450486741, 0.12424209046659952], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.21593608291945585, 0.14086455409198875, 0.1621629372705679], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 262.5, 256, 269, 262.5, 269.0, 269.0, 269.0, 0.1903130649919117, 0.12414953849081739, 0.16020494338186317], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 262.0, 256, 268, 262.0, 268.0, 268.0, 268.0, 0.16693097404223353, 0.10645109965779151, 0.12356804523829397], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.16665277893508876, 0.10627369594200484, 0.12466409049245897], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.21853146853146854, 0.14255763767482518, 0.16645951704545456], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.2055287226389888, 0.13407537765902786, 0.150333020758401], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 0, 0.0, 270.0, 264, 276, 270.0, 276.0, 276.0, 276.0, 0.27693159789531985, 0.152258290639712, 0.7361404389365827], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 2, 0, 0.0, 378.0, 370, 386, 378.0, 386.0, 386.0, 386.0, 0.2581311306143521, 0.1608277942694889, 0.7149022328342798], "isController": false}, {"data": ["ST14-090-GET-id", 2, 0, 0.0, 1335.5, 1041, 1630, 1335.5, 1630.0, 1630.0, 1630.0, 0.23778385447628106, 23.2465066207942, 0.6318455742480086], "isController": false}, {"data": ["eProtect/paypage", 2, 0, 0.0, 1523.0, 860, 2186, 1523.0, 2186.0, 2186.0, 2186.0, 0.1271940981938438, 0.058380103663190026, 0.15725364093106078], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 0, 0.0, 609.0, 275, 943, 609.0, 943.0, 943.0, 943.0, 0.214799699280421, 0.11809788153796585, 0.5709812318762754], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 262.0, 255, 269, 262.0, 269.0, 269.0, 269.0, 0.23089355806972986, 0.15062196952205031, 0.19616933156314936], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 2, 0, 0.0, 1075.5, 790, 1361, 1075.5, 1361.0, 1361.0, 1361.0, 0.24615384615384614, 24.065625, 0.6540865384615384], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 295.5, 291, 300, 295.5, 300.0, 300.0, 300.0, 0.16633399866932802, 0.11370488190286095, 0.1465168621091151], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 262.5, 256, 269, 262.5, 269.0, 269.0, 269.0, 0.16626485992185552, 0.10602632180563638, 0.12307496466871727], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 325.0, 288, 362, 325.0, 362.0, 362.0, 362.0, 0.18738873793685001, 0.14292051203972642, 0.4924444275274056], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 260.5, 253, 268, 260.5, 268.0, 268.0, 268.0, 0.23094688221709006, 0.15065675519630484, 0.17343569572748269], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 0.28401022436807727, 0.1561501526554956, 0.7549568659471741], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 2, 0, 0.0, 338.0, 4, 672, 338.0, 672.0, 672.0, 672.0, 0.1571462245619549, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 2, 0, 0.0, 13.5, 1, 26, 13.5, 26.0, 26.0, 26.0, 0.16589250165892502, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.20610057708161583, 0.13444842333058532, 0.15699067394888705], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 0, 0.0, 268.0, 261, 275, 268.0, 275.0, 275.0, 275.0, 0.21609940572663427, 0.11881246623446784, 0.574436115613182], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 254, 267, 260.5, 267.0, 267.0, 267.0, 0.21530842932500807, 0.14045510819248574, 0.1640044676499085], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 262.0, 255, 269, 262.0, 269.0, 269.0, 269.0, 0.1710863986313088, 0.10158254918733961, 0.1164523631308811], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 0, 0.0, 330.0, 293, 367, 330.0, 367.0, 367.0, 367.0, 0.20475020475020475, 1.5964117526617525, 0.5380691415847666], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 267.5, 261, 274, 267.5, 274.0, 274.0, 274.0, 0.16794021328407088, 0.09233431648333193, 0.13087528339910992], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 639.0, 592, 686, 639.0, 686.0, 686.0, 686.0, 0.182882223847842, 0.13198238615581565, 0.5086411850768106], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 0, 0.0, 467.0, 308, 626, 467.0, 626.0, 626.0, 626.0, 0.27453671928620454, 0.18740348318462594, 0.7506863417982155], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 262.0, 255, 269, 262.0, 269.0, 269.0, 269.0, 0.1677008217340265, 0.10694202792218682, 0.12413791296327352], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 263.0, 254, 272, 263.0, 272.0, 272.0, 272.0, 0.2766251728907331, 0.18045470262793914, 0.21017029737206083], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.22075055187637968, 0.14400524282560706, 0.16577849061810154], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 2, 0, 0.0, 86.0, 1, 171, 86.0, 171.0, 171.0, 171.0, 0.166237220513673, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 0, 0.0, 280.5, 275, 286, 280.5, 286.0, 286.0, 286.0, 0.23113371085172774, 0.29004572113717786, 0.623203296544551], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 909.5, 909, 910, 909.5, 910.0, 910.0, 910.0, 0.15876796062554577, 0.2716420576327697, 0.13396046677780424], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.0, 255, 269, 262.0, 269.0, 269.0, 269.0, 0.16820857863751051, 0.10726582211942809, 0.1258279015979815], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.23164234422052352, 0.15111043548760714, 0.17644631688672688], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.2849002849002849, 0.18585292022792024, 0.2170138888888889], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 283.5, 275, 292, 283.5, 292.0, 292.0, 292.0, 0.16718214494691966, 0.11281529507648584, 0.1456313215748558], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 0, 0.0, 635.0, 624, 646, 635.0, 646.0, 646.0, 646.0, 0.19922303018228907, 0.12762725371052894, 0.5624548635322243], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 2, 0, 0.0, 269.0, 262, 276, 269.0, 276.0, 276.0, 276.0, 0.2609262883235486, 0.14345849641226355, 0.6935950750163079], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 2, 0, 0.0, 796.5, 526, 1067, 796.5, 1067.0, 1067.0, 1067.0, 0.2503442233070472, 0.1559761860057579, 0.6928471961446989], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 262.5, 256, 269, 262.5, 269.0, 269.0, 269.0, 0.18862586060548903, 0.12304890125436198, 0.1611793242478544], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 635.0, 559, 711, 635.0, 711.0, 711.0, 711.0, 0.1621796951021732, 0.10912286125527083, 0.1542607646772624], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 261.0, 255, 267, 261.0, 267.0, 267.0, 267.0, 0.21715526601520088, 0.14165988056460369, 0.1630785152008686], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 268.5, 262, 275, 268.5, 275.0, 275.0, 275.0, 0.16701461377870563, 0.09182541753653445, 0.13015396659707726], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 527.0, 504, 550, 527.0, 550.0, 550.0, 550.0, 0.16753224995811694, 0.7799084331546322, 0.16000638716702964], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 0, 0.0, 756.5, 723, 790, 756.5, 790.0, 790.0, 790.0, 0.21841214371519058, 0.1371474691492847, 0.6238823441083324], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 0, 0.0, 275.0, 271, 279, 275.0, 279.0, 279.0, 279.0, 0.21659085986571366, 0.1366383744855967, 0.6191029754169374], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 430.0, 421, 439, 430.0, 439.0, 439.0, 439.0, 0.21493820526598603, 0.16351256045137025, 0.5917097662547018], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 0, 0.0, 429.5, 422, 437, 429.5, 437.0, 437.0, 437.0, 0.2034174125305126, 0.1549468572009764, 0.5635695306143206], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 0, 0.0, 273.5, 267, 280, 273.5, 280.0, 280.0, 280.0, 0.23022907793254288, 0.1452421722113503, 0.6470696155174399], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 262.5, 254, 273, 262.0, 273.0, 273.0, 273.0, 0.7471980074719801, 0.4874299501867995, 0.5830187577833126], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 0, 0.0, 729.0, 412, 1046, 729.0, 1046.0, 1046.0, 1046.0, 0.2560491614389963, 0.17453351043400334, 0.8221578543080271], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 0, 0.0, 272.5, 265, 280, 272.5, 280.0, 280.0, 280.0, 0.21535479702810378, 0.1358585926564014, 0.5974833773016044], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 255, 268, 261.5, 268.0, 268.0, 268.0, 0.18846588767433095, 0.12294454391255183, 0.14355800037693178], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 0, 0.0, 267.5, 260, 275, 267.5, 275.0, 275.0, 275.0, 0.23113371085172774, 0.12707839766554951, 0.614400352478909], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 0, 0.0, 669.5, 522, 817, 669.5, 817.0, 817.0, 817.0, 0.21473051320592657, 6.1743410457376, 0.5680712502684131], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.21659085986571366, 0.14129169374052414, 0.16498131903833657], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 256, 267, 261.5, 267.0, 267.0, 267.0, 0.2616088947024199, 0.17065892740353172, 0.19927240026160892], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.2313208420078649, 0.1509007055285681, 0.18501149375433726], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.21746221593998044, 0.14186011742959662, 0.1851826682613896], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 0, 0.0, 269.25, 260, 283, 267.0, 283.0, 283.0, 283.0, 0.513347022587269, 0.3148261036960986, 1.3741056532340863], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 268.83333333333337, 261, 275, 269.5, 275.0, 275.0, 275.0, 0.5481955230698949, 0.3014004682503426, 1.4754168570123343], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1093.0, 1070, 1116, 1093.0, 1116.0, 1116.0, 1116.0, 0.15467904098994587, 0.2654014404485692, 0.11525401198762568], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 266.0, 264, 268, 266.0, 268.0, 268.0, 268.0, 0.20706077233668083, 0.13507480070400663, 0.15549778703799563], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 218, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
