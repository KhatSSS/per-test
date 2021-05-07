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

    var data = {"OkPercent": 99.1304347826087, "KoPercent": 0.8695652173913043};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8978260869565218, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler - Load Crypto-js"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.25, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.375, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [0.75, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [0.75, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 230, 2, 0.8695652173913043, 384.6347826086959, 1, 3287, 254.5, 822.8, 1122.8, 2407.5899999999983, 2.623713809860601, 7.090432837917227, 3.8852397917569754], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 0, 0.0, 269.0, 262, 276, 269.0, 276.0, 276.0, 276.0, 0.06361120829490156, 0.12355731767437422, 0.17536566505518272], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 253.5, 245, 262, 253.5, 262.0, 262.0, 262.0, 0.06359502686889884, 0.041485818309008236, 0.04707522496740755], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 251.0, 246, 256, 251.0, 256.0, 256.0, 256.0, 0.0639202275560101, 0.04076162948640097, 0.04837712534756623], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06409023905659168, 0.04180886688457348, 0.04938202989809652], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 836.0, 823, 849, 836.0, 849.0, 849.0, 849.0, 0.060733047888008256, 0.04786286098205339, 0.07129015972791596], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 0, 0.0, 256.5, 253, 260, 256.5, 260.0, 260.0, 260.0, 0.0639897616381379, 0.035181870900655894, 0.17066019436890098], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 0, 0.0, 401.0, 373, 429, 401.0, 429.0, 429.0, 429.0, 0.06395088571976722, 0.048775040768689645, 0.18398370051800217], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 249.0, 245, 253, 249.0, 253.0, 253.0, 253.0, 0.06578947368421052, 0.04291735197368421, 0.05679481907894737], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 822.0, 821, 823, 822.0, 823.0, 823.0, 823.0, 0.06443714156840002, 0.1103737756943102, 0.04430053482827502], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06404918977774932, 0.041782088644078653, 0.05510482050214565], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 0, 0.0, 258.5, 254, 263, 258.5, 263.0, 263.0, 263.0, 0.06528267397832616, 0.03914410334247291, 0.17806104338033688], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.5, 1, 20, 4.5, 20.0, 20.0, 20.0, 0.10443318886742206, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 0, 0.0, 265.0, 262, 268, 265.0, 268.0, 268.0, 268.0, 0.06443091395251441, 0.12514949985503043, 0.17762545907026192], "isController": false}, {"data": ["JSR223 Sampler - Load Crypto-js", 4, 0, 0.0, 773.5, 72, 2628, 197.0, 2628.0, 2628.0, 2628.0, 0.09773021573945125, 0.0, 0.0], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 0, 0.0, 265.0, 253, 277, 265.0, 277.0, 277.0, 277.0, 0.06409023905659168, 0.03523711385630968, 0.17092816685893739], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 249.0, 245, 253, 249.0, 253.0, 253.0, 253.0, 0.0643707756678468, 0.041991873189571934, 0.04890670260701641], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 0, 0.0, 288.5, 279, 298, 288.5, 298.0, 298.0, 298.0, 0.0634296406710856, 0.13571713155307474, 0.17145824743902827], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.06366993505666624, 0.04153468419712212, 0.05477852811027633], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 264.5, 246, 283, 264.5, 283.0, 283.0, 283.0, 0.0647123535883, 0.042214699411117586, 0.0554225918915421], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1490.5, 1064, 1917, 1490.5, 1917.0, 1917.0, 1917.0, 0.06224712107065048, 0.03890445066915655, 0.04583430594460006], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 0, 0.0, 257.0, 254, 260, 257.0, 260.0, 260.0, 260.0, 0.06411283859592884, 0.03524953918897259, 0.17098843965379068], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 2, 0, 0.0, 1071.0, 1021, 1121, 1071.0, 1121.0, 1121.0, 1121.0, 0.06423020104052926, 0.0400184260389235, 0.17694667688997365], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 277.0, 266, 288, 277.0, 288.0, 288.0, 288.0, 0.06383454087006478, 0.046940829370272254, 0.07605287095847563], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 257.5, 252, 263, 257.5, 263.0, 263.0, 263.0, 0.06290890790135883, 0.03458761244967287, 0.04957762566054353], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.06401433921198348, 0.04082164404826681, 0.04844835243094454], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06432729728860441, 0.04196351034061304, 0.04956468511787977], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 245, 253, 249.0, 253.0, 253.0, 253.0, 0.0634517766497462, 0.0404629005393401, 0.04802258486675127], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 253.5, 246, 261, 253.5, 261.0, 261.0, 261.0, 0.06352836541515787, 0.04144233212629439, 0.056207713931770535], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06565341561894757, 0.04282859534517283, 0.05052235498801825], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06577649148194435, 0.042908883115174636, 0.05061706571071499], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 257.0, 253, 261, 257.0, 261.0, 261.0, 261.0, 0.06443298969072166, 0.03542555976159794, 0.1718422801224227], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.06432315955359728, 0.03536517463737819, 0.17154936400475992], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06411489388985062, 0.04182495031095724, 0.049401026639738416], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 259.5, 258, 261, 259.5, 261.0, 261.0, 261.0, 0.0635626887017321, 0.034947064198315586, 0.16952119418401398], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06414162470735384, 0.04184238799268785, 0.04860732497354158], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.0658544616397761, 0.04295974646032268, 0.05659367797168258], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 259.5, 254, 265, 259.5, 265.0, 265.0, 265.0, 0.0639202275560101, 0.03514364073636102, 0.05037463245869155], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 0, 0.0, 506.0, 438, 574, 506.0, 574.0, 574.0, 574.0, 0.06331117442228554, 0.045072115384615384, 0.184863683127572], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 0, 0.0, 1743.5, 1670, 1817, 1743.5, 1817.0, 1817.0, 1817.0, 0.06203281535932508, 0.0389522463633262, 0.18137329022052667], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.06566419331538512, 0.042835626108083266, 0.05630191575283998], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 248.5, 245, 252, 248.5, 252.0, 252.0, 252.0, 0.061854394754747334, 0.03944425759262695, 0.046330391383682806], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 248.5, 245, 252, 248.5, 252.0, 252.0, 252.0, 0.06454736162659351, 0.042107067936098114, 0.049040866548329835], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 253.5, 246, 261, 253.5, 261.0, 261.0, 261.0, 0.06355864874312772, 0.041462087266024725, 0.05406209282740649], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 250.0, 247, 253, 250.0, 253.0, 253.0, 253.0, 0.062758880381574, 0.04002104383707795, 0.047007872317057865], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.06290495061961376, 0.04011419214317167, 0.047608727275586585], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.0, 246, 254, 250.0, 254.0, 254.0, 254.0, 0.06443091395251441, 0.042031104023710575, 0.04964452256692761], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 249.0, 245, 253, 249.0, 253.0, 253.0, 253.0, 0.06402048655569782, 0.0417633642765685, 0.04739016485275288], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 0, 0.0, 257.0, 253, 261, 257.0, 261.0, 261.0, 261.0, 0.06519542328128565, 0.035844749323597484, 0.17387568455194446], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 2, 0, 0.0, 373.5, 367, 380, 373.5, 380.0, 380.0, 380.0, 0.06554153694904145, 0.040835449778797314, 0.18209538341799114], "isController": false}, {"data": ["ST14-090-GET-id", 2, 0, 0.0, 1567.5, 1505, 1630, 1567.5, 1630.0, 1630.0, 1630.0, 0.06279829188646069, 6.188606083977016, 0.16742122739261492], "isController": false}, {"data": ["eProtect/paypage", 4, 0, 0.0, 1421.5, 566, 3287, 916.5, 3287.0, 3287.0, 3287.0, 0.08716495968620615, 0.040007354543473525, 0.10853058945303988], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.06457445434586077, 0.035503337692109, 0.1722195652524861], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 257.0, 246, 268, 257.0, 268.0, 268.0, 268.0, 0.06484663770183516, 0.04230229881330653, 0.0556642524803839], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 2, 0, 0.0, 1267.0, 1250, 1284, 1267.0, 1284.0, 1284.0, 1284.0, 0.06360311655271109, 6.267639926856416, 0.16956690252822387], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 310.5, 277, 344, 310.5, 344.0, 344.0, 344.0, 0.06271165182490908, 0.042869293239683935, 0.055791323059074374], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.0629465269253769, 0.04014070515846788, 0.04714842397633211], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 262.5, 260, 265, 262.5, 265.0, 265.0, 265.0, 0.06360311655271109, 0.0485097988551439, 0.16770352997296867], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 254.5, 246, 263, 254.5, 263.0, 263.0, 263.0, 0.06466632177961718, 0.04218467084842214, 0.04913124838334195], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 0, 0.0, 259.5, 259, 260, 259.5, 260.0, 260.0, 260.0, 0.06535093451836362, 0.03593025013070187, 0.17429043180629983], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 420.49999999999994, 1, 1676, 2.5, 1676.0, 1676.0, 1676.0, 0.09404462417417064, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 253.0, 246, 260, 253.0, 260.0, 260.0, 260.0, 0.06397543343356152, 0.041733974153924894, 0.049293571268632846], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 0, 0.0, 257.5, 254, 261, 257.5, 261.0, 261.0, 261.0, 0.06451404793393763, 0.035470125963678587, 0.17205846182381213], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06457862447529868, 0.04212746206005812, 0.049758334678721344], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 249.0, 245, 253, 249.0, 253.0, 253.0, 253.0, 0.061818069421691955, 0.0367044787191296, 0.04262066114425246], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 0, 0.0, 262.0, 258, 266, 262.0, 266.0, 266.0, 266.0, 0.06400819304871024, 0.49906388017666264, 0.16877160276515396], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 573.0, 273, 873, 573.0, 873.0, 873.0, 873.0, 0.06180087757246153, 0.03397841218095297, 0.04870440254001607], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 618.0, 611, 625, 618.0, 625.0, 625.0, 625.0, 0.06283380458686774, 0.045345880458686774, 0.17530876924285266], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 0, 0.0, 276.0, 273, 279, 276.0, 279.0, 279.0, 279.0, 0.06518479890489538, 0.04449626409621277, 0.17881259777719838], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 252.5, 245, 260, 252.5, 260.0, 260.0, 260.0, 0.06395906619763352, 0.04078639670610809, 0.04790683962264151], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.06522518996836578, 0.042549245018426114, 0.0501291254932655], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 248.5, 245, 252, 248.5, 252.0, 252.0, 252.0, 0.06419927454819761, 0.04187999550605078, 0.04877640195165795], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 55.49999999999999, 1, 216, 2.5, 216.0, 216.0, 216.0, 0.10448501946033488, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 0, 0.0, 269.5, 263, 276, 269.5, 276.0, 276.0, 276.0, 0.06458696635019054, 0.08104907398436995, 0.17471278983401148], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 846.0, 845, 847, 846.0, 847.0, 847.0, 847.0, 0.0643915003219575, 0.1106100088538313, 0.0548962693174501], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.0, 246, 254, 250.0, 254.0, 254.0, 254.0, 0.06300403225806452, 0.04017737603956653, 0.0476837158203125], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06481721545242415, 0.04228310539279232, 0.049942170890588534], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 251.5, 246, 257, 251.5, 257.0, 257.0, 257.0, 0.06535306996046139, 0.042632666732019736, 0.05035505097539457], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 271.0, 266, 276, 271.0, 276.0, 276.0, 276.0, 0.06395088571976722, 0.04315435745347573, 0.056269285188974866], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 0, 0.0, 584.5, 577, 592, 584.5, 592.0, 592.0, 592.0, 0.06338943298152198, 0.04060885550378752, 0.17952085512345092], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 2, 0, 0.0, 257.5, 254, 261, 257.5, 261.0, 261.0, 261.0, 0.06582411795681938, 0.03619040860321222, 0.17555240833991576], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 2, 0, 0.0, 428.5, 424, 433, 428.5, 433.0, 433.0, 433.0, 0.06568144499178982, 0.04092261904761905, 0.18235580870279147], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 248.5, 245, 252, 248.5, 252.0, 252.0, 252.0, 0.06368615462998345, 0.04154526493440326, 0.05497906317666539], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 486.5, 476, 497, 486.5, 497.0, 497.0, 497.0, 0.06250781347668459, 0.04205847996624578, 0.06000505922615327], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 249.0, 245, 253, 249.0, 253.0, 253.0, 253.0, 0.06448908522232612, 0.042069051688001805, 0.048996590139618865], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 576.5, 261, 892, 576.5, 892.0, 892.0, 892.0, 0.06273132174894926, 0.03448997475064299, 0.04943767251113481], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 485.0, 483, 487, 485.0, 487.0, 487.0, 487.0, 0.061385470059236974, 0.28576614821521745, 0.059167440379362196], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 0, 0.0, 637.0, 631, 643, 637.0, 643.0, 643.0, 643.0, 0.06399385658976739, 0.04018364237033245, 0.1833573976898218], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 0, 0.0, 261.5, 258, 265, 261.5, 265.0, 265.0, 265.0, 0.0644766111093201, 0.04067567458654373, 0.18486653341500373], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 424.5, 413, 436, 424.5, 436.0, 436.0, 436.0, 0.06403893567288911, 0.04871712000896545, 0.17685752937786173], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 0, 0.0, 395.0, 377, 413, 395.0, 413.0, 413.0, 413.0, 0.06384676775738228, 0.04863328012769354, 0.17744912210694333], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 0, 0.0, 261.0, 258, 264, 261.0, 264.0, 264.0, 264.0, 0.06467677780292985, 0.04080195162177021, 0.18234556398150245], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 248.83333333333334, 245, 252, 249.0, 252.0, 252.0, 252.0, 0.18958543983822043, 0.1236748767694641, 0.1495947611223458], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 256.5, 252, 261, 256.5, 261.0, 261.0, 261.0, 0.06566419331538512, 0.0487351434762624, 0.21052299477969663], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 0, 0.0, 262.0, 257, 267, 262.0, 267.0, 267.0, 267.0, 0.06453486496079508, 0.04071242457487658, 0.17961363783033785], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.5, 246, 255, 250.5, 255.0, 255.0, 255.0, 0.06356874960269532, 0.04146867649863327, 0.048980218199733014], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 0, 0.0, 257.0, 254, 260, 257.0, 260.0, 260.0, 260.0, 0.06481511488479112, 0.035635653984509186, 0.17286140502965291], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 0, 0.0, 759.0, 749, 769, 759.0, 769.0, 769.0, 769.0, 0.06313729204154434, 1.815443776241437, 0.1675851169618335], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06451612903225806, 0.042086693548387094, 0.049710181451612906], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 247, 252, 249.5, 252.0, 252.0, 252.0, 0.06582845105654664, 0.0429427786189191, 0.05072133582384306], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.06464959917248513, 0.042173761960175846, 0.05227526183087665], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.06447453255963895, 0.042059558349451964, 0.05547076482914249], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 0, 0.0, 255.75, 251, 260, 256.0, 260.0, 260.0, 260.0, 0.1274128814423138, 0.07813993119704403, 0.3421732655921514], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 258.1666666666667, 254, 261, 260.0, 261.0, 261.0, 261.0, 0.18728929953801973, 0.10297253480459483, 0.5057176886939693], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1008.0, 998, 1018, 1008.0, 1018.0, 1018.0, 1018.0, 0.06392227051904883, 0.10980397836231143, 0.04819139925850166], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 253.5, 245, 262, 253.5, 262.0, 262.0, 262.0, 0.06415602745877975, 0.04185178353756335, 0.048743544299736964], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2, 100.0, 0.8695652173913043], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 230, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
