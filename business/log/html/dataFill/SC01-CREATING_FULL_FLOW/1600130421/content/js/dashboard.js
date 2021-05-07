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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.25, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.25, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 692.982142857143, 1, 41760, 268.0, 1142.5, 1474.25, 4133.75, 1.0855342864065907, 0.6498175127211049, 0.8363085322267991], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 250.5, 243, 258, 250.5, 258.0, 258.0, 258.0, 0.01742129928050034, 0.013065974460375255, 0.015362727783488092], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1126.0, 1102, 1150, 1126.0, 1150.0, 1150.0, 1150.0, 0.025971664913579287, 0.006898723492669497, 0.023181739971690884], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1042.5, 1034, 1051, 1042.5, 1051.0, 1051.0, 1051.0, 0.02555388035673217, 0.016669914138962, 0.017992527087113176], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.5, 247, 280, 263.5, 280.0, 280.0, 280.0, 0.027655249657766286, 0.01763562307277479, 0.019931224851007342], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 269.5, 257, 282, 269.5, 282.0, 282.0, 282.0, 0.02684419628476323, 0.017511643670138514, 0.019713706646623], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 803.5, 727, 880, 803.5, 880.0, 880.0, 880.0, 0.027278430944652064, 0.02149774782454513, 0.03202018944870291], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 265.0, 246, 284, 265.0, 284.0, 284.0, 284.0, 0.02637722063226198, 0.007006449230444588, 0.021173901718475927], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 274.5, 253, 296, 274.5, 296.0, 296.0, 296.0, 0.027280291353511656, 0.02046021851513374, 0.02674747316301338], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 887.0, 886, 888, 887.0, 888.0, 888.0, 888.0, 0.026979994334201188, 0.04624012700832333, 0.017573883028234562], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1112.0, 1046, 1178, 1112.0, 1178.0, 1178.0, 1178.0, 0.026507269618692927, 0.017291851665319217, 0.021847788631032063], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 254.0, 251, 257, 254.0, 257.0, 257.0, 257.0, 0.017256553176068612, 0.012942414882051459, 0.014341139407064833], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.5, 1, 23, 3.0, 23.0, 23.0, 23.0, 0.03653902367728734, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1011.0, 996, 1026, 1011.0, 1026.0, 1026.0, 1026.0, 0.0173576456089496, 0.004610624614877238, 0.01549305477205072], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 268.0, 256, 280, 268.0, 280.0, 280.0, 280.0, 0.026853928058326735, 0.007133074640493038, 0.021556571156195872], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1072.5, 1000, 1145, 1072.5, 1145.0, 1145.0, 1145.0, 0.027052983267729848, 0.017647844553558143, 0.01957642636854279], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 265.5, 250, 281, 265.5, 281.0, 281.0, 281.0, 0.025867197806461625, 0.01940039835484622, 0.019450920225561965], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1089.5, 1007, 1172, 1089.5, 1172.0, 1172.0, 1172.0, 0.02602032187138155, 0.01697419434578406, 0.02144643716742776], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 251.5, 239, 264, 251.5, 264.0, 264.0, 264.0, 0.017277871366247678, 0.011271111399075634, 0.01417325385512505], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 246.5, 239, 254, 246.5, 254.0, 254.0, 254.0, 0.017419630181251252, 0.011363586876050621, 0.012792540914356387], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1753.0, 1174, 2332, 1753.0, 2332.0, 2332.0, 2332.0, 0.026881720430107527, 0.016801075268817203, 0.018822454637096774], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 249.5, 242, 257, 249.5, 257.0, 257.0, 257.0, 0.017428130745836858, 0.013071098059377641, 0.013411491238007268], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 278.0, 271, 285, 278.0, 285.0, 285.0, 285.0, 0.026881359121517186, 0.007140361016653002, 0.021578591013561646], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 288.5, 271, 306, 288.5, 306.0, 306.0, 306.0, 0.02763614254722326, 0.020322280603573353, 0.03187332455885807], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 274.0, 256, 292, 274.0, 292.0, 292.0, 292.0, 0.027542518763340906, 0.015143005921641535, 0.020710683054465332], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.0, 247, 279, 263.0, 279.0, 279.0, 279.0, 0.027607531334548064, 0.01760519332173817, 0.01989683410634421], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 272.0, 250, 294, 272.0, 294.0, 294.0, 294.0, 0.027297791608658858, 0.017807543744711052, 0.02004681571260885], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 246, 279, 262.5, 279.0, 279.0, 279.0, 0.027423180814742702, 0.01748763385940135, 0.01976397211062511], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 264.5, 246, 283, 264.5, 283.0, 283.0, 283.0, 0.02585649644473174, 0.016867323852617973, 0.020604395604395608], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 247.0, 240, 254, 247.0, 254.0, 254.0, 254.0, 0.01743511956133239, 0.011373691276337928, 0.013331736930198498], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 261.0, 246, 276, 261.0, 276.0, 276.0, 276.0, 0.017471368794388195, 0.0046408323360093645, 0.014024868309557712], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1097.0, 1009, 1185, 1097.0, 1185.0, 1185.0, 1185.0, 0.017486033031116396, 0.011406904360142337, 0.014395240083233517], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 270.0, 249, 291, 270.0, 291.0, 291.0, 291.0, 0.027314568224962782, 0.007255432184755739, 0.021926342852460357], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 855.5, 253, 1458, 855.5, 1458.0, 1458.0, 1458.0, 0.017417658021702403, 0.004626565412014701, 0.013981752826015015], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 279.0, 272, 286, 279.0, 286.0, 286.0, 286.0, 0.026875940657923026, 0.017532351913566977, 0.019737018920662226], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 261.5, 246, 277, 261.5, 277.0, 277.0, 277.0, 0.02581377939544129, 0.006856785151914092, 0.02072160806938744], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1085.5, 974, 1197, 1085.5, 1197.0, 1197.0, 1197.0, 0.026555840293176477, 0.01732353644125184, 0.019164810524079506], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 275.0, 256, 294, 275.0, 294.0, 294.0, 294.0, 0.027637670144406826, 0.015195320596973675, 0.020782232432805917], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 272.0, 254, 290, 272.0, 290.0, 290.0, 290.0, 0.02634872538040972, 0.01976154403530729, 0.027017735985771688], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 267.0, 258, 276, 267.0, 276.0, 276.0, 276.0, 0.017251045844654332, 0.012938284383490749, 0.0177227541294691], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 246.0, 239, 253, 246.0, 253.0, 253.0, 253.0, 0.017433143893169696, 0.011372402461559917, 0.014317650404448937], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 262.5, 246, 279, 262.5, 279.0, 279.0, 279.0, 0.027515993671321456, 0.017546820182981357, 0.02061012416592144], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 984.0, 980, 988, 984.0, 988.0, 988.0, 988.0, 0.017209334342947614, 0.011226401700282234, 0.012453239011840023], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 262.0, 246, 278, 262.0, 278.0, 278.0, 278.0, 0.02584613794083819, 0.016860566547343664, 0.02105046781509673], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 262.5, 247, 278, 262.5, 278.0, 278.0, 278.0, 0.02758430453072202, 0.017590381697813944, 0.019664592097096752], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 247, 278, 262.5, 278.0, 278.0, 278.0, 0.027559217869396864, 0.01757438405148062, 0.019862014441030165], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 247, 278, 262.5, 278.0, 278.0, 278.0, 0.017466333641905227, 0.011394053586711613, 0.012826838768274151], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1620.0, 1057, 2183, 1620.0, 2183.0, 2183.0, 2183.0, 0.0261110240743642, 0.01703336336101102, 0.018384812849234947], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 261.5, 253, 270, 261.5, 270.0, 270.0, 270.0, 0.017249260437958724, 0.004581834803832786, 0.013846574296877022], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1006.0, 976, 1036, 1006.0, 1036.0, 1036.0, 1036.0, 0.017326067935512376, 0.01299455095163428, 0.013874390338984518], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 0.017320966163492598, 0.004600881637177721, 0.01390413494764738], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1065.0, 1031, 1099, 1065.0, 1099.0, 1099.0, 1099.0, 0.01713928237824682, 0.01118070373893445, 0.01409304273680061], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 296.5, 278, 315, 296.5, 315.0, 315.0, 315.0, 0.027558838119384886, 0.018839049495673263, 0.023521898941740615], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 263.5, 247, 280, 263.5, 280.0, 280.0, 280.0, 0.027533418686931266, 0.017557932033755972, 0.019628316056113107], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 909.0, 254, 1564, 909.0, 1564.0, 1564.0, 1564.0, 0.02581677832423292, 0.00685758174237437, 0.01994245278756664], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 246.5, 239, 254, 246.5, 254.0, 254.0, 254.0, 0.017426460337376274, 0.011368042485710302, 0.01278053878258748], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 246.5, 239, 254, 246.5, 254.0, 254.0, 254.0, 0.017424183023618478, 0.011366556894313618, 0.01441238576270005], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 251.0, 239, 263, 251.0, 263.0, 263.0, 263.0, 0.017287429445678574, 0.011277346552454383, 0.012509751190671704], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 250.0, 247, 253, 250.0, 253.0, 253.0, 253.0, 0.017444548142591734, 0.00463370810037593, 0.014003338450400788], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 332.5, 1, 1322, 3.5, 1322.0, 1322.0, 1322.0, 0.036105319216153516, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 266.5, 248, 285, 266.5, 285.0, 285.0, 285.0, 0.0263636603306003, 0.01719816904379004, 0.019360813055284597], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 253.5, 253, 254, 253.5, 254.0, 254.0, 254.0, 0.01731751666810979, 0.004599965364966664, 0.013901365919127199], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 0.017320666152820238, 0.011299028310628827, 0.012719864205977363], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 264.0, 247, 281, 264.0, 281.0, 281.0, 281.0, 0.02744576031617516, 0.016295920187729, 0.018922565217987953], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 264.0, 260, 268, 264.0, 268.0, 268.0, 268.0, 0.02678344247586142, 0.00711435190765069, 0.020689163084381235], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 271.5, 255, 288, 271.5, 288.0, 288.0, 288.0, 0.027525082231183166, 0.015133419234527462, 0.020697571599620154], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 267.5, 250, 285, 267.5, 285.0, 285.0, 285.0, 0.025833118057349523, 0.01937483854301214, 0.023083303732885557], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 254.5, 252, 257, 254.5, 257.0, 257.0, 257.0, 0.01725298045237315, 0.01293973533927986, 0.014607748097858905], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 262.5, 247, 278, 262.5, 278.0, 278.0, 278.0, 0.02762927044911379, 0.017619056253194633, 0.01969664787876276], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1015.0, 1003, 1027, 1015.0, 1027.0, 1027.0, 1027.0, 0.01713840115855592, 0.011180128880776711, 0.012552539911051697], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1680.5, 1014, 2347, 1680.5, 2347.0, 2347.0, 2347.0, 0.026522736615964035, 0.01730194146432029, 0.019192722492606788], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 42.0, 2, 159, 3.5, 159.0, 159.0, 159.0, 0.03654570039834813, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1069.5, 1016, 1123, 1069.5, 1123.0, 1123.0, 1123.0, 0.017189662137190694, 0.004566004005191278, 0.014453417089962096], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 913.5, 905, 922, 913.5, 922.0, 922.0, 922.0, 0.026973080865296435, 0.04717655061498625, 0.02202099180018342], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.0, 247, 279, 263.0, 279.0, 279.0, 279.0, 0.02754024318034728, 0.017562283981217557, 0.019848339323336225], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 251.5, 239, 264, 251.5, 264.0, 264.0, 264.0, 0.01727026233528487, 0.011266147695283491, 0.01268284890247483], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.5, 247, 254, 250.5, 254.0, 254.0, 254.0, 0.017443483114708346, 0.011379147188110521, 0.012810057912363941], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 281.0, 268, 294, 281.0, 294.0, 294.0, 294.0, 0.027611723937984067, 0.018632520743307606, 0.023297392072674054], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 273.5, 261, 286, 273.5, 286.0, 286.0, 286.0, 0.026833751492627428, 0.02012531361947057, 0.025051822682570137], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 273.5, 249, 298, 273.5, 298.0, 298.0, 298.0, 0.01763031002900186, 0.013222732521751395, 0.015133830581535775], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 269.0, 248, 290, 269.0, 290.0, 290.0, 290.0, 0.026336234708523722, 0.017180278110638523, 0.021783975388788665], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 539.5, 515, 564, 539.5, 564.0, 564.0, 564.0, 0.027432208155595484, 0.018457804120317667, 0.025342645424993485], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 254.5, 254, 255, 254.5, 255.0, 255.0, 255.0, 0.01731676695960864, 0.011296484696307198, 0.012530980778388674], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 271.5, 256, 287, 271.5, 287.0, 287.0, 287.0, 0.027592296230892335, 0.01517037380663319, 0.020748113376745213], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 371.0, 356, 386, 371.0, 386.0, 386.0, 386.0, 0.02739350773866594, 0.018431764484317215, 0.025922176756608684], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 256.0, 243, 269, 256.0, 269.0, 269.0, 269.0, 0.017273394653884357, 0.012955045990413267, 0.01673360107095047], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 259.5, 259, 260, 259.5, 260.0, 260.0, 260.0, 0.017316167239543198, 0.0129871254296574, 0.016808857652447207], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 21022.0, 284, 41760, 21022.0, 41760.0, 41760.0, 41760.0, 0.017460539181449925, 0.013095404386087443, 0.015107458705824837], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 281.0, 276, 286, 281.0, 286.0, 286.0, 286.0, 0.02687088539567379, 0.02015316404675534, 0.02372195351336826], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 255.5, 243, 268, 255.5, 268.0, 268.0, 268.0, 0.017283097131005877, 0.012962322848254408, 0.016591098124783963], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 251.0, 248, 254, 251.0, 254.0, 254.0, 254.0, 0.051319334559295215, 0.03347784715391523, 0.0386398505324381], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 251.0, 243, 259, 251.0, 259.0, 259.0, 259.0, 0.017430105277835877, 0.013072578958376909, 0.022332322387227217], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 0.017320066162652744, 0.012990049621989555, 0.015358027417664736], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 247, 278, 262.5, 278.0, 278.0, 278.0, 0.025823778535275285, 0.016845980528870985, 0.018964337361842786], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 251.5, 238, 265, 251.5, 265.0, 265.0, 265.0, 0.017266534865450527, 0.004586423323635296, 0.013860441073633137], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 267.0, 239, 295, 267.0, 295.0, 295.0, 295.0, 0.026797438164911435, 0.0071180695125546, 0.02117102292520835], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 254, 255, 254.5, 255.0, 255.0, 255.0, 0.01731706683521945, 0.01129668031828769, 0.012717220957114285], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1017.5, 970, 1065, 1017.5, 1065.0, 1065.0, 1065.0, 0.01718227819826631, 0.011208751793400288, 0.013272638725418603], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1543.0, 1035, 2051, 1543.0, 2051.0, 2051.0, 2051.0, 0.01720045409198803, 0.011220608724070316, 0.014176936771130758], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 559.25, 251, 1478, 254.0, 1478.0, 1478.0, 1478.0, 0.034288555337442246, 0.025716416503081686, 0.02705581319595052], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 977.8333333333333, 250, 4546, 268.5, 4546.0, 4546.0, 4546.0, 0.07712478790683326, 0.057843590930124936, 0.061760084066018815], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1311.0, 1052, 1570, 1311.0, 1570.0, 1570.0, 1570.0, 0.0267079750013354, 0.0456435119651728, 0.019170275025372576], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 2049.25, 1347, 2897, 1976.5, 2897.0, 2897.0, 2897.0, 0.03518308397322568, 0.016148485808023503, 0.04380706256431907], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 1119.0, 1098, 1140, 1119.0, 1140.0, 1140.0, 1140.0, 0.0265625415039711, 0.017327907934231147, 0.019221526615666586], "isController": false}]}, function(index, item){
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
