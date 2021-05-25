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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9166666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "LG-030-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "LG-010-POST-check-lead-with-application"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-LOGIN-FLOW"], "isController": false}, {"data": [1.0, 500, 1500, "LG-070-GET-payments/failed"], "isController": false}, {"data": [1.0, 500, 1500, "LG-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "AF-010-GET-Login"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "LG-060-GET-dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "LG-110-GET-applicants/popup/uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-040-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-080-GET-summary?emailEncrypted"], "isController": false}, {"data": [1.0, 500, 1500, "LG-130-GET-customers/popup/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-020-POST-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "LG-100-GET-applicants/id"], "isController": false}, {"data": [1.0, 500, 1500, "LG-120-GET-missed-payment-time?customerUuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-090-GET-customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler - SET-ALL-SWITCH"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 120, 0, 0.0, 352.5333333333334, 0, 2036, 281.0, 955.2000000000003, 1072.3999999999999, 2033.27, 0.26022748219068165, 0.2567226279993928, 0.42714748663623453], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LG-030-GET-applicants/email", 6, 0, 0.0, 301.16666666666663, 283, 325, 298.0, 325.0, 325.0, 325.0, 0.013354106387714221, 0.0297641817827732, 0.03606738955041175], "isController": false}, {"data": ["LG-010-POST-check-lead-with-application", 6, 0, 0.0, 1060.5, 983, 1161, 1051.5, 1161.0, 1161.0, 1161.0, 0.013313570078195034, 0.00722885250339496, 0.010284212824074485], "isController": false}, {"data": ["TEST-01-BUSINESS-LOGIN-FLOW", 10, 0, 0.0, 1.5999999999999999, 0, 12, 0.5, 10.900000000000004, 12.0, 12.0, 0.022254961743720762, 0.0, 0.0], "isController": false}, {"data": ["LG-070-GET-payments/failed", 6, 0, 0.0, 311.83333333333337, 274, 411, 289.5, 411.0, 411.0, 411.0, 0.01335458195706947, 0.006703374146419637, 0.03653817101209925], "isController": false}, {"data": ["LG-050-GET-noaa/latest/customerUUID", 6, 0, 0.0, 276.66666666666663, 253, 333, 262.0, 333.0, 333.0, 333.0, 0.013354463061555171, 0.010433174266839977, 0.03596402112898631], "isController": false}, {"data": ["AF-010-GET-Login", 6, 0, 0.0, 1375.0, 959, 2036, 1109.0, 2036.0, 2036.0, 2036.0, 0.01330167534600983, 0.02280812984541236, 0.008716234528488862], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 6, 0, 0.0, 774.1666666666666, 283, 921, 849.0, 921.0, 921.0, 921.0, 0.013335644845106484, 0.022879399790408116, 0.011186834884713349], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 64.5, 0, 638, 1.0, 574.3000000000002, 638.0, 638.0, 0.022223160533444745, 0.0, 0.0], "isController": false}, {"data": ["LG-060-GET-dashboard", 6, 0, 0.0, 411.3333333333333, 347, 485, 410.0, 485.0, 485.0, 485.0, 0.013348847660725688, 0.014252675887753991, 0.03592282669636044], "isController": false}, {"data": ["LG-110-GET-applicants/popup/uuid", 6, 0, 0.0, 257.3333333333333, 247, 280, 254.0, 280.0, 280.0, 280.0, 0.013344898912390738, 0.00775411606725829, 0.03596432880718845], "isController": false}, {"data": ["LG-040-GET-maintenance/configuration", 6, 0, 0.0, 255.66666666666666, 246, 280, 252.0, 280.0, 280.0, 280.0, 0.01335437389130875, 0.007433587029341785, 0.03571599475618252], "isController": false}, {"data": ["LG-080-GET-summary?emailEncrypted", 6, 0, 0.0, 326.16666666666663, 305, 349, 327.0, 349.0, 349.0, 349.0, 0.013354017222230877, 0.010858833014691645, 0.036236682149907745], "isController": false}, {"data": ["LG-130-GET-customers/popup/customerId", 6, 0, 0.0, 258.5, 248, 283, 256.0, 283.0, 283.0, 283.0, 0.013344245961141556, 0.008678972470820582, 0.035476060144740584], "isController": false}, {"data": ["LG-020-POST-auth/oauth/token", 6, 0, 0.0, 464.8333333333333, 452, 489, 459.5, 489.0, 489.0, 489.0, 0.013332414878086176, 0.06251739463503625, 0.01299823651037373], "isController": false}, {"data": ["LG-100-GET-applicants/id", 6, 0, 0.0, 268.33333333333337, 257, 291, 263.5, 291.0, 291.0, 291.0, 0.013344097572041446, 0.025332935234422434, 0.03544960295749683], "isController": false}, {"data": ["LG-120-GET-missed-payment-time?customerUuid", 6, 0, 0.0, 296.5, 272, 328, 296.0, 328.0, 328.0, 328.0, 0.013342851233880168, 0.007205660871421615, 0.03623244303158475], "isController": false}, {"data": ["LG-090-GET-customers/customerId", 6, 0, 0.0, 280.8333333333333, 265, 300, 280.5, 300.0, 300.0, 300.0, 0.01334329632792485, 0.019330839943824722, 0.03539535214070951], "isController": false}, {"data": ["JSR223 Sampler - SET-ALL-SWITCH", 10, 0, 0.0, 13.0, 0, 121, 1.0, 109.10000000000004, 121.0, 121.0, 0.022255506568712766, 0.0, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 120, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
