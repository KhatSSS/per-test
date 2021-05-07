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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8532110091743119, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.25, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.25, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [0.75, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.75, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.25, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [0.75, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.25, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 218, 0, 0.0, 548.0642201834862, 1, 5737, 277.0, 1156.1, 2113.9999999999964, 5139.190000000002, 3.081838358991758, 11.625548797835645, 4.753689282129579], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 0, 0.0, 284.5, 279, 290, 284.5, 290.0, 290.0, 290.0, 6.134969325153374, 11.916458972392638, 16.859183282208587], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 5.649717514124294, 3.68555790960452, 4.132459392655368], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 272.0, 261, 283, 272.0, 283.0, 283.0, 283.0, 0.6546644844517185, 0.41747647299509, 0.4897197217675941], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 275.0, 262, 288, 275.0, 288.0, 288.0, 288.0, 5.797101449275362, 3.781702898550725, 4.415760869565218], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 994.0, 964, 1024, 994.0, 1024.0, 1024.0, 1024.0, 0.9225092250922509, 0.7270165475092251, 1.0747592827490775], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 0, 0.0, 275.5, 268, 283, 275.5, 283.0, 283.0, 283.0, 5.235602094240838, 2.878558573298429, 13.917293848167539], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 0, 0.0, 448.0, 442, 454, 448.0, 454.0, 454.0, 454.0, 3.134796238244514, 2.390894396551724, 8.991109913793103], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 1.3531799729364007, 0.8827384979702301, 1.1562817151556157], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 1454.0, 818, 2090, 1454.0, 2090.0, 2090.0, 2090.0, 0.3575259206292456, 0.6169417009295673, 0.24265675277082588], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 268.0, 261, 275, 268.0, 275.0, 275.0, 275.0, 5.4945054945054945, 3.584306318681319, 4.678914835164835], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 0, 0.0, 273.5, 267, 280, 273.5, 280.0, 280.0, 280.0, 6.25, 3.74755859375, 16.9921875], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 0, 0.0, 285.0, 279, 291, 285.0, 291.0, 291.0, 291.0, 3.5971223021582737, 6.986988534172661, 9.885060701438848], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 0, 0.0, 275.0, 269, 281, 275.0, 281.0, 281.0, 281.0, 5.47945205479452, 3.0126284246575343, 14.565496575342467], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 276.0, 269, 283, 276.0, 283.0, 283.0, 283.0, 3.9447731755424065, 2.573348126232742, 2.962432199211045], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 0, 0.0, 308.0, 305, 311, 308.0, 311.0, 311.0, 311.0, 5.208333333333333, 11.144002278645834, 14.032999674479166], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 6.191950464396285, 4.039280185758514, 5.272832817337461], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 268.5, 262, 275, 268.5, 275.0, 275.0, 275.0, 2.6917900403768504, 1.755972409152086, 2.28171265141319], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1532.0, 1189, 1875, 1532.0, 1875.0, 1875.0, 1875.0, 0.48426150121065376, 0.3026634382566586, 0.35231915859564167], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 0, 0.0, 277.0, 269, 285, 277.0, 285.0, 285.0, 285.0, 4.7281323877068555, 2.599549349881797, 12.568336288416075], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 2, 0, 0.0, 1641.5, 1577, 1706, 1641.5, 1706.0, 1706.0, 1706.0, 0.6966213862765587, 70.10432993730407, 1.9129876349703936], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 304.0, 287, 321, 304.0, 321.0, 321.0, 321.0, 0.6193868070610096, 0.45546705636419943, 0.7324974837410962], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 715.0, 269, 1161, 715.0, 1161.0, 1161.0, 1161.0, 0.7648183556405354, 0.42050071701720837, 0.5960205544933078], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 551.5, 284, 819, 551.5, 819.0, 819.0, 819.0, 0.5635390250774865, 0.3593661947027332, 0.4215536066497605], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 4.246284501061571, 2.7700371549893843, 3.234474522292994], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 271.5, 261, 282, 271.5, 282.0, 282.0, 282.0, 6.802721088435374, 4.3380633503401365, 5.0887542517006805], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 5.649717514124294, 3.68555790960452, 4.9490201271186445], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 4.048582995951417, 2.6410678137651824, 3.0799278846153846], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 2, 0, 0.0, 515.0, 261, 769, 515.0, 769.0, 769.0, 769.0, 1.366120218579235, 0.8911799863387978, 1.0392652834699454], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 276.0, 267, 285, 276.0, 285.0, 285.0, 285.0, 3.7593984962406015, 2.0669349154135337, 9.993244830827066], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 0, 0.0, 275.5, 269, 282, 275.5, 282.0, 282.0, 282.0, 4.065040650406504, 2.2349784044715446, 10.805703760162602], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 5.012531328320802, 3.269893483709273, 3.8181390977443606], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 278.0, 272, 284, 278.0, 284.0, 284.0, 284.0, 5.714285714285714, 3.1417410714285716, 15.189732142857144], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 268.0, 261, 275, 268.0, 275.0, 275.0, 275.0, 4.662004662004662, 3.0412296037296036, 3.491950757575758], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 1.402524544179523, 0.9149281206171108, 1.1929676542777], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 283.0, 276, 290, 283.0, 290.0, 290.0, 290.0, 0.6563833278634722, 0.3608826304561864, 0.5115174762061043], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 0, 0.0, 508.0, 504, 512, 508.0, 512.0, 512.0, 512.0, 3.395585738539898, 2.4173652376910018, 9.885001061120544], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 0, 0.0, 3135.0, 2994, 3276, 3135.0, 3276.0, 3276.0, 3276.0, 0.6024096385542169, 0.3782708960843374, 1.7560476280120483], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 269.5, 261, 278, 269.5, 278.0, 278.0, 278.0, 3.9138943248532287, 2.5532045009784734, 3.321459148727984], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 276.0, 269, 283, 276.0, 283.0, 283.0, 283.0, 1.402524544179523, 0.8943833274894811, 1.0381968793828893], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 269.0, 261, 277, 269.0, 277.0, 277.0, 277.0, 3.2310177705977385, 2.1077342487883683, 2.4264186187399033], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 269.0, 262, 276, 269.0, 276.0, 276.0, 276.0, 5.434782608695652, 3.545346467391304, 4.574983016304348], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 278.0, 271, 285, 278.0, 285.0, 285.0, 285.0, 0.5680204487361545, 0.3622239775631923, 0.42046826185742686], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.5, 269, 284, 276.5, 284.0, 284.0, 284.0, 0.7601672367920943, 0.4847550836183961, 0.5686407259597112], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 272.0, 269, 275, 272.0, 275.0, 275.0, 275.0, 3.883495145631068, 2.533373786407767, 2.958131067961165], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 268.0, 261, 275, 268.0, 275.0, 275.0, 275.0, 5.128205128205129, 3.345352564102564, 3.7510016025641026], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 0, 0.0, 275.5, 269, 282, 275.5, 282.0, 282.0, 282.0, 6.134969325153374, 3.3730348926380365, 16.30799463190184], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 2, 0, 0.0, 4120.5, 4073, 4168, 4120.5, 4168.0, 4168.0, 4168.0, 0.3780718336483932, 0.2484788516068053, 1.0470817580340264], "isController": false}, {"data": ["ST14-090-GET-id", 2, 0, 0.0, 2433.0, 2375, 2491, 2433.0, 2491.0, 2491.0, 2491.0, 0.7713073659853451, 76.01219027188584, 2.0495384207481684], "isController": false}, {"data": ["eProtect/paypage", 2, 0, 0.0, 1435.0, 547, 2323, 1435.0, 2323.0, 2323.0, 2323.0, 0.192437217357837, 0.08832567593572596, 0.23791554411623206], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 0, 0.0, 274.5, 268, 281, 274.5, 281.0, 281.0, 281.0, 2.9806259314456036, 1.6387621087928463, 7.923109165424739], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 268.5, 262, 275, 268.5, 275.0, 275.0, 275.0, 3.395585738539898, 2.2150891341256367, 2.8849214770797964], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 2, 0, 0.0, 1643.5, 1591, 1696, 1643.5, 1696.0, 1696.0, 1696.0, 0.8748906386701663, 86.89398444335083, 2.3247826443569553], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 743.5, 307, 1180, 743.5, 1180.0, 1180.0, 1180.0, 0.564652738565782, 0.3859930830039526, 0.4973796583850932], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 274.5, 265, 284, 274.5, 284.0, 284.0, 284.0, 1.1634671320535195, 0.7419375363583478, 0.8612383653286795], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 334.0, 305, 363, 334.0, 363.0, 363.0, 363.0, 5.025125628140704, 3.8326397613065324, 13.205676821608039], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 268.0, 261, 275, 268.0, 275.0, 275.0, 275.0, 2.797202797202797, 1.8247377622377623, 2.1006337412587412], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 0, 0.0, 275.0, 269, 281, 275.0, 281.0, 281.0, 281.0, 5.3908355795148255, 2.96390667115903, 14.329935983827493], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 2, 0, 0.0, 379.0, 3, 755, 379.0, 755.0, 755.0, 755.0, 0.2762049440684988, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 2, 0, 0.0, 17.0, 1, 33, 17.0, 33.0, 33.0, 33.0, 0.3083564600678384, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.0, 261, 275, 268.0, 275.0, 275.0, 275.0, 5.555555555555555, 3.6241319444444446, 4.231770833333334], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 0, 0.0, 276.0, 270, 282, 276.0, 282.0, 282.0, 282.0, 3.2626427406199023, 1.7938162724306688, 8.672767128874389], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 269.0, 261, 277, 269.0, 277.0, 277.0, 277.0, 3.067484662576687, 2.0010544478527605, 2.3365605828220857], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 272.0, 261, 283, 272.0, 283.0, 283.0, 283.0, 1.366120218579235, 0.8111338797814208, 0.9298689378415301], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 0, 0.0, 609.5, 590, 629, 609.5, 629.0, 629.0, 629.0, 2.785515320334262, 21.783600278551532, 7.32013840529248], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 280.5, 275, 286, 280.5, 286.0, 286.0, 286.0, 1.386001386001386, 0.7620300589050589, 1.0801065488565489], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 661.0, 634, 688, 661.0, 688.0, 688.0, 688.0, 2.7027027027027026, 1.9504856418918919, 7.516891891891892], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 0, 0.0, 375.0, 339, 411, 375.0, 411.0, 411.0, 411.0, 4.866180048661801, 3.3217381386861318, 13.305961070559611], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 273.5, 268, 279, 273.5, 279.0, 279.0, 279.0, 0.6611570247933884, 0.4216167355371901, 0.4894111570247934], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 6.042296072507553, 3.9416540785498486, 4.590728851963746], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 4.49438202247191, 2.93188202247191, 3.375175561797753], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 2, 0, 0.0, 95.5, 1, 190, 95.5, 190.0, 190.0, 190.0, 0.3098853424233034, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 0, 0.0, 294.5, 283, 306, 294.5, 306.0, 306.0, 306.0, 2.8169014084507045, 3.534881161971831, 7.595180457746479], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 1478.5, 854, 2103, 1478.5, 2103.0, 2103.0, 2103.0, 0.4590314436538903, 0.7831327461556116, 0.38730778058296994], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 276.0, 268, 284, 276.0, 284.0, 284.0, 284.0, 1.3774104683195594, 0.8783681990358126, 1.0303675964187329], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 269.0, 262, 276, 269.0, 276.0, 276.0, 276.0, 3.558718861209964, 2.3215080071174374, 2.7107428825622772], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 5.681818181818182, 3.7064985795454546, 4.327947443181818], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 294.5, 287, 302, 294.5, 302.0, 302.0, 302.0, 0.6596306068601583, 0.44512182552770446, 0.5746000989445911], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 0, 0.0, 650.0, 628, 672, 650.0, 672.0, 672.0, 672.0, 2.73224043715847, 1.7503415300546448, 7.713776468579235], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 2, 0, 0.0, 276.0, 268, 284, 276.0, 284.0, 284.0, 284.0, 1.4114326040931546, 0.776012261820748, 3.751874558927311], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 2, 0, 0.0, 5552.0, 5367, 5737, 5552.0, 5737.0, 5737.0, 5737.0, 0.2845354958031014, 0.22007042253521128, 0.7874742139706928], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 5.9171597633136095, 3.8600221893491122, 5.0561667899408285], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 686.5, 561, 812, 686.5, 812.0, 812.0, 812.0, 1.002004008016032, 0.6741999624248497, 0.9530780310621243], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 269.5, 264, 275, 269.5, 275.0, 275.0, 275.0, 3.527336860670194, 2.301036155202822, 2.648947310405644], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 281.5, 274, 289, 281.5, 289.0, 289.0, 289.0, 0.5651313930488839, 0.3107118889516812, 0.4404051285673919], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 801.5, 789, 814, 801.5, 814.0, 814.0, 814.0, 1.015744032503809, 4.728566213814118, 0.970114906043677], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 0, 0.0, 727.0, 629, 825, 727.0, 825.0, 825.0, 825.0, 1.8001800180018002, 1.1303864761476148, 5.142115774077408], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 0, 0.0, 280.5, 274, 287, 280.5, 287.0, 287.0, 287.0, 3.3840947546531304, 2.1348879018612523, 9.673091159052454], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 454.5, 454, 455, 454.5, 455.0, 455.0, 455.0, 2.881844380403458, 2.1923405979827093, 7.933514949567724], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 0, 0.0, 441.5, 437, 446, 441.5, 446.0, 446.0, 446.0, 3.571428571428571, 2.7204241071428568, 9.894670758928571], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 0, 0.0, 279.0, 272, 286, 279.0, 286.0, 286.0, 286.0, 2.7027027027027026, 1.705025337837838, 7.596072635135135], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 268.5, 261, 277, 268.5, 277.0, 277.0, 277.0, 4.316546762589928, 2.8158723021582737, 3.3680867805755397], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 0, 0.0, 920.5, 751, 1090, 920.5, 1090.0, 1090.0, 1090.0, 1.4914243102162563, 0.9030108128262491, 4.788870246085011], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 0, 0.0, 281.5, 273, 290, 281.5, 290.0, 290.0, 290.0, 3.0911901081916535, 1.950106259659969, 8.576241306027821], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 269.0, 262, 276, 269.0, 276.0, 276.0, 276.0, 6.097560975609756, 3.9777057926829267, 4.644626524390244], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 0, 0.0, 275.0, 268, 282, 275.0, 282.0, 282.0, 282.0, 3.442340791738382, 1.8926151032702239, 9.150441049913942], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 0, 0.0, 1156.5, 1156, 1157, 1156.5, 1157.0, 1157.0, 1157.0, 1.5094339622641508, 43.402122641509436, 3.993219339622642], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 3.3783783783783785, 2.20386402027027, 2.5733741554054057], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 270.5, 266, 275, 270.5, 275.0, 275.0, 275.0, 1.4306151645207439, 0.9332528612303291, 1.0897263948497855], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 268.5, 262, 275, 268.5, 275.0, 275.0, 275.0, 2.849002849002849, 1.8585292022792024, 2.2786458333333335], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 269.0, 261, 277, 269.0, 277.0, 277.0, 277.0, 3.6101083032490977, 2.355031588447653, 3.0742328519855593], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 0, 0.0, 275.5, 269, 281, 276.0, 281.0, 281.0, 281.0, 3.4873583260680037, 2.138731473408893, 9.33481364428945], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 276.3333333333333, 268, 286, 276.5, 286.0, 286.0, 286.0, 6.779661016949152, 3.727489406779661, 18.246822033898304], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1682.5, 972, 2393, 1682.5, 2393.0, 2393.0, 2393.0, 0.27643400138217, 0.47296129923980645, 0.20597572563925362], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 270.5, 262, 279, 270.5, 279.0, 279.0, 279.0, 5.319148936170213, 3.4699135638297873, 3.9945561835106385], "isController": false}]}, function(index, item){
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
