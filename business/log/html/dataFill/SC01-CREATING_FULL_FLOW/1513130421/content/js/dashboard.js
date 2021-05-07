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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5133928571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 441.64732142857133, 0, 2878, 273.5, 1066.0, 1147.5, 1420.75, 1.4108547638392885, 0.8445593519515774, 1.0871484279046917], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 260.0, 245, 275, 260.0, 275.0, 275.0, 275.0, 0.026910294533173666, 0.02018272089988025, 0.023730464808062325], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1095.5, 1085, 1106, 1095.5, 1106.0, 1106.0, 1106.0, 0.02643789078507317, 0.00702256473978506, 0.023597882985895383], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 990.5, 979, 1002, 990.5, 1002.0, 1002.0, 1002.0, 0.026472184352291827, 0.017268964011065372, 0.018639106365236725], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 245, 276, 260.5, 276.0, 276.0, 276.0, 0.026827632461435276, 0.017107855466130115, 0.019334758551307847], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 266.0, 240, 292, 266.0, 292.0, 292.0, 292.0, 0.026753347512607516, 0.017452379041427556, 0.01964698957957114], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 1032.0, 740, 1324, 1032.0, 1324.0, 1324.0, 1324.0, 0.02647849284418731, 0.020867327856698398, 0.031081199608118306], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 259.5, 239, 280, 259.5, 280.0, 280.0, 280.0, 0.026843835984162137, 0.007130393933293068, 0.021548469901348902], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 246.0, 243, 249, 246.0, 249.0, 249.0, 249.0, 0.02672510556416698, 0.020043829173125235, 0.02620313084611684], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 885.5, 884, 887, 885.5, 887.0, 887.0, 887.0, 0.026667022226963023, 0.04570373438312511, 0.017370023266976894], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1082.5, 980, 1185, 1082.5, 1185.0, 1185.0, 1185.0, 0.02652906922760615, 0.0173060725039462, 0.021865756277441008], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 247.5, 247, 248, 247.5, 248.0, 248.0, 248.0, 0.026808932736387764, 0.020106699552290823, 0.022279689217447253], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 14.000000000000002, 1, 50, 2.5, 50.0, 50.0, 50.0, 0.03675085675434809, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 979.0, 978, 980, 979.0, 980.0, 980.0, 980.0, 0.026480245736680435, 0.007033815273805741, 0.023635688089185466], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 265.5, 239, 292, 265.5, 292.0, 292.0, 292.0, 0.02673510854454069, 0.00710151320714362, 0.021461190648059028], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1092.5, 1075, 1110, 1092.5, 1110.0, 1110.0, 1110.0, 0.026428108936665036, 0.01724021168915258, 0.019124246798895305], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 266.0, 251, 281, 266.0, 281.0, 281.0, 281.0, 0.02678667095253402, 0.020090003214400513, 0.02014232093110468], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1054.5, 970, 1139, 1054.5, 1139.0, 1139.0, 1139.0, 0.026478142293536684, 0.01727285063679932, 0.02182378134350094], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 263.0, 244, 282, 263.0, 282.0, 282.0, 282.0, 0.026652096853719966, 0.017386328806918885, 0.02186304820031716], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.0, 238, 270, 254.0, 270.0, 270.0, 270.0, 0.026923698239190136, 0.017563506273221688, 0.019772090894405254], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1106.0, 1010, 1202, 1106.0, 1202.0, 1202.0, 1202.0, 0.026556545524558165, 0.01659784095284885, 0.01859476869248848], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 260.0, 242, 278, 260.0, 278.0, 278.0, 278.0, 0.02687485722732098, 0.020156142920490734, 0.02068104247571185], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 242.0, 241, 243, 242.0, 243.0, 243.0, 243.0, 0.026727605607451656, 0.007099520239479347, 0.021455167782544204], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 288.0, 275, 301, 288.0, 301.0, 301.0, 301.0, 0.026810729654007534, 0.019715311942839524, 0.03092135910291299], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 270.0, 255, 285, 270.0, 285.0, 285.0, 285.0, 0.02672153488496379, 0.014691625136947866, 0.020093341661545038], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.0, 245, 275, 260.0, 275.0, 275.0, 275.0, 0.026781290590393553, 0.017078303472194325, 0.019301359820029725], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 242.0, 240, 244, 242.0, 244.0, 244.0, 244.0, 0.02672474845330518, 0.0174337226238358, 0.01962598714539599], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.0, 246, 276, 261.0, 276.0, 276.0, 276.0, 0.026831231553528307, 0.01711015059028709, 0.019337352428226453], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 260.0, 245, 275, 260.0, 275.0, 275.0, 275.0, 0.026778421947594628, 0.017468736192376183, 0.02133905498948947], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 254.0, 238, 270, 254.0, 270.0, 270.0, 270.0, 0.02684131415074082, 0.017509763528022332, 0.020524168925810608], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 268.0, 265, 271, 268.0, 271.0, 271.0, 271.0, 0.026731177909354576, 0.0071004691321723086, 0.02145803539207955], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1048.0, 996, 1100, 1048.0, 1100.0, 1100.0, 1100.0, 0.02663754295303801, 0.017376834660770894, 0.021929149130284223], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 241.0, 238, 244, 241.0, 244.0, 244.0, 244.0, 0.02672367717797969, 0.007098476750400855, 0.02145201429716729], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 254.0, 238, 270, 254.0, 270.0, 270.0, 270.0, 0.026935301406022735, 0.007154689435974789, 0.021621892339600282], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 242.0, 241, 243, 242.0, 243.0, 243.0, 243.0, 0.026728319991446935, 0.017436052494420463, 0.019628609993718845], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 260.0, 245, 275, 260.0, 275.0, 275.0, 275.0, 0.026731892484328428, 0.007100658941149739, 0.02145860900597458], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1152.5, 1150, 1155, 1152.5, 1155.0, 1155.0, 1155.0, 0.02640717218796625, 0.01722655373199361, 0.019057519772370177], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 270.5, 255, 286, 270.5, 286.0, 286.0, 286.0, 0.02681324574339724, 0.014742048196809222, 0.0201623039281405], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 265.0, 243, 287, 265.0, 287.0, 287.0, 287.0, 0.026810729654007534, 0.02010804724050565, 0.027491470836628822], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 272.5, 249, 296, 272.5, 296.0, 296.0, 296.0, 0.02677340330116063, 0.020080052475870473, 0.02750548854767674], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 255.0, 239, 271, 255.0, 271.0, 271.0, 271.0, 0.02685248586887931, 0.01751705132852674, 0.02205365294504639], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 261.0, 245, 277, 261.0, 277.0, 277.0, 277.0, 0.02665280720691907, 0.016996370220818506, 0.019963577273151293], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1104.0, 1009, 1199, 1104.0, 1199.0, 1199.0, 1199.0, 0.02635393332454869, 0.017191823692186057, 0.019070570892080644], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 261.0, 246, 276, 261.0, 276.0, 276.0, 276.0, 0.026767311758880058, 0.01746148853020691, 0.021800720709869107], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 261.0, 246, 276, 261.0, 276.0, 276.0, 276.0, 0.02675835864228088, 0.017063679876376383, 0.019075783016469772], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 246, 275, 260.5, 275.0, 275.0, 275.0, 0.026735465932332534, 0.0170490813025519, 0.019268333845763097], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.5, 266, 271, 268.5, 271.0, 271.0, 271.0, 0.026728677197765484, 0.01743628551572983, 0.01962887231710903], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 998.5, 989, 1008, 998.5, 1008.0, 1008.0, 1008.0, 0.026591147806895084, 0.017346569077154216, 0.01872286871950328], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 267.5, 244, 291, 267.5, 291.0, 291.0, 291.0, 0.026792053476938738, 0.0071166392048118525, 0.021506902302776996], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1090.0, 1062, 1118, 1090.0, 1118.0, 1118.0, 1118.0, 0.02652730986550654, 0.019895482399129902, 0.021242572353237656], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 270.5, 245, 296, 270.5, 296.0, 296.0, 296.0, 0.02656712849191695, 0.00705689350566544, 0.021326347285503644], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1085.5, 989, 1182, 1085.5, 1182.0, 1182.0, 1182.0, 0.026443483664537967, 0.01725024129678844, 0.021743567622598603], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 304.0, 287, 321, 304.0, 321.0, 321.0, 321.0, 0.026731535192066083, 0.018273510385201423, 0.022815782966665775], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 263.5, 251, 276, 263.5, 276.0, 276.0, 276.0, 0.026713325942646488, 0.01703496273491031, 0.01904367962708197], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 242.5, 240, 245, 242.5, 245.0, 245.0, 245.0, 0.026741900546871866, 0.0071033173327628395, 0.020657073566968404], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 255.0, 239, 271, 255.0, 271.0, 271.0, 271.0, 0.026888948642108095, 0.017540837590750202, 0.019720312920139822], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 255.0, 239, 271, 255.0, 271.0, 271.0, 271.0, 0.02690088369402935, 0.01754862334727696, 0.022251023914885606], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 263.0, 244, 282, 263.0, 282.0, 282.0, 282.0, 0.026624422582835237, 0.017368275669271422, 0.019266305794805576], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 0.026810729654007534, 0.0071216000643457514, 0.021521894312103707], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 340.0, 0, 1354, 3.0, 1354.0, 1354.0, 1354.0, 0.0363002758820967, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 259.5, 238, 281, 259.5, 281.0, 281.0, 281.0, 0.02682835220260772, 0.017501307882169876, 0.01970207114879004], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 271.0, 262, 280, 271.0, 280.0, 280.0, 280.0, 0.02668338825664083, 0.00708777500567022, 0.021419672995076914], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 271.0, 245, 297, 271.0, 297.0, 297.0, 297.0, 0.026585138907350793, 0.017342649209092117, 0.019523461385085737], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 260.5, 245, 276, 260.5, 276.0, 276.0, 276.0, 0.026851043834329062, 0.01594280727663288, 0.01851253608109015], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 243.5, 243, 244, 243.5, 244.0, 244.0, 244.0, 0.026864388566516226, 0.0071358532129808736, 0.020751690777455405], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 269.5, 254, 285, 269.5, 285.0, 285.0, 285.0, 0.026660978991148554, 0.014658331222672495, 0.0200478064679535], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 265.0, 249, 281, 265.0, 281.0, 281.0, 281.0, 0.02675477907241181, 0.020066084304308857, 0.023906858253180473], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 247.5, 247, 248, 247.5, 248.0, 248.0, 248.0, 0.02680821403678087, 0.020106160527585654, 0.02269797028309474], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 261.0, 246, 276, 261.0, 276.0, 276.0, 276.0, 0.02680569889158435, 0.017093868531449785, 0.019109531436383373], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 988.5, 988, 989, 988.5, 989.0, 989.0, 989.0, 0.02654456168292521, 0.017316178910345745, 0.01944181763886124], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 984.5, 979, 990, 984.5, 990.0, 990.0, 990.0, 0.02646692957150041, 0.01726553608765847, 0.01915233868406426], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 64.75, 2, 251, 3.0, 251.0, 251.0, 251.0, 0.03676740936833591, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 986.5, 984, 989, 986.5, 989.0, 989.0, 989.0, 0.026308866087871613, 0.006988292554590898, 0.022121029005524862], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 912.5, 911, 914, 912.5, 914.0, 914.0, 914.0, 0.0266584913959719, 0.04662632625994695, 0.021764158991242687], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 245, 276, 260.5, 276.0, 276.0, 276.0, 0.026674846953065604, 0.017010424863624845, 0.01922464555797111], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.0, 244, 282, 263.0, 282.0, 282.0, 282.0, 0.026678761038337377, 0.0174037230211029, 0.019592215137529016], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 243.5, 243, 244, 243.5, 244.0, 244.0, 244.0, 0.026810729654007534, 0.01748981192273148, 0.019689129589661784], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 288.5, 269, 308, 288.5, 308.0, 308.0, 308.0, 0.02678344247586142, 0.018073592530097892, 0.022598529589008074], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 273.5, 246, 301, 273.5, 301.0, 301.0, 301.0, 0.026769461398436663, 0.020077096048827497, 0.02499180185244673], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 264.5, 253, 276, 264.5, 276.0, 276.0, 276.0, 0.02689545735725236, 0.020171593017939273, 0.023087018571313307], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 261.0, 241, 281, 261.0, 281.0, 281.0, 281.0, 0.0267970791183761, 0.017480907081128157, 0.022165162122328663], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 576.0, 534, 618, 576.0, 618.0, 618.0, 618.0, 0.02658337210075098, 0.017886663454509205, 0.02455846680401409], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 272.5, 262, 283, 272.5, 283.0, 283.0, 283.0, 0.026700843746662394, 0.017418128537861798, 0.019321606656520347], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 269.5, 254, 285, 269.5, 285.0, 285.0, 285.0, 0.026766595289079226, 0.014716399558351178, 0.020127224973233406], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 368.0, 354, 382, 368.0, 382.0, 382.0, 382.0, 0.026802106645582344, 0.018033839334771713, 0.02580749721928144], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 268.0, 250, 286, 268.0, 286.0, 286.0, 286.0, 0.026663467050620594, 0.019997600287965444, 0.0258302337052887], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 279.0, 272, 286, 279.0, 286.0, 286.0, 286.0, 0.026691935031830132, 0.0200189512738726, 0.025909944747694483], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 272.0, 269, 275, 272.0, 275.0, 275.0, 275.0, 0.02672510556416698, 0.020043829173125235, 0.02312348000962104], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 246.0, 245, 247, 246.0, 247.0, 247.0, 247.0, 0.026727605607451656, 0.020045704205588745, 0.023595464325328417], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 269.5, 250, 289, 269.5, 289.0, 289.0, 289.0, 0.026635769174424333, 0.01997682688081825, 0.025569297947713985], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 243.5, 243, 244, 243.5, 244.0, 244.0, 244.0, 0.07937767899666615, 0.05178153278298143, 0.059765811041435156], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 259.0, 243, 275, 259.0, 275.0, 275.0, 275.0, 0.02686258444924986, 0.020146938336937394, 0.03441768632560138], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 274.5, 248, 301, 274.5, 301.0, 301.0, 301.0, 0.026602466048602703, 0.01995184953645203, 0.02358890544153443], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 264.5, 245, 284, 264.5, 284.0, 284.0, 284.0, 0.026742258116275338, 0.01744514494303899, 0.0196388458041397], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 263.0, 244, 282, 263.0, 282.0, 282.0, 282.0, 0.02669300376371353, 0.007090329124736406, 0.02142739169313723], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 288.5, 285, 292, 288.5, 292.0, 292.0, 292.0, 0.026714039563492595, 0.00709591675905272, 0.021105134772329597], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 272.5, 264, 281, 272.5, 281.0, 281.0, 281.0, 0.026689085498485397, 0.01741045811815258, 0.01959979716295021], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1058.5, 981, 1136, 1058.5, 1136.0, 1136.0, 1136.0, 0.026311635004999213, 0.017164230647792454, 0.020324710243119506], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1104.0, 1068, 1140, 1104.0, 1140.0, 1140.0, 1140.0, 0.02642391893141672, 0.017237478365416378, 0.021779089431753624], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 248.0, 246, 251, 247.5, 251.0, 251.0, 251.0, 0.05308841876144719, 0.03981631407108539, 0.041890080428954424], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 263.83333333333337, 248, 280, 263.5, 280.0, 280.0, 280.0, 0.07985944737262418, 0.05989458552946813, 0.0639499480913592], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1100.5, 1064, 1137, 1100.5, 1137.0, 1137.0, 1137.0, 0.0265625415039711, 0.045394968390575614, 0.019065886724041758], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1558.25, 698, 2878, 1328.5, 2878.0, 2878.0, 2878.0, 0.035374125595832924, 0.01623617092777488, 0.04404493177215526], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 986.5, 981, 992, 986.5, 992.0, 992.0, 992.0, 0.02646868093328569, 0.017266678577573084, 0.019153606026918648], "isController": false}]}, function(index, item){
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
