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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.25, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.25, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.25, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.125, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 478.50446428571405, 1, 3309, 260.0, 1120.0, 1270.75, 2935.75, 1.3984878849743714, 0.8325531710244548, 1.069558871501439], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 265.0, 251, 279, 265.0, 279.0, 279.0, 279.0, 0.02820357339274886, 0.021152680044561646, 0.02440270119724169], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1012.0, 1012, 1012, 1012.0, 1012.0, 1012.0, 1012.0, 0.027290714334447703, 0.007249095995087672, 0.023906026130858977], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1202.5, 1198, 1207, 1202.5, 1207.0, 1207.0, 1207.0, 0.0272186611140598, 0.017755923461124947, 0.019164701819567496], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.0, 248, 252, 250.0, 252.0, 252.0, 252.0, 0.027752338134487832, 0.017697535939277885, 0.02000119681958205], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 278.0, 270, 286, 278.0, 286.0, 286.0, 286.0, 0.02755807865075647, 0.017977340369829415, 0.020237964009149283], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 255.5, 254, 257, 255.5, 257.0, 257.0, 257.0, 0.02754479472241733, 0.016838907711165283, 0.03136448305306505], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 263.5, 252, 275, 263.5, 275.0, 275.0, 275.0, 0.027503128480864697, 0.007305518502729686, 0.022077706651631626], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 291.0, 280, 302, 291.0, 302.0, 302.0, 302.0, 0.028337843773467278, 0.02125338283010046, 0.02756298085778653], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 1387.0, 920, 1854, 1387.0, 1854.0, 1854.0, 1854.0, 0.027159521449232067, 0.046441720759380224, 0.017690821100232214], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1111.5, 1082, 1141, 1111.5, 1141.0, 1141.0, 1141.0, 0.027228295644834113, 0.01776220848705975, 0.02199003954909942], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 267.5, 256, 279, 267.5, 279.0, 279.0, 279.0, 0.028361553078646587, 0.02127116480898494, 0.023570001630789303], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.0, 2, 21, 2.5, 21.0, 21.0, 21.0, 0.03685209412024838, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1123.0, 1119, 1127, 1123.0, 1127.0, 1127.0, 1127.0, 0.028113578858588697, 0.007467669384312623, 0.024626836168119202], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 271.0, 266, 276, 271.0, 276.0, 276.0, 276.0, 0.027566055159676372, 0.007322233401789037, 0.022128220059818342], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1062.0, 1002, 1122, 1062.0, 1122.0, 1122.0, 1122.0, 0.028076874482332627, 0.018315773588084172, 0.020317347647859838], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 252.0, 250, 254, 252.0, 254.0, 254.0, 254.0, 0.027562636090515697, 0.020671977067886774, 0.02072581034150106], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1072.0, 1023, 1121, 1072.0, 1121.0, 1121.0, 1121.0, 0.027250555230062812, 0.01777672938836129, 0.022008016772716743], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 267.0, 249, 285, 267.0, 285.0, 285.0, 285.0, 0.028741000474226508, 0.0187490120281087, 0.02309945643582853], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 248, 277, 262.5, 277.0, 277.0, 277.0, 0.028193236442577426, 0.01839168158558762, 0.0207044080125178], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1538.5, 1029, 2048, 1538.5, 2048.0, 2048.0, 2048.0, 0.027425437092903668, 0.017140898183064794, 0.019203162495714778], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 265.0, 251, 279, 265.0, 279.0, 279.0, 279.0, 0.028239015023155994, 0.021179261267366994, 0.02173080452953801], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 260.5, 247, 274, 260.5, 274.0, 274.0, 274.0, 0.02764722145424385, 0.007343793198783522, 0.022193375034559027], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 263.0, 256, 270, 263.0, 270.0, 270.0, 270.0, 0.027719643525384263, 0.020816802608418457, 0.031969627933084784], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 258.0, 256, 260, 258.0, 260.0, 260.0, 260.0, 0.02776967828827703, 0.015267899293261687, 0.020393357492953443], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 246, 251, 248.5, 251.0, 251.0, 251.0, 0.0277623542476402, 0.01770392316768462, 0.020008415463631316], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 286.0, 275, 297, 286.0, 297.0, 297.0, 297.0, 0.028348688873139617, 0.01849309000708717, 0.020818568391211906], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.027555420840164782, 0.01757196270373789, 0.01985927791019688], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 249.0, 247, 251, 249.0, 251.0, 251.0, 251.0, 0.027565675221214544, 0.017982295945089176, 0.021966397441905337], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 263.0, 247, 279, 263.0, 279.0, 279.0, 279.0, 0.028274945570729775, 0.018444984024655754, 0.02162039295105607], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 262.0, 247, 277, 262.0, 277.0, 277.0, 277.0, 0.028450311530911265, 0.007557114000398304, 0.022838043045321346], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1122.0, 1081, 1163, 1122.0, 1163.0, 1163.0, 1163.0, 0.027822990136749996, 0.018150153722020508, 0.022443154153276853], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 284.5, 274, 295, 284.5, 295.0, 295.0, 295.0, 0.02835793384094035, 0.00753257617649978, 0.0227638882980986], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 261.0, 246, 276, 261.0, 276.0, 276.0, 276.0, 0.02818250993433475, 0.007485979201307669, 0.0226230694980695], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 248, 275, 261.5, 275.0, 275.0, 275.0, 0.0276365244306876, 0.018028513984081364, 0.020295572628786205], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 247.5, 245, 250, 247.5, 250.0, 250.0, 250.0, 0.027574416456411743, 0.007324454371234368, 0.02213493196012739], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1326.0, 1079, 1573, 1326.0, 1573.0, 1573.0, 1573.0, 0.02734294893704286, 0.017837001845649056, 0.01973285084421355], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 258.0, 255, 261, 258.0, 261.0, 261.0, 261.0, 0.02775118289417086, 0.015257730438884957, 0.020379774937906728], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 269.0, 256, 282, 269.0, 282.0, 282.0, 282.0, 0.02751940117783037, 0.020639550883372777, 0.027761270914744895], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 253.5, 250, 257, 253.5, 257.0, 257.0, 257.0, 0.028455573735505443, 0.02134168030162908, 0.028761248843992317], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 261.5, 247, 276, 261.5, 276.0, 276.0, 276.0, 0.028263357969560362, 0.01843742492545539, 0.022743170866130605], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 562.0, 252, 872, 562.0, 872.0, 872.0, 872.0, 0.02754593284301573, 0.01756591225243093, 0.02063254930721979], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1023.5, 1004, 1043, 1023.5, 1043.0, 1043.0, 1043.0, 0.028176951253874333, 0.01838105804451958, 0.020389766483516484], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 248.5, 246, 251, 248.5, 251.0, 251.0, 251.0, 0.027567955009097426, 0.017983783150465896, 0.021995135978938082], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 249.5, 247, 252, 249.5, 252.0, 252.0, 252.0, 0.027766208524226017, 0.017706381021796475, 0.01979426974871581], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 246, 251, 248.5, 251.0, 251.0, 251.0, 0.027771220684005164, 0.017709577252593138, 0.020014805532027162], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.0, 247, 277, 262.0, 277.0, 277.0, 277.0, 0.02843857977732592, 0.018551729776614956, 0.020884582023973725], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1049.0, 1010, 1088, 1049.0, 1088.0, 1088.0, 1088.0, 0.027219401989738285, 0.017756406766743334, 0.019165223471290335], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.02845476403886921, 0.007558296697824632, 0.022841617226514146], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1079.5, 1030, 1129, 1079.5, 1129.0, 1129.0, 1129.0, 0.027977897461005808, 0.020983423095754353, 0.022404175701196054], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 251.5, 247, 256, 251.5, 256.0, 256.0, 256.0, 0.028506271379703536, 0.007571978335233751, 0.022882963939566705], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1295.5, 1002, 1589, 1295.5, 1589.0, 1589.0, 1589.0, 0.028155927526642546, 0.018367343347458223, 0.02268421895457041], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 255.5, 253, 258, 255.5, 258.0, 258.0, 258.0, 0.027766208524226017, 0.01697426419547411, 0.022722737054005276], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.027775077423028316, 0.017712036676989736, 0.019800592303526043], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 295.0, 294, 296, 295.0, 296.0, 296.0, 296.0, 0.027560357182229083, 0.0073207198765296, 0.021289299346819536], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 262.5, 247, 278, 262.5, 278.0, 278.0, 278.0, 0.02822785524755829, 0.018414264946649352, 0.020702264932535425], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 262.0, 247, 277, 262.0, 277.0, 277.0, 277.0, 0.02821630620335492, 0.01840673099984481, 0.022870638817172443], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 267.5, 248, 287, 267.5, 287.0, 287.0, 287.0, 0.02846894038603883, 0.018571535329955022, 0.020601059400444117], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 264.0, 252, 276, 264.0, 276.0, 276.0, 276.0, 0.028325402220711535, 0.007523934964876501, 0.022737774048266483], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 324.5, 1, 1292, 2.5, 1292.0, 1292.0, 1292.0, 0.03641992169716835, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 264.5, 252, 277, 264.5, 277.0, 277.0, 277.0, 0.027511830086937382, 0.017947170408275558, 0.02020400022009464], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 246.0, 244, 248, 246.0, 248.0, 248.0, 248.0, 0.028480291638186373, 0.0075650774663932555, 0.022862109107997266], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.0, 248, 262, 255.0, 262.0, 262.0, 262.0, 0.02850058426197737, 0.0185921780146493, 0.02093011656738963], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 249.5, 247, 252, 249.5, 252.0, 252.0, 252.0, 0.0275489682911375, 0.01635719992286289, 0.01899372227885066], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 256.0, 247, 265, 256.0, 265.0, 265.0, 265.0, 0.027534555867613855, 0.007313866402334931, 0.021269368839143127], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 257.5, 255, 260, 257.5, 260.0, 260.0, 260.0, 0.027780092785509906, 0.015273625232658277, 0.020401005639358837], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 253.0, 251, 255, 253.0, 255.0, 255.0, 255.0, 0.027567955009097426, 0.020675966256823067, 0.02417580429508739], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 271.0, 257, 285, 271.0, 285.0, 285.0, 285.0, 0.028398199554148264, 0.021298649665611197, 0.02382231779005211], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 250.0, 247, 253, 250.0, 253.0, 253.0, 253.0, 0.027756574838664907, 0.017700237665672053, 0.0197874019845951], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1073.0, 1023, 1123, 1073.0, 1123.0, 1123.0, 1123.0, 0.02810409757742679, 0.018333532404024508, 0.020584055842841887], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1760.5, 1114, 2407, 1760.5, 2407.0, 2407.0, 2407.0, 0.027508424454989338, 0.01794494876555945, 0.019905998555807717], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 45.25, 2, 172, 3.5, 172.0, 172.0, 172.0, 0.0368588857558836, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1031.0, 990, 1072, 1031.0, 1072.0, 1072.0, 1072.0, 0.028211132112731685, 0.007493581967444353, 0.0235551933167828], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 1372.0, 922, 1822, 1372.0, 1822.0, 1822.0, 1822.0, 0.027509937965089888, 0.04794090263545206, 0.022459285291811668], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 247, 252, 249.5, 252.0, 252.0, 252.0, 0.0277808645405045, 0.017715727094677187, 0.02002175588954328], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.5, 248, 283, 265.5, 283.0, 283.0, 283.0, 0.028711293587332577, 0.018729632926111486, 0.02108485622819736], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.0, 253, 277, 265.0, 277.0, 277.0, 277.0, 0.02833423058396849, 0.018483658232510698, 0.02080795058510186], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 257.0, 253, 261, 257.0, 261.0, 261.0, 261.0, 0.027756574838664907, 0.017049692942890847, 0.022443792935951702], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 276.0, 271, 281, 276.0, 281.0, 281.0, 281.0, 0.02755390232141627, 0.020665426741062205, 0.025266713163876835], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 279.5, 269, 290, 279.5, 290.0, 290.0, 290.0, 0.028132560625668147, 0.02109942046925111, 0.023681901620435493], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 264.5, 252, 277, 264.5, 277.0, 277.0, 277.0, 0.0275303866642807, 0.01795927567552686, 0.022314668878274393], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 256.5, 253, 260, 256.5, 260.0, 260.0, 260.0, 0.02777469170092212, 0.01707438322825242, 0.0246825873514054], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 246.5, 245, 248, 246.5, 248.0, 248.0, 248.0, 0.02847623658057351, 0.018576294956858502, 0.020606339166215796], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 258.5, 256, 261, 258.5, 261.0, 261.0, 261.0, 0.027760812836599855, 0.015263025026372773, 0.02038684692687802], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 357.5, 353, 362, 357.5, 362.0, 362.0, 362.0, 0.027510694782596733, 0.01851061396993081, 0.02648979009339881], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 271.5, 253, 290, 271.5, 290.0, 290.0, 290.0, 0.028723663990578636, 0.021542747992933976, 0.027349191787904462], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 251.0, 250, 252, 251.0, 252.0, 252.0, 252.0, 0.02847542570761433, 0.021356569280710745, 0.027418720456745826], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 266.5, 251, 282, 266.5, 282.0, 282.0, 282.0, 0.02842443364315966, 0.021318325232369748, 0.02437173119013104], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 267.5, 251, 284, 267.5, 284.0, 284.0, 284.0, 0.027622401767833715, 0.020716801325875285, 0.0241426265451281], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 638.0, 288, 988, 638.0, 988.0, 988.0, 988.0, 0.028453144783827232, 0.021339858587870426, 0.027091617347882378], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 265.1666666666667, 253, 278, 265.5, 278.0, 278.0, 278.0, 0.08384338056510439, 0.054694705290517315, 0.06312817032782762], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 265.5, 251, 280, 265.5, 280.0, 280.0, 280.0, 0.02825018362619357, 0.021187637719645176, 0.03572655058195378], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 256.5, 251, 262, 256.5, 262.0, 262.0, 262.0, 0.028494899413005075, 0.021371174559753802, 0.02504434518721149], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 246, 251, 248.5, 251.0, 251.0, 251.0, 0.02757213559976288, 0.017986510332657815, 0.02024828708107586], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 265.5, 248, 283, 265.5, 283.0, 283.0, 283.0, 0.028696874910322266, 0.007622607398054352, 0.023035967945590725], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 257.5, 248, 267, 257.5, 267.0, 267.0, 267.0, 0.02784041871989755, 0.007395111222472787, 0.02199501830507531], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 246.5, 245, 248, 246.5, 248.0, 248.0, 248.0, 0.028478263965028693, 0.018577617508436686, 0.020913725099317947], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1075.5, 1003, 1148, 1075.5, 1148.0, 1148.0, 1148.0, 0.028181318603897478, 0.018383907058011247, 0.021603842875058125], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1003.0, 993, 1013, 1003.0, 1013.0, 1013.0, 1013.0, 0.028166633805593894, 0.01837432752161789, 0.022747857575416162], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 268.25, 256, 281, 268.0, 281.0, 281.0, 281.0, 0.05607424229680096, 0.04205568172260072, 0.04424608181231951], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 252.0, 249, 256, 251.5, 256.0, 256.0, 256.0, 0.08210405320342647, 0.06157803990256985, 0.0647852294808287], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1549.0, 1046, 2052, 1549.0, 2052.0, 2052.0, 2052.0, 0.02672010688042752, 0.04549463510354042, 0.019178982965931866], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 2178.25, 553, 3309, 2425.5, 3309.0, 3309.0, 3309.0, 0.035415154144458415, 0.016255002390522907, 0.04409601712322703], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 1063.5, 1002, 1125, 1063.5, 1125.0, 1125.0, 1125.0, 0.0272929488666603, 0.01780438461223543, 0.01975007334980008], "isController": false}]}, function(index, item){
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
