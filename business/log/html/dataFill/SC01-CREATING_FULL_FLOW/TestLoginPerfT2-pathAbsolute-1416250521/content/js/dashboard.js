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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9111111111111111, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "LG-030-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "LG-010-POST-check-lead-with-application"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-LOGIN-FLOW"], "isController": false}, {"data": [1.0, 500, 1500, "LG-070-GET-payments/failed"], "isController": false}, {"data": [1.0, 500, 1500, "LG-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [0.45, 500, 1500, "AF-010-GET-Login"], "isController": false}, {"data": [0.55, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [0.95, 500, 1500, "LG-060-GET-dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "LG-110-GET-applicants/popup/uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-040-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-080-GET-summary?emailEncrypted"], "isController": false}, {"data": [1.0, 500, 1500, "LG-130-GET-customers/popup/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-020-POST-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "LG-100-GET-applicants/id"], "isController": false}, {"data": [1.0, 500, 1500, "LG-120-GET-missed-payment-time?customerUuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-090-GET-customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler - SET-ALL-SWITCH"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 180, 0, 0.0, 378.72777777777776, 0, 1506, 289.5, 987.9, 1027.9, 1359.3899999999996, 1.5009255707686406, 1.6467267445132832, 2.7402640482464187], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LG-030-GET-applicants/email", 10, 0, 0.0, 293.0, 275, 321, 287.0, 320.4, 321.0, 321.0, 0.09358651605476682, 0.20883319256361543, 0.25303088705979243], "isController": false}, {"data": ["LG-010-POST-check-lead-with-application", 10, 0, 0.0, 1045.6000000000004, 987, 1198, 1008.5, 1190.2, 1198.0, 1198.0, 0.09287034371314208, 0.05042569443799511, 0.07173871277060095], "isController": false}, {"data": ["TEST-01-BUSINESS-LOGIN-FLOW", 10, 0, 0.0, 1.2999999999999998, 0, 9, 0.5, 8.200000000000003, 9.0, 9.0, 0.09337940050424876, 0.0, 0.0], "isController": false}, {"data": ["LG-070-GET-payments/failed", 10, 0, 0.0, 304.6, 279, 366, 297.0, 362.0, 366.0, 366.0, 0.09321054397673466, 0.04678732383207188, 0.2552913004269043], "isController": false}, {"data": ["LG-050-GET-noaa/latest/customerUUID", 10, 0, 0.0, 269.6, 256, 294, 263.0, 293.7, 294.0, 294.0, 0.09309860072803106, 0.07273328181877427, 0.2509843722361353], "isController": false}, {"data": ["AF-010-GET-Login", 10, 0, 0.0, 1110.4, 949, 1506, 1027.0, 1487.9, 1506.0, 1506.0, 0.0925874488454345, 0.15895384284206432, 0.060670095874303276], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 835.4, 238, 978, 904.5, 975.3, 978.0, 978.0, 0.09317580410718944, 0.159963929316835, 0.07816212473444896], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 74.1, 0, 734, 1.0, 660.7000000000003, 734.0, 734.0, 0.09260802726380322, 0.0, 0.0], "isController": false}, {"data": ["LG-060-GET-dashboard", 10, 0, 0.0, 394.8, 332, 520, 378.0, 512.7, 520.0, 520.0, 0.09302931353669541, 0.09938873926674295, 0.2506158831272734], "isController": false}, {"data": ["LG-110-GET-applicants/popup/uuid", 10, 0, 0.0, 264.0, 251, 290, 255.5, 289.4, 290.0, 290.0, 0.09254375005783984, 0.05377297976993624, 0.24966930069315268], "isController": false}, {"data": ["LG-040-GET-maintenance/configuration", 10, 0, 0.0, 263.99999999999994, 250, 289, 258.0, 288.3, 289.0, 289.0, 0.0931098696461825, 0.05182873603351955, 0.2492871275605214], "isController": false}, {"data": ["LG-080-GET-summary?emailEncrypted", 10, 0, 0.0, 312.5, 291, 359, 302.0, 357.0, 359.0, 359.0, 0.09321054397673466, 0.07587010586387531, 0.2531977042243018], "isController": false}, {"data": ["LG-130-GET-customers/popup/customerId", 10, 0, 0.0, 265.8, 252, 292, 256.5, 291.9, 292.0, 292.0, 0.092563452246515, 0.060202401558768534, 0.24639595520854543], "isController": false}, {"data": ["LG-020-POST-auth/oauth/token", 10, 0, 0.0, 471.3999999999999, 457, 495, 466.5, 494.4, 495.0, 495.0, 0.09341341977188443, 0.4386599319483237, 0.09116930832033329], "isController": false}, {"data": ["LG-100-GET-applicants/id", 10, 0, 0.0, 271.8, 259, 297, 263.0, 296.9, 297.0, 297.0, 0.09254032444637751, 0.17582661644811726, 0.24615364817094046], "isController": false}, {"data": ["LG-120-GET-missed-payment-time?customerUuid", 10, 0, 0.0, 310.09999999999997, 272, 384, 297.5, 380.40000000000003, 384.0, 384.0, 0.09251464044184991, 0.04996151969174122, 0.2514880401698569], "isController": false}, {"data": ["LG-090-GET-customers/customerId", 10, 0, 0.0, 319.20000000000005, 278, 493, 301.5, 476.6, 493.0, 493.0, 0.09252662453621029, 0.13425396360927858, 0.24575577481795388], "isController": false}, {"data": ["JSR223 Sampler - SET-ALL-SWITCH", 10, 0, 0.0, 9.5, 0, 86, 1.0, 77.60000000000002, 86.0, 86.0, 0.09324183201551545, 0.0, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 180, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
