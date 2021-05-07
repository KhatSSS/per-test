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

    var data = {"OkPercent": 99.14529914529915, "KoPercent": 0.8547008547008547};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8888888888888888, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-OPTIONS-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 117, 1, 0.8547008547008547, 416.03418803418793, 28, 2557, 261.0, 926.2, 1185.2999999999993, 2427.219999999995, 2.1637816245006656, 5.887495058671771, 3.368374863607782], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 7.167464252767527, 10.140394372693727], "isController": false}, {"data": ["ST10-030-GET-customers/email", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 5.125171076642335, 9.819086450729927], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 2.8910881916996045], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.52053483201581, 2.956707015810277], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.01074604743083], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 1, 0, 0.0, 978.0, 978, 978, 978.0, 978.0, 978.0, 978.0, 1.0224948875255624, 0.8058138420245399, 1.1912464851738243], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.1065313697318007, 10.184686302681992], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 1.7861716920374708, 6.717011855971897], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.377439476284585], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 947.0, 947, 947, 947.0, 947.0, 947.0, 947.0, 1.0559662090813093, 1.808754619852165, 0.7166958157338965], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.5582107843137254, 3.3394607843137254], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 1.150204480796586, 3.8881912339971554], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 7.220753949814126, 10.215787639405203], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 2.0747346698113205, 10.030955188679245], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 257.5, 253, 262, 257.5, 262.0, 262.0, 262.0, 0.7905138339920948, 0.5156867588932806, 0.5936573616600791], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 7.228542018581082, 9.102486275337839], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.5682824803149606, 3.352608267716535], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.350419960474308], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 1, 0, 0.0, 1171.0, 1171, 1171, 1171.0, 1171.0, 1171.0, 1171.0, 0.8539709649871904, 0.533731853116994, 0.6212972352690008], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.1065313697318007, 10.184686302681992], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1, 0, 0.0, 1105.0, 1105, 1105, 1105.0, 1105.0, 1105.0, 1105.0, 0.9049773755656109, 0.5638433257918553, 2.4851527149321266], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 2.5356950431034484, 4.077990301724138], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.1065313697318007, 2.985811781609195], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.52053483201581, 2.956707015810277], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.5682824803149606, 2.998892716535433], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.5007659313725488, 2.933517156862745], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.538302529182879, 3.195677285992218], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.538302529182879, 2.960086332684825], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.0068861166007905], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 263.0, 262, 264, 263.0, 264.0, 264.0, 264.0, 0.7874015748031495, 0.43291707677165353, 2.0930733267716537], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.098491173664122, 10.145813454198473], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.01074604743083], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 1, 0, 0.0, 1172.0, 1172, 1172, 1172.0, 1172.0, 1172.0, 1172.0, 0.8532423208191127, 0.469116627559727, 2.2680914035836177], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 2.9605669466403164], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 4.481724330357142, 9.629603794642856], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.5682824803149606, 3.3487635334645667], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 2.1146334134615383, 2.997295673076923], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 1.5680926486784141, 6.412186811674008], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1, 0, 0.0, 1836.0, 1836, 1836, 1836.0, 1836.0, 1836.0, 1836.0, 0.5446623093681918, 0.3569027437363834, 1.5877119076797386], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.3542798913043477], "isController": false}, {"data": ["ST10-040-OPTIONS-businesses/applications", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.5284641472868215, 3.100018168604651], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.52053483201581, 2.9258275691699605], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.5682824803149606, 2.9566006397637796], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.538302529182879, 3.2754742217898833], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.52053483201581, 2.9258275691699605], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.52053483201581, 2.956707015810277], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 254.0, 253, 255, 254.0, 255.0, 255.0, 255.0, 0.7902015013828526, 0.5154830106677203, 0.6019112998814697], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.5886656746031744, 2.902560763888889], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1, 0, 0.0, 1795.0, 1795, 1795, 1795.0, 1795.0, 1795.0, 1795.0, 0.5571030640668524, 0.30629787604456826, 1.4808931058495822], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 1.6614583333333333, 7.385416666666667], "isController": false}, {"data": ["ST14-090-GET-id", 1, 0, 0.0, 1542.0, 1542, 1542, 1542.0, 1542.0, 1542.0, 1542.0, 0.648508430609598, 63.936344844357976, 1.7232338278210115], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.098491173664122, 10.145813454198473], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.358139822134387], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1, 0, 0.0, 1305.0, 1305, 1305, 1305.0, 1305.0, 1305.0, 1305.0, 0.7662835249042146, 75.54777298850576, 2.0361889367816093], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 2.34107448630137, 3.0166416952054798], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.52053483201581, 2.9258275691699605], "isController": false}, {"data": ["ST06-030-GET-suffixes", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 2.8780955188679243, 9.916715801886792], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 2.968286808300395], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.1065313697318007, 10.184686302681992], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.01074604743083], "isController": false}, {"data": ["ST10-030-OPTIONS-customers/email", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.5482177734375, 3.1890869140625], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.1065313697318007, 10.184686302681992], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.5886656746031744, 3.0226934523809526], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.3468379446640317, 2.6903717885375493], "isController": false}, {"data": ["ST07-030-GET-core/products", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 29.51061320754717, 9.916715801886792], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.1065313697318007, 2.985811781609195], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 1.0951133345978754, 4.22040971168437], "isController": false}, {"data": ["ST14-060-POST-middesk", 1, 0, 0.0, 877.0, 877, 877, 877.0, 877.0, 877.0, 877.0, 1.1402508551881414, 0.9620866590649942, 3.1178734321550743], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.5007659313725488, 2.9028799019607843], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.003026185770751], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 2.968286808300395], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 5.025300266903914, 9.595334741992882], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 1.8651177388707925, 0.9161237785016286], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.510611466535433, 2.945066437007874], "isController": false}, {"data": ["eProtect/paypage_01", 1, 0, 0.0, 2557.0, 2557, 2557, 2557.0, 2557.0, 2557.0, 2557.0, 0.39108330074305825, 0.17797345522096206, 0.4827434493547126], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.01074604743083], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.01074604743083], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 2.3929244237588656, 3.0889849290780145], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 1.0913543441226576, 4.809611903747871], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.1065313697318007, 10.184686302681992], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 1.4694501768867925, 6.527306898584905], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.5682824803149606, 3.3641424704724407], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 1.2865230640535372, 1.8186842734225621], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.4341184701492535, 2.80215135261194], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 2.1146334134615383, 2.997295673076923], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 9.481208630346233, 1.9451692973523422], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1, 0, 0.0, 726.0, 726, 726, 726.0, 726.0, 726.0, 726.0, 1.3774104683195594, 0.8931646005509642, 3.9344976756198347], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 1.7665647110849056, 6.741505748820755], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 426.5, 422, 431, 426.5, 431.0, 431.0, 431.0, 0.7412898443291327, 0.5624826260192736, 2.040718819495923], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 1.8007535460992907, 6.549663859338062], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 1.983882874015748, 7.40239501312336], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 3, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 1.7271157167530224, 1.1266731433506045, 1.3729220639032815], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 1, 100.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 2.7797284644194753, 12.161312031835205], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 1.7123287671232876, 6.3342786815068495], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.5886656746031744, 3.0226934523809526], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.1065313697318007, 10.184686302681992], "isController": false}, {"data": ["ST09-010-GET-industries", 1, 0, 0.0, 787.0, 787, 787, 787.0, 787.0, 787.0, 787.0, 1.2706480304955527, 36.53609434561626, 3.361509291613723], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.5682824803149606, 2.998892716535433], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.01074604743083], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.1612833498023716], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 3.3658596837944663], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 2, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 1.33422281521014, 1.0918737491661106, 3.5909356237491656], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 3, 0, 0.0, 271.6666666666667, 260, 289, 266.0, 289.0, 289.0, 289.0, 3.667481662591687, 2.016398609413203, 9.870683068459659], "isController": false}, {"data": ["AF-010-GET-Welcome", 1, 0, 0.0, 1107.0, 1107, 1107, 1107.0, 1107.0, 1107.0, 1107.0, 0.9033423667570009, 1.5473266711833786, 0.67309592366757], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.5784337944664033, 2.968286808300395], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 100.0, 0.8547008547008547], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 117, 1, "400/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 1, "400/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
