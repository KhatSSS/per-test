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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8034188034188035, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-OPTIONS-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.0, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 117, 0, 0.0, 1018.948717948718, 23, 15217, 245.0, 2107.0000000000005, 5238.699999999997, 15146.259999999997, 0.9445767569531345, 3.328023137589311, 1.4736069132725145], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 7.499547538610038, 10.62530164092664], "isController": false}, {"data": ["ST10-030-GET-customers/email", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 5.125171076642335, 9.83334283759124], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 2.803949839055794, 3.1560152896995706], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7293669871794872, 3.213474893162393], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.271901709401709], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 1, 0, 0.0, 1131.0, 1131, 1131, 1131.0, 1131.0, 1131.0, 1131.0, 0.8841732979664013, 0.6976679929266136, 1.034413682581786], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.238948170731707, 10.821582825203253], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 1.8357496995192308, 6.904015174278847], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 2.666613520408163, 3.5036670918367347], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 1778.0, 1778, 1778, 1778.0, 1778.0, 1778.0, 1778.0, 0.562429696287964, 0.6146082325646794, 0.38337492969628795], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 2.7683064088983054, 3.624867584745763], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 1.383880876068376, 4.679153311965813], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 4.0214965062111805, 5.697625517598344], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 2.2665895061728394, 10.955182613168725], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 233.5, 233, 234, 233.5, 234.0, 234.0, 234.0, 0.11919661481613922, 0.07787356964062221, 0.08997947583288635], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 7.396869593425606, 9.336478157439448], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.6558493589743586], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.6391559829059825], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.6582298238696109, 0.7691328207150369], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.238948170731707, 10.821582825203253], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1, 0, 0.0, 4083.0, 4083, 4083, 4083.0, 4083.0, 4083.0, 4083.0, 0.24491795248591722, 24.468355835170218, 0.6735243693362724], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 1, 0, 0.0, 1027.0, 1027, 1027, 1027.0, 1027.0, 1027.0, 1027.0, 0.9737098344693281, 0.7169699367088608, 1.1553295399221033], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 2.2573002049180326, 3.2098488729508197], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 2.7177526595744683, 3.1998005319148937], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.271901709401709], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7293669871794872, 3.213474893162393], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.526475694444444], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 1, 0, 0.0, 4819.0, 4819, 4819, 4819.0, 4819.0, 4819.0, 4819.0, 0.20751193193608633, 0.13557176021996264, 0.1582683777754721], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 2.6996707128099175, 3.151633522727273], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 242.5, 242, 243, 242.5, 243.0, 243.0, 243.0, 0.7087172218284905, 0.3903481573352232, 1.886682760453579], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 2.275955578512397, 11.000451962809917], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.271901709401709], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 2.078419811320755, 10.04569575471698], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 2.803949839055794, 3.231457886266094], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 4.826472355769231, 10.385366586538462], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 2.6996707128099175, 3.530959452479339], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 2.203125, 3.1328125], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1, 0, 0.0, 2211.0, 2211, 2211, 2211.0, 2211.0, 2211.0, 2211.0, 0.4522840343735866, 0.32242904794210764, 1.3184256275440978], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1, 0, 0.0, 3759.0, 3759, 3759, 3759.0, 3759.0, 3759.0, 3759.0, 0.26602819898909286, 0.17458100558659218, 0.7765217644320298], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 2.6885609567901234, 3.5083912037037037], "isController": false}, {"data": ["ST10-040-OPTIONS-businesses/applications", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.434662126068376], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7293669871794872, 3.180088141025641], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 2.803949839055794, 3.239840396995708], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 2.780086436170213, 3.5987367021276597], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 2.7177526595744683, 3.16655585106383], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7293669871794872, 3.213474893162393], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 451.0, 234, 668, 451.0, 668.0, 668.0, 668.0, 0.7104795737122558, 0.46417073712255774, 0.5439609236234458], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 2.780086436170213, 3.1291555851063833], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 2.285399377593361, 11.046096991701246], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1, 0, 0.0, 5872.0, 5872, 5872, 5872.0, 5872.0, 5872.0, 5872.0, 0.17029972752043596, 0.11209181284059946, 0.47231565054495916], "isController": false}, {"data": ["ST14-090-GET-id", 1, 0, 0.0, 5704.0, 5704, 5704, 5704.0, 5704.0, 5704.0, 5704.0, 0.1753155680224404, 17.148396410413746, 0.46619559738779803], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 2.194347609561753, 10.606013446215139], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.6475026709401708], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1, 0, 0.0, 5187.0, 5187, 5187, 5187.0, 5187.0, 5187.0, 5187.0, 0.192789666473877, 19.006161738480817, 0.5126623650472334], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 2.4189763692579507, 3.126380300353357], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7293669871794872, 3.180088141025641], "isController": false}, {"data": ["ST06-030-GET-suffixes", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 2.5371158637873754, 8.743640988372093], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 2.72216796875, 3.1453450520833335], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 2.275955578512397, 11.000451962809917], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 23.0, 43.47826086956522, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.271901709401709], "isController": false}, {"data": ["ST10-030-OPTIONS-customers/email", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 2.803949839055794, 3.520654506437768], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 2.285399377593361, 11.046096991701246], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 2.803949839055794, 3.2859442060085837], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.5415665064102564, 2.925514155982906], "isController": false}, {"data": ["ST07-030-GET-core/products", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 8.904056272644926, 4.767818727355072], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 2.285399377593361, 3.2498054979253115], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 1.3163137522768669, 5.073144353369763], "isController": false}, {"data": ["ST14-060-POST-middesk", 1, 0, 0.0, 935.0, 935, 935, 935.0, 935.0, 935.0, 935.0, 1.0695187165775402, 0.9034508689839572, 2.928643048128342], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7293669871794872, 3.180088141025641], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.2635550213675213], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 2.803949839055794, 3.239840396995708], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 4.786811440677966, 9.153204449152543], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 1, 0, 0.0, 1877.0, 1877, 1877, 1877.0, 1877.0, 1877.0, 1877.0, 0.5327650506126798, 0.5821914957378796, 0.4516016249334044], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7293669871794872, 3.213474893162393], "isController": false}, {"data": ["eProtect/paypage_01", 1, 0, 0.0, 15217.0, 15217, 15217, 15217.0, 15217.0, 15217.0, 15217.0, 0.06571597555365709, 0.029905902937504107, 0.08118233308142209], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 1129.0, 1129, 1129, 1129.0, 1129.0, 1129.0, 1129.0, 0.8857395925597874, 0.578671667404783, 0.6781443755535872], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.9537522810218977, 1.1177007299270072], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.6091940154440154, 3.378378378378378], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.9916562017001546, 4.369626642194745], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.185639880952381, 10.563926091269842], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1, 0, 0.0, 13161.0, 13161, 13161, 13161.0, 13161.0, 13161.0, 13161.0, 0.07598206823189727, 0.05876738089810805, 0.21058311488488718], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.668369391025641], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.9794013444767443, 1.388194949127907], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.225994925213675], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 2.2480867346938775, 3.196747448979592], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 8.404783393501804, 1.7327814756317688], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.8315160851472471, 3.66242197503201], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 1.5856236786469344, 6.051384117336153], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 7625.5, 427, 14824, 7625.5, 14824.0, 14824.0, 14824.0, 0.11784115012962527, 0.08953165507895357, 0.3248687175936837], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 1.820275208830549, 6.621513275656325], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 1.7934500888625593, 6.692461492890995], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 3, 0, 0.0, 236.0, 233, 241, 234.0, 241.0, 241.0, 241.0, 1.9367333763718528, 1.2653072546804391, 1.5471170916720465], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 0, 0.0, 2081.0, 2081, 2081, 2081.0, 2081.0, 2081.0, 2081.0, 0.4805382027871216, 0.2932972429120615, 1.5429781355117733], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 1.8139530495169083, 6.710918629227053], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.271901709401709], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1, 0, 0.0, 967.0, 967, 967, 967.0, 967.0, 967.0, 967.0, 1.0341261633919339, 0.5695773009307136, 2.752956954498449], "isController": false}, {"data": ["ST09-010-GET-industries", 1, 0, 0.0, 1181.0, 1181, 1181, 1181.0, 1181.0, 1181.0, 1181.0, 0.8467400508044031, 24.347910933530905, 2.2433649978831496], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 2.72216796875, 3.190104166666667], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 2.6996707128099175, 3.1637396694214877], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.522472249034749, 3.1031310328185326], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 2.803949839055794, 3.671539699570815], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 2, 0, 0.0, 251.0, 250, 252, 251.0, 252.0, 252.0, 252.0, 1.5117157974300832, 1.2386030801209373, 4.074546485260771], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 3, 0, 0.0, 544.0, 241, 1140, 251.0, 1140.0, 1140.0, 1140.0, 1.8359853121175032, 1.0112262851897185, 4.948554161566708], "isController": false}, {"data": ["AF-010-GET-Welcome", 1, 0, 0.0, 2279.0, 2279, 2279, 2279.0, 2279.0, 2279.0, 2279.0, 0.43878894251864853, 0.4794969010530935, 0.3278061924089513], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.7919671474358974, 3.225994925213675], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 117, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
