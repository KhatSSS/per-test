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

    var data = {"OkPercent": 95.41284403669725, "KoPercent": 4.587155963302752};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8761467889908257, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.0, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 109, 5, 4.587155963302752, 373.47706422018337, 26, 2344, 253.0, 750.0, 1380.0, 2340.0, 2.3792373343810707, 6.6917542168707564, 3.6563379935826075], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 1, 1, 100.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.5221456692913384, 10.753721702755906], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 2.973354928861789], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 3.028529858299595], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0964176829268295], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.425905257936508, 4.483661954365079], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 10.465366633858267], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.4126838235294117, 11.217064950980392], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.4060594512195124], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 1810.0, 1810, 1810, 1810.0, 1810.0, 1810.0, 1810.0, 0.5524861878453039, 0.951204247237569, 0.3749784185082873], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.3941501524390243], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.3606668307086616, 10.703740157480315], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1, 1, 100.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.5421626984126986, 10.839068700396826], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.173141057312253, 10.506731719367588], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0527502540650406], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 7.227847450657895, 8.862947162828947], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.3941501524390243], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.3645938765182186], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 1, 0, 0.0, 1083.0, 1083, 1083, 1083.0, 1083.0, 1083.0, 1083.0, 0.9233610341643582, 0.577100646352724, 0.6717812211449677], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.173141057312253, 10.506731719367588], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.524679021317829, 10.579427083333334], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 2.753412680505415, 4.269376128158845], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 2.9871323529411766], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 3.028529858299595], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0964176829268295], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.592257367886179, 3.040840955284553], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.546463815789474], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0924479166666665], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 2.662627551020408, 3.1050701530612246], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.147674560546875, 10.38360595703125], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 10.465366633858267], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.0838815789473686], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.173141057312253, 10.506731719367588], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 2.662627551020408, 3.057238520408163], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.3901803861788617], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 2.9871323529411766], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.5926776960784315, 11.358762254901961], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.925857843137255, 11.36642156862745], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.3822408536585367], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 2.996900303643725], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 2.662627551020408, 3.0652104591836737], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.3544524898373984], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 2.571352066532258, 2.9848160282258065], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 3.028529858299595], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0964176829268295], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 2.973354928861789], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1, 0, 0.0, 1155.0, 1155, 1155, 1155.0, 1155.0, 1155.0, 1155.0, 0.8658008658008658, 0.47602137445887444, 2.301474567099567], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5745738636363638, 10.881145009881422], "isController": false}, {"data": ["ST14-090-GET-id", 1, 0, 0.0, 1503.0, 1503, 1503, 1503.0, 1503.0, 1503.0, 1503.0, 0.6653359946773121, 65.5843261393879, 1.7679484780439123], "isController": false}, {"data": ["eProtect/paypage", 1, 0, 0.0, 2304.0, 2304, 2304, 2304.0, 2304.0, 2304.0, 2304.0, 0.43402777777777773, 0.19921196831597224, 0.5366007486979167], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.1065313697318007, 10.184686302681992], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.386210619918699], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1, 0, 0.0, 1257.0, 1257, 1257, 1257.0, 1257.0, 1257.0, 1257.0, 0.7955449482895784, 78.41944485879078, 2.1139431682577565], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.427896492094862, 3.342700098814229], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 2.996900303643725], "isController": false}, {"data": ["ST06-030-GET-suffixes", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.9110508110687023, 10.030265982824426], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 1, 0, 0.0, 869.0, 869, 869, 869.0, 869.0, 869.0, 869.0, 1.1507479861910241, 0.7506832566168009, 0.8641847669735327], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.173141057312253, 10.506731719367588], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 1, 0, 0.0, 902.0, 902, 902, 902.0, 902.0, 902.0, 902.0, 1.1086474501108647, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.0838815789473686], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.173141057312253, 10.506731719367588], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0964176829268295], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.4136178861788617, 2.7669270833333335], "isController": false}, {"data": ["ST07-030-GET-core/products", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 30.10376447876448, 10.14644666988417], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.173141057312253, 3.01074604743083], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.6028850885826773, 10.884442667322835], "isController": false}, {"data": ["ST14-060-POST-middesk", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.656711368110236, 10.734498031496063], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.592257367886179, 3.009082825203252], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.088478150406504], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0527502540650406], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.5072854662698414, 10.676308283730158], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 1, 0, 0.0, 1881.0, 1881, 1881, 1881.0, 1881.0, 1881.0, 1881.0, 0.531632110579479, 0.9049167663476874, 0.4485645933014354], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.592257367886179, 3.040840955284553], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0964176829268295], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0964176829268295], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.369488856589147, 3.2400678294573644], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.5926776960784315, 11.006433823529411], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.173141057312253, 10.506731719367588], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.5847904265873014, 10.916573660714286], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.3922697368421053], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 2.3304332386363633, 3.4697561553030303], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0527502540650406], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 2.998892716535433], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 9.718733689979123, 1.993900052192067], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.90679931640625, 11.0931396484375], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.4221825787401574, 11.222779281496063], "isController": false}, {"data": ["ST10-010-PUT-businesses", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 2.2291100543478257, 9.946076766304348], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.4317564229249014, 10.91588438735178], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 1.1499707943925233, 5.308119158878505], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 3, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 2.4019215372297835, 1.5668785028022416, 1.8741555744595675], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 1, 100.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.8793092757936507, 12.675936259920634], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.4221825787401574, 10.892132135826772], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0964176829268295], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 10.465366633858267], "isController": false}, {"data": ["ST09-010-GET-industries", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 38.338541666666664, 3.52734375], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0964176829268295], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.0838815789473686], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.2274199695121952], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.3941501524390243], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 2, 0, 0.0, 253.5, 253, 254, 253.5, 254.0, 254.0, 254.0, 1.9821605550049552, 1.2156219028741329, 5.3057637512388505], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 3, 0, 0.0, 253.66666666666666, 253, 255, 253.0, 255.0, 255.0, 255.0, 3.926701570680628, 2.158918929973822, 10.522333115183246], "isController": false}, {"data": ["AF-010-GET-Welcome", 1, 0, 0.0, 2344.0, 2344, 2344, 2344.0, 2344.0, 2344.0, 2344.0, 0.42662116040955633, 0.7282556527303755, 0.317882759172355], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.0527502540650406], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 20.0, 0.9174311926605505], "isController": false}, {"data": ["406/Not Acceptable", 2, 40.0, 1.834862385321101], "isController": false}, {"data": ["500/Internal Server Error", 2, 40.0, 1.834862385321101], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 109, 5, "406/Not Acceptable", 2, "500/Internal Server Error", 2, "400/Bad Request", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 1, 1, "406/Not Acceptable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1, 1, "406/Not Acceptable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 1, "400/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
