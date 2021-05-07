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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5111607142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.25, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [0.75, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.25, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.125, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 461.0803571428572, 1, 2971, 253.0, 1065.0, 1159.75, 2771.0, 1.3920652281992643, 0.8287660238981555, 1.0637486444454112], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 248.0, 245, 251, 248.0, 251.0, 251.0, 251.0, 0.026757284670751613, 0.02006796350306371, 0.023151322478794853], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1685.5, 1071, 2300, 1685.5, 2300.0, 2300.0, 2300.0, 0.026365050489071687, 0.007003216536159667, 0.02309516629755596], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1340.5, 1106, 1575, 1340.5, 1575.0, 1575.0, 1575.0, 0.026345254561022196, 0.01718616215504182, 0.01854973490087598], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 614.5, 247, 982, 614.5, 982.0, 982.0, 982.0, 0.026967625365748416, 0.017197128284993864, 0.019435651874924156], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 259.5, 252, 267, 259.5, 267.0, 267.0, 267.0, 0.027033602768240923, 0.017635201805844665, 0.019852802032926928], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 251.5, 249, 254, 251.5, 254.0, 254.0, 254.0, 0.027008048398422732, 0.01656352968184519, 0.030753305109922753], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 281.0, 276, 286, 281.0, 286.0, 286.0, 286.0, 0.027063233244475716, 0.0071886713305638625, 0.021724587623983438], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 259.0, 250, 268, 259.0, 268.0, 268.0, 268.0, 0.026798874447273215, 0.02009915583545491, 0.02606609272410559], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 861.0, 821, 901, 861.0, 901.0, 901.0, 901.0, 0.027151778441487917, 0.04702507721286994, 0.017685777559055118], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1049.0, 1021, 1077, 1049.0, 1077.0, 1077.0, 1077.0, 0.026766237068561717, 0.017460787462694555, 0.021616873101270057], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 252.0, 251, 253, 252.0, 253.0, 253.0, 253.0, 0.026724034260211922, 0.02004302569515894, 0.022209133940859712], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.75, 1, 20, 5.0, 20.0, 20.0, 20.0, 0.03668950588407951, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 981.0, 971, 991, 981.0, 991.0, 991.0, 991.0, 0.026532588652011833, 0.007047718860690643, 0.023241925801615833], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 262.5, 251, 274, 262.5, 274.0, 274.0, 274.0, 0.02702556618561159, 0.0071786660180530775, 0.02169435098102805], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1034.5, 1031, 1038, 1034.5, 1038.0, 1038.0, 1038.0, 0.02651008045809419, 0.017293685298834884, 0.019183564081491987], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 558.0, 250, 866, 558.0, 866.0, 866.0, 866.0, 0.026802106645582344, 0.020101579984186758, 0.020153927848728912], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1146.0, 1130, 1162, 1146.0, 1162.0, 1162.0, 1162.0, 0.026768386535501572, 0.017462189654018603, 0.02161860904771465], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 279.5, 272, 287, 279.5, 287.0, 287.0, 287.0, 0.026621941804435216, 0.017366657348987034, 0.021396345805713066], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 243.0, 241, 245, 243.0, 245.0, 245.0, 245.0, 0.026761222987890545, 0.017457516558506723, 0.01965277313173212], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1074.0, 1014, 1134, 1074.0, 1134.0, 1134.0, 1134.0, 0.026880636533473112, 0.016800397833420695, 0.01882169569775412], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 246.5, 244, 249, 246.5, 249.0, 249.0, 249.0, 0.026750842651543524, 0.020063131988657643, 0.020585609384195604], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 587.5, 245, 930, 587.5, 930.0, 930.0, 930.0, 0.026781649213958595, 0.007113875572457753, 0.021498550443236297], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 261.0, 256, 266, 261.0, 266.0, 266.0, 266.0, 0.027201632097925876, 0.020427788167290035, 0.0313721948316899], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 254.0, 251, 257, 254.0, 257.0, 257.0, 257.0, 0.026996018087332117, 0.014842537288249984, 0.019825200782884526], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.5, 242, 247, 244.5, 247.0, 247.0, 247.0, 0.026987275499601938, 0.017209659083242252, 0.019449813787799055], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 252.5, 244, 261, 252.5, 261.0, 261.0, 261.0, 0.026794925041197196, 0.017479501882343484, 0.01967752307712919], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.0, 241, 247, 244.0, 247.0, 247.0, 247.0, 0.027020454484044422, 0.017230817166094734, 0.019473725985571077], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 244.5, 242, 247, 244.5, 247.0, 247.0, 247.0, 0.02680569889158435, 0.017486530136306976, 0.02136079130423128], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 243.0, 241, 245, 243.0, 245.0, 245.0, 245.0, 0.026746192010912447, 0.017447711194618666, 0.020451433930219184], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 252.5, 252, 253, 252.5, 253.0, 253.0, 253.0, 0.02678810608090008, 0.007115590677739084, 0.021503733592285027], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1073.5, 994, 1153, 1073.5, 1153.0, 1153.0, 1153.0, 0.026442085222840674, 0.01724932903208747, 0.021329260150455463], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 252.5, 244, 261, 252.5, 261.0, 261.0, 261.0, 0.02678882370275121, 0.00711578129604329, 0.02150430965201318], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 242.5, 240, 245, 242.5, 245.0, 245.0, 245.0, 0.02676337164956041, 0.007109020594414484, 0.021483878414002597], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.0, 247, 249, 248.0, 249.0, 249.0, 249.0, 0.02702885330089871, 0.01763210352050814, 0.019849314142847487], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 243.5, 240, 247, 243.5, 247.0, 247.0, 247.0, 0.026814324211994048, 0.007122554868810919, 0.02152477978736241], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1050.5, 999, 1102, 1050.5, 1102.0, 1102.0, 1102.0, 0.026513946335772615, 0.017296207179976666, 0.01913457650599215], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 257.0, 256, 258, 257.0, 258.0, 258.0, 258.0, 0.02696471666823961, 0.014825327621307519, 0.01980221380323846], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 286.5, 282, 291, 286.5, 291.0, 291.0, 291.0, 0.027067994802944997, 0.020300996102208747, 0.027305897101017756], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 274.5, 262, 287, 274.5, 287.0, 287.0, 287.0, 0.026685880500627118, 0.02001441037547034, 0.02697254523256745], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 243.0, 240, 246, 243.0, 246.0, 246.0, 246.0, 0.026747980527470176, 0.01744887792221687, 0.021523765580698656], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 244.5, 242, 247, 244.5, 247.0, 247.0, 247.0, 0.027009142594768328, 0.01722360362732785, 0.020230480830261043], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1082.0, 1021, 1143, 1082.0, 1143.0, 1143.0, 1143.0, 0.02653329264895127, 0.017308827626464306, 0.019200361184446187], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 245.0, 242, 248, 245.0, 248.0, 248.0, 248.0, 0.026807495375707046, 0.017487702061496396, 0.021388402072219394], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 244.0, 241, 247, 244.0, 247.0, 247.0, 247.0, 0.02699310326211653, 0.017213375420080168, 0.01924313025521979], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.0, 241, 247, 244.0, 247.0, 247.0, 247.0, 0.026997111309089928, 0.017215931332847385, 0.019456902486433954], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 253.0, 252, 254, 253.0, 254.0, 254.0, 254.0, 0.02678810608090008, 0.017475053576212162, 0.019672515403160996], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1008.0, 1001, 1015, 1008.0, 1015.0, 1015.0, 1015.0, 0.026795284030010715, 0.017479736066452305, 0.018866601353161844], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 266.5, 252, 281, 266.5, 281.0, 281.0, 281.0, 0.026698348707132464, 0.0070917488753320605, 0.021431682262952036], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 995.0, 978, 1012, 995.0, 1012.0, 1012.0, 1012.0, 0.026473235558850002, 0.0198549266691375, 0.021199270662360353], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 268.0, 254, 282, 268.0, 282.0, 282.0, 282.0, 0.02687088539567379, 0.007137578933225849, 0.021570183393792824], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1086.5, 1030, 1143, 1086.5, 1143.0, 1143.0, 1143.0, 0.026375829190130165, 0.017206107323248974, 0.021250057697126352], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 252.0, 249, 255, 252.0, 255.0, 255.0, 255.0, 0.026992374654160198, 0.016580277009244887, 0.022089462851744384], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 244.0, 241, 247, 244.0, 247.0, 247.0, 247.0, 0.027002214181562886, 0.017219185410703677, 0.01924962534427823], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 259.0, 248, 270, 259.0, 270.0, 270.0, 270.0, 0.02664641539096953, 0.007077954088226281, 0.020583315013922753], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 243.0, 240, 246, 243.0, 246.0, 246.0, 246.0, 0.026754063273359642, 0.017452845963480703, 0.019621388201458097], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 243.0, 240, 246, 243.0, 246.0, 246.0, 246.0, 0.02675692669939931, 0.017454713901561267, 0.021687743320802172], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 278.5, 271, 286, 278.5, 286.0, 286.0, 286.0, 0.026610606987945394, 0.017359263152292505, 0.01925630837701908], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 246.0, 243, 249, 246.0, 249.0, 249.0, 249.0, 0.026731177909354576, 0.0071004691321723086, 0.02145803539207955], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 347.5, 2, 1382, 3.0, 1382.0, 1382.0, 1382.0, 0.036231227695150456, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 281.5, 276, 287, 281.5, 287.0, 287.0, 287.0, 0.027066529529583716, 0.017656681372814377, 0.019876982623288044], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 242.0, 239, 245, 242.0, 245.0, 245.0, 245.0, 0.026809292100642083, 0.0071212182142330535, 0.02152074033860136], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 267.5, 253, 282, 267.5, 282.0, 282.0, 282.0, 0.026860780574283486, 0.017522462327755246, 0.01972588573423944], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 244.0, 241, 247, 244.0, 247.0, 247.0, 247.0, 0.027012425715829284, 0.016038627768773635, 0.017647766410048622], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 247.0, 245, 249, 247.0, 249.0, 249.0, 249.0, 0.027067994802944997, 0.007189936119532264, 0.020908968641728018], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 255.5, 253, 258, 255.5, 258.0, 258.0, 258.0, 0.027003672499459928, 0.01484674571991791, 0.019830821991790884], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 248.5, 246, 251, 248.5, 251.0, 251.0, 251.0, 0.02680821403678087, 0.020106160527585654, 0.02350954707522385], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 251.0, 249, 253, 251.0, 253.0, 253.0, 253.0, 0.02671796515977343, 0.020038473869830074, 0.02241282428930213], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 244.5, 242, 247, 244.5, 247.0, 247.0, 247.0, 0.02697017099088408, 0.01719875161821026, 0.019226782054048222], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1002.0, 991, 1013, 1002.0, 1013.0, 1013.0, 1013.0, 0.026447679877282766, 0.01725297866994618, 0.019370859285119214], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1027.5, 996, 1059, 1027.5, 1059.0, 1059.0, 1059.0, 0.02653998248361156, 0.017313191698293477, 0.019205202168316567], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 40.25, 1, 154, 3.0, 154.0, 154.0, 154.0, 0.03669489115377912, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1629.0, 1230, 2028, 1629.0, 2028.0, 2028.0, 2028.0, 0.02625464379012038, 0.006973889756750725, 0.02192160199272746], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 1209.5, 894, 1525, 1209.5, 1525.0, 1525.0, 1525.0, 0.026924060686832788, 0.04615741067942867, 0.02198097142010958], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.0, 241, 247, 244.0, 247.0, 247.0, 247.0, 0.027006224934847483, 0.017221743049272858, 0.0194634707049975], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 278.5, 271, 286, 278.5, 286.0, 286.0, 286.0, 0.026632222325791974, 0.01737336378284086, 0.019558038270503484], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 247.0, 244, 250, 247.0, 250.0, 250.0, 250.0, 0.026728319991446935, 0.017436052494420463, 0.019628609993718845], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 269.0, 248, 290, 269.0, 290.0, 290.0, 290.0, 0.026969807300726838, 0.01654007713364888, 0.02180761762207209], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 264.5, 257, 272, 264.5, 272.0, 272.0, 272.0, 0.027037257340615368, 0.020277943005461527, 0.02479295375277132], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 270.5, 248, 293, 270.5, 293.0, 293.0, 293.0, 0.026689441656880537, 0.0200170812426604, 0.022467088582256857], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 284.5, 278, 291, 284.5, 291.0, 291.0, 291.0, 0.02707239157507174, 0.017660505441550706, 0.02194344238995073], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 252.5, 250, 255, 252.5, 255.0, 255.0, 255.0, 0.02700112054650268, 0.016559280960159847, 0.02399513642316156], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 243.0, 241, 245, 243.0, 245.0, 245.0, 245.0, 0.026803902648225582, 0.017485358368178407, 0.019396183459311676], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 259.5, 255, 264, 259.5, 264.0, 264.0, 264.0, 0.02698436256189538, 0.014836129025729589, 0.01981664125639192], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 353.0, 346, 360, 353.0, 360.0, 360.0, 360.0, 0.026976355224645598, 0.01815108276345783, 0.025000547957215503], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 284.5, 279, 290, 284.5, 290.0, 290.0, 290.0, 0.02662513146158659, 0.019968848596189942, 0.025351077319381764], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 247.0, 245, 249, 247.0, 249.0, 249.0, 249.0, 0.026803902648225582, 0.020102926986169185, 0.025809226573389087], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 256.5, 256, 257, 256.5, 257.0, 257.0, 257.0, 0.02678738849749538, 0.020090541373121534, 0.022968092871875918], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 0.027028488026379804, 0.020271366019784853, 0.02362353201524407], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 283.5, 276, 291, 283.5, 291.0, 291.0, 291.0, 0.026614502242271815, 0.01996087668170386, 0.02534095672481935], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 247.33333333333334, 244, 250, 248.0, 250.0, 250.0, 250.0, 0.07911392405063292, 0.05160947389240506, 0.05956722211234177], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 246.5, 244, 249, 246.5, 249.0, 249.0, 249.0, 0.02674869600106995, 0.02006152200080246, 0.03382769660291561], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 271.0, 256, 286, 271.0, 286.0, 286.0, 286.0, 0.026848881072881286, 0.020136660804660967, 0.02359764938046207], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.5, 242, 247, 244.5, 247.0, 247.0, 247.0, 0.02681180792020806, 0.01749051532294823, 0.019689921441402795], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 279.5, 273, 286, 279.5, 286.0, 286.0, 286.0, 0.026637188178415885, 0.00707550310989172, 0.021382586604158066], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 260.5, 245, 276, 260.5, 276.0, 276.0, 276.0, 0.026818998578593073, 0.007123796497438785, 0.021188056494220505], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 242.5, 240, 245, 242.5, 245.0, 245.0, 245.0, 0.02680713605961907, 0.01748746766389213, 0.019686490543782756], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1134.5, 1105, 1164, 1134.5, 1164.0, 1164.0, 1164.0, 0.026297796244674695, 0.017155203018987007, 0.020159931691474252], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 988.0, 980, 996, 988.0, 996.0, 996.0, 996.0, 0.02653646109754803, 0.0173108945441036, 0.021431302077804904], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 252.5, 248, 255, 253.5, 255.0, 255.0, 255.0, 0.05291355248362987, 0.0396851643627224, 0.041752100006614196], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 248.66666666666666, 245, 251, 249.5, 251.0, 251.0, 251.0, 0.08052394245222247, 0.060392956839166845, 0.06353842334120678], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1024.0, 970, 1078, 1024.0, 1078.0, 1078.0, 1078.0, 0.02703141049899984, 0.04620945710790939, 0.019402428434340705], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 2173.5, 1005, 2971, 2359.0, 2971.0, 2971.0, 2971.0, 0.03529359862354965, 0.0161992103057308, 0.04394466625490802], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 998.5, 995, 1002, 998.5, 1002.0, 1002.0, 1002.0, 0.026756568737625087, 0.017454480387435113, 0.019361931088457216], "isController": false}]}, function(index, item){
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
