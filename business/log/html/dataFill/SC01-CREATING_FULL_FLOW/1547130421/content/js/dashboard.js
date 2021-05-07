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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.515625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 436.098214285714, 1, 1499, 275.5, 1069.0, 1136.25, 1238.5, 1.4125629820213526, 0.8456003924749491, 1.0881691150040675], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 270.0, 257, 283, 270.0, 283.0, 283.0, 283.0, 0.02726021235705426, 0.020445159267790693, 0.024039034920332027], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1134.0, 1101, 1167, 1134.0, 1167.0, 1167.0, 1167.0, 0.02676229727559814, 0.007108735213830755, 0.023887441122945993], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1049.5, 980, 1119, 1049.5, 1119.0, 1119.0, 1119.0, 0.026818638954073083, 0.017494971505196112, 0.018883045591686222], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 274.0, 253, 295, 274.0, 295.0, 295.0, 295.0, 0.026716894428191668, 0.017037238341415194, 0.019254949304692823], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.5, 254, 257, 255.5, 257.0, 257.0, 257.0, 0.027142934694099126, 0.017706523804353728, 0.019933092665979046], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 749.5, 739, 760, 749.5, 760.0, 760.0, 760.0, 0.026766237068561717, 0.02109409503352471, 0.031418961871495295], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 254.5, 238, 271, 254.5, 271.0, 271.0, 271.0, 0.02718462437645268, 0.007220915849995243, 0.021822032458441505], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 279.0, 258, 300, 279.0, 300.0, 300.0, 300.0, 0.027059205541725296, 0.02029440415629397, 0.02653070543348847], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 876.5, 859, 894, 876.5, 894.0, 894.0, 894.0, 0.026434396436643363, 0.045317952094265056, 0.017218498460196408], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1042.0, 1041, 1043, 1042.0, 1043.0, 1043.0, 1043.0, 0.026857173551055484, 0.017520109308696352, 0.022136186012784012], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 250.5, 242, 259, 250.5, 259.0, 259.0, 259.0, 0.027134464840517184, 0.02035084863038789, 0.022550224198515746], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 8.75, 1, 30, 2.0, 30.0, 30.0, 30.0, 0.03630917260472927, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1004.5, 985, 1024, 1004.5, 1024.0, 1024.0, 1024.0, 0.02686294525331757, 0.0071354698329124805, 0.02397727730618385], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 254.5, 253, 256, 254.5, 256.0, 256.0, 256.0, 0.027142566329646466, 0.0072097441813123424, 0.0217882710185248], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1120.5, 1030, 1211, 1120.5, 1211.0, 1211.0, 1211.0, 0.02674833825948563, 0.017449111286461327, 0.019355975244412942], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 276.5, 256, 297, 276.5, 297.0, 297.0, 297.0, 0.02704127851164803, 0.020280958883736024, 0.020333773880829086], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1036.5, 971, 1102, 1036.5, 1102.0, 1102.0, 1102.0, 0.02683339147234819, 0.017504595218289638, 0.022116584377599485], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.02714735584754045, 0.017709407916168967, 0.022269315343685526], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 266.0, 254, 278, 266.0, 278.0, 278.0, 278.0, 0.027271363704542046, 0.01779030366663485, 0.020027407720523065], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1129.5, 1028, 1231, 1129.5, 1231.0, 1231.0, 1231.0, 0.02633172709798036, 0.016457329436237723, 0.018437351884035075], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 269.5, 256, 283, 269.5, 283.0, 283.0, 283.0, 0.02723200304998434, 0.020424002287488256, 0.020955877347058262], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 284.5, 276, 293, 284.5, 293.0, 293.0, 293.0, 0.027092561737175058, 0.007196461711437125, 0.021748130613240137], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 297.5, 275, 320, 297.5, 320.0, 320.0, 320.0, 0.026667733376001704, 0.019610159406376254, 0.03075643859087697], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 282.5, 261, 304, 282.5, 304.0, 304.0, 304.0, 0.02685284640171858, 0.014763820824382384, 0.02019208176691729], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 274.0, 253, 295, 274.0, 295.0, 295.0, 295.0, 0.026779139050679523, 0.01707693144540403, 0.019299809198634263], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 275.0, 253, 297, 275.0, 297.0, 297.0, 297.0, 0.02704420375103106, 0.01764211729071167, 0.019860587129663435], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 275.0, 253, 297, 275.0, 297.0, 297.0, 297.0, 0.02698108625853277, 0.017205712233224507, 0.019445353182419124], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 274.5, 254, 295, 274.5, 295.0, 295.0, 295.0, 0.027057009118212075, 0.017650470791958656, 0.021561054141075245], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 266.0, 253, 279, 266.0, 279.0, 279.0, 279.0, 0.027205702315205266, 0.017747469869684687, 0.02080279776641184], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 274.5, 253, 296, 274.5, 296.0, 296.0, 296.0, 0.027128207910585428, 0.007205930226249254, 0.021776745021973846], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1029.5, 1028, 1031, 1029.5, 1031.0, 1031.0, 1031.0, 0.027004766341259232, 0.017616390542930824, 0.02223146291570462], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 274.0, 253, 295, 274.0, 295.0, 295.0, 295.0, 0.0270292185852907, 0.007179636186717842, 0.021697282887801712], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 265.5, 253, 278, 265.5, 278.0, 278.0, 278.0, 0.027280663465735485, 0.007246426233085989, 0.02189912633675251], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 286.0, 278, 294, 286.0, 294.0, 294.0, 294.0, 0.027097700760090507, 0.017677015730215292, 0.019899873995691465], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 273.0, 252, 294, 273.0, 294.0, 294.0, 294.0, 0.02711864406779661, 0.007203389830508475, 0.02176906779661017], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1064.5, 1025, 1104, 1064.5, 1104.0, 1104.0, 1104.0, 0.026820437173125922, 0.017496144562156365, 0.0193557647177149], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 284.5, 261, 308, 284.5, 308.0, 308.0, 308.0, 0.026729034413631808, 0.014695748412963582, 0.02009898095556298], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 260.0, 244, 276, 260.0, 276.0, 276.0, 276.0, 0.02715841503489856, 0.020368811276173925, 0.027847984166644035], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 299.5, 288, 311, 299.5, 311.0, 311.0, 311.0, 0.02707898941211514, 0.020309242059086352, 0.027819430528852662], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 266.5, 254, 279, 266.5, 279.0, 279.0, 279.0, 0.027214957340554367, 0.017753507327627264, 0.02235134680020139], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 275.5, 255, 296, 275.5, 296.0, 296.0, 296.0, 0.026925873071434344, 0.017170503042623655, 0.02016811000565443], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1030.0, 975, 1085, 1030.0, 1085.0, 1085.0, 1085.0, 0.02684275514038761, 0.01751070354861223, 0.019424298397487518], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 273.5, 253, 294, 273.5, 294.0, 294.0, 294.0, 0.02707239157507174, 0.017660505441550706, 0.02204919391954085], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 274.5, 254, 295, 274.5, 295.0, 295.0, 295.0, 0.026810010858054397, 0.01709661825225539, 0.019112605396855185], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 274.0, 253, 295, 274.0, 295.0, 295.0, 295.0, 0.026840953927502582, 0.017116350502596862, 0.019344359373532134], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 275.0, 254, 296, 275.0, 296.0, 296.0, 296.0, 0.027112394431114184, 0.017686601054672145, 0.01991066466034948], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1037.0, 988, 1086, 1037.0, 1086.0, 1086.0, 1086.0, 0.026886779770386903, 0.01753942274083833, 0.01893102364692281], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 294.0, 283, 305, 294.0, 305.0, 305.0, 305.0, 0.02707275803722504, 0.0071912013536379014, 0.02173223350253807], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1092.5, 1030, 1155, 1092.5, 1155.0, 1155.0, 1155.0, 0.026875940657923026, 0.02015695549344227, 0.021521749354977426], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 253.0, 240, 266, 253.0, 266.0, 266.0, 266.0, 0.027169114151033104, 0.0072167959463681685, 0.021809581867333217], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1194.0, 1151, 1237, 1194.0, 1237.0, 1237.0, 1237.0, 0.02677447856702991, 0.017466163752710918, 0.022015733352967953], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 304.0, 283, 325, 304.0, 325.0, 325.0, 325.0, 0.02681468372080551, 0.018330350199769394, 0.022886751535140644], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 274.5, 254, 295, 274.5, 295.0, 295.0, 295.0, 0.02687088539567379, 0.01713543765954588, 0.019156002284025257], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 257.0, 239, 275, 257.0, 275.0, 275.0, 275.0, 0.027074590496818735, 0.007191688100717476, 0.02091406355760119], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 266.0, 253, 279, 266.0, 279.0, 279.0, 279.0, 0.02724276023646716, 0.017771644373007874, 0.019979797790612146], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 266.5, 254, 279, 266.5, 279.0, 279.0, 279.0, 0.027252040496532178, 0.017777698292659665, 0.022541482715393316], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 260.5, 254, 267, 260.5, 267.0, 267.0, 267.0, 0.027157677475422304, 0.017716141165607515, 0.019652186532507738], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 246.0, 238, 254, 246.0, 254.0, 254.0, 254.0, 0.027159152634437807, 0.007214149918522542, 0.021801585415535035], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 312.0, 2, 1239, 3.5, 1239.0, 1239.0, 1239.0, 0.03590632041005018, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.5, 239, 272, 255.5, 272.0, 272.0, 272.0, 0.027172067115005773, 0.017725528157054547, 0.019954486787582364], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 275.5, 271, 280, 275.5, 280.0, 280.0, 280.0, 0.027098435065374977, 0.007198021814240227, 0.021752845335681864], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 252.5, 240, 265, 252.5, 265.0, 265.0, 265.0, 0.027159890274043294, 0.01771758467095793, 0.01994554442000054], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 274.0, 253, 295, 274.0, 295.0, 295.0, 295.0, 0.02695018258748703, 0.016001670911320424, 0.01858088760426352], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 253.5, 240, 267, 253.5, 267.0, 267.0, 267.0, 0.027149935518903143, 0.007211701622208647, 0.020972264643996468], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 283.0, 260, 306, 283.0, 306.0, 306.0, 306.0, 0.026907398189132105, 0.014793813652813842, 0.020233102153937227], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 280.0, 258, 302, 280.0, 302.0, 302.0, 302.0, 0.027085590465872156, 0.020314192849404115, 0.024202456324485373], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 250.0, 242, 258, 250.0, 258.0, 258.0, 258.0, 0.027111291853056798, 0.0203334688897926, 0.022954580113867428], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 275.5, 254, 297, 275.5, 297.0, 297.0, 297.0, 0.026747980527470176, 0.017057061801209007, 0.019068384555716043], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1000.5, 970, 1031, 1000.5, 1031.0, 1031.0, 1031.0, 0.026823314825246105, 0.01749802178053164, 0.01964598253802205], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1114.0, 1032, 1196, 1114.0, 1196.0, 1196.0, 1196.0, 0.026793848132468785, 0.017478799367665183, 0.01938890768179626], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 43.0, 2, 163, 3.5, 163.0, 163.0, 163.0, 0.03631840344298465, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1014.5, 982, 1047, 1014.5, 1047.0, 1047.0, 1047.0, 0.026907398189132105, 0.007147277643988215, 0.02262428695394799], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 998.5, 916, 1081, 998.5, 1081.0, 1081.0, 1081.0, 0.026369917198459995, 0.046134479161172935, 0.021528565212805235], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 273.5, 253, 294, 273.5, 294.0, 294.0, 294.0, 0.02689509567930288, 0.01715087644393045, 0.01938337950324758], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.02713667385788524, 0.017702439586979826, 0.019928494864384475], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 246.0, 238, 254, 246.0, 254.0, 254.0, 254.0, 0.027153252959704572, 0.01771325486043228, 0.019940670142283044], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 293.0, 272, 314, 293.0, 314.0, 314.0, 314.0, 0.026757284670751613, 0.01805594112059508, 0.022576458940946675], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 260.5, 260, 261, 260.5, 261.0, 261.0, 261.0, 0.02714146129627619, 0.020356095972207142, 0.02533909863207035], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 257.5, 257, 258, 257.5, 258.0, 258.0, 258.0, 0.02728996957168393, 0.020467477178762943, 0.023425667239756025], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 256.0, 239, 273, 256.0, 273.0, 273.0, 273.0, 0.027147724342007032, 0.01770964830123115, 0.02245519777117183], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 564.0, 552, 576, 564.0, 576.0, 576.0, 576.0, 0.026778421947594628, 0.01801790304872334, 0.024738659338305196], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 276.0, 272, 280, 276.0, 280.0, 280.0, 280.0, 0.027107984656880683, 0.01768372436601201, 0.01961622717846542], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 282.5, 261, 304, 282.5, 304.0, 304.0, 304.0, 0.026792053476938738, 0.014730396589371593, 0.0201463683371512], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 380.0, 360, 400, 380.0, 400.0, 400.0, 400.0, 0.026926598093596855, 0.018117603600086168, 0.025296276724648608], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 264.5, 257, 272, 264.5, 272.0, 272.0, 272.0, 0.02714072465734835, 0.020355543493011264, 0.026292577011806217], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 279.5, 275, 284, 279.5, 284.0, 284.0, 284.0, 0.027103576316895014, 0.02032768223767126, 0.026309526229485982], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 281.5, 258, 305, 281.5, 305.0, 305.0, 305.0, 0.027093662792272887, 0.020320247094204665, 0.023442368392532987], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 290.0, 280, 300, 290.0, 300.0, 300.0, 300.0, 0.027102841732955702, 0.020327131299716774, 0.023926727467374953], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 265.0, 258, 272, 265.0, 272.0, 272.0, 272.0, 0.027150672657915098, 0.020363004493436327, 0.0260635851784478], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 247.0, 239, 255, 247.0, 255.0, 255.0, 255.0, 0.08030301002449242, 0.052385166695664974, 0.06046252024305045], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 271.0, 260, 282, 271.0, 282.0, 282.0, 282.0, 0.027222365895820003, 0.020416774421865007, 0.03487865630401939], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 256.5, 244, 269, 256.5, 269.0, 269.0, 269.0, 0.027149198419916653, 0.02036189881493749, 0.024073703286410467], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 274.0, 254, 294, 274.0, 294.0, 294.0, 294.0, 0.02710320901994796, 0.017680609009106677, 0.019903919124024283], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 260.0, 253, 267, 260.0, 267.0, 267.0, 267.0, 0.027131888108093444, 0.0072069077787123206, 0.021779699243020322], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 261.5, 252, 271, 261.5, 271.0, 271.0, 271.0, 0.027130047884534516, 0.007206418969329481, 0.02143379759627776], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 275.5, 271, 280, 275.5, 280.0, 280.0, 280.0, 0.027101739931703617, 0.017679650658572278, 0.019902840262344842], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1083.0, 1035, 1131, 1083.0, 1131.0, 1131.0, 1131.0, 0.026877385367951406, 0.01753329436112455, 0.020761730298876523], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1122.0, 1106, 1138, 1122.0, 1138.0, 1138.0, 1138.0, 0.02680785470142752, 0.017487936465384355, 0.02209553649219221], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 250.25, 242, 258, 250.5, 258.0, 258.0, 258.0, 0.05372805544735322, 0.04029604158551492, 0.04239479375142715], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 277.16666666666663, 256, 298, 277.0, 298.0, 298.0, 298.0, 0.08042895442359249, 0.060321715817694375, 0.06440599865951743], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1077.0, 1057, 1097, 1077.0, 1097.0, 1097.0, 1097.0, 0.02631994525451387, 0.04499322672658841, 0.018891757580144233], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 871.25, 560, 1499, 713.0, 1499.0, 1499.0, 1499.0, 0.03543021134121065, 0.01626191340856348, 0.04411476509769881], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 1154.5, 1124, 1185, 1154.5, 1185.0, 1185.0, 1185.0, 0.02680354342844124, 0.017485124033397213, 0.019395923516088827], "isController": false}]}, function(index, item){
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
