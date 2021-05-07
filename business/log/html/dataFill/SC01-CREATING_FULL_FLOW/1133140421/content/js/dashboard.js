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

    var data = {"OkPercent": 95.53571428571429, "KoPercent": 4.464285714285714};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [0.75, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.75, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.875, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP Request"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 10, 4.464285714285714, 382.64732142857133, 0, 5053, 264.5, 830.5, 1104.5, 2096.75, 1.7106941294170657, 1.7087774145416639, 2.495234614253748], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 0, 0.0, 374.5, 332, 417, 374.5, 417.0, 417.0, 417.0, 0.031221217939711828, 0.019452282271031393, 0.08530953886261103], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 0, 0.0, 276.0, 266, 286, 276.0, 286.0, 286.0, 286.0, 0.032940788931894914, 0.0638549472947377, 0.08930041999505887], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 258.0, 251, 265, 258.0, 265.0, 265.0, 265.0, 0.032934279644968464, 0.021484471487147397, 0.023189077757834242], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 566.0, 264, 868, 566.0, 868.0, 868.0, 868.0, 0.03295164346321773, 0.021013108575665213, 0.02374835241782684], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 251, 264, 257.5, 264.0, 264.0, 264.0, 0.032234668385848986, 0.02102808445483117, 0.023672334595857845], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 892.0, 855, 929, 892.0, 929.0, 929.0, 929.0, 0.03271662495296985, 0.02578351204789714, 0.037221550849814336], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 258, 273, 265.5, 273.0, 273.0, 273.0, 0.03301637612255679, 0.018152558356444796, 0.08653901710248284], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 0, 0.0, 266.0, 259, 273, 266.0, 273.0, 273.0, 273.0, 0.03193663771078181, 0.019648517341594278, 0.09041436789409811], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 904.5, 889, 920, 904.5, 920.0, 920.0, 920.0, 0.03284503711489194, 0.056340144230769225, 0.021394179448860275], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 414.0, 265, 563, 414.0, 563.0, 563.0, 563.0, 0.03222012791390782, 0.021018599068838302, 0.02655643355404121], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 0, 0.0, 425.0, 270, 580, 425.0, 580.0, 580.0, 580.0, 0.031155074382740088, 0.018680874678713297, 0.08354671313965263], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.5, 0, 24, 3.0, 24.0, 24.0, 24.0, 0.04759694903556682, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 0, 0.0, 275.5, 270, 281, 275.5, 281.0, 281.0, 281.0, 0.031967776481306845, 0.06196878546425203, 0.08666264405479276], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 0, 0.0, 264.5, 257, 272, 264.5, 272.0, 272.0, 272.0, 0.03223882521720908, 0.01772505722391476, 0.08450098328416912], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 257.0, 250, 264, 257.0, 264.0, 264.0, 264.0, 0.03196266760423825, 0.020850646444952294, 0.023129235053457563], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 263.5, 256, 271, 263.5, 271.0, 271.0, 271.0, 0.03286338690065398, 0.021694970258634858, 0.08655522897564824], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 258.0, 251, 265, 258.0, 265.0, 265.0, 265.0, 0.032960332240148986, 0.021501466734784685, 0.027166523838560292], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 257.5, 250, 265, 257.5, 265.0, 265.0, 265.0, 0.03207132663042607, 0.020921529481567006, 0.026308510126521384], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 260, 263, 261.5, 263.0, 263.0, 263.0, 0.031298414735293656, 0.020417325237476722, 0.022984773321231278], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1118.5, 1071, 1166, 1118.5, 1166.0, 1166.0, 1166.0, 0.03274287024000524, 0.020464293900003275, 0.02292640425984742], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 270.0, 263, 277, 270.0, 277.0, 277.0, 277.0, 0.031236821965733207, 0.020346640870257858, 0.0818441341152951], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 0, 0.0, 265.0, 258, 272, 265.0, 272.0, 272.0, 272.0, 0.032280452571945055, 0.017747944138676825, 0.08461009248349662], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 286.5, 281, 292, 286.5, 292.0, 292.0, 292.0, 0.033224798989966116, 0.024431907851020004, 0.03825394336833012], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 264.0, 257, 271, 264.0, 271.0, 271.0, 271.0, 0.03301201637396012, 0.018150161346230025, 0.02482348887495048], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 261, 264, 262.5, 264.0, 264.0, 264.0, 0.03297554863069035, 0.021028352788907023, 0.023765580946728], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 251, 264, 257.5, 264.0, 264.0, 264.0, 0.031948371431766265, 0.020841320426191277, 0.023462085270203353], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.0, 259, 265, 262.0, 265.0, 265.0, 265.0, 0.03284287966368891, 0.020943750410535995, 0.023669966007619548], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 258.0, 251, 265, 258.0, 265.0, 265.0, 265.0, 0.03287473083814126, 0.021445625195193715, 0.027128073787333364], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 257.0, 250, 264, 257.0, 264.0, 264.0, 264.0, 0.031188597448772726, 0.020345686616972832, 0.02384831230702055], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 264.5, 258, 271, 264.5, 271.0, 271.0, 271.0, 0.03196726552010741, 0.01757575242951218, 0.08378919985934404], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 257.5, 251, 264, 257.5, 264.0, 264.0, 264.0, 0.03131213501792619, 0.020426275578100294, 0.025777470527452915], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 0, 0.0, 264.0, 257, 271, 264.0, 271.0, 271.0, 271.0, 0.031951944275809184, 0.017567328737578682, 0.08374904144167172], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 0, 0.0, 264.5, 258, 271, 264.5, 271.0, 271.0, 271.0, 0.031302333588969056, 0.017210169736903886, 0.08204635093046186], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 251, 264, 257.5, 264.0, 264.0, 264.0, 0.0322768058872894, 0.02105557259053644, 0.023703279323478148], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 265.0, 259, 271, 265.0, 271.0, 271.0, 271.0, 0.032923436548306914, 0.018101459742867962, 0.08629541376528882], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 257.5, 251, 264, 257.5, 264.0, 264.0, 264.0, 0.032291397571686906, 0.021065091384655128, 0.02330404570847326], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 264.5, 257, 272, 264.5, 272.0, 272.0, 272.0, 0.03295381522795802, 0.0181181620833402, 0.024779724341335616], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 0, 0.0, 427.0, 393, 461, 427.0, 461.0, 461.0, 461.0, 0.0328974422238671, 0.023420151739452257, 0.09454801998519614], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 1916.5, 1556, 2277, 1916.5, 2277.0, 2277.0, 2277.0, 0.03110032966349443, 0.023720075651551903, 0.0895045620296075], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 257.5, 251, 264, 257.5, 264.0, 264.0, 264.0, 0.031194921466785205, 0.020349812050598163, 0.02562004780621715], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 263.5, 258, 269, 263.5, 269.0, 269.0, 269.0, 0.03303328103063837, 0.021065168469733254, 0.02354911635973243], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 257.0, 251, 263, 257.0, 263.0, 263.0, 263.0, 0.03202100577979155, 0.020888702989160887, 0.02317145047150931], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 261.0, 252, 270, 261.0, 270.0, 270.0, 270.0, 0.03288229781497131, 0.02145056146523519, 0.026781090212584055], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 257.5, 250, 265, 257.5, 265.0, 265.0, 265.0, 0.03299241174529858, 0.02103910631804685, 0.023519981029363247], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 251, 265, 258.0, 265.0, 265.0, 265.0, 0.03300765777660417, 0.021048828640744654, 0.02378872210852918], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.0, 250, 264, 257.0, 264.0, 264.0, 264.0, 0.031964200095892605, 0.02085164615630494, 0.02347370944542113], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 258.0, 251, 265, 258.0, 265.0, 265.0, 265.0, 0.033028916816673, 0.021546207454626525, 0.023255711938301983], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 0, 0.0, 264.0, 257, 271, 264.0, 271.0, 271.0, 271.0, 0.03174149724642511, 0.01745162397435287, 0.08319744004824707], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 267.5, 265, 270, 267.5, 270.0, 270.0, 270.0, 0.031178873195522715, 0.022013989570666914, 0.0826666413338322], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 259, 272, 265.5, 272.0, 272.0, 272.0, 0.03203434081335191, 0.017612630740153446, 0.08396501049124662], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 260.0, 255, 265, 260.0, 265.0, 265.0, 265.0, 0.03210530540171763, 0.020943695320651736, 0.026399089011959226], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 296.0, 289, 303, 296.0, 303.0, 303.0, 303.0, 0.03297935492381769, 0.0225444809049535, 0.028148394729899082], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 258.5, 253, 264, 258.5, 264.0, 264.0, 264.0, 0.033022372657475436, 0.021058212251300258, 0.023541339882770577], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 270.5, 264, 277, 270.5, 277.0, 277.0, 277.0, 0.03293482198728716, 0.025119234347725852, 0.08532820579323519], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 261.0, 255, 267, 261.0, 267.0, 267.0, 267.0, 0.031247558784469963, 0.020384149675806578, 0.022916910788219672], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 258.5, 253, 264, 258.5, 264.0, 264.0, 264.0, 0.03125439514931787, 0.02038860933568783, 0.025852024112765857], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 257.5, 250, 265, 257.5, 265.0, 265.0, 265.0, 0.0320589885389116, 0.020913480804680612, 0.023198936042317864], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 0, 0.0, 264.0, 257, 271, 264.0, 271.0, 271.0, 271.0, 0.03117595710188303, 0.017140687351914204, 0.08171510631001372], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 361.0, 1, 1436, 3.5, 1436.0, 1436.0, 1436.0, 0.046796214186272334, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.0, 250, 266, 258.0, 266.0, 266.0, 266.0, 0.03301201637396012, 0.021535182556450545, 0.024243199524626963], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 0, 0.0, 267.5, 258, 277, 267.5, 277.0, 277.0, 277.0, 0.03200768184364247, 0.017597973513643273, 0.08389513483235976], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.0, 255, 265, 260.0, 265.0, 265.0, 265.0, 0.03203126251221192, 0.020895393904450745, 0.023522958407405627], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 260.5, 255, 266, 260.5, 266.0, 266.0, 266.0, 0.03308136361380816, 0.019642059645698595, 0.021612726814099276], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 0, 0.0, 888.5, 277, 1500, 888.5, 1500.0, 1500.0, 1500.0, 0.03236926861637561, 0.25171531835175687, 0.08386295863207471], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 261, 270, 265.5, 270.0, 270.0, 270.0, 0.03302673514209752, 0.0181582537939462, 0.024834556698647554], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 619.5, 593, 646, 619.5, 646.0, 646.0, 646.0, 0.03270913402567668, 0.023605517622045956, 0.08975846348842914], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 0, 0.0, 273.5, 268, 279, 273.5, 279.0, 279.0, 279.0, 0.031750063500127, 0.0216731390494031, 0.08563835487045975], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 258.0, 251, 265, 258.0, 265.0, 265.0, 265.0, 0.03296685183048445, 0.021022806880181977, 0.02350175960571645], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 257.0, 250, 264, 257.0, 264.0, 264.0, 264.0, 0.031752079761224364, 0.020713270781736202, 0.0232559177938655], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 258.0, 252, 264, 258.0, 264.0, 264.0, 264.0, 0.031934088042280734, 0.02083200274633157, 0.023108553944658227], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 35.25, 2, 132, 3.5, 132.0, 132.0, 132.0, 0.04760884572353544, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 0.032039985902406205, 0.018961163532088047, 0.08520007969946494], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 922.0, 917, 927, 922.0, 927.0, 927.0, 927.0, 0.03282509149994255, 0.05745993800160843, 0.026798609857374978], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 260, 265, 262.5, 265.0, 265.0, 265.0, 0.033024008454146166, 0.02105925539116938, 0.023800506092929562], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.0, 250, 264, 257.0, 264.0, 264.0, 264.0, 0.03209242618741977, 0.020935293645699616, 0.02356787548138639], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 257, 264, 260.5, 264.0, 264.0, 264.0, 0.031172555681977583, 0.020335221870665065, 0.022892345578952287], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 279.5, 274, 285, 279.5, 285.0, 285.0, 285.0, 0.032961961895972045, 0.022242886396598324, 0.027811655349726416], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 264.0, 257, 271, 264.0, 271.0, 271.0, 271.0, 0.03222428099573028, 0.02401086562474825, 0.08971818859260453], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 0, 0.0, 1173.0, 1160, 1186, 1173.0, 1186.0, 1186.0, 1186.0, 0.03086705559156712, 0.01923162252677717, 0.08361837129981171], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 258.5, 253, 264, 258.5, 264.0, 264.0, 264.0, 0.03296685183048445, 0.02150571974879259, 0.027268479980879227], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 537.0, 536, 538, 537.0, 538.0, 538.0, 538.0, 0.032873650125741706, 0.022119086852183632, 0.03036960255756998], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 257.5, 251, 264, 257.5, 264.0, 264.0, 264.0, 0.03198976327575176, 0.020868322136916185, 0.023148842370441458], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 264.0, 256, 272, 264.0, 272.0, 272.0, 272.0, 0.03297989875171083, 0.018132502926966013, 0.024799337928532558], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 735.0, 492, 978, 735.0, 978.0, 978.0, 978.0, 0.0326963004136082, 0.15144389927904658, 0.03020576190554039], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 0, 0.0, 693.5, 680, 707, 693.5, 707.0, 707.0, 707.0, 0.031858801790464665, 0.020005087452410916, 0.08982066481354636], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 0, 0.0, 268.0, 260, 276, 268.0, 276.0, 276.0, 276.0, 0.03199181009661527, 0.019682461289909782, 0.09025814391515773], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 267.5, 262, 273, 267.5, 273.0, 273.0, 273.0, 0.03195245474733597, 0.019658248526193023, 0.08677712563705206], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 0, 0.0, 278.5, 260, 297, 278.5, 297.0, 297.0, 297.0, 0.032252342326361455, 0.019842749673445032, 0.08815850212059151], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 0, 0.0, 267.5, 263, 272, 267.5, 272.0, 272.0, 272.0, 0.032060016350608345, 0.0197244241219563, 0.09010617876665117], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 372.8333333333333, 251, 937, 264.5, 937.0, 937.0, 937.0, 0.09195261375304593, 0.05998471287796355, 0.06923385273788907], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 0, 0.0, 632.0, 590, 674, 632.0, 674.0, 674.0, 674.0, 0.031037104858858765, 0.018791997082512144, 0.09720312039292976], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 0, 0.0, 267.5, 262, 273, 267.5, 273.0, 273.0, 273.0, 0.03202203115743632, 0.019701054325375857, 0.08765405599052148], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 259.0, 254, 264, 259.0, 264.0, 264.0, 264.0, 0.03292018501143976, 0.021475276941056408, 0.024175760867776078], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 0, 0.0, 265.0, 257, 273, 265.0, 273.0, 273.0, 273.0, 0.03209603132572657, 0.01764654847303131, 0.08412670710766613], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 0, 0.0, 1158.5, 806, 1511, 1158.5, 1511.0, 1511.0, 1511.0, 0.0316540841682098, 0.9101785686023139, 0.08256646368485193], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.0, 250, 264, 257.0, 264.0, 264.0, 264.0, 0.032004608663647564, 0.02087800643292634, 0.02350338448736618], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 258.5, 253, 264, 258.5, 264.0, 264.0, 264.0, 0.032051795701854194, 0.020908788602381448, 0.024758760156412762], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 257.5, 251, 264, 257.5, 264.0, 264.0, 264.0, 0.03198311291638015, 0.020863983816544866, 0.026361081349047702], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 0, 0.0, 330.0, 265, 509, 273.0, 509.0, 509.0, 509.0, 0.06155171883174838, 0.03774851506478318, 0.16247489843966392], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 266.83333333333337, 259, 273, 268.5, 273.0, 273.0, 273.0, 0.09768804949527841, 0.05370934752523608, 0.2592930845001628], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1103.0, 1100, 1106, 1103.0, 1106.0, 1106.0, 1106.0, 0.032695765898316166, 0.05592444723720778, 0.02346815228052967], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1853.0, 550, 5053, 904.5, 5053.0, 5053.0, 5053.0, 0.04418180814049815, 0.020278759595736457, 0.05501152869056166], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 257.5, 251, 264, 257.5, 264.0, 264.0, 264.0, 0.03224974200206398, 0.021037917634158926, 0.023336971507352942], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2, 20.0, 0.8928571428571429], "isController": false}, {"data": ["500/Internal Server Error", 6, 60.0, 2.6785714285714284], "isController": false}, {"data": ["403/Forbidden", 2, 20.0, 0.8928571428571429], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 10, "500/Internal Server Error", 6, "400/Bad Request", 2, "403/Forbidden", 2, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, "403/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
