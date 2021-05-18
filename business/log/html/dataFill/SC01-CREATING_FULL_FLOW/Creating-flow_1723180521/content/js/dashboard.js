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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8574468085106383, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-B-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-B-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-C-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-B-020-POST-commercial/lead"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-B-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-CREATING-FLOW"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-B-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "AF-B-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-B-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [0.5, 500, 1500, "AF-C-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-C-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-C-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-B-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-C-010-GET-Welcome"], "isController": false}, {"data": [0.5, 500, 1500, "AF-C-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-B-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "ST05-B-020-POST-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-C-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-B-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-C-020-POST-commercial/lead"], "isController": false}, {"data": [0.25, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.45, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-C-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-B-030-POST-commercial/lead"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-B-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-B-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [0.5, 500, 1500, "AF-B-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-C-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-B-010-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 470, 0, 0.0, 511.8042553191486, 0, 5598, 267.0, 1019.8000000000001, 1496.85, 4974.45, 1.1937781299846586, 6.0211184431101215, 2.331362269911965], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 6, 0, 0.0, 258.3333333333333, 254, 263, 258.5, 263.0, 263.0, 263.0, 0.016725810992760513, 0.032602264396044904, 0.045554967635555735], "isController": false}, {"data": ["ST10-030-GET-customers/email", 6, 0, 0.0, 264.1666666666667, 259, 268, 264.5, 268.0, 268.0, 268.0, 0.01672366649664272, 0.023599314538719468, 0.04458555618733851], "isController": false}, {"data": ["ST03-B-020-POST-commercial/lead", 3, 0, 0.0, 248.66666666666666, 243, 257, 246.0, 257.0, 257.0, 257.0, 0.010710498787928553, 0.006579007556256895, 0.008712739736664537], "isController": false}, {"data": ["AF-B-020-GET-maintenance/configuration", 3, 0, 0.0, 911.6666666666666, 901, 928, 906.0, 928.0, 928.0, 928.0, 0.010680261452800365, 0.018659167713925638, 0.008667282487575296], "isController": false}, {"data": ["AF-C-030-POST-commercial/lead", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.95257568359375, 4.5166015625], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 6, 0, 0.0, 262.6666666666667, 254, 277, 261.5, 277.0, 277.0, 277.0, 0.01671788841924006, 0.00919157341800015, 0.04403139166668989], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 6, 0, 0.0, 3328.3333333333335, 3231, 3463, 3315.5, 3463.0, 3463.0, 3463.0, 0.016588241148790994, 0.010902232708140955, 0.045536665887940905], "isController": false}, {"data": ["ST14-090-GET-id", 6, 0, 0.0, 1019.8333333333333, 521, 1768, 891.0, 1768.0, 1768.0, 1768.0, 0.016704902332004366, 1.634154895510836, 0.044013502433347444], "isController": false}, {"data": ["ST02-B-020-POST-commercial/lead", 3, 0, 0.0, 248.66666666666666, 243, 256, 247.0, 256.0, 256.0, 256.0, 0.010709198844834417, 0.006567750854058608, 0.008607100243455788], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 6, 0, 0.0, 494.5, 466, 538, 490.0, 538.0, 538.0, 538.0, 0.016686365848571232, 0.01315029027323924, 0.018902523812834596], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 6, 0, 0.0, 251.16666666666669, 245, 254, 252.5, 254.0, 254.0, 254.0, 0.016725344751168682, 0.009195672944246064, 0.04405103007216986], "isController": false}, {"data": ["ST09-020-PUT-businesses", 6, 0, 0.0, 286.1666666666667, 280, 297, 284.5, 297.0, 297.0, 297.0, 0.016723526657301493, 0.01275495538999264, 0.04749220265569603], "isController": false}, {"data": ["ST04-B-010-GET-maintenance/configuration", 3, 0, 0.0, 252.33333333333334, 245, 256, 256.0, 256.0, 256.0, 256.0, 0.010712028536844023, 0.005889523502190609, 0.00781434112990477], "isController": false}, {"data": ["TEST-01-BUSINESS-CREATING-FLOW", 10, 0, 0.0, 1.4000000000000001, 0, 13, 0.0, 11.800000000000004, 13.0, 13.0, 0.027813471733168678, 0.0, 0.0], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 6, 0, 0.0, 256.8333333333333, 251, 270, 254.5, 270.0, 270.0, 270.0, 0.01672026440311443, 0.009192879745071702, 0.044037649507030874], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 6, 0, 0.0, 773.5, 288, 1484, 666.0, 1484.0, 1484.0, 1484.0, 0.016723899567408464, 1.6489209687736923, 0.044063555696160196], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 6, 0, 0.0, 276.1666666666667, 272, 286, 274.5, 286.0, 286.0, 286.0, 0.016695187612170793, 0.011412725906757378, 0.014168084018531658], "isController": false}, {"data": ["ST01-B-010-GET-maintenance/configuration", 3, 0, 0.0, 256.0, 247, 264, 257.0, 264.0, 264.0, 264.0, 0.010708663665861137, 0.0058876734803513875, 0.00781188648281081], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 6, 0, 0.0, 993.5000000000001, 819, 1576, 890.0, 1576.0, 1576.0, 1576.0, 0.01666157562966871, 0.02909809676210047, 0.010771448307461608], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 6, 0, 0.0, 663.5, 578, 1000, 597.0, 1000.0, 1000.0, 1000.0, 0.016700950005706157, 0.013406426664736779, 0.04524261261311414], "isController": false}, {"data": ["AF-B-030-OPTIONS-commercial/lead", 3, 0, 0.0, 742.0, 242, 1020, 964.0, 1020.0, 1020.0, 1020.0, 0.010678132608169483, 0.006673832880105928, 0.0074246390791178445], "isController": false}, {"data": ["ST05-B-040-GET-applicants/email", 3, 0, 0.0, 337.3333333333333, 310, 380, 322.0, 380.0, 380.0, 380.0, 0.01071397960058284, 0.023834419463015344, 0.02860548850389989], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 6, 0, 0.0, 255.83333333333334, 253, 261, 254.5, 261.0, 261.0, 261.0, 0.016722408026755852, 0.03259563127090301, 0.045545699205685616], "isController": false}, {"data": ["ST06-030-GET-suffixes", 6, 0, 0.0, 257.0, 248, 263, 258.0, 263.0, 263.0, 263.0, 0.016726323888535777, 0.01275708882514301, 0.04354724559261365], "isController": false}, {"data": ["AF-C-020-GET-maintenance/configuration", 1, 0, 0.0, 909.0, 909, 909, 909.0, 909.0, 909.0, 909.0, 1.1001100110011, 1.9219695407040704, 0.8927650577557755], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 6, 0, 0.0, 251.33333333333334, 247, 261, 249.0, 261.0, 261.0, 261.0, 0.016726557033377845, 0.009196339462687232, 0.04405422296779301], "isController": false}, {"data": ["ST03-C-010-GET-maintenance/configuration", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 2.208050953815261, 2.9296875], "isController": false}, {"data": ["AF-C-030-OPTIONS-commercial/lead", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 2.5826446280991737, 2.8731921487603307], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 6, 0, 0.0, 316.0, 293, 373, 306.5, 373.0, 373.0, 373.0, 0.016720683764494745, 0.035923344025281675, 0.04464291934778186], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 6, 0, 0.0, 262.33333333333337, 255, 267, 263.0, 267.0, 267.0, 267.0, 0.016716723967881604, 0.009190933197184902, 0.04402832474743816], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 17.5, 0, 172, 0.0, 154.90000000000006, 172.0, 172.0, 0.027800172361068638, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 6, 0, 0.0, 259.66666666666663, 245, 272, 260.5, 272.0, 272.0, 272.0, 0.01672133614623366, 0.009193468994462451, 0.044040472252336114], "isController": false}, {"data": ["ST03-B-010-GET-maintenance/configuration", 3, 0, 0.0, 258.3333333333333, 251, 263, 261.0, 263.0, 263.0, 263.0, 0.010710766462448052, 0.005888829607771732, 0.007813420456492868], "isController": false}, {"data": ["AF-C-010-GET-Welcome", 1, 0, 0.0, 919.0, 919, 919, 919.0, 919.0, 919.0, 919.0, 1.088139281828074, 1.8968052910772577, 0.7087782236126224], "isController": false}, {"data": ["AF-C-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 889.0, 889, 889, 889.0, 889.0, 889.0, 889.0, 1.124859392575928, 1.9652084505061866, 0.7272040213723284], "isController": false}, {"data": ["ST07-030-GET-core/products", 6, 0, 0.0, 455.0, 249, 1450, 255.5, 1450.0, 1450.0, 1450.0, 0.01672483191543925, 0.1307934120887085, 0.04354336121734477], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 6, 0, 0.0, 256.0, 245, 270, 255.0, 270.0, 270.0, 270.0, 0.016697696552760544, 0.00918047183516034, 0.012474353381700994], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 6, 0, 0.0, 1016.0, 983, 1054, 1008.0, 1054.0, 1054.0, 1054.0, 0.016660465271260142, 0.010412790794537588, 0.011584229758923066], "isController": false}, {"data": ["ST04-B-020-POST-commercial/lead", 3, 0, 0.0, 249.0, 243, 256, 248.0, 256.0, 256.0, 256.0, 0.010711569566288548, 0.006576178451178451, 0.009466768024893686], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 6, 0, 0.0, 349.8333333333333, 342, 367, 348.0, 367.0, 367.0, 367.0, 0.01672254784739003, 0.012068323104708232, 0.046101320872248094], "isController": false}, {"data": ["ST05-B-020-POST-auth/oauth/token", 3, 0, 0.0, 506.6666666666667, 486, 536, 498.0, 536.0, 536.0, 536.0, 0.010703353003717631, 0.050025632300578694, 0.009908963522972963], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 6, 0, 0.0, 257.1666666666667, 249, 264, 258.0, 264.0, 264.0, 264.0, 0.016725531244686162, 0.00919577547925616, 0.04405152125675642], "isController": false}, {"data": ["ST14-060-POST-middesk", 6, 0, 0.0, 829.5, 685, 1070, 755.0, 1070.0, 1070.0, 1070.0, 0.016695652173913045, 0.013989130434782608, 0.04524456521739131], "isController": false}, {"data": ["ST02-C-010-GET-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.2259299089068825, 2.9534096659919027], "isController": false}, {"data": ["ST05-B-030-GET-maintenance/configuration", 9, 0, 0.0, 258.4444444444444, 247, 271, 262.0, 271.0, 271.0, 271.0, 0.0320869342003936, 0.017641546830880466, 0.08519958407311543], "isController": false}, {"data": ["ST03-C-020-POST-commercial/lead", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.500952743902439, 3.306815294715447], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 6, 0, 0.0, 1512.3333333333335, 1018, 2046, 1439.0, 2046.0, 2046.0, 2046.0, 0.01669662783773104, 1.6679779027087496, 0.045442872835699616], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 6, 0, 0.0, 269.6666666666667, 265, 276, 269.0, 276.0, 276.0, 276.0, 0.016694583720554927, 0.012276388224197129, 0.019303112426891634], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 6.800000000000002, 0, 65, 0.0, 58.60000000000002, 65.0, 65.0, 0.02781455480023587, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 6, 0, 0.0, 259.6666666666667, 254, 267, 258.5, 267.0, 267.0, 267.0, 0.016719938247694736, 0.023463428966735683, 0.04467358500555938], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 6, 0, 0.0, 905.6666666666666, 845, 933, 914.0, 933.0, 933.0, 933.0, 0.016663796790552736, 0.02910197584027195, 0.013523061653270826], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 6, 0, 0.0, 254.66666666666666, 245, 269, 251.5, 269.0, 269.0, 269.0, 0.016696209682131997, 0.009179654346719055, 0.012473242584795876], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 1102.4, 416, 2538, 845.5, 2456.5000000000005, 2538.0, 2538.0, 0.027671320060323478, 0.012700703543312535, 0.030860007332899817], "isController": false}, {"data": ["ST02-C-020-POST-commercial/lead", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.4750126518218623, 3.2538904352226723], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 6, 0, 0.0, 261.8333333333333, 258, 266, 261.0, 266.0, 266.0, 266.0, 0.01669658137496348, 0.011266931377050548, 0.014006214258880493], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 6, 0, 0.0, 344.1666666666667, 328, 374, 336.0, 374.0, 374.0, 374.0, 0.016720870154082818, 0.010711807442459306, 0.046798841661720075], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 6, 0, 0.0, 256.3333333333333, 249, 264, 256.0, 264.0, 264.0, 264.0, 0.01673168786478565, 0.009199160417846018, 0.04406773649543643], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 6, 0, 0.0, 5104.166666666666, 4865, 5598, 5018.5, 5598.0, 5598.0, 5598.0, 0.01651650411673865, 0.012790613051341552, 0.04530748053117077], "isController": false}, {"data": ["AF-B-030-POST-commercial/lead", 3, 0, 0.0, 261.0, 251, 279, 253.0, 279.0, 279.0, 279.0, 0.010707440600473269, 0.008093319360123351, 0.012380478194297218], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 6, 0, 0.0, 489.83333333333337, 475, 542, 480.5, 542.0, 542.0, 542.0, 0.016685066587319906, 0.01122657312369474, 0.015332663729167998], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 12, 0, 0.0, 254.83333333333334, 246, 262, 255.5, 262.0, 262.0, 262.0, 0.03334750602339328, 0.01833461512809611, 0.08783029662606608], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 6, 0, 0.0, 255.66666666666666, 245, 273, 253.0, 273.0, 273.0, 273.0, 0.016696720764041943, 0.009179935341948843, 0.012473624398918054], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 6, 0, 0.0, 479.6666666666667, 449, 507, 486.5, 507.0, 507.0, 507.0, 0.016686041014288812, 0.07798768778748659, 0.015447623907759566], "isController": false}, {"data": ["ST14-020-POST-senti-link", 6, 0, 0.0, 595.3333333333334, 546, 641, 599.0, 641.0, 641.0, 641.0, 0.01670587907727861, 0.010832718464172851, 0.0473115716055742], "isController": false}, {"data": ["ST12-010-PUT-businesses", 6, 0, 0.0, 284.8333333333333, 281, 289, 285.0, 289.0, 289.0, 289.0, 0.016720870154082818, 0.012524323640802266, 0.047386684753074546], "isController": false}, {"data": ["ST10-010-PUT-businesses", 12, 0, 0.0, 286.0, 279, 318, 282.0, 308.70000000000005, 318.0, 318.0, 0.03334593068492541, 0.02530252748260454, 0.09098489290398595], "isController": false}, {"data": ["AF-B-010-GET-Welcome", 3, 0, 0.0, 1090.3333333333333, 1010, 1216, 1045.0, 1216.0, 1216.0, 1216.0, 0.010673839486801798, 0.01860625340228634, 0.006952588806344531], "isController": false}, {"data": ["ST08-010-PUT-businesses", 6, 0, 0.0, 285.0, 279, 292, 284.0, 292.0, 292.0, 292.0, 0.01672455220011484, 0.012739404996181227, 0.04581286027472864], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 6, 0, 0.0, 255.0, 247, 268, 254.0, 268.0, 268.0, 268.0, 0.01672483191543925, 0.009195390984758103, 0.04404967937103482], "isController": false}, {"data": ["ST02-B-010-GET-maintenance/configuration", 3, 0, 0.0, 256.6666666666667, 245, 265, 260.0, 265.0, 265.0, 265.0, 0.01070961938012723, 0.005888198936534795, 0.007812583668901406], "isController": false}, {"data": ["ST14-010-PUT-businesses", 6, 0, 0.0, 299.33333333333337, 281, 363, 288.0, 363.0, 363.0, 363.0, 0.016718167911705783, 0.012636583948886988, 0.04664434152709318], "isController": false}, {"data": ["ST15-010-POST-add-payment", 6, 0, 0.0, 567.6666666666666, 465, 699, 564.0, 699.0, 699.0, 699.0, 0.01670564650851988, 0.010180003341129302, 0.05323293413798864], "isController": false}, {"data": ["ST13-010-PUT-businesses", 6, 0, 0.0, 291.0, 283, 307, 288.5, 307.0, 307.0, 307.0, 0.01671923938606953, 0.012539429539552147, 0.045977908311691205], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 6, 0, 0.0, 258.33333333333337, 247, 271, 256.0, 271.0, 271.0, 271.0, 0.016722874104629446, 0.009194314571197636, 0.04404452291033752], "isController": false}, {"data": ["ST09-010-GET-industries", 6, 0, 0.0, 599.3333333333334, 498, 768, 530.5, 768.0, 768.0, 768.0, 0.016713604038006733, 0.48062492861898276, 0.04380792308399422], "isController": false}, {"data": ["AF-B-020-OPTIONS-maintenance/configuration", 3, 0, 0.0, 881.6666666666666, 873, 890, 882.0, 890.0, 890.0, 890.0, 0.010680945904569307, 0.018660363499291496, 0.006905064637524299], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 6, 0, 0.0, 253.5, 244, 262, 253.0, 262.0, 262.0, 262.0, 0.016727069974909397, 0.009196621480345692, 0.044055573947588515], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 6, 0, 0.0, 260.33333333333337, 257, 265, 260.0, 265.0, 265.0, 265.0, 0.016723526657301493, 0.02083908204562178, 0.044683172787477424], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 12, 0, 0.0, 260.3333333333333, 256, 267, 260.5, 265.8, 267.0, 267.0, 0.033352603726597596, 0.027098990527860543, 0.08895113357161917], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 18, 0, 0.0, 251.94444444444446, 244, 259, 252.5, 258.1, 259.0, 259.0, 0.05009978206594801, 0.02754509502258665, 0.13361572736533595], "isController": false}, {"data": ["ST01-C-010-GET-maintenance/configuration", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 2.216954385080645, 2.941500756048387], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 6, 0, 0.0, 254.83333333333334, 247, 265, 252.5, 265.0, 265.0, 265.0, 0.01669667430075719, 0.00917990979621709, 0.012473589687577396], "isController": false}, {"data": ["ST05-B-010-POST-commercial/lead", 3, 0, 0.0, 249.33333333333334, 243, 256, 249.0, 256.0, 256.0, 256.0, 0.010712564052205897, 0.00658725048652895, 0.011758712885429127], "isController": false}, {"data": ["AF-010-GET-Welcome", 6, 0, 0.0, 1065.8333333333333, 1006, 1109, 1080.5, 1109.0, 1109.0, 1109.0, 0.01664521283678814, 0.02903159192041369, 0.010842145470837587], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 6, 0, 0.0, 313.0, 307, 320, 312.0, 320.0, 320.0, 320.0, 0.016722780886976298, 0.01190518287754465, 0.04832295766070593], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 6, 0, 0.0, 1477.1666666666667, 1368, 1723, 1441.0, 1723.0, 1723.0, 1723.0, 0.01666504645381699, 0.010920162275889843, 0.04817239990556473], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 470, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
