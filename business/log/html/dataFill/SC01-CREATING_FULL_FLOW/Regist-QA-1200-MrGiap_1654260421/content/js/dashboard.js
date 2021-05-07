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

    var data = {"OkPercent": 99.99871794871795, "KoPercent": 0.001282051282051282};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8214679487179487, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.99625, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [0.9975, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.4475, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.49375, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.9945833333333334, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.9633333333333334, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.9954166666666666, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5291666666666667, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.50125, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5020833333333333, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [0.9954166666666666, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [0.9945833333333334, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.9945833333333334, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.99625, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.9908333333333333, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.4875, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.49875, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.49541666666666667, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.24333333333333335, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [0.9975, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.9970833333333333, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5354166666666667, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.9941666666666666, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.55, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5045833333333334, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.99375, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.9908333333333333, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [0.994375, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.8779166666666667, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.495, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.97125, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.97, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.9658333333333333, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.9970833333333333, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.9608333333333333, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.49541666666666667, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.9670833333333333, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [0.99375, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5533333333333333, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [0.9925, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [0.9941666666666666, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.9965277777777778, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.9954166666666666, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5054166666666666, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.91875, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.16083333333333333, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 78000, 1, 0.001282051282051282, 638.6078076923026, 0, 60274, 300.0, 993.0, 1531.0, 6311.930000000011, 12.916877738936984, 76.54970273016842, 28.16174323863551], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 1200, 0, 0.0, 282.87666666666615, 247, 3184, 267.0, 299.0, 308.0, 326.0, 0.20056422057986123, 0.38976835835344126, 0.5511598796012984], "isController": false}, {"data": ["ST10-030-GET-customers/email", 1200, 0, 0.0, 295.7408333333334, 252, 3175, 273.0, 306.0, 317.0, 412.3500000000006, 0.20054149546132816, 0.28181563668833126, 0.5395427929648038], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1200, 0, 0.0, 271.4941666666663, 242, 3217, 260.0, 292.9000000000001, 299.0, 312.0, 0.20052879443091431, 0.11025167115684059, 0.5330462680087391], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1200, 0, 0.0, 4053.24333333334, 3435, 7509, 4043.0, 4265.9, 4396.8, 5086.700000000001, 0.2004254029176928, 0.1317248985972727, 0.5550844166743913], "isController": false}, {"data": ["ST14-090-GET-id", 1200, 0, 0.0, 1009.3199999999994, 504, 5040, 789.0, 1527.9, 1787.9, 3117.8100000000004, 0.2005223607497531, 19.750185724698255, 0.5332249885952908], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 1200, 0, 0.0, 957.3425000000011, 742, 3987, 923.0, 1015.0, 1054.95, 3038.5600000000004, 0.200367574315081, 0.15790686764870154, 0.23343605093544106], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1200, 0, 0.0, 276.3858333333329, 241, 3133, 260.0, 292.0, 302.0, 328.99, 0.20056117015409117, 0.1102694714812044, 0.5331323292572617], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1200, 0, 0.0, 462.3633333333335, 333, 3609, 432.5, 482.0, 510.0, 1284.7100000000003, 0.20054353984081522, 0.15295361778874675, 0.5751917739379632], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1200, 0, 0.0, 277.0725000000001, 242, 3618, 262.0, 291.0, 300.0, 316.97, 0.20052819125576768, 0.11025133952831759, 0.5330446646466793], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1200, 0, 0.0, 937.4441666666664, 277, 4337, 798.0, 1391.9, 1600.9, 3069.5400000000004, 0.20052179112079482, 19.90462751500279, 0.5332234738495355], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 1200, 0, 0.0, 303.4908333333333, 263, 3772, 289.0, 324.0, 333.0, 386.99, 0.2003946773169758, 0.13698854894715143, 0.17651953021475797], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 1200, 0, 0.0, 871.430833333334, 224, 3701, 876.0, 890.0, 894.95, 1420.8400000000001, 0.20038025493043965, 0.3466764309947177, 0.13600027068032772], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1200, 0, 0.0, 606.7649999999994, 462, 3353, 583.0, 648.0, 680.0, 1251.94, 0.2005434392965872, 0.1621581716187248, 0.5481651236241676], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1200, 0, 0.0, 282.13000000000017, 247, 3255, 268.0, 300.0, 309.95000000000005, 362.94000000000005, 0.20053351942843936, 0.38970869498300226, 0.5510755113980745], "isController": false}, {"data": ["ST06-030-GET-suffixes", 1200, 0, 0.0, 275.8233333333327, 242, 3124, 260.0, 291.0, 301.0, 314.0, 0.20056616485569348, 0.15297087378153965, 0.527073778932296], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1200, 0, 0.0, 280.2925000000004, 241, 3263, 262.0, 293.0, 301.0, 318.95000000000005, 0.2005564773725497, 0.11026689136791551, 0.5331198548907035], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 1200, 0, 0.0, 311.1624999999999, 265, 3077, 296.0, 328.0, 338.0, 393.95000000000005, 0.20057025466238093, 0.42973744016529664, 0.5404036451303799], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1200, 0, 0.0, 274.27916666666715, 241, 3185, 260.0, 290.0, 299.0, 313.99, 0.20055624273923728, 0.11026676236542049, 0.533119231187699], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 1200, 0, 0.0, 2.6716666666666624, 0, 1389, 0.0, 1.0, 1.0, 2.0, 0.2003429537463214, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 1200, 0, 0.0, 0.4058333333333336, 0, 168, 0.0, 1.0, 1.0, 1.0, 0.20038905535096388, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1200, 0, 0.0, 282.47916666666697, 242, 3150, 261.5, 293.0, 302.0, 375.84000000000015, 0.20052966569031, 0.11025215017934037, 0.5330485839931873], "isController": false}, {"data": ["ST07-030-GET-core/products", 1200, 0, 0.0, 288.46250000000003, 242, 3550, 262.0, 295.0, 304.0, 885.6800000000003, 0.2005593265351521, 1.5684366082944319, 0.5270558083067328], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 1200, 0, 0.0, 273.359166666667, 240, 3139, 259.0, 289.0, 298.0, 312.99, 0.20039240172130393, 0.11017668180575596, 0.15616517243515676], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 1200, 0, 0.0, 1093.2775000000004, 950, 4263, 1028.0, 1160.9, 1200.95, 3816.96, 0.2003677750511063, 0.12522985940694145, 0.14577538321589276], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 1200, 0, 0.0, 672.4758333333328, 475, 3759, 649.0, 724.9000000000001, 761.0, 1282.840000000002, 0.20055661144897471, 0.144737632676555, 0.557798075592461], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1200, 0, 0.0, 283.06916666666626, 242, 3188, 262.0, 291.9000000000001, 300.0, 319.98, 0.20055423161907934, 0.11026565664213053, 0.5331138852218105], "isController": false}, {"data": ["ST14-060-POST-middesk", 1200, 0, 0.0, 751.4416666666665, 602, 4438, 720.0, 792.9000000000001, 826.9000000000001, 1433.95, 0.20053908247687827, 0.16920485083986603, 0.548349053647714], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1200, 0, 0.0, 1545.6858333333305, 743, 5554, 1510.0, 1986.7000000000003, 2248.3000000000006, 3506.6200000000003, 0.20051137083274712, 20.165058480185632, 0.5506230222477391], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 1200, 0, 0.0, 289.2233333333335, 256, 3117, 278.0, 309.0, 319.0, 340.98, 0.2004001322640873, 0.14736455038560325, 0.2369966407927829], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 1200, 0, 0.0, 0.9616666666666669, 0, 443, 0.0, 1.0, 1.0, 2.990000000000009, 0.20039123047897178, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1200, 0, 0.0, 286.06916666666734, 253, 3781, 273.0, 303.0, 313.0, 328.98, 0.20052601315350382, 0.2833604892901563, 0.5406760960125235], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 1200, 0, 0.0, 865.5733333333326, 231, 3850, 897.5, 918.0, 935.9000000000001, 3129.83, 0.20037774544645748, 0.34295332756676794, 0.16906872272044848], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 1200, 0, 0.0, 280.7041666666666, 240, 3653, 262.0, 292.0, 301.0, 326.95000000000005, 0.20039400801876625, 0.11017756495563025, 0.15616642421774946], "isController": false}, {"data": ["eProtect/paypage_01", 1200, 0, 0.0, 730.5708333333331, 420, 5674, 579.5, 1080.900000000001, 1525.6500000000003, 3417.970000000002, 0.20015946037009485, 0.09187006481830524, 0.24902651612451251], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 1200, 0, 0.0, 287.8883333333333, 253, 3176, 277.0, 309.0, 315.95000000000005, 349.9100000000001, 0.20039899439784611, 0.1352301807899528, 0.17456631152624877], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1200, 0, 0.0, 622.0716666666659, 452, 4113, 592.0, 660.0, 686.0, 1434.1600000000008, 0.20054675730934438, 0.12847526640129875, 0.566192065802065], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1200, 0, 0.0, 279.5866666666662, 241, 3987, 260.0, 292.0, 300.0, 329.0, 0.20055875669615547, 0.1102681445507183, 0.5331259137958352], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1200, 1, 0.08333333333333333, 8065.885000000007, 4401, 60274, 6545.5, 7910.700000000001, 10038.050000000003, 54460.84, 0.20035646754851338, 0.15451171850542425, 0.5545021767895381], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 1200, 0, 0.0, 416.668333333333, 348, 3273, 397.0, 431.0, 443.0, 549.8600000000001, 0.20038778375953867, 0.13483123340851771, 0.19060322400565494], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2400, 0, 0.0, 278.1333333333335, 241, 3664, 260.0, 291.9000000000001, 301.0, 318.9899999999998, 0.40099393028854186, 0.22046834253168857, 1.0659233185990342], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 1200, 0, 0.0, 275.20416666666716, 241, 3659, 261.0, 291.0, 298.0, 318.99, 0.20039722069094623, 0.11017933129785423, 0.15616892784313974], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 1200, 0, 0.0, 492.87083333333374, 460, 3436, 482.0, 513.0, 522.0, 543.95, 0.20038085721594845, 0.9328276819808851, 0.19137937339570077], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1200, 0, 0.0, 767.8599999999997, 606, 3743, 737.0, 810.9000000000001, 842.95, 1559.5300000000022, 0.2005075179458406, 0.130016593668006, 0.572738759757406], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1200, 0, 0.0, 452.7666666666665, 328, 3751, 432.0, 480.0, 503.0, 981.8600000000001, 0.20052554402997858, 0.15019833229589216, 0.5731819017341282], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2400, 0, 0.0, 450.22083333333364, 329, 3387, 430.0, 482.0, 504.0, 743.7799999999952, 0.400984215757577, 0.30426243715198953, 1.103881351777939], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1200, 0, 0.0, 454.7083333333332, 322, 3562, 428.0, 482.0, 511.0, 1085.7000000000003, 0.20054910344523305, 0.1527620123899236, 0.5556228578848889], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1200, 0, 0.0, 271.308333333333, 241, 3095, 259.0, 290.0, 298.0, 315.99, 0.2005459194169729, 0.11026108655444897, 0.5330917897001956], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1200, 0, 0.0, 458.11833333333317, 334, 3372, 432.0, 487.0, 514.0, 1209.990000000001, 0.20051901003764744, 0.1515641736026749, 0.5655262704968025], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1200, 0, 0.0, 790.2933333333336, 604, 4161, 762.0, 857.0, 899.0, 1461.850000000001, 0.2005387808579049, 0.1222033195852858, 0.643917491660929], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1200, 0, 0.0, 458.0049999999996, 325, 3406, 435.0, 486.0, 506.0, 1048.8300000000002, 0.20052222671911885, 0.15039167003933912, 0.5563316856533366], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1200, 0, 0.0, 279.1466666666669, 240, 3140, 259.0, 291.0, 299.0, 315.97, 0.20052343300127767, 0.11024872341769466, 0.5330320162397244], "isController": false}, {"data": ["ST09-010-GET-industries", 1200, 0, 0.0, 561.5016666666661, 484, 3069, 523.0, 604.0, 795.9000000000001, 1200.2700000000007, 0.20054229980238228, 5.766785103258395, 0.5305362208639195], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 1200, 0, 0.0, 281.13999999999993, 241, 3127, 259.5, 290.9000000000001, 301.0, 359.73000000000025, 0.2005676063259023, 0.11027301011863573, 0.5331494379092833], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 1200, 0, 0.0, 284.4391666666661, 250, 3231, 272.0, 304.9000000000001, 314.0, 331.97, 0.20053975274451186, 0.2518497285443772, 0.5407131419214817], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 2400, 0, 0.0, 289.68125000000094, 249, 3675, 273.0, 302.9000000000001, 311.0, 372.8899999999976, 0.40104746914817013, 0.32820095619742834, 1.0793816650120673], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 3600, 0, 0.0, 272.0633333333342, 241, 3312, 259.0, 290.0, 299.0, 312.0, 0.6016673204227783, 0.330799513084008, 1.6193311866066182], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 1200, 0, 0.0, 278.3516666666666, 241, 3628, 261.0, 292.0, 300.0, 315.98, 0.20040110280726875, 0.11018146570360576, 0.15617195316425828], "isController": false}, {"data": ["AF-010-GET-Welcome", 1200, 0, 0.0, 1028.775833333334, 325, 4121, 1006.0, 1069.0, 1101.0, 3678.970000000003, 0.20036703902097994, 0.34258149099667407, 0.1491012536464714], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1200, 0, 0.0, 478.15333333333336, 359, 3656, 458.0, 513.9000000000001, 538.0, 617.0, 0.2005565444107398, 0.14277902429241143, 0.5838467371957181], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1200, 0, 0.0, 1697.4150000000013, 1247, 9487, 1548.0, 1853.9, 2068.800000000001, 4960.630000000002, 0.2004734514678833, 0.1313649276708493, 0.5843879420230779], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 1, 100.0, 0.001282051282051282], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 78000, 1, "504/Gateway Time-out", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1200, 1, "504/Gateway Time-out", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
