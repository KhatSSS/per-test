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

    var data = {"OkPercent": 62.5, "KoPercent": 37.5};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5758928571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.75, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.75, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [0.75, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.125, 500, 1500, "HTTP Request"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 84, 37.5, 333.91517857142856, 1, 2823, 281.0, 472.5, 893.0, 2285.75, 1.5167519839657648, 1.0798367417932884, 1.1617790138065058], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 263.5, 242, 285, 263.5, 285.0, 285.0, 285.0, 0.026499191774650873, 0.019874393830988154, 0.02336793962159154], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 504.0, 286, 722, 504.0, 722.0, 722.0, 722.0, 0.02683303146172939, 0.02012477359629704, 0.02308584054471054], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.02637548135253468, 0.017205880413567548, 0.018571017632009284], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.026794566062002624, 0.01708676917821066, 0.01931092749390424], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.0, 239, 281, 260.0, 281.0, 281.0, 281.0, 0.026860780574283486, 0.017522462327755246, 0.01972588573423944], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 743.5, 709, 778, 743.5, 778.0, 778.0, 778.0, 0.026396716248498684, 0.02080288087161957, 0.03098520794013225], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 264.0, 243, 285, 264.0, 285.0, 285.0, 285.0, 0.026933487751996443, 0.020200115813997332, 0.020752462730786323], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 264.5, 244, 285, 264.5, 285.0, 285.0, 285.0, 0.026948003826616544, 0.020211002869962406, 0.02642167562687794], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 878.0, 875, 881, 878.0, 881.0, 881.0, 881.0, 0.026633640951886327, 0.04567253272608632, 0.017348279799715018], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.02688967167710882, 0.01754130925811396, 0.022162971577617038], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 263.5, 242, 285, 263.5, 285.0, 285.0, 285.0, 0.026673779674579887, 0.020005334755934915, 0.02216736963190184], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 6.75, 1, 21, 2.5, 21.0, 21.0, 21.0, 0.03640533702240749, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 264.0, 243, 285, 264.0, 285.0, 285.0, 285.0, 0.026841674383648054, 0.02013125578773604, 0.023093276496087826], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 263.5, 243, 284, 263.5, 284.0, 284.0, 284.0, 0.026844556595036442, 0.020133417446277332, 0.020683940579573977], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.02690414054723022, 0.017550747935107216, 0.019468718892087494], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 264.5, 245, 284, 264.5, 284.0, 284.0, 284.0, 0.026460276509889528, 0.019845207382417147, 0.02033616954422174], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 261.0, 241, 281, 261.0, 281.0, 281.0, 281.0, 0.026992738953221584, 0.017608544551515642, 0.022247921559100603], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.02685140432844638, 0.01751634579238494, 0.02202654261317867], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.0, 239, 281, 260.0, 281.0, 281.0, 281.0, 0.02648550580694715, 0.017277654178750677, 0.01945029332697681], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1103.0, 1021, 1185, 1103.0, 1185.0, 1185.0, 1185.0, 0.02652027475004641, 0.016575171718779005, 0.018569372066194606], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 264.5, 245, 284, 264.5, 284.0, 284.0, 284.0, 0.026542800265428, 0.019907100199071003, 0.020425514266755145], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 263.0, 242, 284, 263.0, 284.0, 284.0, 284.0, 0.026784877258299967, 0.020088657943724973, 0.020637957184373702], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 280.5, 262, 299, 280.5, 299.0, 299.0, 299.0, 0.026776987856636007, 0.019690499859420812, 0.030882444002624142], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 269.0, 247, 291, 269.0, 291.0, 291.0, 291.0, 0.026657425425852373, 0.014656377455815318, 0.020045134353424147], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026733679088916218, 0.017047941840881143, 0.019267046062129072], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.026934575915102215, 0.01757060225711746, 0.01978007918765319], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.026519571443725472, 0.01691140639917259, 0.019112738013153708], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026447330142022163, 0.01725275052233477, 0.02107521620692391], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.026587259385302563, 0.017344032489630967, 0.020329906346378813], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 266.0, 243, 289, 266.0, 289.0, 289.0, 289.0, 0.026856812902012916, 0.02014260967650969, 0.020693384159851752], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 261.0, 239, 283, 261.0, 283.0, 283.0, 283.0, 0.026455726341966718, 0.01725822773089235, 0.021779470025662055], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 264.0, 243, 285, 264.0, 285.0, 285.0, 285.0, 0.026918262695325646, 0.020188697021494232, 0.020740731705675714], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 263.5, 243, 284, 263.5, 284.0, 284.0, 284.0, 0.026469731861616243, 0.019852298896212178, 0.02039513519415548], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 241, 282, 261.5, 282.0, 282.0, 282.0, 0.02680031088360625, 0.017483015302977512, 0.01968147830514834], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 264.5, 243, 286, 264.5, 286.0, 286.0, 286.0, 0.026388705633988655, 0.01979152922549149, 0.02033270385275102], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.026770894683300316, 0.017463825828559192, 0.019320010909139585], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 268.5, 248, 289, 268.5, 289.0, 289.0, 289.0, 0.026776987856636007, 0.014722113440709055, 0.0201350396968845], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 265.0, 245, 285, 265.0, 285.0, 285.0, 285.0, 0.02696180859812076, 0.02022135644859057, 0.02764638576955742], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 265.0, 245, 285, 265.0, 285.0, 285.0, 285.0, 0.026778421947594628, 0.020083816460695972, 0.02751064442272417], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.02657242313926607, 0.0173343541572556, 0.021823640488401137], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026585492296853606, 0.016953443818208402, 0.019913156827819058], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 260.5, 239, 282, 260.5, 282.0, 282.0, 282.0, 0.02697271709665673, 0.017595483418522163, 0.019518343133420546], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.02643299895589654, 0.017243401662635636, 0.021528438602751675], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 261.5, 241, 282, 261.5, 282.0, 282.0, 282.0, 0.026704052339942583, 0.017029049001936046, 0.019037068562654382], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026675558519506502, 0.017010878626208738, 0.01922515838612871], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.0, 239, 281, 260.0, 281.0, 281.0, 281.0, 0.026874496103198066, 0.017531409567320612, 0.01973595807578608], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 261.5, 241, 282, 261.5, 282.0, 282.0, 282.0, 0.02691971195908204, 0.017560905848307422, 0.0189542112524396], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 264.0, 243, 285, 264.0, 285.0, 285.0, 285.0, 0.026764087946792994, 0.020073065960094744, 0.020621938857441083], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 265.5, 246, 285, 265.5, 285.0, 285.0, 285.0, 0.026599635584992485, 0.019949726688744365, 0.021300489433294767], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 263.5, 243, 284, 263.5, 284.0, 284.0, 284.0, 0.026926235577635068, 0.0201946766832263, 0.02074687487378327], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026794925041197196, 0.017479501882343484, 0.022032545785828164], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 290.5, 271, 310, 290.5, 310.0, 310.0, 310.0, 0.026679472813617204, 0.018237920868683637, 0.022771346913184994], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 261.0, 241, 281, 261.0, 281.0, 281.0, 281.0, 0.02664535038635758, 0.01699161504130029, 0.018995220490274446], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 956.0, 287, 1625, 956.0, 1625.0, 1625.0, 1625.0, 0.02635949073463901, 0.019769618050979255, 0.019512201149273798], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 260.5, 239, 282, 260.5, 282.0, 282.0, 282.0, 0.02652977303779166, 0.017306531630121903, 0.01945689409314603], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.02651464934376243, 0.01729666578284502, 0.02193155077555349], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026880997822639176, 0.017535650923362275, 0.019451972057202765], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 263.5, 243, 284, 263.5, 284.0, 284.0, 284.0, 0.026614502242271815, 0.01996087668170386, 0.020506681903469198], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 360.25, 1, 1435, 2.5, 1435.0, 1435.0, 1435.0, 0.0359366436971619, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026949093163015064, 0.01758007249306061, 0.019790740291589188], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 264.0, 243, 285, 264.0, 285.0, 285.0, 285.0, 0.026986547206217702, 0.020239910404663275, 0.020793345454790786], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 239, 282, 260.5, 282.0, 282.0, 282.0, 0.026942195519512886, 0.017575572858432233, 0.019785674834642275], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 261.5, 241, 282, 261.5, 282.0, 282.0, 282.0, 0.026545970985253714, 0.015761670272494394, 0.018302202651942504], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 265.0, 244, 286, 265.0, 286.0, 286.0, 286.0, 0.02690341673392521, 0.020177562550443905, 0.019914833871401666], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 268.5, 247, 290, 268.5, 290.0, 290.0, 290.0, 0.026597866851078546, 0.014623631872223847, 0.02000034909700242], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 264.5, 244, 285, 264.5, 285.0, 285.0, 285.0, 0.026417636414070033, 0.019813227310552527, 0.02360560285046297], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 264.0, 243, 285, 264.0, 285.0, 285.0, 285.0, 0.02673475116630352, 0.02005106337472764, 0.022635770762876126], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 261.5, 241, 282, 261.5, 282.0, 282.0, 282.0, 0.026764804282368684, 0.01706779023084644, 0.01908037805286049], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.026750484852537955, 0.017450511603022804, 0.019592640272854945], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 572.5, 283, 862, 572.5, 862.0, 862.0, 862.0, 0.0267401128432762, 0.01744374548760596, 0.01935002306334733], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 40.25, 1, 154, 3.0, 154.0, 154.0, 154.0, 0.0364119649716897, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 265.0, 243, 287, 265.0, 287.0, 287.0, 287.0, 0.026910294533173666, 0.02018272089988025, 0.021759495970183396], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 903.5, 897, 910, 903.5, 910.0, 910.0, 910.0, 0.02662158744525936, 0.046587778029203886, 0.021734030375231278], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 241, 281, 261.0, 281.0, 281.0, 281.0, 0.02661556478228468, 0.016972620901203023, 0.01918192071223251], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.02682295508496171, 0.01749778710620549, 0.019698107640518756], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026630449255678944, 0.017372207131634308, 0.019556736172139225], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 278.0, 255, 301, 278.0, 301.0, 301.0, 301.0, 0.026743330881861337, 0.018046525038443537, 0.022564685431570503], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 265.5, 246, 285, 265.5, 285.0, 285.0, 285.0, 0.026873412789057145, 0.02015505959179286, 0.02508885022103382], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 264.0, 244, 284, 264.0, 284.0, 284.0, 284.0, 0.026439987837605594, 0.019829990878204196, 0.022696044247319646], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026977810750657586, 0.017598806231874282, 0.02231465400957712], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 491.0, 469, 513, 491.0, 513.0, 513.0, 513.0, 0.026549142462698454, 0.017863631989061754, 0.0245268445016726], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.02681288627314287, 0.01749121877974555, 0.019402684305077023], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 268.5, 248, 289, 268.5, 289.0, 289.0, 289.0, 0.026716537536735238, 0.014688877571466738, 0.020089583889927865], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 494.5, 476, 513, 494.5, 513.0, 513.0, 513.0, 0.02645082791091361, 0.12282586593397875, 0.0254434233322753], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 264.0, 243, 285, 264.0, 285.0, 285.0, 285.0, 0.02683699210992432, 0.02012774408244324, 0.025998336106489186], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 264.0, 244, 284, 264.0, 284.0, 284.0, 284.0, 0.02679672008146203, 0.020097540061096524, 0.026011659922825447], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 264.0, 243, 285, 264.0, 285.0, 285.0, 285.0, 0.026887864162510253, 0.02016589812188269, 0.023264304343734457], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 263.5, 242, 285, 263.5, 285.0, 285.0, 285.0, 0.02681468372080551, 0.020111012790604135, 0.023672337972273617], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 264.0, 244, 284, 264.0, 284.0, 284.0, 284.0, 0.02686474941904979, 0.020148562064287345, 0.02578911003801362], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 261.0, 239, 284, 261.0, 284.0, 284.0, 284.0, 0.07896191403679625, 0.0515103111099413, 0.05945276926012686], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 264.5, 243, 286, 264.5, 286.0, 286.0, 286.0, 0.026556545524558165, 0.01991740914341862, 0.034025573953340146], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 263.5, 243, 284, 263.5, 284.0, 284.0, 284.0, 0.02695635765695339, 0.020217268242715043, 0.02390270776612664], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.026404731727925644, 0.017224961713138996, 0.019390974862695396], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 266.5, 248, 285, 266.5, 285.0, 285.0, 285.0, 0.0268067767531632, 0.0201050825648724, 0.02065483091625563], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 263.5, 242, 285, 263.5, 285.0, 285.0, 285.0, 0.02675477907241181, 0.020066084304308857, 0.020275106015812075], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 564.0, 281, 847, 564.0, 847.0, 847.0, 847.0, 0.02678344247586142, 0.017472011302612726, 0.019669090568210732], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 261.0, 240, 282, 261.0, 282.0, 282.0, 282.0, 0.026895819044929468, 0.017545319455090705, 0.020775969594276567], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 261.5, 240, 283, 261.5, 283.0, 283.0, 283.0, 0.026827632461435276, 0.01750083836351442, 0.02211183769282361], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 263.75, 242, 286, 263.5, 286.0, 286.0, 286.0, 0.052776714913380214, 0.03958253618503516, 0.04164412661133908], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 264.0, 243, 285, 264.0, 285.0, 285.0, 285.0, 0.07891206565483863, 0.059184049241128966, 0.06450136616513664], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1054.0, 1052, 1056, 1054.0, 1056.0, 1056.0, 1056.0, 0.026547732823616863, 0.04539558610757141, 0.019055257446639058], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1914.25, 615, 2823, 2109.5, 2823.0, 2823.0, 2823.0, 0.03504621719893109, 0.016085666097165635, 0.0436366473912472], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 260.5, 240, 281, 260.5, 281.0, 281.0, 281.0, 0.026830871600863955, 0.017502951395876095, 0.01941569907835956], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 84, 100.0, 37.5], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 84, "401/Unauthorized", 84, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, "401/Unauthorized", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, "401/Unauthorized", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
