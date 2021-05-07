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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8842105263157894, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "LG-030-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "LG-010-POST-check-lead-with-application"], "isController": false}, {"data": [1.0, 500, 1500, "LG-070-GET-payments/failed"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "LG-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Login"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "LG-060-GET-dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "LG-110-GET-applicants/popup/uuid"], "isController": false}, {"data": [0.65, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "LG-040-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-080-GET-summary?emailEncrypted"], "isController": false}, {"data": [1.0, 500, 1500, "LG-130-GET-customers/popup/customerId"], "isController": false}, {"data": [0.75, 500, 1500, "LG-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.95, 500, 1500, "LG-100-GET-applicants/id"], "isController": false}, {"data": [1.0, 500, 1500, "LG-120-GET-missed-payment-time?customerUuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-090-GET-customers/customerId"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 0, 0.0, 402.4473684210527, 0, 1686, 294.0, 990.1000000000001, 1043.3999999999999, 1436.660000000001, 1.2910327582575136, 1.362286406274419, 2.314648677710659], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LG-030-GET-applicants/email", 10, 0, 0.0, 298.40000000000003, 282, 331, 288.5, 330.6, 331.0, 331.0, 0.07622938947881967, 0.16913395790613114, 0.20538758356646822], "isController": false}, {"data": ["LG-010-POST-check-lead-with-application", 10, 0, 0.0, 1069.8, 992, 1226, 1020.0, 1219.8, 1226.0, 1226.0, 0.07473003773866906, 0.04006522531106378, 0.058090927773418524], "isController": false}, {"data": ["LG-070-GET-payments/failed", 10, 0, 0.0, 300.6, 281, 329, 294.0, 328.0, 329.0, 329.0, 0.07625787362545183, 0.037756583914164144, 0.20814527029603308], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 20.099999999999998, 0, 191, 1.0, 172.10000000000008, 191.0, 191.0, 0.07509367936500785, 0.0, 0.0], "isController": false}, {"data": ["LG-050-GET-noaa/latest/customerUUID", 10, 0, 0.0, 278.79999999999995, 264, 314, 269.5, 313.0, 314.0, 314.0, 0.07623113279463332, 0.05903446123646897, 0.2047967249199573], "isController": false}, {"data": ["AF-010-GET-Login", 10, 0, 0.0, 1014.1999999999999, 947, 1151, 1015.5, 1140.9, 1151.0, 1151.0, 0.07466810029419231, 0.12756286587369145, 0.054834386153547486], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 885.6999999999998, 837, 938, 901.5, 935.9, 938.0, 938.0, 0.07478760320689243, 0.1279130940005385, 0.06310204020581549], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 60.0, 1, 589, 1.0, 530.4000000000002, 589.0, 589.0, 0.07474958887726117, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 10, 0, 0.0, 3.1, 0, 24, 1.0, 21.800000000000008, 24.0, 24.0, 0.07508071176514754, 0.0, 0.0], "isController": false}, {"data": ["LG-060-GET-dashboard", 10, 0, 0.0, 387.9, 330, 446, 392.5, 444.7, 446.0, 446.0, 0.07618002864369076, 0.08094128043392144, 0.20451064330225188], "isController": false}, {"data": ["LG-110-GET-applicants/popup/uuid", 10, 0, 0.0, 262.90000000000003, 247, 291, 253.5, 290.5, 291.0, 291.0, 0.07631374105221385, 0.04382078099482593, 0.20516770421557104], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 778.0999999999999, 421, 1686, 533.0, 1658.6000000000001, 1686.0, 1686.0, 0.07339234077531669, 0.033399248829392165, 0.09059367064453154], "isController": false}, {"data": ["LG-040-GET-maintenance/configuration", 10, 0, 0.0, 264.4, 248, 294, 256.5, 293.3, 294.0, 294.0, 0.07623868808465543, 0.04191638807779396, 0.20340243735085806], "isController": false}, {"data": ["LG-080-GET-summary?emailEncrypted", 10, 0, 0.0, 316.40000000000003, 295, 348, 308.5, 347.6, 348.0, 348.0, 0.07626485258003995, 0.06159280574579399, 0.2064513392108113], "isController": false}, {"data": ["LG-130-GET-customers/popup/customerId", 10, 0, 0.0, 268.40000000000003, 253, 297, 260.5, 296.4, 297.0, 297.0, 0.07640703555983434, 0.04917210589251059, 0.2027323394688183], "isController": false}, {"data": ["LG-020-POST-auth/oauth/token", 10, 0, 0.0, 497.40000000000003, 476, 521, 497.5, 521.0, 521.0, 521.0, 0.07514220662603978, 0.3498075185413395, 0.07176667781276065], "isController": false}, {"data": ["LG-100-GET-applicants/id", 10, 0, 0.0, 338.09999999999997, 262, 897, 270.0, 837.4000000000002, 897.0, 897.0, 0.07630500637146803, 0.14389156963213356, 0.20231259013528877], "isController": false}, {"data": ["LG-120-GET-missed-payment-time?customerUuid", 10, 0, 0.0, 307.5, 266, 438, 291.5, 427.20000000000005, 438.0, 438.0, 0.07630209525553572, 0.04068451563429932, 0.2067011838270079], "isController": false}, {"data": ["LG-090-GET-customers/customerId", 10, 0, 0.0, 294.70000000000005, 279, 320, 289.0, 319.9, 320.0, 320.0, 0.0762869610326203, 0.1097370054697751, 0.20196674937444692], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 190, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
