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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9238532110091743, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [0.95, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.2, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.4, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.45, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.95, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.55, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.85, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.65, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.8, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1090, 0, 0.0, 354.9770642201832, 0, 2424, 270.0, 625.0, 934.45, 1500.6999999999975, 11.537321647825904, 32.68038145931242, 17.796144986557433], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 10, 0, 0.0, 273.40000000000003, 258, 304, 268.5, 302.3, 304.0, 304.0, 0.2198381990854731, 0.42700993943457616, 0.6041256760024621], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 10, 0, 0.0, 258.6, 243, 289, 253.5, 287.4, 289.0, 289.0, 0.21989620898935702, 0.14344791758290087, 0.16084205130178555], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 10, 0, 0.0, 258.40000000000003, 244, 290, 250.0, 288.2, 290.0, 290.0, 0.205279796362442, 0.1309059638912838, 0.1535589101695611], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 10, 0, 0.0, 258.3, 243, 293, 250.0, 291.0, 293.0, 293.0, 0.22021096210169344, 0.14365324480852656, 0.16773881878839927], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 10, 0, 0.0, 906.8000000000001, 795, 996, 925.0, 991.1, 996.0, 996.0, 0.20313230006703367, 0.16008570913485953, 0.23665706443356557], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 10, 0, 0.0, 265.99999999999994, 250, 297, 257.5, 295.7, 297.0, 297.0, 0.21998328127062342, 0.12094783921421973, 0.5847602457213252], "isController": false}, {"data": ["ST09-020-PUT-businesses", 10, 0, 0.0, 422.8, 364, 462, 427.0, 460.2, 462.0, 462.0, 0.21944743136781583, 0.1673715272443986, 0.6294112362571046], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 10, 0, 0.0, 259.2, 244, 296, 250.5, 293.6, 296.0, 296.0, 0.22130258702724234, 0.14436535950605264, 0.18910133168831744], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 838.8, 817, 991, 822.0, 974.7, 991.0, 991.0, 0.19749185346104473, 0.34213920707020834, 0.1340398810111583], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 10, 0, 0.0, 259.0, 244, 290, 251.0, 288.2, 290.0, 290.0, 0.22000748025432865, 0.14352050469715968, 0.18735011990407674], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 10, 0, 0.0, 264.09999999999997, 248, 295, 256.0, 293.3, 295.0, 295.0, 0.22122425502732118, 0.13264813729177266, 0.6014534433555294], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 10, 0, 0.0, 272.40000000000003, 257, 304, 264.0, 302.2, 304.0, 304.0, 0.22048771883406093, 0.4282715554306125, 0.6059105867178198], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 10, 0, 0.0, 264.3, 249, 295, 256.5, 293.4, 295.0, 295.0, 0.2201818702248057, 0.12105702435211484, 0.5852881354999229], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 10, 0, 0.0, 259.0, 243, 289, 252.0, 287.6, 289.0, 289.0, 0.2203516812833282, 0.14374504208717112, 0.1654789481512494], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 10, 0, 0.0, 297.9, 278, 329, 289.0, 328.1, 329.0, 329.0, 0.21937040693210486, 0.4693755484260173, 0.5910575710211692], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 10, 0, 0.0, 258.8, 244, 289, 251.5, 287.2, 289.0, 289.0, 0.21991071624920283, 0.1434573813031909, 0.18726771930596178], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 10, 0, 0.0, 260.5, 244, 289, 254.5, 288.1, 289.0, 289.0, 0.2207310612749426, 0.14399252825357584, 0.18710406365883805], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 10, 0, 0.0, 1059.9999999999998, 989, 1279, 1019.5, 1261.8000000000002, 1279.0, 1279.0, 0.20077902260771793, 0.12548688912982373, 0.14607458187768543], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 10, 0, 0.0, 264.40000000000003, 250, 297, 256.0, 295.1, 297.0, 297.0, 0.2201721746405689, 0.12105169367445343, 0.5852623626676061], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 10, 0, 0.0, 965.4, 775, 1219, 937.5, 1208.1000000000001, 1219.0, 1219.0, 0.21742911810749696, 0.1354685325708819, 0.5970807423030092], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 10, 0, 0.0, 364.79999999999995, 262, 1098, 281.5, 1019.9000000000003, 1098.0, 1098.0, 0.2047753614285129, 0.1505818819879592, 0.24217086200188392], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 10, 0, 0.0, 265.1, 250, 296, 260.0, 294.2, 296.0, 296.0, 0.20582060675914873, 0.11316113438027416, 0.1603953556580085], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 10, 0, 0.0, 261.2, 247, 290, 255.0, 289.0, 290.0, 290.0, 0.205456936226167, 0.13101892515203814, 0.15369141909105852], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 10, 0, 0.0, 259.09999999999997, 243, 291, 252.0, 289.2, 291.0, 291.0, 0.22035653687666645, 0.1437482096031379, 0.16784970582402328], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 10, 0, 0.0, 257.8, 243, 290, 249.5, 288.2, 290.0, 290.0, 0.2195630694917115, 0.14001434021297618, 0.1642434679986826], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 10, 0, 0.0, 258.2, 243, 291, 250.5, 289.2, 291.0, 291.0, 0.2196016426202868, 0.14325575905307772, 0.19236589202187232], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 10, 0, 0.0, 257.8, 244, 289, 249.0, 287.3, 289.0, 289.0, 0.22118021764133414, 0.14428553260196406, 0.16826112260019463], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 10, 0, 0.0, 258.40000000000003, 244, 294, 249.5, 291.8, 294.0, 294.0, 0.22130258702724234, 0.14436535950605264, 0.1683542141545135], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 10, 0, 0.0, 266.8999999999999, 250, 295, 263.5, 293.5, 295.0, 295.0, 0.22052175447107858, 0.12124389430392307, 0.5861916168655038], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 10, 0, 0.0, 266.9, 249, 296, 266.0, 294.3, 296.0, 296.0, 0.22032255221644487, 0.12113437197056491, 0.5856620968097295], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 258.6, 244, 294, 249.5, 292.0, 294.0, 294.0, 0.22021096210169344, 0.14365324480852656, 0.16773881878839927], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 10, 0, 0.0, 264.5, 250, 296, 256.5, 294.3, 296.0, 296.0, 0.21987686895338612, 0.1208893332233949, 0.5844773801671065], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 10, 0, 0.0, 258.1, 244, 289, 250.0, 287.6, 289.0, 289.0, 0.2201964152023605, 0.14364375522966485, 0.16493227584004932], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 10, 0, 0.0, 258.59999999999997, 244, 289, 250.0, 287.9, 289.0, 289.0, 0.22129768965212004, 0.14436216473400018, 0.18823270281933255], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 10, 0, 0.0, 269.0, 250, 297, 268.0, 295.9, 297.0, 297.0, 0.20533459271883536, 0.11289392158271903, 0.16001660643518614], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 10, 0, 0.0, 442.3, 398, 460, 445.0, 460.0, 460.0, 460.0, 0.2191444600280505, 0.1560120228129383, 0.6379586282652525], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 10, 0, 0.0, 1509.8, 1225, 1732, 1545.5, 1731.4, 1732.0, 1732.0, 0.2142382758103563, 0.13452657358013584, 0.6245129426698374], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 10, 0, 0.0, 258.1, 244, 292, 250.0, 290.1, 292.0, 292.0, 0.22117043393639138, 0.14427915026319282, 0.18769248739328528], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 10, 0, 0.0, 258.40000000000003, 243, 289, 253.0, 287.3, 289.0, 289.0, 0.2061685634174501, 0.13147272647616692, 0.15261305768596406], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 10, 0, 0.0, 258.5, 243, 292, 249.5, 290.4, 292.0, 292.0, 0.2206287920573635, 0.1439258135686707, 0.16568705184776614], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 10, 0, 0.0, 258.40000000000003, 244, 290, 250.5, 288.4, 290.0, 290.0, 0.21959199806759042, 0.14324946748940467, 0.18485185774830365], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 10, 0, 0.0, 260.7, 244, 290, 256.0, 289.0, 290.0, 290.0, 0.20561324149275215, 0.13111860028785854, 0.15220198930811144], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 10, 0, 0.0, 258.7, 244, 289, 253.5, 287.3, 289.0, 289.0, 0.2057951926243003, 0.1312346296715509, 0.15394445073263088], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 257.59999999999997, 243, 289, 249.0, 287.3, 289.0, 289.0, 0.22057039504157752, 0.14388771864040406, 0.16801260559807663], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 10, 0, 0.0, 321.1, 243, 874, 260.0, 815.5000000000002, 874.0, 874.0, 0.21999780002199978, 0.14351418985810144, 0.16091635958640413], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 10, 0, 0.0, 267.6, 251, 311, 255.5, 309.0, 311.0, 311.0, 0.22108730737768345, 0.12155483794300369, 0.5876949713691937], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 10, 0, 0.0, 389.5, 362, 452, 379.5, 449.9, 452.0, 452.0, 0.22068234982566093, 0.13749544842653486, 0.6111866641656001], "isController": false}, {"data": ["ST14-090-GET-id", 10, 0, 0.0, 1139.6000000000001, 580, 1553, 1480.5, 1550.5, 1553.0, 1553.0, 0.21968365553602812, 21.479097443431456, 0.5837492448374341], "isController": false}, {"data": ["eProtect/paypage", 10, 0, 0.0, 813.2, 531, 2424, 612.0, 2266.4000000000005, 2424.0, 2424.0, 0.18418580664174017, 0.08453840734532997, 0.22771409297699519], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 10, 0, 0.0, 265.90000000000003, 250, 295, 257.5, 294.2, 295.0, 295.0, 0.22063365987114994, 0.12130542041743889, 0.5864890841496779], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 10, 0, 0.0, 259.59999999999997, 244, 289, 255.0, 287.4, 289.0, 289.0, 0.22110686094589516, 0.1442376788201738, 0.18785446193645391], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 10, 0, 0.0, 983.7, 564, 1287, 1241.5, 1284.6, 1287.0, 1287.0, 0.21983336630833827, 21.49309104948449, 0.5841470602783091], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 10, 0, 0.0, 293.5, 272, 325, 292.5, 324.0, 325.0, 325.0, 0.2055667475229207, 0.14052414381449657, 0.18107539674382273], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 10, 0, 0.0, 258.5, 243, 289, 251.5, 287.3, 289.0, 289.0, 0.20584602717167558, 0.13126704662412517, 0.1523743052696583], "isController": false}, {"data": ["ST06-030-GET-suffixes", 10, 0, 0.0, 270.90000000000003, 255, 308, 260.0, 305.9, 308.0, 308.0, 0.2198430320750984, 0.16767325004946468, 0.5777320305801658], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 10, 0, 0.0, 259.4, 243, 299, 249.0, 296.9, 299.0, 299.0, 0.22073593360263116, 0.14399570668609143, 0.1657675126371322], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 10, 0, 0.0, 265.6, 250, 299, 257.0, 297.3, 299.0, 299.0, 0.22116065109695682, 0.12159516266365888, 0.5878899338729653], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 71.80000000000001, 0, 709, 1.0, 638.4000000000002, 709.0, 709.0, 0.19587103850824616, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 10, 0, 0.0, 3.3, 0, 24, 0.5, 22.200000000000006, 24.0, 24.0, 0.19862551146069202, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 260.4, 245, 289, 252.5, 287.8, 289.0, 289.0, 0.22002200220022003, 0.14352997799779976, 0.16759488448844884], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 10, 0, 0.0, 266.0, 250, 298, 261.5, 296.1, 298.0, 298.0, 0.22059958968476318, 0.12128668846925944, 0.5863985186737553], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 257.70000000000005, 244, 288, 249.0, 286.4, 288.0, 288.0, 0.22068234982566093, 0.1439607516440835, 0.16809788365626518], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 10, 0, 0.0, 257.8, 244, 290, 249.5, 288.2, 290.0, 290.0, 0.20591384564698129, 0.12226134585289515, 0.14015815470307225], "isController": false}, {"data": ["ST07-030-GET-core/products", 10, 0, 0.0, 305.8, 255, 564, 284.5, 539.1000000000001, 564.0, 564.0, 0.21992038881924744, 1.719846165688021, 0.5779353186646434], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 10, 0, 0.0, 264.7, 249, 296, 257.5, 294.3, 296.0, 296.0, 0.20613456464379948, 0.11333374989693272, 0.1606400220563984], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 10, 0, 0.0, 652.9, 623, 731, 632.0, 727.1, 731.0, 731.0, 0.21771788116958044, 0.15712257244562497, 0.6055278570028957], "isController": false}, {"data": ["ST14-060-POST-middesk", 10, 0, 0.0, 291.1, 269, 326, 289.5, 324.4, 326.0, 326.0, 0.22108730737768345, 0.15091799595410227, 0.6045356061108531], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 10, 0, 0.0, 259.7, 244, 290, 251.5, 288.9, 290.0, 290.0, 0.2054442732408834, 0.13101085002568055, 0.15207691319979458], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 10, 0, 0.0, 259.0999999999999, 243, 295, 249.0, 293.7, 295.0, 295.0, 0.22118021764133414, 0.14428553260196406, 0.16804512629390425], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 10, 0, 0.0, 258.0, 243, 288, 252.0, 286.4, 288.0, 288.0, 0.22023521120556755, 0.14366906355988196, 0.1653914818526186], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 16.1, 0, 153, 1.0, 137.80000000000007, 153.0, 153.0, 0.19872024164381383, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 10, 0, 0.0, 276.4, 259, 312, 268.5, 310.4, 312.0, 312.0, 0.22063365987114994, 0.27686938763127705, 0.5948921239299267], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 893.7, 418, 1779, 842.0, 1686.4000000000003, 1779.0, 1779.0, 0.1981061056301755, 0.3392180132929197, 0.16715202662546058], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 10, 0, 0.0, 258.0, 244, 289, 250.0, 287.3, 289.0, 289.0, 0.20614731286977675, 0.13145917510152755, 0.15420785318188376], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 10, 0, 0.0, 259.2, 243, 289, 257.0, 287.3, 289.0, 289.0, 0.2211166390270868, 0.14424405749032615, 0.16842868988391377], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 10, 0, 0.0, 258.0, 244, 289, 249.5, 287.3, 289.0, 289.0, 0.22121936111848509, 0.14431106760463674, 0.16850693522697105], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 10, 0, 0.0, 287.2, 261, 323, 281.0, 322.1, 323.0, 323.0, 0.20530929845812718, 0.13854367698688072, 0.1788436467037592], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 10, 0, 0.0, 571.7, 478, 642, 564.5, 640.4, 642.0, 642.0, 0.21842168490487737, 0.13992639189218706, 0.6166573154882816], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 10, 0, 0.0, 266.59999999999997, 249, 299, 257.5, 298.1, 299.0, 299.0, 0.22120957395036056, 0.12162206067778612, 0.588019980754767], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 10, 0, 0.0, 478.9, 427, 540, 475.5, 539.2, 540.0, 540.0, 0.2202837254383646, 0.13724708674773106, 0.6096524198167239], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 10, 0, 0.0, 260.70000000000005, 244, 290, 256.5, 288.2, 290.0, 290.0, 0.21990588028323876, 0.14345422659101906, 0.18790785668733784], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 10, 0, 0.0, 516.4, 477, 576, 516.0, 572.4, 576.0, 576.0, 0.2048760499897562, 0.13785117035443556, 0.19487233661135012], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 10, 0, 0.0, 259.1, 244, 289, 250.0, 288.4, 289.0, 289.0, 0.22055093623872435, 0.14387502481198033, 0.16562858395271388], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 10, 0, 0.0, 265.3, 250, 296, 258.0, 294.2, 296.0, 296.0, 0.2055076037813399, 0.11298904387587341, 0.1601514334155364], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 10, 0, 0.0, 511.9, 472, 625, 490.0, 621.7, 625.0, 625.0, 0.20493483072382981, 0.9540276738872039, 0.19572877387490778], "isController": false}, {"data": ["ST14-020-POST-senti-link", 10, 0, 0.0, 675.2, 606, 733, 682.5, 731.2, 733.0, 733.0, 0.21898609438300667, 0.1375078698127669, 0.625521802803022], "isController": false}, {"data": ["ST12-010-PUT-businesses", 10, 0, 0.0, 270.90000000000003, 253, 302, 264.0, 301.2, 302.0, 302.0, 0.22048771883406093, 0.13909674449883142, 0.6302417510032191], "isController": false}, {"data": ["ST10-010-PUT-businesses", 10, 0, 0.0, 427.6, 372, 491, 418.5, 491.0, 491.0, 491.0, 0.21950523519985954, 0.16698689279364312, 0.6042824785433633], "isController": false}, {"data": ["ST08-010-PUT-businesses", 10, 0, 0.0, 418.1, 371, 487, 416.5, 484.1, 487.0, 487.0, 0.21942335542195113, 0.16713888401281432, 0.6079141204414799], "isController": false}, {"data": ["ST14-010-PUT-businesses", 10, 0, 0.0, 271.59999999999997, 252, 307, 264.5, 305.6, 307.0, 307.0, 0.22067747986317998, 0.1392164570230608, 0.6202244014123359], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 30, 0, 0.0, 258.26666666666665, 243, 309, 250.5, 287.40000000000003, 298.0, 309.0, 0.6480181445080463, 0.42273058645642075, 0.505631345177665], "isController": false}, {"data": ["ST15-010-POST-add-payment", 10, 0, 0.0, 390.4, 359, 423, 385.0, 421.5, 423.0, 423.0, 0.22061905707415005, 0.15038291195093434, 0.7083940035740287], "isController": false}, {"data": ["ST13-010-PUT-businesses", 10, 0, 0.0, 269.1, 253, 301, 259.5, 299.7, 301.0, 301.0, 0.22059958968476318, 0.13916731927378614, 0.6120346038031369], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 257.8, 243, 289, 250.0, 287.3, 289.0, 289.0, 0.2199155524278677, 0.1434605361541168, 0.16751379970091484], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 10, 0, 0.0, 265.9, 250, 296, 262.5, 294.4, 296.0, 296.0, 0.22107753189043397, 0.12154946333429134, 0.5876689861384388], "isController": false}, {"data": ["ST09-010-GET-industries", 10, 0, 0.0, 530.5, 502, 593, 513.0, 590.0, 593.0, 593.0, 0.2188327461321312, 6.29229626671335, 0.5789237395233823], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 259.3, 243, 292, 250.0, 290.8, 292.0, 292.0, 0.2205947233742169, 0.1439035890761493, 0.16803113694520427], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 257.6, 243, 292, 249.0, 290.0, 292.0, 292.0, 0.22124872781981503, 0.14433022478870747, 0.16852930439399974], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 10, 0, 0.0, 257.79999999999995, 244, 289, 249.5, 287.4, 289.0, 289.0, 0.22074567890333546, 0.14400206397209775, 0.17655342873225757], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 10, 0, 0.0, 259.3, 243, 294, 252.5, 291.8, 294.0, 294.0, 0.22055580061755622, 0.14387819805910895, 0.18781704896338772], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 20, 0, 0.0, 263.95000000000005, 248, 302, 256.0, 292.40000000000003, 301.6, 302.0, 0.43448980035193674, 0.26646444787208623, 1.163023967543612], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 30, 0, 0.0, 265.5333333333334, 250, 319, 257.0, 293.40000000000003, 306.34999999999997, 319.0, 0.6506463086666088, 0.3577283904094734, 1.7511535416847404], "isController": false}, {"data": ["AF-010-GET-Welcome", 10, 0, 0.0, 993.1, 955, 1222, 966.0, 1198.7, 1222.0, 1222.0, 0.19546902793252408, 0.3357715040364354, 0.14564733233644128], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 10, 0, 0.0, 257.8, 243, 289, 250.0, 287.5, 289.0, 289.0, 0.22021581149526537, 0.14365640828011453, 0.16537691312486238], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1090, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
