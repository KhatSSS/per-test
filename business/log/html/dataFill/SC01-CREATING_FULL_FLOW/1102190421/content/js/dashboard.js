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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8990825688073395, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.25, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.25, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.25, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [0.75, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.25, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 218, 0, 0.0, 405.05504587155986, 1, 3354, 261.0, 794.6999999999999, 1035.1499999999999, 2519.060000000001, 4.069289927574106, 11.525158314977974, 6.276818463936384], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 0, 0.0, 268.0, 265, 271, 268.0, 271.0, 271.0, 271.0, 1.520912547528517, 2.954194391634981, 4.17953897338403], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 1.5174506828528074, 0.989899468892261, 1.10993218892261], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.0, 254, 270, 262.0, 270.0, 270.0, 270.0, 0.546000546000546, 0.3481819888069888, 0.4084340021840022], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 253, 256, 254.5, 256.0, 256.0, 256.0, 0.975609756097561, 0.6364329268292683, 0.743140243902439], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 946.5, 939, 954, 946.5, 954.0, 954.0, 954.0, 0.48344210780759006, 0.38099392675852073, 0.5632289400531787], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 0, 0.0, 264.0, 261, 267, 264.0, 267.0, 267.0, 267.0, 1.5661707126076743, 0.8610879992169147, 4.163199882537197], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 0, 0.0, 427.5, 426, 429, 427.5, 429.0, 429.0, 429.0, 0.8976660682226212, 0.6846457024236984, 2.574653557001795], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 1.4858841010401187, 0.9693072065378899, 1.269676355869242], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 1358.0, 890, 1826, 1358.0, 1826.0, 1826.0, 1826.0, 0.3178639542275906, 0.5438453591862683, 0.2157377423712651], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 0.9186954524575104, 0.599305236564079, 0.7823265962333487], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 0, 0.0, 264.5, 260, 269, 264.5, 269.0, 269.0, 269.0, 6.472491909385114, 3.8809668284789645, 17.597087378640776], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 0, 0.0, 271.0, 270, 272, 271.0, 272.0, 272.0, 272.0, 0.9799118079372856, 1.9033638535031847, 2.692843581577658], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 0, 0.0, 275.0, 264, 286, 275.0, 286.0, 286.0, 286.0, 0.9615384615384616, 0.5286583533653846, 2.555964543269231], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 255.5, 255, 256, 255.5, 256.0, 256.0, 256.0, 0.9760858955588092, 0.6367435334309419, 0.7330176305514886], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 0, 0.0, 294.5, 292, 297, 294.5, 297.0, 297.0, 297.0, 1.4492753623188406, 3.100939764492754, 3.904834692028986], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 257.0, 254, 260, 257.0, 260.0, 260.0, 260.0, 1.5408320493066257, 1.005152157164869, 1.3121147919876732], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 1.3458950201884252, 0.877986204576043, 1.140856325706595], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1070.0, 1038, 1102, 1070.0, 1102.0, 1102.0, 1102.0, 0.4371584699453552, 0.27322404371584696, 0.31804986338797814], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 0, 0.0, 263.0, 261, 265, 263.0, 265.0, 265.0, 265.0, 0.9610764055742432, 0.52840431283037, 2.554736304661221], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 2, 0, 0.0, 1152.0, 965, 1339, 1152.0, 1339.0, 1339.0, 1339.0, 0.9779951100244498, 0.6093367970660147, 2.685666259168704], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 280.5, 279, 282, 280.5, 282.0, 282.0, 282.0, 0.5330490405117271, 0.39197844482942434, 0.6303929570895522], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 261.5, 259, 264, 261.5, 264.0, 264.0, 264.0, 0.5526388505111909, 0.30384343050566454, 0.4306697292069632], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 256.0, 254, 258, 256.0, 258.0, 258.0, 258.0, 0.5497526113249038, 0.3505746632765256, 0.4112407229246839], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.5, 255, 256, 255.5, 256.0, 256.0, 256.0, 0.9737098344693281, 0.6351935248296008, 0.7416930379746836], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 253, 264, 258.5, 264.0, 264.0, 264.0, 1.4771048744460857, 0.9419428545051698, 1.1049436853766617], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 257.5, 255, 260, 257.5, 260.0, 260.0, 260.0, 1.4914243102162563, 0.9729213273676361, 1.30645274049217], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 255.5, 254, 257, 255.5, 257.0, 257.0, 257.0, 4.4543429844097995, 2.9057628062360803, 3.3886066258351892], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 2, 0, 0.0, 255.5, 254, 257, 255.5, 257.0, 257.0, 257.0, 1.4814814814814814, 0.9664351851851851, 1.1270254629629628], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 266.0, 261, 271, 266.0, 271.0, 271.0, 271.0, 0.9794319294809011, 0.5384962659157689, 2.603529015670911], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 0, 0.0, 262.0, 260, 264, 262.0, 264.0, 264.0, 264.0, 0.9713453132588635, 0.5340502064108791, 2.582033147158815], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 0.9624639076034649, 0.6278573147256978, 0.7331268046198268], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 263.0, 261, 265, 263.0, 265.0, 265.0, 265.0, 1.5026296018031555, 0.8261527986476334, 3.9942947032306537], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 0.9666505558240696, 0.6305884485258579, 0.7240439221846303], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 2, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 1.4958863126402393, 0.9758320867614062, 1.2723798616305162], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 262.0, 260, 264, 262.0, 264.0, 264.0, 264.0, 0.5474952094169175, 0.30101543252121543, 0.4266613057760745], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 0, 0.0, 438.0, 434, 442, 438.0, 442.0, 442.0, 442.0, 1.3679890560875512, 0.973890646374829, 3.9823978283173735], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 0, 0.0, 2804.5, 2255, 3354, 2804.5, 3354.0, 3354.0, 3354.0, 0.5963029218843172, 0.37443630739415623, 1.738246310375671], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 256.0, 254, 258, 256.0, 258.0, 258.0, 258.0, 4.484304932735426, 2.9253082959641254, 3.805528307174888], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 0.5788712011577424, 0.36914345151953687, 0.42850036179450074], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 0.998003992015968, 0.6510416666666666, 0.7494776072854291], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 255.5, 254, 257, 255.5, 257.0, 257.0, 257.0, 1.4992503748125936, 0.9780266116941528, 1.26206428035982], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 257.0, 254, 260, 257.0, 260.0, 260.0, 260.0, 0.5509641873278236, 0.3513472796143251, 0.4078426308539945], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 254, 261, 257.5, 261.0, 261.0, 261.0, 0.5523336095001381, 0.35222055371444355, 0.4131714305440486], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.5, 254, 257, 255.5, 257.0, 257.0, 257.0, 0.9818360333824251, 0.6404945999018165, 0.7478829160530192], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 564.0, 256, 872, 564.0, 872.0, 872.0, 872.0, 1.063264221158958, 0.693613769271664, 0.7777196305156832], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 261, 270, 265.5, 270.0, 270.0, 270.0, 6.514657980456026, 3.5817894951140063, 17.317284201954397], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 2, 0, 0.0, 381.5, 381, 382, 381.5, 382.0, 382.0, 382.0, 1.3596193065941535, 0.8471065601631542, 3.765508157715839], "isController": false}, {"data": ["ST14-090-GET-id", 2, 0, 0.0, 914.0, 793, 1035, 914.0, 1035.0, 1035.0, 1035.0, 1.932367149758454, 188.9153079710145, 5.13473731884058], "isController": false}, {"data": ["eProtect/paypage", 2, 0, 0.0, 1687.5, 794, 2581, 1687.5, 2581.0, 2581.0, 2581.0, 0.18749414080809973, 0.08605688103496766, 0.23180427955376395], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 0, 0.0, 262.5, 260, 265, 262.5, 265.0, 265.0, 265.0, 1.001001001001001, 0.5503550425425425, 2.660863988988989], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 255.5, 254, 257, 255.5, 257.0, 257.0, 257.0, 1.5186028853454823, 0.9906511009870919, 1.2902192482915718], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 2, 0, 0.0, 1351.0, 801, 1901, 1351.0, 1901.0, 1901.0, 1901.0, 1.0520778537611783, 102.85961747106786, 2.7956092188321935], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 285.5, 284, 287, 285.5, 287.0, 287.0, 287.0, 0.5473453749315819, 0.374161877394636, 0.4821343048713739], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 0.5541701302299806, 0.3533916943751732, 0.4102157799944583], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 281.5, 276, 287, 281.5, 287.0, 287.0, 287.0, 1.4958863126402393, 1.1409054786836201, 3.9310840501121915], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 497.0, 253, 741, 497.0, 741.0, 741.0, 741.0, 1.0111223458038423, 0.6595993427704753, 0.7593291835187058], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 0, 0.0, 279.5, 272, 287, 279.5, 287.0, 287.0, 287.0, 5.970149253731344, 3.2824160447761193, 15.869869402985074], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 2, 0, 0.0, 311.0, 6, 616, 311.0, 616.0, 616.0, 616.0, 0.27386005751061204, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 2, 0, 0.0, 14.0, 1, 27, 14.0, 27.0, 27.0, 27.0, 0.29895366218236175, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 256.5, 254, 259, 256.5, 259.0, 259.0, 259.0, 1.5698587127158556, 1.024087519623234, 1.1957908163265305], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 0, 0.0, 262.0, 260, 264, 262.0, 264.0, 264.0, 264.0, 0.9925558312655087, 0.5457118486352357, 2.6384150124069476], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 253, 256, 254.5, 256.0, 256.0, 256.0, 1.0030090270812437, 0.6543066700100301, 0.7640107823470411], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 255.5, 254, 257, 255.5, 257.0, 257.0, 257.0, 0.5820721769499417, 0.34560535506402795, 0.39619561263096625], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 0, 0.0, 436.5, 287, 586, 436.5, 586.0, 586.0, 586.0, 0.9045680687471732, 7.074004975124379, 2.377141282225238], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 261.5, 260, 263, 261.5, 263.0, 263.0, 263.0, 0.5772005772005772, 0.317347582972583, 0.4498106060606061], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 633.5, 633, 634, 633.5, 634.0, 634.0, 634.0, 1.1695906432748537, 0.8440698099415205, 3.252923976608187], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 0, 0.0, 388.5, 369, 408, 388.5, 408.0, 408.0, 408.0, 4.773269689737471, 3.2583159307875897, 13.051909307875896], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 256.0, 254, 258, 256.0, 258.0, 258.0, 258.0, 0.5488474204171241, 0.34999742727771677, 0.40627572722283206], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 6.622516556291391, 4.320157284768212, 5.031560430463577], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 255.5, 253, 258, 255.5, 258.0, 258.0, 258.0, 0.9713453132588635, 0.6336510441962117, 0.7294575643516269], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 2, 0, 0.0, 94.5, 1, 188, 94.5, 188.0, 188.0, 188.0, 0.30007501875468867, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 0, 0.0, 276.0, 274, 278, 276.0, 278.0, 278.0, 278.0, 0.9960159362549801, 1.2498832793824701, 2.685546875], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 1374.5, 910, 1839, 1374.5, 1839.0, 1839.0, 1839.0, 0.3720238095238095, 0.6365094866071428, 0.31389508928571425], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.5, 254, 257, 255.5, 257.0, 257.0, 257.0, 0.5775339301183945, 0.3682906800462027, 0.43202245163153336], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.0, 254, 256, 255.0, 256.0, 256.0, 256.0, 1.5117157974300832, 0.9861583522297809, 1.1515022675736961], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 6.329113924050633, 4.128757911392405, 4.821004746835443], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 274.0, 273, 275, 274.0, 275.0, 275.0, 275.0, 0.5465974309920743, 0.36884650860890955, 0.47613760590325227], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 0, 0.0, 615.0, 554, 676, 615.0, 676.0, 676.0, 676.0, 0.8087343307723412, 0.5180954306510311, 2.2832528811160535], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 2, 0, 0.0, 262.0, 260, 264, 262.0, 264.0, 264.0, 264.0, 1.486988847583643, 0.81755343866171, 3.952718401486989], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 2, 0, 0.0, 474.5, 434, 515, 474.5, 515.0, 515.0, 515.0, 1.7543859649122808, 1.0930646929824563, 4.855400219298246], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 258.5, 253, 264, 258.5, 264.0, 264.0, 264.0, 1.549186676994578, 1.0106022463206816, 1.323767912470953], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 589.5, 519, 660, 589.5, 660.0, 660.0, 660.0, 0.5167958656330749, 0.3477269056847545, 0.4915616925064599], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 256.0, 255, 257, 256.0, 257.0, 257.0, 257.0, 0.9900990099009901, 0.645884900990099, 0.743541150990099], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 262.0, 260, 264, 262.0, 264.0, 264.0, 264.0, 0.5494505494505495, 0.3020904876373626, 0.42818509615384615], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 489.0, 487, 491, 489.0, 491.0, 491.0, 491.0, 0.5455537370430987, 2.5397018207855973, 0.5210464402618658], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 0, 0.0, 728.5, 649, 808, 728.5, 808.0, 808.0, 808.0, 1.0649627263045793, 0.6687217119275826, 3.0420077875399363], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 0, 0.0, 267.0, 265, 269, 267.0, 269.0, 269.0, 269.0, 0.9861932938856016, 0.6221492850098619, 2.8189333703155817], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 420.0, 414, 426, 420.0, 426.0, 426.0, 426.0, 0.9062075215224287, 0.6893902922519257, 2.494725589034889], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 0, 0.0, 419.5, 415, 424, 419.5, 424.0, 424.0, 424.0, 0.8932559178204555, 0.6804097811523002, 2.4747724988834303], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 0, 0.0, 265.5, 263, 268, 265.5, 268.0, 268.0, 268.0, 1.3333333333333333, 0.8411458333333334, 3.7473958333333335], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 258.5, 253, 269, 255.5, 269.0, 269.0, 269.0, 4.470938897168406, 2.916589046199702, 3.4885548621460503], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 0, 0.0, 888.5, 791, 986, 888.5, 986.0, 986.0, 986.0, 2.028397565922921, 1.3826381845841784, 6.513057809330629], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 0, 0.0, 268.0, 265, 271, 268.0, 271.0, 271.0, 271.0, 0.9940357852882703, 0.6270967942345924, 2.757866861332008], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.5, 253, 258, 255.5, 258.0, 258.0, 258.0, 1.5048908954100828, 0.9817061700526712, 1.146303611738149], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 0, 0.0, 262.5, 261, 264, 262.5, 264.0, 264.0, 264.0, 1.5060240963855422, 0.8280191076807228, 4.003317959337349], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 0, 0.0, 525.5, 523, 528, 525.5, 528.0, 528.0, 528.0, 0.8568980291345331, 24.639165595544128, 2.2669304305912594], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 253, 256, 254.5, 256.0, 256.0, 256.0, 0.9940357852882703, 0.6484530318091452, 0.7571756958250497], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.5, 253, 258, 255.5, 258.0, 258.0, 258.0, 1.488095238095238, 0.9707496279761905, 1.133510044642857], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 256.0, 254, 258, 256.0, 258.0, 258.0, 258.0, 1.0085728693898135, 0.657936207766011, 0.806661308623298], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 0.9891196834817012, 0.6452460435212661, 0.8422972304648864], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 0, 0.0, 262.5, 258, 269, 261.5, 269.0, 269.0, 269.0, 3.6496350364963503, 2.238252737226277, 9.769189096715328], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 266.0, 261, 269, 267.0, 269.0, 269.0, 269.0, 3.181336161187699, 1.7491135339342525, 8.56226802757158], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1527.5, 1031, 2024, 1527.5, 2024.0, 2024.0, 2024.0, 0.2664180098574664, 0.45647499833488747, 0.19851263820434262], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 255.0, 253, 257, 255.0, 257.0, 257.0, 257.0, 0.9652509652509653, 0.6296754343629344, 0.7248808518339768], "isController": false}]}, function(index, item){
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
