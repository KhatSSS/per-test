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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8247863247863247, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-OPTIONS-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 117, 0, 0.0, 1761.7094017094016, 22, 70458, 304.0, 1668.6000000000001, 2842.0999999999976, 67983.3599999999, 0.5540612213971814, 1.9741668215591377, 0.8623539669836339], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 6.20881589456869, 8.779702476038338], "isController": false}, {"data": ["ST10-030-GET-customers/email", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 4.419098860062893, 8.460470715408805], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.46277882996633], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.1471222643097643, 2.518676346801347], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.189072986577181, 2.5561031879194633], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 1, 0, 0.0, 1868.0, 1868, 1868, 1868.0, 1868.0, 1868.0, 1868.0, 0.5353319057815846, 0.4218875468415417, 0.6236825816381156], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 1.7967473447712419, 8.686938316993464], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 1.6124636627906979, 6.063771802325582], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 2.5989790836653386, 3.404351344621514], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 1451.0, 1451, 1451, 1451.0, 1451.0, 1451.0, 1451.0, 0.6891798759476223, 1.1697213128876636, 0.4677539197105444], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.867213804713805], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 1.45169434470377, 4.907358056552962], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 6.149871439873418, 8.696350870253164], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.8085680509868423, 8.744089226973685], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 296.5, 296, 297, 296.5, 297.0, 297.0, 297.0, 0.6887052341597797, 0.4492725550964187, 0.5172014893250689], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 6.086869673295455, 7.654363458806818], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.867213804713805], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.189072986577181, 2.8444840604026846], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 1, 0, 0.0, 1255.0, 1255, 1255, 1255.0, 1255.0, 1255.0, 1255.0, 0.7968127490039841, 0.4980079681274901, 0.5797124003984064], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.8026383196721312, 8.715420081967213], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1, 0, 0.0, 2799.0, 2799, 2799, 2799.0, 2799.0, 2799.0, 2799.0, 0.3572704537334762, 35.69076009289032, 0.9810981600571633], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 2.2556796395705523, 3.627660084355828], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.8085680509868423, 2.5634765625], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.1471222643097643, 2.518676346801347], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.564709595959596], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 2.0908043032786887, 2.4526127049180326], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.7994408700980392, 1.0064816942401962], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.576673353040541], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 1, 0, 0.0, 2252.0, 2252, 2252, 2252.0, 2252.0, 2252.0, 2252.0, 0.44404973357015987, 0.28967306838365897, 0.3386746503108348], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 303.5, 303, 304, 303.5, 304.0, 304.0, 304.0, 0.690846286701209, 0.3798305267702936, 1.8364097582037997], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.8085680509868423, 8.744089226973685], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 808.0, 808, 808, 808.0, 808.0, 808.0, 808.0, 1.2376237623762376, 0.8073561262376238, 0.9427212252475247], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.8085680509868423, 8.744089226973685], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.5304845861486487], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 3.9868551587301586, 8.559647817460318], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 2.5989790836653386, 3.38878859561753], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.8026383196721312, 2.5550717213114753], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 1.6143176020408163, 6.601208191609977], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1, 0, 0.0, 1687.0, 1687, 1687, 1687.0, 1687.0, 1687.0, 1687.0, 0.5927682276229994, 0.38842527415530526, 1.7279425385299347], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.857349537037037], "isController": false}, {"data": ["ST10-040-OPTIONS-businesses/applications", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.6929450757575757], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.1471222643097643, 2.4923716329966332], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.537082981418919], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.8343329124579126], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.1471222643097643, 2.4923716329966332], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.1471222643097643, 2.518676346801347], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 0.6922810661128419, 0.45160522672204917, 0.5273234683281413], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.4710990287162162], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.8085680509868423, 8.744089226973685], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1, 0, 0.0, 12772.0, 12772, 12772, 12772.0, 12772.0, 12772.0, 12772.0, 0.07829627309740057, 0.0514583904243658, 0.21684397510178516], "isController": false}, {"data": ["ST14-090-GET-id", 1, 0, 0.0, 6223.0, 6223, 6223, 6223.0, 6223.0, 6223.0, 6223.0, 0.16069419893941828, 15.719784468905672, 0.42731474971878514], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.8085680509868423, 8.744089226973685], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 1, 0, 0.0, 819.0, 819, 819, 819.0, 819.0, 819.0, 819.0, 1.221001221001221, 0.7965125152625153, 1.0373740842490844], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1, 0, 0.0, 70458.0, 70458, 70458, 70458.0, 70458.0, 70458.0, 70458.0, 0.014192852479491327, 1.3993404093573476, 0.03774134502114735], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 2.034505208333333, 2.621605282738095], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.1399171560402683, 2.484007969798658], "isController": false}, {"data": ["ST06-030-GET-suffixes", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 2.452396503215434, 8.449934686495176], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.5285406144781146], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.8085680509868423, 8.744089226973685], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 22.0, 45.45454545454545, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.189072986577181, 2.5561031879194633], "isController": false}, {"data": ["ST10-030-OPTIONS-customers/email", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.7488425925925926], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.8145369224422443, 8.772947607260726], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.564709595959596], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.9991582491582494, 2.2917981902356903], "isController": false}, {"data": ["ST07-030-GET-core/products", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 12.532552083333334, 4.21142578125], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.8145369224422443, 2.571936881188119], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 1, 0, 0.0, 701.0, 701, 701, 701.0, 701.0, 701.0, 701.0, 1.4265335235378032, 1.0295002674750358, 3.9675463623395153], "isController": false}, {"data": ["ST14-060-POST-middesk", 1, 0, 0.0, 808.0, 808, 808, 808.0, 808.0, 808.0, 808.0, 1.2376237623762376, 1.0442450495049505, 3.3841274752475243], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 1, 0, 0.0, 904.0, 904, 904, 904.0, 904.0, 904.0, 904.0, 1.1061946902654867, 0.7054151686946902, 0.8188433351769911], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.566775760135135], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.537082981418919], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 4.295094034954407, 8.19540748480243], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 1, 0, 0.0, 1395.0, 1395, 1395, 1395.0, 1395.0, 1395.0, 1395.0, 0.7168458781362007, 1.2201780913978495, 0.6048387096774194], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.1471222643097643, 2.518676346801347], "isController": false}, {"data": ["eProtect/paypage_01", 1, 0, 0.0, 2312.0, 2312, 2312, 2312.0, 2312.0, 2312.0, 2312.0, 0.43252595155709345, 0.19683309904844293, 0.5338992214532873], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.564709595959596], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.5733741554054057], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 2.12202731918239, 2.7392885220125787], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.982553680981595, 4.330126054447852], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.1310259205426356, 10.3031128875969], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1, 0, 0.0, 56710.0, 56710, 56710, 56710.0, 56710.0, 56710.0, 56710.0, 0.017633574325515784, 0.013638467642391112, 0.04880229456885911], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.189072986577181, 2.8674234479865772], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 1.1580921901893289, 1.6371288726333908], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.537082981418919], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.8145369224422443, 2.571936881188119], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 1, 0, 0.0, 3230.0, 3230, 3230, 3230.0, 3230.0, 3230.0, 3230.0, 0.30959752321981426, 1.4412611261609907, 0.29568982198142413], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1, 0, 0.0, 869.0, 869, 869, 869.0, 869.0, 869.0, 869.0, 1.1507479861910241, 0.7461881472957422, 3.287048691024166], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 1.6390009573304156, 6.254701176148796], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 468.0, 460, 476, 468.0, 476.0, 476.0, 476.0, 0.651890482398957, 0.4946473679921773, 1.7946086619947847], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 1.7797167056074767, 6.4731490946261685], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 1.5649262422360248, 5.839156314699793], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 3, 0, 0.0, 296.6666666666667, 296, 297, 297.0, 297.0, 297.0, 297.0, 1.6910935738444193, 1.1031743235625704, 1.3442872745208567], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 0, 0.0, 980.0, 980, 980, 980.0, 980.0, 980.0, 980.0, 1.0204081632653061, 0.621811224489796, 3.272480867346939], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 1.6375545851528384, 6.057672625545852], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.189072986577181, 2.5561031879194633], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.8085680509868423, 8.744089226973685], "isController": false}, {"data": ["ST09-010-GET-industries", 1, 0, 0.0, 1794.0, 1794, 1794, 1794.0, 1794.0, 1794.0, 1794.0, 0.5574136008918618, 16.02781842251951, 1.4746420359531773], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.5733741554054057], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 2.5989790836653386, 3.0347360557768925], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 2.196443602693603, 2.6929450757575757], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.20386402027027, 2.876900337837838], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 2, 0, 0.0, 319.5, 315, 324, 319.5, 324.0, 324.0, 324.0, 1.309757694826457, 1.0718524885396203, 3.5250900458415195], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 3, 0, 0.0, 608.3333333333334, 307, 1210, 308.0, 1210.0, 1210.0, 1210.0, 1.6411378555798686, 0.9023052858315098, 4.416968681619256], "isController": false}, {"data": ["AF-010-GET-Welcome", 1, 0, 0.0, 1664.0, 1664, 1664, 1664.0, 1664.0, 1664.0, 1664.0, 0.6009615384615385, 1.022925743689904, 0.4471998948317308], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.189072986577181, 2.5200555788590604], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 117, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
