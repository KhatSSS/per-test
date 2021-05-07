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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5133928571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.25, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.25, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 450.3303571428569, 1, 2423, 274.5, 1092.0, 1152.5, 2021.75, 1.3952995845246328, 0.8309349188514941, 1.0671204699481123], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 268.0, 250, 286, 268.0, 286.0, 286.0, 286.0, 0.026711185308848077, 0.02003338898163606, 0.023111435726210352], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1289.5, 1007, 1572, 1289.5, 1572.0, 1572.0, 1572.0, 0.026185550813061353, 0.006955536934719422, 0.022937928788394565], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1005.5, 1001, 1010, 1005.5, 1010.0, 1010.0, 1010.0, 0.02637722063226198, 0.01720701502182715, 0.018572242261582897], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.5, 247, 280, 263.5, 280.0, 280.0, 280.0, 0.026961081678596944, 0.017192955406370905, 0.019430935819145064], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 253.5, 247, 260, 253.5, 260.0, 260.0, 260.0, 0.0264385897656219, 0.01724704879241741, 0.019415839359128582], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 269.0, 252, 286, 269.0, 286.0, 286.0, 286.0, 0.026781649213958595, 0.016476991215619057, 0.03049551072605051], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 257.5, 248, 267, 257.5, 267.0, 267.0, 267.0, 0.026392536190765252, 0.00701051742567202, 0.021186196043758827], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 265.5, 257, 274, 265.5, 274.0, 274.0, 274.0, 0.026262228350075502, 0.019696671262556628, 0.025544120543628125], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 884.5, 879, 890, 884.5, 890.0, 890.0, 890.0, 0.026756210785428565, 0.04585659172697963, 0.017428117767461775], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1029.0, 1010, 1048, 1029.0, 1048.0, 1048.0, 1048.0, 0.026157467957101752, 0.0170636607376406, 0.02112522070363589], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 252.5, 252, 253, 252.5, 253.0, 253.0, 253.0, 0.026779139050679523, 0.02008435428800964, 0.022254929035281514], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 6.5, 1, 21, 2.0, 21.0, 21.0, 21.0, 0.036499680627794504, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1049.5, 1008, 1091, 1049.5, 1091.0, 1091.0, 1091.0, 0.026066443364135182, 0.006923899018598407, 0.02283359345471607], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 252.5, 247, 258, 252.5, 258.0, 258.0, 258.0, 0.026442784425199976, 0.007023864612943742, 0.021226532028822635], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1034.5, 999, 1070, 1034.5, 1070.0, 1070.0, 1070.0, 0.02602641681306526, 0.01697817034289804, 0.0188335691977357], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 266.0, 249, 283, 266.0, 283.0, 283.0, 283.0, 0.02669977438690643, 0.020024830790179825, 0.02007697878702925], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1050.5, 1010, 1091, 1050.5, 1091.0, 1091.0, 1091.0, 0.02615678376186864, 0.017063214407156496, 0.021124668135806022], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 269.5, 250, 289, 269.5, 289.0, 289.0, 289.0, 0.02643824027072758, 0.017246820801607447, 0.02124870287383672], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.0, 247, 283, 265.0, 283.0, 283.0, 283.0, 0.026725462684572727, 0.017434188548139242, 0.019626511658983097], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1096.0, 1050, 1142, 1096.0, 1142.0, 1142.0, 1142.0, 0.026673779674579887, 0.016671112296612427, 0.01867685549479861], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 268.0, 250, 286, 268.0, 286.0, 286.0, 286.0, 0.026670934016109243, 0.020003200512081935, 0.020524117192084065], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 281.0, 280, 282, 281.0, 282.0, 282.0, 282.0, 0.02643789078507317, 0.00702256473978506, 0.02122260373567397], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 275.0, 261, 289, 275.0, 289.0, 289.0, 289.0, 0.026947640734053733, 0.02023704660594465, 0.03107926143253658], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 272.0, 255, 289, 272.0, 289.0, 289.0, 289.0, 0.026852125345721112, 0.014763424384415027, 0.019719529550763944], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.5, 247, 280, 263.5, 280.0, 280.0, 280.0, 0.026913915840185168, 0.01716287797230558, 0.01939694325200845], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 252, 269, 260.5, 269.0, 269.0, 269.0, 0.026270162349603318, 0.01713717622024904, 0.019292150475489937], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.5, 247, 280, 263.5, 280.0, 280.0, 280.0, 0.02674833825948563, 0.017057289925238396, 0.019277610972168353], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 263.5, 246, 281, 263.5, 281.0, 281.0, 281.0, 0.026688729349595666, 0.0174102257866503, 0.021267581200459046], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 264.5, 246, 283, 264.5, 283.0, 283.0, 283.0, 0.02663257696814744, 0.017373595131564928, 0.020364558365292426], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 256.5, 246, 267, 256.5, 267.0, 267.0, 267.0, 0.026320638012265418, 0.006991419472008001, 0.02112848090437712], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 999.5, 990, 1009, 999.5, 1009.0, 1009.0, 1009.0, 0.02648936452014516, 0.017280171386188446, 0.02136739755238272], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 260.5, 252, 269, 260.5, 269.0, 269.0, 269.0, 0.02627602969191355, 0.006979570386914538, 0.02109267227221967], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 266.5, 247, 286, 266.5, 286.0, 286.0, 286.0, 0.026738682852482685, 0.0071024626326907135, 0.021464059867910907], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 279.5, 279, 280, 279.5, 280.0, 280.0, 280.0, 0.0264385897656219, 0.01724704879241741, 0.019415839359128582], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 263.0, 246, 280, 263.0, 280.0, 280.0, 280.0, 0.02664251079021687, 0.007076916928651356, 0.021386859247615495], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1101.0, 1093, 1109, 1101.0, 1109.0, 1109.0, 1109.0, 0.02615131148827114, 0.017059644603676875, 0.018872870302570677], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 272.5, 256, 289, 272.5, 289.0, 289.0, 289.0, 0.026946188461642102, 0.014815140726469242, 0.01978860715151842], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 262.5, 253, 272, 262.5, 272.0, 272.0, 272.0, 0.026404731727925644, 0.019803548795944235, 0.026636804565378116], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 281.5, 278, 285, 281.5, 285.0, 285.0, 285.0, 0.026409264369940975, 0.019806948277455733, 0.026692957639539952], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 264.5, 246, 283, 264.5, 283.0, 283.0, 283.0, 0.02664535038635758, 0.01738192779110045, 0.021441180389022114], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 264.5, 247, 282, 264.5, 282.0, 282.0, 282.0, 0.026795284030010715, 0.017087227023043945, 0.02007029575294748], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1066.5, 999, 1134, 1066.5, 1134.0, 1134.0, 1134.0, 0.026029804125723956, 0.016980380035140238, 0.01883602036832173], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 264.0, 247, 281, 264.0, 281.0, 281.0, 281.0, 0.026676981766282963, 0.01740256232409865, 0.021284271585012872], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 264.0, 248, 280, 264.0, 280.0, 280.0, 280.0, 0.026890394750994945, 0.01714787868398408, 0.019169910320533504], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.5, 247, 280, 263.5, 280.0, 280.0, 280.0, 0.026867275658248254, 0.017133135746910264, 0.019363329527135948], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.0, 246, 264, 255.0, 264.0, 264.0, 264.0, 0.026314404505026052, 0.017166037313825586, 0.019324640808378504], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1055.0, 1021, 1089, 1055.0, 1089.0, 1089.0, 1089.0, 0.026125690697947825, 0.017042931041239405, 0.01839513964181678], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.026413449728601806, 0.007016072584159855, 0.02120298405948309], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1362.5, 1156, 1569, 1362.5, 1569.0, 1569.0, 1569.0, 0.02631301968213872, 0.019734764761604042, 0.02107097279233765], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 262.0, 243, 281, 262.0, 281.0, 281.0, 281.0, 0.026509729070568897, 0.007041646784369864, 0.021280270796882456], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1142.0, 1112, 1172, 1142.0, 1172.0, 1172.0, 1172.0, 0.026101141924959218, 0.017026916802610113, 0.021028752039151714], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 269.0, 253, 285, 269.0, 285.0, 285.0, 285.0, 0.02687702417588325, 0.01652254562374854, 0.021995064706435703], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 263.5, 247, 280, 263.5, 280.0, 280.0, 280.0, 0.02684347569323276, 0.01711795862078222, 0.019136462164121012], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 246.5, 246, 247, 246.5, 247.0, 247.0, 247.0, 0.026647480480720548, 0.007078237002691395, 0.020584137754150345], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 266.5, 246, 287, 266.5, 287.0, 287.0, 287.0, 0.0266851683834125, 0.017407902812616748, 0.01957086079681913], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 264.5, 246, 283, 264.5, 283.0, 283.0, 283.0, 0.026699417952688632, 0.017417198430074225, 0.02164112978587067], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 270.0, 250, 290, 270.0, 290.0, 290.0, 290.0, 0.026464828243264703, 0.017264165299317208, 0.01915081809400307], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 0.026778063410454158, 0.007112923093401885, 0.021495671995501283], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 339.25, 1, 1350, 3.0, 1350.0, 1350.0, 1350.0, 0.03605650053634044, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 247, 268, 257.5, 268.0, 268.0, 268.0, 0.02639950368933064, 0.017221551234836784, 0.01938713552185219], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 274.0, 270, 278, 274.0, 278.0, 278.0, 278.0, 0.026325834858037935, 0.006992799884166326, 0.021132652591120293], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 635.0, 281, 989, 635.0, 989.0, 989.0, 989.0, 0.02626291807282707, 0.017132450461570786, 0.01928683045973238], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 265.5, 247, 284, 265.5, 284.0, 284.0, 284.0, 0.026770178021683844, 0.015894793200374784, 0.018456782893856247], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 258.5, 251, 266, 258.5, 266.0, 266.0, 266.0, 0.026414496275556025, 0.00701635057319457, 0.020404166556606266], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 274.0, 255, 293, 274.0, 293.0, 293.0, 293.0, 0.026804980365351883, 0.014737503853215927, 0.019684907455805287], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 267.0, 251, 283, 267.0, 283.0, 283.0, 283.0, 0.026664178010052397, 0.019998133507539297, 0.023383234231471726], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 253.5, 253, 254, 253.5, 254.0, 254.0, 254.0, 0.026779497616624712, 0.020084623212468535, 0.022464441848320926], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 264.0, 248, 280, 264.0, 280.0, 280.0, 280.0, 0.026937478113299034, 0.017177903523422137, 0.01920347560811357], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1518.5, 1014, 2023, 1518.5, 2023.0, 2023.0, 2023.0, 0.026159520757579723, 0.0170649998692024, 0.01915980524236796], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1347.5, 1094, 1601, 1347.5, 1601.0, 1601.0, 1601.0, 0.025977062254029692, 0.01694597420477718, 0.018797854619371095], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 44.0, 2, 168, 3.0, 168.0, 168.0, 168.0, 0.03650600980186363, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1154.0, 1118, 1190, 1154.0, 1190.0, 1190.0, 1190.0, 0.026205794101075746, 0.006960914058098245, 0.021880814410566177], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 908.5, 899, 918, 908.5, 918.0, 918.0, 918.0, 0.026753347512607516, 0.04679223183113287, 0.021841600117714726], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.0, 247, 279, 263.0, 279.0, 279.0, 279.0, 0.026821516220311935, 0.01710395516783564, 0.019330350557217], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 269.5, 250, 289, 269.5, 289.0, 289.0, 289.0, 0.02641135688345989, 0.017229283591944537, 0.019395840211290857], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 0.02677734636497523, 0.01746803454277681, 0.019664613736778684], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 269.5, 253, 286, 269.5, 286.0, 286.0, 286.0, 0.026923698239190136, 0.016551238321845886, 0.021770334123095147], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 257.5, 252, 263, 257.5, 263.0, 263.0, 263.0, 0.02643299895589654, 0.019824749216922406, 0.024238853534752785], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 250.5, 249, 252, 250.5, 252.0, 252.0, 252.0, 0.02675907467119787, 0.0200693060033984, 0.02252570543610602], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 258.0, 248, 268, 258.0, 268.0, 268.0, 268.0, 0.02641310089804543, 0.017230421288959324, 0.021409056391970417], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 271.5, 257, 286, 271.5, 286.0, 286.0, 286.0, 0.0268294318867798, 0.016440887215775704, 0.02384256154000939], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 274.0, 270, 278, 274.0, 278.0, 278.0, 278.0, 0.026333807341865488, 0.017178694633170066, 0.019056007070627275], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 272.5, 256, 289, 272.5, 289.0, 289.0, 289.0, 0.02689907467183129, 0.014789237343985366, 0.0197540079621261], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 371.5, 356, 387, 371.5, 387.0, 387.0, 387.0, 0.026720463867252738, 0.017978905863805794, 0.025728884153428902], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 273.0, 254, 292, 273.0, 292.0, 292.0, 292.0, 0.02642356982428326, 0.019817677368212445, 0.02515916072136346], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 279.0, 275, 283, 279.0, 283.0, 283.0, 283.0, 0.026329300562130568, 0.019746975421597927, 0.025352236674082755], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 259.0, 250, 268, 259.0, 268.0, 268.0, 268.0, 0.02630678978244285, 0.019730092336832136, 0.02255601702049299], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 0.02643684238354571, 0.019827631787659283, 0.023106419856712315], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 274.5, 255, 294, 274.5, 294.0, 294.0, 294.0, 0.026449778483105202, 0.019837333862328905, 0.025184115254909743], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 250.66666666666669, 249, 257, 249.5, 257.0, 257.0, 257.0, 0.07926442612555486, 0.051707652980342425, 0.05968053959258085], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 268.0, 249, 287, 268.0, 287.0, 287.0, 287.0, 0.026657425425852373, 0.019993069069389278, 0.033712271412576975], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 266.0, 248, 284, 266.0, 284.0, 284.0, 284.0, 0.02627430373095113, 0.019705727798213345, 0.023092649763531266], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.5, 247, 280, 263.5, 280.0, 280.0, 280.0, 0.026653872807718963, 0.017387487339410417, 0.01957393784316861], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 269.5, 250, 289, 269.5, 289.0, 289.0, 289.0, 0.02639776146982736, 0.0070119053904228925, 0.021190390554880947], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 271.5, 269, 274, 271.5, 274.0, 274.0, 274.0, 0.026434396436643363, 0.007021636553483392, 0.02088420577855906], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 274.0, 270, 278, 274.0, 278.0, 278.0, 278.0, 0.026328260755094517, 0.01717507635195619, 0.01933481649202254], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1095.0, 1019, 1171, 1095.0, 1171.0, 1171.0, 1171.0, 0.026211976251949518, 0.01709921888310769, 0.020094141950957392], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1123.0, 1107, 1139, 1123.0, 1139.0, 1139.0, 1139.0, 0.02604946793961733, 0.016993207601234746, 0.02103799803326517], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 252.75, 252, 253, 253.0, 253.0, 253.0, 253.0, 0.053015944545322005, 0.03976195840899151, 0.04183289374279315], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 267.5, 250, 287, 267.0, 287.0, 287.0, 287.0, 0.07959882193743532, 0.059699116453076496, 0.06280844543500756], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1057.0, 1040, 1074, 1057.0, 1074.0, 1074.0, 1074.0, 0.0266588467382901, 0.04555955253125749, 0.01913501206312815], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1490.0, 527, 2423, 1505.0, 2423.0, 2423.0, 2423.0, 0.03528457005751385, 0.01619506633499171, 0.04393342463215835], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 1130.5, 1126, 1135, 1130.5, 1135.0, 1135.0, 1135.0, 0.02614276564317739, 0.0170540697750415, 0.018917763028900827], "isController": false}]}, function(index, item){
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
