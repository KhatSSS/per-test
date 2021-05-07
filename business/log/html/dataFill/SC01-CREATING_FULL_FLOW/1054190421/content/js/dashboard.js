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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8922018348623854, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.75, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.75, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.25, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.25, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.25, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.25, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.75, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [0.75, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 218, 0, 0.0, 472.94036697247697, 1, 6257, 266.0, 841.2, 1284.5499999999995, 5198.320000000003, 3.6188579017264275, 13.651546159113545, 5.582033843791501], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 0, 0.0, 276.0, 267, 285, 276.0, 285.0, 285.0, 285.0, 0.5056890012642224, 0.9822416245259166, 1.3896570796460177], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.5028916268544129, 0.3280582097058084, 0.36783772315815944], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.0, 244, 266, 255.0, 266.0, 266.0, 266.0, 0.350754121360926, 0.22367425903191862, 0.26238052437741144], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 243, 266, 254.5, 266.0, 266.0, 266.0, 0.5442176870748299, 0.3550170068027211, 0.4145408163265306], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 984.5, 975, 994, 984.5, 994.0, 994.0, 994.0, 0.32846115946789295, 0.25885562079159136, 0.38267008129413693], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 0, 0.0, 261.5, 249, 274, 261.5, 274.0, 274.0, 274.0, 0.5256241787122208, 0.2889906373193167, 1.3972158344283836], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 0, 0.0, 455.5, 432, 479, 455.5, 479.0, 479.0, 479.0, 0.5924170616113744, 0.45183371593601895, 1.6991493261255926], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 2.8208744710860367, 1.8401798307475319, 2.410415197461213], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 820.0, 819, 821, 820.0, 821.0, 821.0, 821.0, 0.3050640634533252, 0.5284996568029287, 0.20705031650396583], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.5359056806002144, 0.34959472132904607, 0.45635718113612], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 0, 0.0, 604.5, 272, 937, 604.5, 937.0, 937.0, 937.0, 0.6159531875577456, 0.3693313058207576, 1.674622728672621], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 0, 0.0, 271.0, 260, 282, 271.0, 282.0, 282.0, 282.0, 0.667779632721202, 1.2970836811352253, 1.8350897328881468], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 0, 0.0, 262.0, 251, 273, 262.0, 273.0, 273.0, 273.0, 0.546448087431694, 0.3004397199453552, 1.452570013661202], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 255.5, 245, 266, 255.5, 266.0, 266.0, 266.0, 0.6435006435006435, 0.4197836229086229, 0.4832539012226512], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 0, 0.0, 301.5, 289, 314, 301.5, 314.0, 314.0, 314.0, 0.5124263387138099, 1.096412214962849, 1.3806486997181655], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 255.0, 244, 266, 255.0, 266.0, 266.0, 266.0, 0.5108556832694764, 0.33325351213282245, 0.43502554278416344], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 255.0, 244, 266, 255.0, 266.0, 266.0, 266.0, 0.7518796992481204, 0.49048402255639095, 0.6373355263157895], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1088.5, 998, 1179, 1088.5, 1179.0, 1179.0, 1179.0, 0.2972209838014564, 0.18576311487591024, 0.21623987591023927], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 0, 0.0, 261.5, 251, 272, 261.5, 272.0, 272.0, 272.0, 0.5571030640668524, 0.30629787604456826, 1.4808931058495822], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 2, 0, 0.0, 1773.0, 1131, 2415, 1773.0, 2415.0, 2415.0, 2415.0, 0.8281573498964804, 83.3393989389234, 2.274197722567288], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 283.0, 267, 299, 283.0, 299.0, 299.0, 299.0, 0.34381983840467595, 0.252828455389376, 0.4066072503008423], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 266.5, 259, 274, 266.5, 274.0, 274.0, 274.0, 0.36133694670280037, 0.1986647470641373, 0.28158875338753386], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 251, 266, 258.5, 266.0, 266.0, 266.0, 0.3556187766714083, 0.22677642692034142, 0.2660195145803699], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.6367398917542184, 0.4153732887615409, 0.48501671442215855], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 243, 266, 254.5, 266.0, 266.0, 266.0, 0.5059448520111307, 0.3226386605110043, 0.3784704654692639], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 254.5, 244, 265, 254.5, 265.0, 265.0, 265.0, 0.5224660397074191, 0.34082745559038663, 0.4576680054858934], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 254.5, 244, 265, 254.5, 265.0, 265.0, 265.0, 1.00150225338007, 0.6533237356034051, 0.7618850150225338], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 2, 0, 0.0, 562.0, 265, 859, 562.0, 859.0, 859.0, 859.0, 2.328288707799767, 1.5188445867287543, 1.7712274447031433], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 260.5, 248, 273, 260.5, 273.0, 273.0, 273.0, 0.6648936170212766, 0.36556162732712766, 1.7674222905585106], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 0, 0.0, 266.5, 260, 273, 266.5, 273.0, 273.0, 273.0, 0.6379585326953748, 0.3507525917065391, 1.69582336523126], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 243, 266, 254.5, 266.0, 266.0, 266.0, 0.5547850208044383, 0.36191054091539526, 0.42259015256588073], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 263.5, 251, 276, 263.5, 276.0, 276.0, 276.0, 0.4987531172069825, 0.27421680174563595, 1.3257870947630923], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 254.5, 244, 265, 254.5, 265.0, 265.0, 265.0, 0.5616399887672002, 0.3663823364223533, 0.4206815150238697], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 4.291845493562231, 2.799758583690987, 3.650583422746781], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 262.5, 250, 275, 262.5, 275.0, 275.0, 275.0, 0.35174111853675694, 0.1933889157580021, 0.27411075448469924], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 0, 0.0, 457.5, 433, 482, 457.5, 482.0, 482.0, 482.0, 0.4927322000492732, 0.3507829822616408, 1.4344088753387534], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 0, 0.0, 1535.5, 1272, 1799, 1535.5, 1799.0, 1799.0, 1799.0, 0.47158688988446124, 0.29612340839424667, 1.3746942053760907], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 254.5, 243, 266, 254.5, 266.0, 266.0, 266.0, 1.0121457489878543, 0.6602669534412956, 0.8589400936234818], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 260.0, 254, 266, 260.0, 266.0, 266.0, 266.0, 0.3729951510630362, 0.23785725941812755, 0.2761038325251772], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 254.5, 243, 266, 254.5, 266.0, 266.0, 266.0, 0.7042253521126761, 0.45939700704225356, 0.5288567341549296], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 262.5, 244, 281, 262.5, 281.0, 281.0, 281.0, 0.5253480430785396, 0.34270751247701603, 0.44223634095088], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.35842293906810035, 0.2285646281362007, 0.26531698028673834], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 258, 267, 262.5, 267.0, 267.0, 267.0, 0.36081544290095613, 0.23009031661555113, 0.2699068645138012], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 253.5, 242, 265, 253.5, 265.0, 265.0, 265.0, 0.6613756613756614, 0.43144427910052907, 0.5037822420634921], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 254.0, 244, 264, 254.0, 264.0, 264.0, 264.0, 0.5298013245033113, 0.34561258278145696, 0.38752069536423844], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 0, 0.0, 263.0, 249, 277, 263.0, 277.0, 277.0, 277.0, 0.7429420505200593, 0.40847302191679047, 1.9748908803863297], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 2, 0, 0.0, 3915.0, 3824, 4006, 3915.0, 4006.0, 4006.0, 4006.0, 0.46860356138706655, 0.3079787078256795, 1.2978122071227742], "isController": false}, {"data": ["ST14-090-GET-id", 2, 0, 0.0, 1097.0, 530, 1664, 1097.0, 1664.0, 1664.0, 1664.0, 0.5851375073142189, 57.66347279110591, 1.5548429271503803], "isController": false}, {"data": ["eProtect/paypage", 2, 0, 0.0, 1667.5, 628, 2707, 1667.5, 2707.0, 2707.0, 2707.0, 0.1902044698050404, 0.08730087969567284, 0.23515513552068473], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 0, 0.0, 262.0, 251, 273, 262.0, 273.0, 273.0, 273.0, 0.7204610951008645, 0.39611288724783866, 1.9151319344380404], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 254.5, 243, 266, 254.5, 266.0, 266.0, 266.0, 0.6184291898577613, 0.40342841682127395, 0.5254232374768089], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 2, 0, 0.0, 1466.0, 522, 2410, 1466.0, 2410.0, 2410.0, 2410.0, 0.8298755186721991, 82.41579681016597, 2.2051672717842323], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 292.0, 277, 307, 292.0, 307.0, 307.0, 307.0, 0.35765379113018597, 0.24448989628040058, 0.3150426949213162], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 261.5, 251, 272, 261.5, 272.0, 272.0, 272.0, 0.36284470246734396, 0.23138436592888245, 0.26859012155297535], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 266.0, 255, 277, 266.0, 277.0, 277.0, 277.0, 0.5044136191677175, 0.3847139029003783, 1.325563524590164], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.7404664938911515, 0.4830386893743058, 0.5560729822288041], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 0, 0.0, 261.5, 251, 272, 261.5, 272.0, 272.0, 272.0, 0.6329113924050633, 0.34797765031645567, 1.6824070411392404], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 2, 0, 0.0, 325.5, 2, 649, 325.5, 649.0, 649.0, 649.0, 0.283245999150262, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 2, 0, 0.0, 17.0, 1, 33, 17.0, 33.0, 33.0, 33.0, 0.3117692907248636, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.5234231876472127, 0.3414518450667364, 0.39870125621565033], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 0, 0.0, 262.0, 250, 274, 262.0, 274.0, 274.0, 274.0, 0.6966213862765587, 0.38300570358760017, 1.8517611459421803], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.5, 242, 269, 255.5, 269.0, 269.0, 269.0, 0.7160759040458289, 0.46712764052989614, 0.5454484425349087], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.3734129947722181, 0.22171396564600448, 0.25416880601194924], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 0, 0.0, 270.5, 260, 281, 270.5, 281.0, 281.0, 281.0, 0.5305039787798408, 4.148706896551724, 1.3941271551724137], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 262.5, 253, 272, 262.5, 272.0, 272.0, 272.0, 0.37174721189591076, 0.2043883596654275, 0.2897014405204461], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 664.0, 644, 684, 664.0, 684.0, 684.0, 684.0, 0.47961630695443647, 0.34612934652278177, 1.3339328537170263], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 0, 0.0, 289.0, 282, 296, 289.0, 296.0, 296.0, 296.0, 0.7476635514018691, 0.5103679906542057, 2.044392523364486], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 257.5, 249, 266, 257.5, 266.0, 266.0, 266.0, 0.3533568904593639, 0.22533403268551236, 0.2615669169611307], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.7524454477050414, 0.4908530850263356, 0.5716821858540256], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 254.5, 244, 265, 254.5, 265.0, 265.0, 265.0, 0.6230529595015577, 0.40644470404984423, 0.4678981697819315], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 2, 0, 0.0, 93.5, 2, 185, 93.5, 185.0, 185.0, 185.0, 0.31333228889237036, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 0, 0.0, 277.0, 265, 289, 277.0, 289.0, 289.0, 289.0, 0.7222824124232575, 0.9063797851209823, 1.947482168652943], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 841.0, 839, 843, 841.0, 843.0, 843.0, 843.0, 0.3041825095057034, 0.5210313688212928, 0.25665399239543724], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 244, 265, 254.5, 265.0, 265.0, 265.0, 0.3708511032820323, 0.23649001019840535, 0.2774140089004265], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.0, 243, 267, 255.0, 267.0, 267.0, 267.0, 0.6101281269066504, 0.3980132702867602, 0.4647460341671751], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 244, 265, 254.5, 265.0, 265.0, 265.0, 0.630119722747322, 0.41105466288594833, 0.4799740075614367], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 278.0, 269, 287, 278.0, 287.0, 287.0, 287.0, 0.3533568904593639, 0.23844688604240283, 0.30780697879858654], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 0, 0.0, 597.5, 580, 615, 597.5, 615.0, 615.0, 615.0, 0.49419322955275513, 0.3165925376822338, 1.39522717445021], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 2, 0, 0.0, 263.5, 255, 272, 263.5, 272.0, 272.0, 272.0, 4.040404040404041, 2.221433080808081, 10.740214646464647], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 2, 0, 0.0, 5867.5, 5478, 6257, 5867.5, 6257.0, 6257.0, 6257.0, 0.3049245311785333, 0.23584006708339686, 0.8439024622655893], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 254.5, 243, 266, 254.5, 266.0, 266.0, 266.0, 0.513874614594039, 0.33522289311408016, 0.4391018435251799], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 530.0, 483, 577, 530.0, 577.0, 577.0, 577.0, 0.34946706272933775, 0.23513945919972043, 0.3324032413070068], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 254.5, 244, 265, 254.5, 265.0, 265.0, 265.0, 0.6811989100817438, 0.4443758514986376, 0.5115644158719346], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 261.5, 251, 272, 261.5, 272.0, 272.0, 272.0, 0.35656979853806386, 0.19604374665715815, 0.2778737297200927], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 489.5, 481, 498, 489.5, 498.0, 498.0, 498.0, 0.35893754486719315, 1.6709524183417086, 0.3428133973438622], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 0, 0.0, 993.5, 673, 1314, 993.5, 1314.0, 1314.0, 1314.0, 0.5395198273536552, 0.3387805165902347, 1.541108881845158], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 0, 0.0, 268.5, 255, 282, 268.5, 282.0, 282.0, 282.0, 0.6837606837606838, 0.43135683760683763, 1.9544604700854702], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 416.0, 386, 446, 416.0, 446.0, 446.0, 446.0, 0.6193868070610096, 0.4711936745122329, 1.705128329204088], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 0, 0.0, 434.0, 433, 435, 434.0, 435.0, 435.0, 435.0, 0.5267316302343956, 0.40122135896760597, 1.459314096655254], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 0, 0.0, 265.0, 255, 275, 265.0, 275.0, 275.0, 275.0, 0.7432181345224824, 0.46886612783351916, 2.0888494054254925], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 254.16666666666666, 243, 265, 254.5, 265.0, 265.0, 265.0, 1.3966480446927374, 0.9110946229050279, 1.0897673708100557], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 0, 0.0, 816.5, 792, 841, 816.5, 841.0, 841.0, 841.0, 0.7840062720501764, 0.4746912975303802, 2.5173951391611133], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 0, 0.0, 265.5, 254, 277, 265.5, 277.0, 277.0, 277.0, 0.7072135785007072, 0.4461523161244696, 1.96210329738331], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 412.0, 275, 549, 412.0, 549.0, 549.0, 549.0, 0.49566294919454773, 0.3233426270136307, 0.3775557620817844], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 0, 0.0, 261.0, 250, 272, 261.0, 272.0, 272.0, 272.0, 0.6131207847946045, 0.3370966814837523, 1.6297995861434702], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 0, 0.0, 665.0, 500, 830, 665.0, 830.0, 830.0, 830.0, 0.5268703898840885, 15.14958179662803, 1.3938397326132772], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 253.5, 243, 264, 253.5, 264.0, 264.0, 264.0, 0.693000693000693, 0.4520746708246708, 0.5278716216216216], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.0, 244, 264, 254.0, 264.0, 264.0, 264.0, 3.9603960396039604, 2.583539603960396, 3.0167079207920793], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.7344840249724568, 0.4791360631656262, 0.5874437660668381], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.6763611768684478, 0.4412199864727765, 0.5759638146770376], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 0, 0.0, 260.75, 249, 272, 261.0, 272.0, 272.0, 272.0, 0.9962640099626401, 0.6109900373599004, 2.666757471980075], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 262.33333333333337, 250, 277, 262.0, 277.0, 277.0, 277.0, 1.3513513513513513, 0.7429793074324323, 3.637035472972973], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1112.0, 941, 1283, 1112.0, 1283.0, 1283.0, 1283.0, 0.28022978842650975, 0.4813712869553034, 0.208804031806081], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 254.5, 243, 266, 254.5, 266.0, 266.0, 266.0, 0.5509641873278236, 0.359418044077135, 0.41376119146005513], "isController": false}]}, function(index, item){
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
