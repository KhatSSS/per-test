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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8157894736842105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "LG-030-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "LG-010-POST-check-lead-with-application"], "isController": false}, {"data": [1.0, 500, 1500, "LG-070-GET-payments/failed"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "LG-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Login"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "LG-060-GET-dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "LG-110-GET-applicants/popup/uuid"], "isController": false}, {"data": [0.0, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "LG-040-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-080-GET-summary?emailEncrypted"], "isController": false}, {"data": [1.0, 500, 1500, "LG-130-GET-customers/popup/customerId"], "isController": false}, {"data": [0.5, 500, 1500, "LG-020-POST-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "LG-100-GET-applicants/id"], "isController": false}, {"data": [1.0, 500, 1500, "LG-120-GET-missed-payment-time?customerUuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-090-GET-customers/customerId"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19, 0, 0.0, 496.05263157894746, 28, 1767, 297.0, 1132.0, 1767.0, 1767.0, 1.1214070707666883, 1.183656229711385, 2.0105325576934425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LG-030-GET-applicants/email", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 7.458578020134229, 9.04139576342282], "isController": false}, {"data": ["LG-010-POST-check-lead-with-application", 1, 0, 0.0, 1132.0, 1132, 1132, 1132.0, 1132.0, 1132.0, 1132.0, 0.8833922261484098, 0.4736155587455831, 0.686699425795053], "isController": false}, {"data": ["LG-070-GET-payments/failed", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.6670612373737375, 9.190209385521886], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 0.0, 0.0], "isController": false}, {"data": ["LG-050-GET-noaa/latest/customerUUID", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.8896047108208953, 10.024341184701491], "isController": false}, {"data": ["AF-010-GET-Login", 1, 0, 0.0, 1058.0, 1058, 1058, 1058.0, 1058.0, 1058.0, 1058.0, 0.945179584120983, 1.6134510869565217, 0.6941162570888468], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 1, 0, 0.0, 846.0, 846, 846, 846.0, 846.0, 846.0, 846.0, 1.1820330969267139, 2.0235390809692673, 0.9973404255319149], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 0.0, 0.0], "isController": false}, {"data": ["LG-060-GET-dashboard", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 2.6604597431077694, 6.728246397243107], "isController": false}, {"data": ["LG-110-GET-applicants/popup/uuid", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.2518382352941178, 10.543045343137255], "isController": false}, {"data": ["eProtect/paypage_01", 1, 0, 0.0, 1767.0, 1767, 1767, 1767.0, 1767.0, 1767.0, 1767.0, 0.5659309564233164, 0.25754279852857953, 0.6985710243350312], "isController": false}, {"data": ["LG-040-GET-maintenance/configuration", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.1393178501945527, 10.381201361867705], "isController": false}, {"data": ["LG-080-GET-summary?emailEncrypted", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 2.512899143302181, 8.433119158878505], "isController": false}, {"data": ["LG-130-GET-customers/popup/customerId", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.456315601145038, 10.127176765267174], "isController": false}, {"data": ["LG-020-POST-auth/oauth/token", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 9.12798713235294, 1.8727022058823528], "isController": false}, {"data": ["LG-100-GET-applicants/id", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 6.797296537769784, 9.537292041366905], "isController": false}, {"data": ["LG-120-GET-missed-payment-time?customerUuid", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 2.0273883079847907, 10.300320817490494], "isController": false}, {"data": ["LG-090-GET-customers/customerId", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 5.0121134581881535, 9.224602569686413], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
