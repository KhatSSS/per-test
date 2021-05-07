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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.49776785714285715, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.25, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 475.92410714285717, 1, 3744, 260.0, 1080.5, 1175.25, 3185.0, 1.3995189153728407, 0.8375538877260941, 1.0775104651526037], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 257.0, 249, 265, 257.0, 265.0, 265.0, 265.0, 0.02893560381371258, 0.021701702860284437, 0.02551645531619381], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1000.5, 991, 1010, 1000.5, 1010.0, 1010.0, 1010.0, 0.027514479494834154, 0.007308533615815324, 0.02455882251785002], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1039.0, 995, 1083, 1039.0, 1083.0, 1083.0, 1083.0, 0.027521294601698065, 0.01795334452532647, 0.019377786531078422], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 246, 251, 248.5, 251.0, 251.0, 251.0, 0.027354542221735917, 0.01744386335038433, 0.01971450406214952], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.5, 254, 277, 265.5, 277.0, 277.0, 277.0, 0.029260727714298256, 0.01908805284487425, 0.02148834691518778], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 613.5, 573, 654, 613.5, 654.0, 654.0, 654.0, 0.02765104382690447, 0.021791398797179593, 0.032457572929628094], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 254.5, 246, 263, 254.5, 263.0, 263.0, 263.0, 0.028908418131359852, 0.007678798566142461, 0.023205780960915818], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 279.0, 276, 282, 279.0, 282.0, 282.0, 282.0, 0.029200916908790935, 0.0219006876815932, 0.028630586500416114], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 894.5, 887, 902, 894.5, 902.0, 902.0, 902.0, 0.026961081678596944, 0.046681638492336315, 0.01756156394494547], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1541.0, 1122, 1960, 1541.0, 1960.0, 1960.0, 1960.0, 0.02856653145175113, 0.018635198251728276, 0.023545070844998], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 255.5, 253, 258, 255.5, 258.0, 258.0, 258.0, 0.028995172303811417, 0.02174637922785856, 0.02409657385795265], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.0, 2, 21, 2.5, 21.0, 21.0, 21.0, 0.036873496252730946, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 985.5, 979, 992, 985.5, 992.0, 992.0, 992.0, 0.029079488782587204, 0.007724239207874725, 0.025955715573520218], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 265.0, 253, 277, 265.0, 277.0, 277.0, 277.0, 0.029251312652655286, 0.00776987992336156, 0.023481034180158834], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1084.0, 967, 1201, 1084.0, 1201.0, 1201.0, 1201.0, 0.028916777514313804, 0.018863679081603146, 0.020925129041119657], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 254.5, 249, 260, 254.5, 260.0, 260.0, 260.0, 0.02782531268695132, 0.02086898451521349, 0.020923330829055193], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 2407.0, 1070, 3744, 2407.0, 3744.0, 3744.0, 3744.0, 0.02749216473305108, 0.01793434183757629, 0.022659557651069445], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 273.0, 254, 292, 273.0, 292.0, 292.0, 292.0, 0.02922182285730984, 0.01906267350457322, 0.023971026562636978], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 251.5, 243, 260, 251.5, 260.0, 260.0, 260.0, 0.028930999566035006, 0.01887295674815565, 0.02124620280630696], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1023.0, 1006, 1040, 1023.0, 1040.0, 1040.0, 1040.0, 0.026922973373179334, 0.016826858358237082, 0.018851339754462484], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 258.5, 249, 268, 258.5, 268.0, 268.0, 268.0, 0.028957389201789564, 0.02171804190134218, 0.02228361590918963], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 245.5, 245, 246, 245.5, 246.0, 246.0, 246.0, 0.029250457038391225, 0.007769652650822669, 0.02348034734917733], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 436.5, 276, 597, 436.5, 597.0, 597.0, 597.0, 0.027204592135152413, 0.02000493933375954, 0.031375608702749025], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 258.0, 255, 261, 258.0, 261.0, 261.0, 261.0, 0.027499725002749973, 0.015119477711472887, 0.020678504152458477], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 245, 254, 249.5, 254.0, 254.0, 254.0, 0.027487252786520252, 0.01752849225546653, 0.019810148980910103], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 274.5, 272, 277, 274.5, 277.0, 277.0, 277.0, 0.02920518099910924, 0.019051817292387672, 0.02144755479622085], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.0, 246, 250, 248.0, 250.0, 250.0, 250.0, 0.027812930231264518, 0.01773617523536692, 0.020044865733079308], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 248.5, 246, 251, 248.5, 251.0, 251.0, 251.0, 0.027831120759232976, 0.018155457682780887, 0.022177924355013777], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 250.5, 242, 259, 250.5, 259.0, 259.0, 259.0, 0.028980047237476998, 0.018904952690072883, 0.022159547838812976], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 267.0, 238, 296, 267.0, 296.0, 296.0, 296.0, 0.029376340295525986, 0.00780309039099909, 0.023581398166916366], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1600.5, 1078, 2123, 1600.5, 2123.0, 2123.0, 2123.0, 0.028157513128440496, 0.018368377704881107, 0.023180452702417323], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 273.5, 271, 276, 273.5, 276.0, 276.0, 276.0, 0.029207740051113543, 0.007758305951077036, 0.0234460569550931], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 251.0, 242, 260, 251.0, 260.0, 260.0, 260.0, 0.028923886791907095, 0.007682907429100322, 0.023218198186472295], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 243.5, 242, 245, 243.5, 245.0, 245.0, 245.0, 0.029251312652655286, 0.019081910988255596, 0.021481432729293724], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 247.5, 245, 250, 247.5, 250.0, 250.0, 250.0, 0.02784041871989755, 0.007395111222472787, 0.02234846112085526], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1061.0, 1021, 1101, 1061.0, 1101.0, 1101.0, 1101.0, 0.02888920988010978, 0.018845695507727862, 0.020848755958399537], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 258.0, 255, 261, 258.0, 261.0, 261.0, 261.0, 0.027353419861318163, 0.015039038458908324, 0.020568489544155258], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 265.0, 252, 278, 265.0, 278.0, 278.0, 278.0, 0.028887958054684904, 0.021665968541013676, 0.029621441364667135], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 252.5, 245, 260, 252.5, 260.0, 260.0, 260.0, 0.02895948567953433, 0.02171961425965075, 0.0297513466160841], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 251.5, 242, 261, 251.5, 261.0, 261.0, 261.0, 0.028971651239262382, 0.01889947561311257, 0.023794100285370764], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 582.0, 246, 918, 582.0, 918.0, 918.0, 918.0, 0.027519779841761266, 0.017549234606123152, 0.02061296009631923], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1035.5, 1002, 1069, 1035.5, 1069.0, 1069.0, 1069.0, 0.02900316134458656, 0.01892003103338264, 0.020987639215174454], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 248.0, 245, 251, 248.0, 251.0, 251.0, 251.0, 0.027833444667112003, 0.018156973669561347, 0.022669035988643955], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.027492920572952467, 0.017532106576306602, 0.019599445330327443], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 245, 252, 248.5, 252.0, 252.0, 252.0, 0.027500481258422024, 0.017536927989989824, 0.019819682781948685], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.0, 238, 298, 268.0, 298.0, 298.0, 298.0, 0.029350474010155263, 0.019146598280062224, 0.021554254351207773], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1154.0, 1141, 1167, 1154.0, 1167.0, 1167.0, 1167.0, 0.028546144843138936, 0.018621899175016415, 0.020099385187405443], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 246.5, 239, 254, 246.5, 254.0, 254.0, 254.0, 0.028968294201995915, 0.007694703147405165, 0.023253845541055317], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1026.5, 995, 1058, 1026.5, 1058.0, 1058.0, 1058.0, 0.028674657337844814, 0.021505993003383607, 0.02296212794632104], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 254.5, 247, 262, 254.5, 262.0, 262.0, 262.0, 0.029370732065496733, 0.00780160070489757, 0.02357689624788898], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1004.5, 975, 1034, 1004.5, 1034.0, 1034.0, 1034.0, 0.028631964725419456, 0.018677883238847847, 0.023543080369924984], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 285.0, 280, 290, 285.0, 290.0, 290.0, 290.0, 0.0274830978947947, 0.018787273951519814, 0.023457253476611883], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 248.5, 246, 251, 248.5, 251.0, 251.0, 251.0, 0.027505397934344616, 0.017540063331178746, 0.019608340324288643], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 254.0, 243, 265, 254.0, 265.0, 265.0, 265.0, 0.027800172361068638, 0.007384420783408858, 0.021474547204692673], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 251.5, 243, 260, 251.5, 260.0, 260.0, 260.0, 0.02895277801905093, 0.018887163785865253, 0.021233922160456296], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 251.5, 243, 260, 251.5, 260.0, 260.0, 260.0, 0.0289452356142179, 0.01888224354521246, 0.023942006411369687], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 272.5, 254, 291, 272.5, 291.0, 291.0, 291.0, 0.02925302403135924, 0.019083027395457006, 0.021168448053942576], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 249.5, 245, 254, 249.5, 254.0, 254.0, 254.0, 0.029008630067445064, 0.007705417361665096, 0.023286224526796725], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 317.75, 1, 1263, 3.5, 1263.0, 1263.0, 1263.0, 0.0364507868813618, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.5, 246, 263, 254.5, 263.0, 263.0, 263.0, 0.028901316454964524, 0.018853593156168264, 0.021224404271614573], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 285.0, 274, 296, 285.0, 296.0, 296.0, 296.0, 0.02931261908251502, 0.007786164443793053, 0.023530246958815768], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 247, 268, 257.5, 268.0, 268.0, 268.0, 0.029361246091284113, 0.01915362537986112, 0.02156216509828677], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 248.0, 245, 251, 248.0, 251.0, 251.0, 251.0, 0.027807516371675264, 0.016510712845682188, 0.01816721528579175], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 282.5, 280, 285, 282.5, 285.0, 285.0, 285.0, 0.028912179255511386, 0.007679797614745212, 0.02233352909288038], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 258.5, 255, 262, 258.5, 262.0, 262.0, 262.0, 0.02751372246908145, 0.015127173584075056, 0.020689029591008514], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 252.5, 250, 255, 252.5, 255.0, 255.0, 255.0, 0.027834219389317228, 0.02087566454198792, 0.024871397208227796], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 254.0, 250, 258, 254.0, 258.0, 258.0, 258.0, 0.02898256698595795, 0.02173692523946846, 0.02453895075861869], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 248.0, 245, 251, 248.0, 251.0, 251.0, 251.0, 0.027360529699854988, 0.017447681537114557, 0.019505065118060685], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1014.0, 999, 1029, 1014.0, 1029.0, 1029.0, 1029.0, 0.028659043361132605, 0.018695547817613848, 0.020990510274267044], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1117.5, 1112, 1123, 1117.5, 1123.0, 1123.0, 1123.0, 0.028844212408780177, 0.018816341688540197, 0.020872618549713003], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 45.0, 2, 170, 4.0, 170.0, 170.0, 170.0, 0.036879615714404256, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1155.0, 1108, 1202, 1155.0, 1202.0, 1202.0, 1202.0, 0.028970811907003693, 0.007695371912797857, 0.02435924712102557], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 914.5, 913, 916, 914.5, 916.0, 916.0, 916.0, 0.026956720984459448, 0.04620023957785775, 0.022007635491218848], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.0, 245, 251, 248.0, 251.0, 251.0, 251.0, 0.027515236562246345, 0.01754633737807311, 0.0198303169755252], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 561.5, 254, 869, 561.5, 869.0, 869.0, 869.0, 0.02894565453361314, 0.0188825168246617, 0.02125696504812215], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 245, 254, 249.5, 254.0, 254.0, 254.0, 0.029005264455498673, 0.018921402984641712, 0.021300741084506837], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 427.5, 262, 593, 427.5, 593.0, 593.0, 593.0, 0.027356413027123883, 0.01846023574388926, 0.02308197349163578], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 271.0, 260, 282, 271.0, 282.0, 282.0, 282.0, 0.029268007141393743, 0.021951005356045307, 0.027324428542160564], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 276.5, 271, 282, 276.5, 282.0, 282.0, 282.0, 0.028476642034371304, 0.021357481525778477, 0.02444430502755115], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 258.0, 247, 269, 258.0, 269.0, 269.0, 269.0, 0.028880449379792353, 0.018839980650098915, 0.023888418578793084], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 485.0, 475, 495, 485.0, 495.0, 495.0, 495.0, 0.02742092490779714, 0.018450212169406476, 0.025332221643336032], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 286.0, 276, 296, 286.0, 296.0, 296.0, 296.0, 0.029339279427297263, 0.019139295563900947, 0.021230865288698508], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 258.5, 256, 261, 258.5, 261.0, 261.0, 261.0, 0.027486875017179297, 0.01511241272917182, 0.0206688415656524], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 354.5, 352, 357, 354.5, 357.0, 357.0, 357.0, 0.02776890715465893, 0.01868435256792969, 0.02573505165016731], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 277.5, 258, 297, 277.5, 297.0, 297.0, 297.0, 0.029203475213550413, 0.021902606410162808, 0.028290866613126964], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 291.0, 281, 301, 291.0, 301.0, 301.0, 301.0, 0.029328523455486633, 0.021996392591614976, 0.028469289369876673], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 272.0, 242, 302, 272.0, 302.0, 302.0, 302.0, 0.029322933466263964, 0.021992200099697972, 0.025371210010849483], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 248.0, 247, 249, 248.0, 249.0, 249.0, 249.0, 0.029250457038391225, 0.021937842778793418, 0.025822669104204752], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 278.0, 260, 296, 278.0, 296.0, 296.0, 296.0, 0.029235491887151004, 0.021926618915363252, 0.02806493020026312], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 250.0, 246, 254, 250.0, 254.0, 254.0, 254.0, 0.08572285800008572, 0.05592077064849343, 0.06454328468561142], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 263.0, 259, 267, 263.0, 267.0, 267.0, 267.0, 0.028961163080309306, 0.021720872310231978, 0.037106490196646295], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 259.0, 250, 268, 259.0, 268.0, 268.0, 268.0, 0.029352197011946343, 0.022014147758959757, 0.026027143444186794], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.0, 245, 251, 248.0, 251.0, 251.0, 251.0, 0.027838093647347028, 0.01816000640276154, 0.020443600022270476], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 271.5, 253, 290, 271.5, 290.0, 290.0, 290.0, 0.028930999566035006, 0.007684796759728049, 0.023223907854766385], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 261.5, 252, 271, 261.5, 271.0, 271.0, 271.0, 0.029206460469055756, 0.007757966062092936, 0.02307424464791612], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 286.5, 276, 297, 286.5, 297.0, 297.0, 297.0, 0.029321213898255385, 0.01912751062894004, 0.0215327664565313], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1103.0, 1028, 1178, 1103.0, 1178.0, 1178.0, 1178.0, 0.028941047087083612, 0.018879511185714702, 0.02235582836512025], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1170.0, 1131, 1209, 1170.0, 1209.0, 1209.0, 1209.0, 0.02898256698595795, 0.018906596432246004, 0.023887975132957526], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 254.75, 249, 259, 255.5, 259.0, 259.0, 259.0, 0.057356715754455896, 0.043017536815841924, 0.04525803352500036], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 253.5, 248, 266, 251.5, 266.0, 266.0, 266.0, 0.08286606082368865, 0.06214954561776648, 0.06635758776896941], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1774.0, 1110, 2438, 1774.0, 2438.0, 2438.0, 2438.0, 0.02638313589953302, 0.0450883670158035, 0.01893711414663747], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1782.5, 811, 3434, 1442.5, 3434.0, 3434.0, 3434.0, 0.03534255774090371, 0.016221681775610102, 0.04400562609341038], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 996.0, 993, 999, 996.0, 999.0, 999.0, 999.0, 0.028936022454353425, 0.018876233397957118, 0.020939055311206923], "isController": false}]}, function(index, item){
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
