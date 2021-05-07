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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5133928571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.25, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 436.11607142857156, 0, 1974, 270.0, 1072.0, 1122.0, 1667.25, 1.4182062223798007, 0.8445825630278703, 1.0846393902029807], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 264.0, 258, 270, 264.0, 270.0, 270.0, 270.0, 0.02750577621300473, 0.020629332159753547, 0.023798943090549016], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1063.5, 1003, 1124, 1063.5, 1124.0, 1124.0, 1124.0, 0.026925510574994278, 0.007152088746482856, 0.023586116197040888], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1011.0, 990, 1032, 1011.0, 1032.0, 1032.0, 1032.0, 0.02695490444486374, 0.017583863446454084, 0.018978990336666758], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.026932037004618842, 0.01717443375392198, 0.01941000323184444], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.0, 245, 285, 265.0, 285.0, 285.0, 285.0, 0.02727322314951181, 0.017791516663939345, 0.020028773250422738], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 264.5, 250, 279, 264.5, 279.0, 279.0, 279.0, 0.02708449006676327, 0.01661040992375716, 0.030840347087740205], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 257.5, 250, 265, 257.5, 265.0, 265.0, 265.0, 0.027153252959704572, 0.007212582817421527, 0.02179684954382535], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 267.0, 259, 275, 267.0, 275.0, 275.0, 275.0, 0.027419797093501508, 0.02056484782012613, 0.026670037016726076], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 883.5, 856, 911, 883.5, 911.0, 911.0, 911.0, 0.026664533503986346, 0.04573852841772658, 0.01736840219449111], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1063.0, 998, 1128, 1063.0, 1128.0, 1128.0, 1128.0, 0.026935301406022735, 0.017571075526585142, 0.02175341236599688], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 264.0, 242, 286, 264.0, 286.0, 286.0, 286.0, 0.027715418087081844, 0.020786563565311382, 0.023033028117291646], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 18.5, 0, 66, 4.0, 66.0, 66.0, 66.0, 0.03642954071456544, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1012.5, 993, 1032, 1012.5, 1032.0, 1032.0, 1032.0, 0.027175759222773287, 0.007218561043549154, 0.023805328147292616], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 262.0, 246, 278, 262.0, 278.0, 278.0, 278.0, 0.027287735527267272, 0.007248304749430368, 0.021904803323646187], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1000.5, 966, 1035, 1000.5, 1035.0, 1035.0, 1035.0, 0.027143303068550412, 0.017706764111124682, 0.01964178474003501], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 261.5, 247, 276, 261.5, 276.0, 276.0, 276.0, 0.027165054873410845, 0.020373791155058135, 0.020426847902857766], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1053.5, 1019, 1088, 1053.5, 1088.0, 1088.0, 1088.0, 0.02689473401108063, 0.01754461164004088, 0.02172064944058953], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 261.0, 255, 267, 261.0, 267.0, 267.0, 267.0, 0.02758963181636341, 0.01799792388020582, 0.022174088852409266], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 256, 266, 261.0, 266.0, 266.0, 266.0, 0.027502750275027504, 0.017941247249724974, 0.02019733223322332], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1204.5, 1159, 1250, 1204.5, 1250.0, 1250.0, 1250.0, 0.02656783432298516, 0.016604896451865726, 0.018602673056230822], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 264.0, 258, 270, 264.0, 270.0, 270.0, 270.0, 0.02751826524855873, 0.020638698936419047, 0.02117616505455496], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 258.0, 241, 275, 258.0, 275.0, 275.0, 275.0, 0.027221624858787822, 0.007230744103115514, 0.021851734017503503], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 270.0, 253, 287, 270.0, 287.0, 287.0, 287.0, 0.026891841015435916, 0.020195142325068575, 0.03101490648362287], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 266.5, 252, 281, 266.5, 281.0, 281.0, 281.0, 0.02702191477288081, 0.014856775407355366, 0.01984421866133434], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.02697344464374823, 0.017200839211296476, 0.01943984584676386], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.0, 254, 272, 263.0, 272.0, 272.0, 272.0, 0.027414910970076624, 0.017883945828135923, 0.02013282524365002], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.02712268948588942, 0.017296011947544716, 0.019547407070885148], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.027176867050766388, 0.017728659365148385, 0.021656565931079466], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 260.5, 254, 267, 260.5, 267.0, 267.0, 267.0, 0.027532660618658885, 0.017960759075453255, 0.0210528059222753], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 246.5, 239, 254, 246.5, 254.0, 254.0, 254.0, 0.02745141100252553, 0.007291781047545845, 0.022036191253980455], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1014.0, 1005, 1023, 1014.0, 1023.0, 1023.0, 1023.0, 0.02721754987616015, 0.017755198552026348, 0.021954781443074493], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 261.5, 252, 271, 261.5, 271.0, 271.0, 271.0, 0.027408524050979856, 0.007280389201041524, 0.022001764423735783], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.02749821261617995, 0.007304212726172799, 0.022073760518066327], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 246, 276, 261.0, 276.0, 276.0, 276.0, 0.027232373846028158, 0.017764868876119933, 0.01999877454317693], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.0272186611140598, 0.007229956858422135, 0.021849354917731597], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1081.5, 1061, 1102, 1081.5, 1102.0, 1102.0, 1102.0, 0.026921886147343484, 0.0175623241664311, 0.01942897838172542], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 267.5, 254, 281, 267.5, 281.0, 281.0, 281.0, 0.026938929446943777, 0.01481114968616147, 0.019783276312599338], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 263.0, 255, 271, 263.0, 271.0, 271.0, 271.0, 0.02716284123319299, 0.020372130924894746, 0.027401577142469102], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 277.5, 276, 279, 277.5, 279.0, 279.0, 279.0, 0.027561876412546166, 0.020671407309409626, 0.027857951256821566], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 260.5, 255, 266, 260.5, 266.0, 266.0, 266.0, 0.027528113085488557, 0.017957792520611672, 0.02215152849847907], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 258.5, 245, 272, 258.5, 272.0, 272.0, 272.0, 0.027076423204494684, 0.01726650815677249, 0.020280875583835376], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1114.5, 1072, 1157, 1114.5, 1157.0, 1157.0, 1157.0, 0.027125264471328594, 0.017694996744968265, 0.019628731419193836], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.027187580713130242, 0.017735648355831055, 0.021691653752565827], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 258.5, 245, 272, 258.5, 272.0, 272.0, 272.0, 0.026992738953221584, 0.01721314310200556, 0.019242870542823982], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.027014250016883908, 0.017226860606469913, 0.019469254406699533], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 247.5, 240, 255, 247.5, 255.0, 255.0, 255.0, 0.027445383686463938, 0.01790382451421671, 0.020155203644746954], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1055.5, 996, 1115, 1055.5, 1115.0, 1115.0, 1115.0, 0.026880997822639176, 0.017535650923362275, 0.01892695256847934], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 273.0, 271, 275, 273.0, 275.0, 275.0, 275.0, 0.027562636090515697, 0.007321325211543233, 0.02212547545547256], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1061.5, 1036, 1087, 1061.5, 1087.0, 1087.0, 1087.0, 0.027244244653316985, 0.020433183489987742, 0.021816680288788994], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 273.5, 262, 285, 273.5, 285.0, 285.0, 285.0, 0.027401389250434997, 0.007278494019646795, 0.021996037074079655], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1110.5, 1105, 1116, 1110.5, 1116.0, 1116.0, 1116.0, 0.027251669164736342, 0.01777745605668347, 0.02195569048916746], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 265.0, 250, 280, 265.0, 280.0, 280.0, 280.0, 0.02700112054650268, 0.016546096819268, 0.02209662013473559], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.02703506447862878, 0.01724013389115683, 0.019273044013084974], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 248.0, 243, 253, 248.0, 253.0, 253.0, 253.0, 0.027244615782805924, 0.007236851067307822, 0.021045401449413557], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 260.5, 255, 266, 260.5, 266.0, 266.0, 266.0, 0.02751561511157582, 0.017949639545442035, 0.02017990912968109], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 261.5, 256, 267, 261.5, 267.0, 267.0, 267.0, 0.027510694782596733, 0.01794642979958459, 0.02229870768511259], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 260.0, 254, 266, 260.0, 266.0, 266.0, 266.0, 0.027599530807976266, 0.018004381425515765, 0.01997192610225626], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 259.5, 239, 280, 259.5, 280.0, 280.0, 280.0, 0.027547071057669795, 0.007317190749693539, 0.022112980868559153], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 413.25000000000006, 1, 1647, 2.5, 1647.0, 1647.0, 1647.0, 0.03589182204834628, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 250, 267, 258.5, 267.0, 267.0, 267.0, 0.027158783829660107, 0.017716862888879834, 0.01994473187490664], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 238.5, 238, 239, 238.5, 239.0, 239.0, 239.0, 0.027467245309967865, 0.007295987035460214, 0.022048901996868736], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 274.5, 263, 286, 274.5, 286.0, 286.0, 286.0, 0.027409650938095304, 0.017880514479148107, 0.02012896240766374], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.02709733362237156, 0.01608904183828311, 0.01868234134511164], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.02720126213856323, 0.007225335255555858, 0.02101191245273781], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 266.5, 252, 281, 266.5, 281.0, 281.0, 281.0, 0.027063233244475716, 0.014879492496718584, 0.019874561913911855], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 263.0, 250, 276, 263.0, 276.0, 276.0, 276.0, 0.027195713955480615, 0.020396785466610463, 0.023849366339864838], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 264.5, 243, 286, 264.5, 286.0, 286.0, 286.0, 0.027637670144406826, 0.02072825260830512, 0.023184334623091274], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 258.5, 244, 273, 258.5, 273.0, 273.0, 273.0, 0.026951998490688085, 0.017187163100018867, 0.019213827049025686], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1057.5, 973, 1142, 1057.5, 1142.0, 1142.0, 1142.0, 0.027298536798427604, 0.01780802986459926, 0.019994045506660844], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1355.0, 1101, 1609, 1355.0, 1609.0, 1609.0, 1609.0, 0.026926960619320095, 0.01756563446650959, 0.01948523224503534], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 54.25, 1, 210, 3.0, 210.0, 210.0, 210.0, 0.0364507868813618, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1279.5, 993, 1566, 1279.5, 1566.0, 1566.0, 1566.0, 0.02712967986977754, 0.007206321215409658, 0.02265222293814433], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 875.5, 842, 909, 875.5, 909.0, 909.0, 909.0, 0.026689085498485397, 0.046718931402378, 0.021789136207747844], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.0270559110401645, 0.0172534276457299, 0.019499279636368553], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 255, 267, 261.0, 267.0, 267.0, 267.0, 0.027580120249324287, 0.01799171906889514, 0.02025415080809752], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 239, 282, 260.5, 282.0, 282.0, 282.0, 0.027530765630592185, 0.01795952289183162, 0.020217906009966136], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 266.5, 252, 281, 266.5, 281.0, 281.0, 281.0, 0.02695962795713419, 0.016573325975601537, 0.021799386668463976], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 267.5, 249, 286, 267.5, 286.0, 286.0, 286.0, 0.027257983181824375, 0.02044348738636828, 0.024995357624739343], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 252.0, 249, 255, 252.0, 255.0, 255.0, 255.0, 0.027506911111416746, 0.020630183333562556, 0.02315523181449339], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 258.5, 251, 266, 258.5, 266.0, 266.0, 266.0, 0.027169852331852574, 0.017724083357106953, 0.022022438901794568], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 265.5, 251, 280, 265.5, 280.0, 280.0, 280.0, 0.027042741052233057, 0.016571601572535392, 0.024032123396027425], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 0.027467999780256002, 0.017918577981651376, 0.019876745934736033], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 267.0, 253, 281, 267.0, 281.0, 281.0, 281.0, 0.026979994334201188, 0.014833727353667255, 0.019813433339178996], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 375.5, 356, 395, 375.5, 395.0, 395.0, 395.0, 0.027066529529583716, 0.018211756685432796, 0.026062107535321823], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 264.5, 257, 272, 264.5, 272.0, 272.0, 272.0, 0.027583543657853725, 0.020687657743390292, 0.026263627994538456], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 244.0, 243, 245, 244.0, 245.0, 245.0, 245.0, 0.02746573649372408, 0.02059930237029306, 0.026446500178527288], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 250.5, 243, 258, 250.5, 258.0, 258.0, 258.0, 0.027438229685420697, 0.020578672264065522, 0.023526138343554073], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 262.0, 246, 278, 262.0, 278.0, 278.0, 278.0, 0.027243502424671714, 0.020432626818503784, 0.023811459638751156], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 264.5, 258, 271, 264.5, 271.0, 271.0, 271.0, 0.02759305758671118, 0.020694793190033388, 0.026272686667034573], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 363.3333333333333, 239, 855, 282.0, 855.0, 855.0, 855.0, 0.08118969973342716, 0.05296359318547787, 0.06113013524850814], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 264.0, 258, 270, 264.0, 270.0, 270.0, 270.0, 0.027522430781086585, 0.02064182308581494, 0.034806199083503055], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 278.5, 268, 289, 278.5, 289.0, 289.0, 289.0, 0.027416414207185845, 0.020562310655389382, 0.024096457799284432], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.027207552816661904, 0.01774867703274429, 0.019980546599736086], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 260.0, 253, 267, 260.0, 267.0, 267.0, 267.0, 0.02757593723716685, 0.0073248583286224436, 0.022136152743116356], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 265.5, 260, 271, 265.5, 271.0, 271.0, 271.0, 0.02723126148818844, 0.0072333038328000554, 0.021513760296820752], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 239.5, 239, 240, 239.5, 240.0, 240.0, 240.0, 0.027467245309967865, 0.01791808580767435, 0.02017125827450765], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1059.0, 1037, 1081, 1059.0, 1081.0, 1081.0, 1081.0, 0.027309346623882024, 0.01781508158667304, 0.020935387792722058], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 976.5, 972, 981, 976.5, 981.0, 981.0, 981.0, 0.027194604590449256, 0.017740230338300883, 0.021962830074513218], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 265.25, 242, 291, 264.0, 291.0, 291.0, 291.0, 0.05437959677528991, 0.04078469758146743, 0.042908900580502195], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 262.6666666666667, 247, 281, 262.0, 281.0, 281.0, 281.0, 0.08085054776246109, 0.06063791082184582, 0.06379613534381695], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1037.5, 961, 1114, 1037.5, 1114.0, 1114.0, 1114.0, 0.026546675692536405, 0.0454067406987085, 0.019054498666029547], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1322.75, 571, 1974, 1373.0, 1974.0, 1974.0, 1974.0, 0.035264350386585444, 0.016185785821967925, 0.0439082487723598], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 1050.5, 991, 1110, 1050.5, 1110.0, 1110.0, 1110.0, 0.026981450252951095, 0.017601180438448567, 0.01952466273187184], "isController": false}]}, function(index, item){
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
