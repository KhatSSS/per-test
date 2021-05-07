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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8804347826086957, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler - Load Crypto-js"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.25, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.375, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.25, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.75, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 230, 2, 0.8695652173913043, 420.53043478260855, 0, 3244, 271.0, 910.5, 1255.0499999999986, 2719.5299999999975, 2.5519544642559944, 6.895640578711152, 3.7787606308320485], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 0, 0.0, 280.5, 272, 289, 280.5, 289.0, 289.0, 289.0, 0.06682705159048383, 0.12980371641940658, 0.18423121742181234], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 262.5, 255, 270, 262.5, 270.0, 270.0, 270.0, 0.06693664446601291, 0.04366570166337561, 0.04954880518089628], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 255, 270, 262.5, 270.0, 270.0, 270.0, 0.06564048705241393, 0.041858630903541305, 0.04967907955627031], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 588.0, 270, 906, 588.0, 906.0, 906.0, 906.0, 0.06585229330611439, 0.04295833196141056, 0.05073970646340259], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 904.5, 864, 945, 904.5, 945.0, 945.0, 945.0, 0.06403893567288911, 0.05046818465627101, 0.07517070378790304], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 0, 0.0, 419.5, 278, 561, 419.5, 561.0, 561.0, 561.0, 0.0678656260604004, 0.0373128393281303, 0.1809970945028843], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 0, 0.0, 438.0, 424, 452, 438.0, 452.0, 452.0, 452.0, 0.06651368519072799, 0.05072967591206891, 0.19135675446473113], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 263.0, 255, 271, 263.0, 271.0, 271.0, 271.0, 0.06941552131056504, 0.04528278147993891, 0.059925118006386224], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 905.5, 880, 931, 905.5, 931.0, 931.0, 931.0, 0.06420339635966743, 0.10991069708837597, 0.04413983499727136], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 262.5, 255, 270, 262.5, 270.0, 270.0, 270.0, 0.06592609684543627, 0.043006477239015066, 0.056719620430497414], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 0, 0.0, 270.0, 263, 277, 270.0, 277.0, 277.0, 277.0, 0.07202535292422933, 0.04318707685105157, 0.19645196359118408], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 13.0, 0, 45, 3.5, 45.0, 45.0, 45.0, 0.10509445364020914, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 0, 0.0, 278.0, 270, 286, 278.0, 286.0, 286.0, 286.0, 0.06874033339061694, 0.1335200421034542, 0.18950582144698402], "isController": false}, {"data": ["JSR223 Sampler - Load Crypto-js", 4, 0, 0.0, 850.4999999999999, 61, 3072, 134.5, 3072.0, 3072.0, 3072.0, 0.09724788485850433, 0.0, 0.0], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 0, 0.0, 417.5, 280, 555, 417.5, 555.0, 555.0, 555.0, 0.06723819129265422, 0.036967872751722974, 0.17932373087913933], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.06896789544467051, 0.04499077554398428, 0.05239943618745474], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 0, 0.0, 303.5, 296, 311, 303.5, 311.0, 311.0, 311.0, 0.06725401842760105, 0.1438999554442128, 0.18179601856210909], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 267.0, 256, 278, 267.0, 278.0, 278.0, 278.0, 0.06681588881836101, 0.04358692747135269, 0.05748515434470317], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.07189072609633358, 0.0468974658519051, 0.06157047537742631], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1095.0, 1087, 1103, 1095.0, 1103.0, 1103.0, 1103.0, 0.06394270733422854, 0.03996419208389283, 0.04708281379883624], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 0, 0.0, 273.0, 266, 280, 273.0, 280.0, 280.0, 280.0, 0.06774379297496867, 0.03724585492666734, 0.18067216661585883], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 2, 0, 0.0, 1102.0, 1007, 1197, 1102.0, 1197.0, 1197.0, 1197.0, 0.06706458319361545, 0.04178437898195963, 0.18475506756756757], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 286.0, 282, 290, 286.0, 290.0, 290.0, 290.0, 0.06561249261859457, 0.04824824896660324, 0.07817113378387246], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 269.5, 262, 277, 269.5, 277.0, 277.0, 277.0, 0.06534239414532148, 0.03592555459357031, 0.051495421948510194], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.5, 256, 271, 263.5, 271.0, 271.0, 271.0, 0.06550289850325877, 0.04177089133069138, 0.0495749475976812], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 588.0, 270, 906, 588.0, 906.0, 906.0, 906.0, 0.06685385746757588, 0.043611696082363954, 0.05151141947452868], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.0, 254, 270, 262.0, 270.0, 270.0, 270.0, 0.0674217907227616, 0.04299455990426106, 0.05102723418959007], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 262.5, 255, 270, 262.5, 270.0, 270.0, 270.0, 0.06731513580828649, 0.04391260812493689, 0.059558118205378485], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 263.5, 255, 272, 263.5, 272.0, 272.0, 272.0, 0.07097735822272695, 0.04630163602810703, 0.05461929519483285], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.06945650286508075, 0.04530951554089251, 0.053448949470394164], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 270.5, 263, 278, 270.5, 278.0, 278.0, 278.0, 0.06879708300368065, 0.03782495872175019, 0.1834812828936053], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 0, 0.0, 420.0, 279, 561, 420.0, 561.0, 561.0, 561.0, 0.06828502168049438, 0.037543425005974934, 0.18211561934514664], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.06780350544123132, 0.04423119300267824, 0.05224313065735499], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 272.0, 263, 281, 272.0, 281.0, 281.0, 281.0, 0.06695232994108195, 0.036810704840653456, 0.17856134088778788], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.0677323218639935, 0.04418475684096451, 0.051328400162557575], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.06925447557048375, 0.04517772429793275, 0.05951556494338446], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 270.0, 261, 279, 270.0, 279.0, 279.0, 279.0, 0.06559097468188377, 0.03606222533779352, 0.051691324773711134], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 0, 0.0, 449.0, 401, 497, 449.0, 497.0, 497.0, 497.0, 0.06624710168930109, 0.04716224329248095, 0.1934363613779397], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 0, 0.0, 1816.0, 1724, 1908, 1816.0, 1908.0, 1908.0, 1908.0, 0.06828269033799932, 0.04287672840559918, 0.19964685046090816], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 264.0, 257, 271, 264.0, 271.0, 271.0, 271.0, 0.07093707881109457, 0.04627536000567497, 0.06082300312123147], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 262.0, 254, 270, 262.0, 270.0, 270.0, 270.0, 0.0653146533424774, 0.041650848274060286, 0.04892220616570328], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 263.0, 254, 272, 263.0, 272.0, 272.0, 272.0, 0.06855184233076264, 0.04471936589545844, 0.05208333333333333], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 263.5, 255, 272, 263.5, 272.0, 272.0, 272.0, 0.06727664155005382, 0.04388749663616792, 0.05722456522470398], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.06544502617801048, 0.04173398642015707, 0.04901985847513089], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.0, 256, 270, 263.0, 270.0, 270.0, 270.0, 0.06538725602380095, 0.041697146663615264, 0.04948742521332592], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.0, 254, 270, 262.0, 270.0, 270.0, 270.0, 0.06885392639515268, 0.04491642854683788, 0.053052488208765104], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 262.5, 255, 270, 262.5, 270.0, 270.0, 270.0, 0.06854244490900992, 0.04471323554611193, 0.050737473868192884], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 0, 0.0, 273.5, 262, 285, 273.5, 285.0, 285.0, 285.0, 0.0722908985758693, 0.03974587490060001, 0.19279926172919828], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 2, 0, 0.0, 383.5, 376, 391, 383.5, 391.0, 391.0, 391.0, 0.0690917884409438, 0.04304742287629115, 0.19195911925242684], "isController": false}, {"data": ["ST14-090-GET-id", 2, 0, 0.0, 1493.0, 1326, 1660, 1493.0, 1660.0, 1660.0, 1660.0, 0.06842051246963839, 6.741291351647224, 0.18241015531456328], "isController": false}, {"data": ["eProtect/paypage", 4, 0, 0.0, 1610.75, 721, 3244, 1239.0, 3244.0, 3244.0, 3244.0, 0.08639682059700203, 0.0396547907037021, 0.10757416627068124], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 0, 0.0, 271.0, 262, 280, 271.0, 280.0, 280.0, 280.0, 0.06842051246963839, 0.03761791847695939, 0.18247697222127193], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 263.0, 255, 271, 263.0, 271.0, 271.0, 271.0, 0.07188555819135935, 0.046894094601394584, 0.061706450830278196], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 2, 0, 0.0, 1361.5, 1072, 1651, 1361.5, 1651.0, 1651.0, 1651.0, 0.06757669955399379, 6.658119710011488, 0.18016053689687794], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 297.0, 291, 303, 297.0, 303.0, 303.0, 303.0, 0.06534239414532148, 0.044667652247778356, 0.058131758853894405], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 263.5, 256, 271, 263.5, 271.0, 271.0, 271.0, 0.06532318646503577, 0.04165628980631675, 0.04892859767449456], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 275.0, 267, 283, 275.0, 283.0, 283.0, 283.0, 0.06687397599224261, 0.05100446801752098, 0.17632786638579598], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 262.0, 254, 270, 262.0, 270.0, 270.0, 270.0, 0.07132413252023823, 0.046527852073749154, 0.05418962412182162], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 0, 0.0, 271.0, 264, 278, 271.0, 278.0, 278.0, 278.0, 0.07184940364994971, 0.03950313892082196, 0.19162179821094985], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 484.75, 1, 1935, 1.5, 1935.0, 1935.0, 1935.0, 0.09301244041390536, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 576.5, 278, 875, 576.5, 875.0, 875.0, 875.0, 0.06651810955532644, 0.04339267303023248, 0.05125272308510992], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 0, 0.0, 274.0, 268, 280, 274.0, 280.0, 280.0, 280.0, 0.068561242329711, 0.03769529241369854, 0.1828522976586336], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 255, 270, 262.5, 270.0, 270.0, 270.0, 0.06847907964116963, 0.04467189960966925, 0.05276366585633089], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 263.5, 256, 271, 263.5, 271.0, 271.0, 271.0, 0.06545573555882835, 0.03886434298805433, 0.04512866143020782], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 0, 0.0, 839.0, 268, 1410, 839.0, 1410.0, 1410.0, 1410.0, 0.0659326168655634, 0.5140683721236896, 0.17384576712599722], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 271.0, 262, 280, 271.0, 280.0, 280.0, 280.0, 0.06533172181752851, 0.03591968689772319, 0.05148701123705615], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 672.5, 621, 724, 672.5, 724.0, 724.0, 724.0, 0.06623174487531874, 0.047798104944199754, 0.18478915537967347], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 0, 0.0, 291.5, 282, 301, 291.5, 301.0, 301.0, 301.0, 0.07214486689272058, 0.04924732613087079, 0.19790520615395713], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 263.0, 254, 272, 263.0, 272.0, 272.0, 272.0, 0.0655694708543702, 0.041813344206937254, 0.04911307045439643], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 262.0, 253, 271, 262.0, 271.0, 271.0, 271.0, 0.0722700007227, 0.047144883283948835, 0.05554344782105948], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 265.5, 254, 277, 265.5, 277.0, 277.0, 277.0, 0.06695681285570806, 0.04367885838634081, 0.05087148476732507], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 46.5, 0, 181, 2.5, 181.0, 181.0, 181.0, 0.10522162304353545, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 0, 0.0, 284.5, 274, 295, 284.5, 295.0, 295.0, 295.0, 0.0683433570256971, 0.08576290408009841, 0.1848741200792783], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 932.5, 911, 954, 932.5, 954.0, 954.0, 954.0, 0.06424670735624799, 0.11029854641824607, 0.05477282765820752], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.0, 255, 271, 263.0, 271.0, 271.0, 271.0, 0.0653851183470642, 0.041695783477180594, 0.04948580734274879], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.0, 255, 271, 263.0, 271.0, 271.0, 271.0, 0.07197092374680629, 0.04694978228795566, 0.05545415901975601], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.0, 254, 272, 263.0, 272.0, 272.0, 272.0, 0.07191140514885662, 0.046910955702574426, 0.05540829947504674], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 281.5, 274, 289, 281.5, 289.0, 289.0, 289.0, 0.06549646319098769, 0.0441973203759497, 0.05762921224128897], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 0, 0.0, 614.0, 604, 624, 614.0, 624.0, 624.0, 624.0, 0.06513385006187716, 0.04172637269589005, 0.18446109880805053], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 2, 0, 0.0, 270.0, 261, 279, 270.0, 279.0, 279.0, 279.0, 0.06927606511950121, 0.038088305334257014, 0.184758724454451], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 2, 0, 0.0, 490.5, 427, 554, 490.5, 554.0, 554.0, 554.0, 0.06839477463921757, 0.042613150605293755, 0.1898890081047808], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 263.0, 255, 271, 263.0, 271.0, 271.0, 271.0, 0.06678242286630158, 0.043565096166688924, 0.05765201349004942], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 534.5, 513, 556, 534.5, 556.0, 556.0, 556.0, 0.06477942605428516, 0.04358693803847898, 0.06218571856578351], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 266.0, 262, 270, 266.0, 270.0, 270.0, 270.0, 0.0687001923605386, 0.044816141110195114, 0.05219604458642484], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 272.0, 265, 279, 272.0, 279.0, 279.0, 279.0, 0.06545573555882835, 0.03598787023400425, 0.05158474472263132], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 492.0, 485, 499, 492.0, 499.0, 499.0, 499.0, 0.06493928177154361, 0.3023101134813949, 0.06259284287940775], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 0, 0.0, 731.0, 707, 755, 731.0, 755.0, 755.0, 755.0, 0.07073886747073178, 0.04441903494500053, 0.20268343472571004], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 0, 0.0, 278.5, 270, 287, 278.5, 287.0, 287.0, 287.0, 0.06863889079552475, 0.043301487747957994, 0.19680056970279358], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 440.5, 424, 457, 440.5, 457.0, 457.0, 457.0, 0.06849080510941406, 0.052103844902571826, 0.1891523406732646], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 0, 0.0, 432.5, 422, 443, 432.5, 443.0, 443.0, 443.0, 0.06745817593092283, 0.051384157447382624, 0.18748629755801402], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 0, 0.0, 401.0, 282, 520, 401.0, 520.0, 520.0, 520.0, 0.07125298371869322, 0.04495061277565998, 0.20088609765221419], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 262.33333333333337, 254, 271, 262.0, 271.0, 271.0, 271.0, 0.20824656393169513, 0.13584834443981675, 0.16431955435235318], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 283.0, 278, 288, 283.0, 288.0, 288.0, 288.0, 0.070859167404783, 0.05259078830823737, 0.22648638175376437], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 0, 0.0, 274.5, 267, 282, 274.5, 282.0, 282.0, 282.0, 0.06848611444029723, 0.043205107351984386, 0.19061076772934288], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.0, 256, 274, 265.0, 274.0, 274.0, 274.0, 0.0670084095553992, 0.04371251717090495, 0.051630503065634735], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 0, 0.0, 271.0, 262, 280, 271.0, 280.0, 280.0, 280.0, 0.07190881961672599, 0.03953580609786791, 0.19178026013015498], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 0, 0.0, 684.0, 524, 844, 684.0, 844.0, 844.0, 844.0, 0.06640767672742968, 1.9094801109008201, 0.17626568881362684], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.0, 254, 276, 265.0, 276.0, 276.0, 276.0, 0.06862475981334065, 0.04476693315948394, 0.05287591356711502], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 264.0, 254, 274, 264.0, 274.0, 274.0, 274.0, 0.06933610677760443, 0.045230975905702894, 0.05342401196047842], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 885.5, 276, 1495, 885.5, 1495.0, 1495.0, 1495.0, 0.06833868653044489, 0.04458031504134491, 0.055258234811726925], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.06873797085510036, 0.04484078567500687, 0.05913882062826505], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 0, 0.0, 270.25, 261, 280, 270.0, 280.0, 280.0, 280.0, 0.13995311570623842, 0.08583062174171653, 0.375850652531402], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 276.1666666666667, 262, 294, 278.5, 294.0, 294.0, 294.0, 0.19834710743801653, 0.1090521694214876, 0.5355759297520661], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1086.5, 1012, 1161, 1086.5, 1161.0, 1161.0, 1161.0, 0.0633432571102806, 0.10874750585925128, 0.04775487743079749], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 262.5, 254, 271, 262.5, 271.0, 271.0, 271.0, 0.06788635823631241, 0.04428524150571943, 0.0515777213943858], "isController": false}]}, function(index, item){
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
