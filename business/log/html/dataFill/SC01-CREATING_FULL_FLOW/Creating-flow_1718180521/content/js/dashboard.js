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

    var data = {"OkPercent": 99.33774834437087, "KoPercent": 0.6622516556291391};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8708609271523179, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-B-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-B-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-C-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-B-020-POST-commercial/lead"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-B-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-CREATING-FLOW"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-B-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [0.75, 500, 1500, "AF-B-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-B-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [0.75, 500, 1500, "AF-C-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-C-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-C-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-B-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-C-010-GET-Welcome"], "isController": false}, {"data": [0.5, 500, 1500, "AF-C-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-B-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-B-020-POST-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-C-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-B-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-C-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-C-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-B-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-B-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-B-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [0.5, 500, 1500, "AF-B-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-C-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-B-010-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 151, 1, 0.6622516556291391, 446.3973509933775, 0, 5442, 263.0, 912.4000000000001, 1060.4, 4361.959999999979, 1.6718519912753684, 5.152462210332267, 2.5989370834209855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 1, 50.0, 257.0, 252, 262, 257.0, 262.0, 262.0, 262.0, 0.025871213101182313, 0.03350119977750757, 0.07024893362093498], "isController": false}, {"data": ["ST10-030-GET-customers/email", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 5.386003101145038, 10.175632156488549], "isController": false}, {"data": ["ST03-B-020-POST-commercial/lead", 2, 0, 0.0, 262.5, 247, 278, 262.5, 278.0, 278.0, 278.0, 0.3759398496240602, 0.24395706062030073, 0.31242657424812026], "isController": false}, {"data": ["AF-B-020-GET-maintenance/configuration", 2, 0, 0.0, 911.5, 909, 914, 911.5, 914.0, 914.0, 914.0, 0.38842493688094776, 0.6786056758593901, 0.31521593998834724], "isController": false}, {"data": ["AF-C-030-POST-commercial/lead", 2, 0, 0.0, 255.0, 254, 256, 255.0, 256.0, 256.0, 256.0, 0.3071253071253071, 0.2313937250460688, 0.3551136363636364], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.147674560546875, 10.288238525390625], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1, 0, 0.0, 3365.0, 3365, 3365, 3365.0, 3365.0, 3365.0, 3365.0, 0.2971768202080238, 0.1953125, 0.8157851968796433], "isController": false}, {"data": ["ST14-090-GET-id", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 185.92561787072242, 5.0090601235741445], "isController": false}, {"data": ["ST02-B-020-POST-commercial/lead", 2, 0, 0.0, 256.5, 248, 265, 256.5, 265.0, 265.0, 265.0, 0.3785727806170736, 0.24400198750709823, 0.31091768408101456], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 396.0, 252, 540, 396.0, 540.0, 540.0, 540.0, 0.025531045751633986, 0.01786425222758374, 0.028473099851919936], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 2.208050953815261, 10.577466114457831], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 2.6030556740614337, 9.692299488054609], "isController": false}, {"data": ["ST04-B-010-GET-maintenance/configuration", 2, 0, 0.0, 255.5, 253, 258, 255.5, 258.0, 258.0, 258.0, 0.3610760064993681, 0.19852128091713306, 0.26657564542336165], "isController": false}, {"data": ["TEST-01-BUSINESS-CREATING-FLOW", 3, 0, 0.0, 3.333333333333333, 0, 10, 0.0, 10.0, 10.0, 10.0, 0.03824335521703104, 0.0, 0.0], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.1310259205426356, 10.208484738372093], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 339.8875269396552, 9.085398706896552], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 266.0, 252, 280, 266.0, 280.0, 280.0, 280.0, 0.025459544783339273, 0.016521354988797803, 0.021158274033810275], "isController": false}, {"data": ["ST01-B-010-GET-maintenance/configuration", 2, 0, 0.0, 256.5, 255, 258, 256.5, 258.0, 258.0, 258.0, 0.3791469194312796, 0.20845675355450236, 0.27991706161137436], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 888.5, 885, 892, 888.5, 892.0, 892.0, 892.0, 0.02525029353466234, 0.04411403821631927, 0.016323920234322727], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 1.229302258805513, 4.148521248085758], "isController": false}, {"data": ["AF-B-030-OPTIONS-commercial/lead", 2, 0, 0.0, 620.5, 242, 999, 620.5, 999.0, 999.0, 999.0, 0.38167938931297707, 0.23854961832061067, 0.2653864503816794], "isController": false}, {"data": ["ST05-B-040-GET-applicants/email", 2, 0, 0.0, 349.5, 319, 380, 349.5, 380.0, 380.0, 380.0, 0.3354579000335458, 0.73348656071788, 0.8956463854411272], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 7.52594111969112, 10.515956805019306], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 260.5, 258, 263, 260.5, 263.0, 263.0, 263.0, 0.025867532366749876, 0.01972904568206216, 0.06734652469702654], "isController": false}, {"data": ["AF-C-020-GET-maintenance/configuration", 2, 0, 0.0, 579.0, 248, 910, 579.0, 910.0, 910.0, 910.0, 0.3076923076923077, 0.5375600961538461, 0.24969951923076922], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 2.090512119771863, 10.014407081749049], "isController": false}, {"data": ["ST03-C-010-GET-maintenance/configuration", 2, 0, 0.0, 254.5, 253, 256, 254.5, 256.0, 256.0, 256.0, 0.3069838833461243, 0.16878117805065235, 0.22394234458940906], "isController": false}, {"data": ["AF-C-030-OPTIONS-commercial/lead", 2, 0, 0.0, 244.0, 242, 246, 244.0, 246.0, 246.0, 246.0, 0.3077870113881194, 0.19236688211757463, 0.21400815635580178], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 0, 0.0, 369.5, 353, 386, 369.5, 386.0, 386.0, 386.0, 0.025804786787949167, 0.05543997161473454, 0.06889676472485647], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 2.0669349154135337, 9.901462640977442], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 3, 0, 0.0, 53.0, 0, 158, 1.0, 158.0, 158.0, 158.0, 0.038165996641392294, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.328584558823529], "isController": false}, {"data": ["ST03-B-010-GET-maintenance/configuration", 2, 0, 0.0, 260.0, 253, 267, 260.0, 267.0, 267.0, 267.0, 0.3755163349605708, 0.20646064119414195, 0.2772366691701089], "isController": false}, {"data": ["AF-C-010-GET-Welcome", 2, 0, 0.0, 915.0, 909, 921, 915.0, 921.0, 921.0, 921.0, 0.3074085459575776, 0.535863529818629, 0.20023583999385183], "isController": false}, {"data": ["AF-C-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 888.5, 886, 891, 888.5, 891.0, 891.0, 891.0, 0.30864197530864196, 0.5392192322530864, 0.19953221450617284], "isController": false}, {"data": ["ST07-030-GET-core/products", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 30.548095703125, 10.16998291015625], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 251.5, 248, 255, 251.5, 255.0, 255.0, 255.0, 0.02553267544139613, 0.014037984642095722, 0.018850295540718234], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1044.0, 1024, 1064, 1044.0, 1064.0, 1064.0, 1064.0, 0.025199707683390873, 0.015749817302119294, 0.017521671748607717], "isController": false}, {"data": ["ST04-B-020-POST-commercial/lead", 2, 0, 0.0, 360.5, 247, 474, 360.5, 474.0, 474.0, 474.0, 0.3615328994938539, 0.23213660294649313, 0.3258738928054953], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 302.5, 251, 354, 302.5, 354.0, 354.0, 354.0, 0.025839793281653745, 0.017865794573643408, 0.07102158026485787], "isController": false}, {"data": ["ST05-B-020-POST-auth/oauth/token", 2, 0, 0.0, 500.5, 488, 513, 500.5, 513.0, 513.0, 513.0, 0.3322811098189068, 1.55302479647782, 0.3076196211995348], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 2.090512119771863, 10.014407081749049], "isController": false}, {"data": ["ST14-060-POST-middesk", 1, 0, 0.0, 730.0, 730, 730, 730.0, 730.0, 730.0, 730.0, 1.36986301369863, 1.1477953767123288, 3.712275256849315], "isController": false}, {"data": ["ST02-C-010-GET-maintenance/configuration", 2, 0, 0.0, 255.5, 253, 258, 255.5, 258.0, 258.0, 258.0, 0.3071253071253071, 0.16885893350737102, 0.22404551213144966], "isController": false}, {"data": ["ST05-B-030-GET-maintenance/configuration", 6, 0, 0.0, 255.0, 248, 273, 252.5, 273.0, 273.0, 273.0, 0.9382329945269742, 0.5158448983580923, 2.496762607505864], "isController": false}, {"data": ["ST03-C-020-POST-commercial/lead", 2, 0, 0.0, 250.0, 248, 252, 250.0, 252.0, 252.0, 252.0, 0.30731407498463426, 0.18831990434849416, 0.24999279732636756], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1, 0, 0.0, 1205.0, 1205, 1205, 1205.0, 1205.0, 1205.0, 1205.0, 0.8298755186721991, 82.88057572614107, 2.2586553423236513], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 261.0, 255, 267, 261.0, 267.0, 267.0, 267.0, 0.02544658761260115, 0.018910989426942845, 0.02942261692707008], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 3, 0, 0.0, 20.0, 0, 59, 1.0, 59.0, 59.0, 59.0, 0.038248231019315355, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 5.2362698227611935, 9.969682835820896], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 919.0, 910, 928, 919.0, 928.0, 928.0, 928.0, 0.025242644924335172, 0.04410067555628479, 0.020484997980588407], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 256.5, 249, 264, 256.5, 264.0, 264.0, 264.0, 0.025465055577483797, 0.014000806923948611, 0.01880037306306421], "isController": false}, {"data": ["eProtect/paypage_01", 3, 0, 0.0, 808.6666666666666, 475, 1387, 564.0, 1387.0, 1387.0, 1387.0, 0.03727773152577755, 0.017109896305776806, 0.04157340761956832], "isController": false}, {"data": ["ST02-C-020-POST-commercial/lead", 2, 0, 0.0, 249.0, 247, 251, 249.0, 251.0, 251.0, 251.0, 0.30731407498463426, 0.18846996004917024, 0.24699168331284574], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 258.0, 251, 265, 258.0, 265.0, 265.0, 265.0, 0.025456628269585693, 0.016420022433653664, 0.02090725036593903], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 1.6468508997429305, 7.1949309125964005], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 10.369248277559056], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1, 0, 0.0, 5442.0, 5442, 5442, 5442.0, 5442.0, 5442.0, 5442.0, 0.18375597206909225, 0.14230320883866227, 0.5040727788496876], "isController": false}, {"data": ["AF-B-030-POST-commercial/lead", 2, 0, 0.0, 263.5, 254, 273, 263.5, 273.0, 273.0, 273.0, 0.37936267071320184, 0.2828548819233687, 0.4386380880121396], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 359.0, 252, 466, 359.0, 466.0, 466.0, 466.0, 0.025464082911053957, 0.01635022901759568, 0.02295248879580352], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 258.0, 251, 265, 258.0, 265.0, 265.0, 265.0, 1.5015015015015014, 0.8255325638138138, 3.9546382319819817], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 251.5, 249, 254, 251.5, 254.0, 254.0, 254.0, 0.025460192988262853, 0.013998133449601548, 0.01879678310461593], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 483.5, 458, 509, 483.5, 509.0, 509.0, 509.0, 0.025543436613962044, 0.11938563245549055, 0.023647634677769546], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 1.1027848639455784, 4.816379676870748], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 2.600775824652778, 9.840223524305557], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 288.0, 287, 289, 288.0, 289.0, 289.0, 289.0, 1.4598540145985401, 1.1077212591240875, 3.9832344890510947], "isController": false}, {"data": ["AF-B-010-GET-Welcome", 2, 0, 0.0, 970.0, 900, 1040, 970.0, 1040.0, 1040.0, 1040.0, 0.3913128546272745, 0.6821225053805517, 0.2548883535511642], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 2.626616379310345, 9.445716594827587], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.1227980212355213, 10.16906973938224], "isController": false}, {"data": ["ST02-B-010-GET-maintenance/configuration", 2, 0, 0.0, 254.0, 252, 256, 254.0, 256.0, 256.0, 256.0, 0.3778575477045154, 0.20774785093519743, 0.27896514264122424], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 2.51953125, 9.300130208333334], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 1.128472222222222, 5.900969328703703], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 2.5423728813559325, 9.322033898305085], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 2.190456922310757, 10.493183515936256], "isController": false}, {"data": ["ST09-010-GET-industries", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 53.24797453703703, 4.853877314814815], "isController": false}, {"data": ["AF-B-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 902.5, 892, 913, 902.5, 913.0, 913.0, 913.0, 0.39001560062402496, 0.6813846772620905, 0.25213899180967236], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 257.0, 250, 264, 257.0, 264.0, 264.0, 264.0, 0.025870209160641065, 0.014223562263125898, 0.06813667393188375], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 4.737999049429658, 10.159220532319392], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 2, 0, 0.0, 265.0, 263, 267, 265.0, 267.0, 267.0, 267.0, 1.6877637130801688, 1.371308016877637, 4.5012526371308015], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 259.5, 252, 280, 255.5, 280.0, 280.0, 280.0, 0.077000077000077, 0.04233500327250327, 0.20490743146993148], "isController": false}, {"data": ["ST01-C-010-GET-maintenance/configuration", 2, 0, 0.0, 251.0, 250, 252, 251.0, 252.0, 252.0, 252.0, 0.30731407498463426, 0.16896271896127843, 0.2241832168100799], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 255.5, 249, 262, 255.5, 262.0, 262.0, 262.0, 0.0254569522936714, 0.013996351700524415, 0.01879439056056209], "isController": false}, {"data": ["ST05-B-010-POST-commercial/lead", 2, 0, 0.0, 358.5, 246, 471, 358.5, 471.0, 471.0, 471.0, 0.3478260869565218, 0.24388586956521738, 0.38790760869565216], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1067.0, 1058, 1076, 1067.0, 1076.0, 1076.0, 1076.0, 0.025173698519786524, 0.04388188657990132, 0.016397321203806263], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 2.21091323757764, 8.974063470496894], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1, 0, 0.0, 1450.0, 1450, 1450, 1450.0, 1450.0, 1450.0, 1450.0, 0.689655172413793, 0.4519127155172414, 1.9935344827586208], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 1, 100.0, 0.6622516556291391], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 151, 1, "406/Not Acceptable", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 1, "406/Not Acceptable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
