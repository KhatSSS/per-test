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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.49776785714285715, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [0.75, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [0.75, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.125, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 499.8035714285715, 0, 5829, 271.0, 1131.0, 1237.0, 2676.0, 1.3501865547940664, 0.8080481798852341, 1.0396700180225795], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 262.0, 247, 277, 262.0, 277.0, 277.0, 277.0, 0.025556166063967083, 0.01916712454797531, 0.022536345659924097], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1150.5, 1133, 1168, 1150.5, 1168.0, 1168.0, 1168.0, 0.024809894185801297, 0.00659012814310347, 0.022144768833810925], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1130.0, 1108, 1152, 1130.0, 1152.0, 1152.0, 1152.0, 0.024812664383901544, 0.016186386531685772, 0.017470635762493178], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 617.0, 246, 988, 617.0, 988.0, 988.0, 988.0, 0.02501500900540324, 0.015951953984890934, 0.01802839516209726], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 244, 253, 248.5, 253.0, 253.0, 253.0, 0.024737779536908765, 0.01613753586978033, 0.018166806847417376], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 831.0, 825, 837, 831.0, 837.0, 837.0, 837.0, 0.024668212541319255, 0.019440671407074846, 0.02895624167447827], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 269.0, 247, 291, 269.0, 291.0, 291.0, 291.0, 0.02497377753358973, 0.006633659657359772, 0.020047309699815195], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 300.5, 291, 310, 300.5, 310.0, 310.0, 310.0, 0.024713020054615772, 0.01853476504096183, 0.024230343881674058], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 851.5, 823, 880, 851.5, 880.0, 880.0, 880.0, 0.024959440908523648, 0.04322809419069013, 0.016257760826157496], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1297.0, 997, 1597, 1297.0, 1597.0, 1597.0, 1597.0, 0.024514911194734198, 0.015992149099689885, 0.020205649461284825], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 250.5, 249, 252, 250.5, 252.0, 252.0, 252.0, 0.0254569522936714, 0.01909271422025355, 0.021156119533119497], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 6.25, 0, 21, 2.0, 21.0, 21.0, 21.0, 0.035132405252294586, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1564.0, 1124, 2004, 1564.0, 2004.0, 2004.0, 2004.0, 0.024405720700932297, 0.006482769561185142, 0.02178401242251184], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 248.0, 244, 252, 248.0, 252.0, 252.0, 252.0, 0.024735331948154745, 0.006570322548728604, 0.01985590123181953], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1192.5, 1160, 1225, 1192.5, 1225.0, 1225.0, 1225.0, 0.024410188812810468, 0.01592383410835683, 0.017664013584270073], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 245.0, 242, 248, 245.0, 248.0, 248.0, 248.0, 0.02486479766270902, 0.018648598247031765, 0.018770008391869212], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1093.5, 1004, 1183, 1093.5, 1183.0, 1183.0, 1183.0, 0.024794822840990802, 0.01617474771267759, 0.020436357888472884], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 281.5, 275, 288, 281.5, 288.0, 288.0, 288.0, 0.025095362377032724, 0.01637080280064244, 0.02058603944990966], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.02556694705085266, 0.016678438115204662, 0.01877572674046992], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1085.5, 1013, 1158, 1085.5, 1158.0, 1158.0, 1158.0, 0.024937344920886274, 0.015585840575553922, 0.017461012019800253], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 261.0, 247, 275, 261.0, 275.0, 275.0, 275.0, 0.02552843868069029, 0.01914632901051772, 0.01964493132849995], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 247.5, 243, 252, 247.5, 252.0, 252.0, 252.0, 0.024715463229569582, 0.006565044920354419, 0.019839951928424016], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 266.0, 261, 271, 266.0, 271.0, 271.0, 271.0, 0.02521940885705639, 0.018545131708362757, 0.029086056504085543], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 248.5, 245, 252, 248.5, 252.0, 252.0, 252.0, 0.025032855623005192, 0.013763181363038989, 0.018823534013392578], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 243.0, 239, 247, 243.0, 247.0, 247.0, 247.0, 0.0250243987888191, 0.015957941805760618, 0.01803516240834814], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 303.0, 282, 324, 303.0, 324.0, 324.0, 324.0, 0.024703252183149914, 0.0161150121663517, 0.018141450822000717], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 243.0, 240, 246, 243.0, 246.0, 246.0, 246.0, 0.02485645397827546, 0.015850844187318237, 0.017914124058561805], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 243.0, 240, 246, 243.0, 246.0, 246.0, 246.0, 0.024867270941350543, 0.01622200877814664, 0.01981610653138871], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 258.5, 245, 272, 258.5, 272.0, 272.0, 272.0, 0.0255007713983348, 0.016635268841882468, 0.019499125004781393], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 293.5, 285, 302, 293.5, 302.0, 302.0, 302.0, 0.024658480051289636, 0.00654990876362381, 0.019794209572421954], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1550.5, 1107, 1994, 1550.5, 1994.0, 1994.0, 1994.0, 0.02530556469367614, 0.016507926968140293, 0.020832608434344712], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 295.0, 281, 309, 295.0, 309.0, 309.0, 309.0, 0.024695016545661086, 0.006559613769941226, 0.01982353867239591], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.02557610169058032, 0.006793652011560398, 0.02053081600552444], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 243, 254, 248.5, 254.0, 254.0, 254.0, 0.024717601403959757, 0.016124372790864375, 0.018151988531032948], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 242.0, 238, 246, 242.0, 246.0, 246.0, 246.0, 0.025080885856888464, 0.006662110305735998, 0.0201332892327757], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1064.5, 1003, 1126, 1064.5, 1126.0, 1126.0, 1126.0, 0.024485498463534972, 0.015972961888321643, 0.01767068687944565], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 249.5, 246, 253, 249.5, 253.0, 253.0, 253.0, 0.02501532188465435, 0.013753541231504298, 0.01881034946404673], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 274.0, 251, 297, 274.0, 297.0, 297.0, 297.0, 0.0250003125039063, 0.018750234377929727, 0.025635086063575795], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 277.0, 266, 288, 277.0, 288.0, 288.0, 288.0, 0.0254427030327702, 0.01908202727457765, 0.026138401943822512], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 259.0, 245, 273, 259.0, 273.0, 273.0, 273.0, 0.02550987870052678, 0.016641209933546768, 0.020950984362444358], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 244.0, 242, 246, 244.0, 246.0, 246.0, 246.0, 0.024845646421605774, 0.0158439522590904, 0.018609971489620732], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1109.5, 1099, 1120, 1109.5, 1120.0, 1120.0, 1120.0, 0.024857071836937607, 0.01621535545612727, 0.017987392803877705], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 243.5, 241, 246, 243.5, 246.0, 246.0, 246.0, 0.024862943026566053, 0.016219185489986448, 0.02024970164468368], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 242.5, 239, 246, 242.5, 246.0, 246.0, 246.0, 0.025028783100565652, 0.01596073766080993, 0.017842784827551684], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 243.0, 239, 247, 243.0, 247.0, 247.0, 247.0, 0.025032228994830846, 0.015962935091430215, 0.0180408056622902], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 295.5, 287, 304, 295.5, 304.0, 304.0, 304.0, 0.024662737070560093, 0.016088582385873185, 0.01811169753619257], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1058.5, 1000, 1117, 1058.5, 1117.0, 1117.0, 1117.0, 0.024705083070841825, 0.016116206534494474, 0.01739488759187203], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 274.5, 264, 285, 274.5, 285.0, 285.0, 285.0, 0.025450473378804846, 0.0067602819912450365, 0.020429969841189045], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1059.0, 994, 1124, 1059.0, 1124.0, 1124.0, 1124.0, 0.0252178189108424, 0.0189133641831318, 0.02019395654969802], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 272.5, 270, 275, 272.5, 275.0, 275.0, 275.0, 0.02512531249607417, 0.006673911131769701, 0.020168952023215787], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1577.0, 1063, 2091, 1577.0, 2091.0, 2091.0, 2091.0, 0.024865415936245076, 0.01622079867715987, 0.020445976775701515], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.025020016012810245, 0.017103526571257004, 0.021354974604683746], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 242.5, 239, 246, 242.5, 246.0, 246.0, 246.0, 0.025036929470969683, 0.015965932563030468, 0.017848592298640494], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 277.5, 274, 281, 277.5, 281.0, 281.0, 281.0, 0.025085919273511777, 0.006663447307026566, 0.019377892720066226], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 259.0, 244, 274, 259.0, 274.0, 274.0, 274.0, 0.025538544047603844, 0.01665990959355407, 0.018729928300537584], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 258.5, 245, 272, 258.5, 272.0, 272.0, 272.0, 0.025548331055273814, 0.016666294086838777, 0.02113226211310246], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 280.0, 274, 286, 280.0, 286.0, 286.0, 286.0, 0.025084975354011715, 0.01636402689109358, 0.01815231126691668], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 0.025458248472505093, 0.006762347250509165, 0.02043621117617108], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 367.25, 1, 1463, 2.5, 1463.0, 1463.0, 1463.0, 0.03468729404419161, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.5, 246, 291, 268.5, 291.0, 291.0, 291.0, 0.024987818438511226, 0.016300647184497558, 0.01835042916578168], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 270.5, 253, 288, 270.5, 288.0, 288.0, 288.0, 0.025110170874712803, 0.006669889138595588, 0.020156797323255784], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 273.5, 271, 276, 273.5, 276.0, 276.0, 276.0, 0.025123734391880006, 0.016389311107202976, 0.018450242444036882], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 242.5, 239, 246, 242.5, 246.0, 246.0, 246.0, 0.024851821017185034, 0.014755768728953613, 0.016236199473141394], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 258.0, 242, 274, 258.0, 274.0, 274.0, 274.0, 0.024928641762953545, 0.006621670468284536, 0.01925640198681275], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 256.0, 252, 260, 256.0, 260.0, 260.0, 260.0, 0.024843177442394882, 0.013658895410222967, 0.01868090491273834], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 246.0, 243, 249, 246.0, 249.0, 249.0, 249.0, 0.024864179419918694, 0.018648134564939023, 0.02221750407150938], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 248.0, 247, 249, 248.0, 249.0, 249.0, 249.0, 0.025456628269585693, 0.019092471202189272, 0.02155361006809648], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 243.0, 240, 246, 243.0, 246.0, 246.0, 246.0, 0.0250197030161252, 0.015954947333525153, 0.017836311720479878], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1002.5, 995, 1010, 1002.5, 1010.0, 1010.0, 1010.0, 0.0252178189108424, 0.01645068655511985, 0.01847008221008965], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1193.5, 1146, 1241, 1193.5, 1241.0, 1241.0, 1241.0, 0.02446004451728102, 0.01595635716557004, 0.017700090807915268], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 40.75, 1, 157, 2.5, 157.0, 157.0, 157.0, 0.03513857776606492, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1089.0, 999, 1179, 1089.0, 1179.0, 1179.0, 1179.0, 0.024843177442394882, 0.006598969008136141, 0.020888648220607417], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 881.5, 852, 911, 881.5, 911.0, 911.0, 911.0, 0.024968789013732832, 0.0428053799937578, 0.020384675405742823], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 242.5, 239, 246, 242.5, 246.0, 246.0, 246.0, 0.02484749847809072, 0.015845133306829334, 0.017907669801592724], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 281.0, 275, 287, 281.0, 287.0, 287.0, 287.0, 0.025102921980118487, 0.016375734260467917, 0.018434958329149514], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 245.0, 244, 246, 245.0, 246.0, 246.0, 246.0, 0.025458572537837804, 0.016607740678980132, 0.01869613920747464], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 261.5, 258, 265, 261.5, 265.0, 265.0, 265.0, 0.02501594766663748, 0.01688087874770166, 0.021107205843725375], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 252.5, 248, 257, 252.5, 257.0, 257.0, 257.0, 0.024739309525871132, 0.018554482144403348, 0.02309646475266875], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 703.5, 275, 1132, 703.5, 1132.0, 1132.0, 1132.0, 0.025868536099542126, 0.0194014020746566, 0.022205510968259307], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 270.5, 249, 292, 270.5, 292.0, 292.0, 292.0, 0.02501532188465435, 0.016318588885692487, 0.020691384410451402], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 821.0, 512, 1130, 821.0, 1130.0, 1130.0, 1130.0, 0.024763201882003344, 0.01666195907880889, 0.02287694236364762], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 267.5, 254, 281, 267.5, 281.0, 281.0, 281.0, 0.025083087728099328, 0.016362795510127297, 0.018150945318868753], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 249.0, 246, 252, 249.0, 252.0, 252.0, 252.0, 0.025024711903004218, 0.013758703907608763, 0.018817410317688715], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 350.5, 346, 355, 350.5, 355.0, 355.0, 355.0, 0.024820978691189793, 0.01670083429514626, 0.023003035915956167], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 289.5, 285, 294, 289.5, 294.0, 294.0, 294.0, 0.025096621994679515, 0.01882246649600964, 0.024312352557345783], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 273.0, 258, 288, 273.0, 288.0, 288.0, 288.0, 0.02509063993677159, 0.01881797995257869, 0.024355562594873984], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 299.0, 290, 308, 299.0, 308.0, 308.0, 308.0, 0.024666691333358, 0.0185000185000185, 0.021342469259135924], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 251.5, 247, 256, 251.5, 256.0, 256.0, 256.0, 0.024719739948335744, 0.018539804961251807, 0.02182289542314015], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 289.0, 279, 299, 289.0, 299.0, 299.0, 299.0, 0.02508717794335315, 0.018815383457514864, 0.024082710857730616], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 245.5, 245, 246, 245.5, 246.0, 246.0, 246.0, 0.07541762509898564, 0.04919821637316641, 0.05678416889777141], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 263.5, 248, 279, 263.5, 279.0, 279.0, 279.0, 0.025518015719097682, 0.01913851178932326, 0.032694957640093905], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 277.0, 274, 280, 277.0, 280.0, 280.0, 280.0, 0.025121209837465772, 0.018840907378099327, 0.022275447785565353], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 590.5, 249, 932, 590.5, 932.0, 932.0, 932.0, 0.024864179419918694, 0.016219992043462587, 0.018259631761502793], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 281.0, 274, 288, 281.0, 288.0, 288.0, 288.0, 0.025107333852218233, 0.006669135554495468, 0.020154519947776745], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 261.5, 247, 276, 261.5, 276.0, 276.0, 276.0, 0.02475186257765897, 0.006574713497190663, 0.019554938305982525], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 267.5, 254, 281, 267.5, 281.0, 281.0, 281.0, 0.02510134668724977, 0.01637470662801059, 0.01843380147344905], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1138.0, 1112, 1164, 1138.0, 1164.0, 1164.0, 1164.0, 0.024808355454116946, 0.016183575628271604, 0.019163485511920417], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1262.5, 1033, 1492, 1262.5, 1492.0, 1492.0, 1492.0, 0.024698676150958308, 0.01611202702035171, 0.02035711198379767], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 249.75, 248, 253, 249.0, 253.0, 253.0, 253.0, 0.050431822479984866, 0.037823866859988654, 0.039793859925613066], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 245.5, 242, 249, 245.5, 249.0, 249.0, 249.0, 0.07412532120972525, 0.05559399090729393, 0.05957533140195691], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1029.0, 972, 1086, 1029.0, 1086.0, 1086.0, 1086.0, 0.024852129827526222, 0.0424840363897311, 0.017838198655499776], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 3008.75, 1299, 5829, 2453.5, 5829.0, 5829.0, 5829.0, 0.03384266544833071, 0.015533254649136165, 0.04213808442052896], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 1012.0, 991, 1033, 1012.0, 1033.0, 1033.0, 1033.0, 0.024496594973298712, 0.01598020062711283, 0.01772653991720151], "isController": false}]}, function(index, item){
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
