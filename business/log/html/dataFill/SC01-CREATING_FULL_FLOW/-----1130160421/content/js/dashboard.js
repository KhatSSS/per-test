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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.868421052631579, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "JSR223 Sampler - Load Crypto-js"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Request"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 114, 0, 0.0, 451.16666666666663, 1, 4299, 254.0, 946.5, 1537.75, 4123.199999999993, 1.8175730616539914, 6.5498553365300305, 2.6703856413721083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 7.220753949814126, 10.248460734200743], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 2.996900303643725], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 3.0641131072874495], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.132145579268293], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 1, 0, 0.0, 961.0, 961, 961, 961.0, 961.0, 961.0, 961.0, 1.040582726326743, 0.8200686134235172, 1.221465270551509], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.458792892156863], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 1.794577205882353, 6.7693014705882355], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 2.407172509225092, 3.1855396678966788], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 932.0, 932, 932, 932.0, 932.0, 932.0, 932.0, 1.0729613733905579, 1.8357698497854076, 0.7376609442060086], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.483204706477733], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.3699975296442686, 10.780786808300395], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 2, 0, 0.0, 14.0, 4, 24, 14.0, 24.0, 24.0, 24.0, 0.21012817818869511, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 7.385485979087452, 10.482265922053232], "isController": false}, {"data": ["JSR223 Sampler - Load Crypto-js", 2, 0, 0.0, 944.5, 134, 1755, 944.5, 1755.0, 1755.0, 1755.0, 0.17747803709290977, 0.0, 0.0], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 10.499969242125983], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 1, 0, 0.0, 860.0, 860, 860, 860.0, 860.0, 860.0, 860.0, 1.1627906976744187, 0.7585392441860466, 0.8834484011627907], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 7.378098060344828, 9.321120689655173], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.483204706477733], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.4814850101626016], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 1, 0, 0.0, 1017.0, 1017, 1017, 1017.0, 1017.0, 1017.0, 1017.0, 0.9832841691248771, 0.6145526057030483, 0.7240197885939037], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.458792892156863], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1, 0, 0.0, 1633.0, 1633, 1633, 1633.0, 1633.0, 1633.0, 1633.0, 0.612369871402327, 61.62151236221678, 1.687007233619106], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 2.580180921052632, 4.1803728070175445], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 3.1027005413385824], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 3.0641131072874495], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.119464827935223], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 3.0641131072874495], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.582047064777328], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.115511133603239], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 2.6198544176706826, 3.0904869477911645], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.1393178501945527, 10.377401507782102], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 2.090512119771863, 10.140654705323193], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.119464827935223], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.147674560546875, 10.417938232421875], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.080538617886179], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.479251012145749], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 3.090533088235294], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 1.8685408464566928, 7.663836942257218], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1, 0, 0.0, 1744.0, 1744, 1744, 1744.0, 1744.0, 1744.0, 1744.0, 0.573394495412844, 0.3600514263188073, 1.676506952408257], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 1, 0, 0.0, 924.0, 924, 924, 924.0, 924.0, 924.0, 924.0, 1.0822510822510822, 0.7059997294372294, 0.9279457521645021], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 3.0324835526315788], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.075974190283401], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.4436677631578947], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 2.571352066532258, 3.020255796370968], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 2.571352066532258, 3.0517578125], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.119464827935223], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 2.996900303643725], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.458792892156863], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1, 0, 0.0, 4299.0, 4299, 4299, 4299.0, 4299.0, 4299.0, 4299.0, 0.23261223540358222, 0.15287893986973713, 0.6462712985578041], "isController": false}, {"data": ["ST14-090-GET-id", 1, 0, 0.0, 1506.0, 1506, 1506, 1506.0, 1506.0, 1506.0, 1506.0, 0.6640106241699867, 65.4355235308765, 1.7702626992031874], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.458792892156863], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.4752973178137654], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1, 0, 0.0, 1296.0, 1296, 1296, 1296.0, 1296.0, 1296.0, 1296.0, 0.7716049382716049, 76.62323374807099, 2.057110821759259], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.3094383445945947, 3.0055690456081083], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 2.571352066532258, 3.020255796370968], "isController": false}, {"data": ["ST06-030-GET-suffixes", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 2.9334435096153846, 10.141225961538462], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.075974190283401], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.458792892156863], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 2, 0, 0.0, 670.0, 4, 1336, 670.0, 1336.0, 1336.0, 1336.0, 0.1603720631865929, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.119464827935223], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 10.499969242125983], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.132145579268293], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.4038461538461537, 2.791308198380567], "isController": false}, {"data": ["ST07-030-GET-core/products", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 30.10376447876448, 10.180381274131275], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 3.1027005413385824], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 1.3026709160649819, 5.036171592960288], "isController": false}, {"data": ["ST14-060-POST-middesk", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 2.4554575089928057, 9.867496627697841], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 3.0324835526315788], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.1115574392712553], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.075974190283401], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 2, 0, 0.0, 59.5, 1, 118, 59.5, 118.0, 118.0, 118.0, 0.21059281878487945, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 4.5966403388278385, 9.90871108058608], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 1, 0, 0.0, 932.0, 932, 932, 932.0, 932.0, 932.0, 932.0, 1.0729613733905579, 1.8410089189914163, 0.9147414833690987], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.581762398785425, 3.0641131072874495], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.132145579268293], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.119464827935223], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 2.5085676115241635, 3.270939823420074], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 1.1318462897526502, 5.0035887809187285], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.458792892156863], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 2.6304183467741935, 3.4809727822580645], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 1.2600216526217227, 1.7976796582397003], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.075974190283401], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.147674560546875, 3.078460693359375], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 9.200145133399209, 1.9048758646245059], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.8485536317567568, 3.8719383445945947], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.4357504826254828, 11.070222007722007], "isController": false}, {"data": ["ST10-010-PUT-businesses", 1, 0, 0.0, 752.0, 752, 752, 752.0, 752.0, 752.0, 752.0, 1.3297872340425532, 1.0116252493351063, 3.6724983377659575], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 2.2874436936936937, 8.346236861861861], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.4357504826254828, 10.88546694015444], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 3, 0, 0.0, 246.66666666666666, 246, 247, 247.0, 247.0, 247.0, 247.0, 2.3961661341853033, 1.5631240015974441, 1.890724840255591], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 0, 0.0, 916.0, 916, 916, 916.0, 916.0, 916.0, 916.0, 1.0917030567685588, 0.6609920851528384, 3.469142330786026], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.4170857279693485, 10.663613505747126], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.119464827935223], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.458792892156863], "isController": false}, {"data": ["ST09-010-GET-industries", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 38.185798472775566, 3.5249626494023905], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.132145579268293], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.132145579268293], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 2.6410678137651824, 3.273658906882591], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.497364075203252], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 2, 0, 0.0, 256.5, 254, 259, 256.5, 259.0, 259.0, 259.0, 1.9665683382497543, 1.2060594886922322, 5.281311455260571], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 3, 0, 0.0, 254.66666666666666, 254, 255, 255.0, 255.0, 255.0, 255.0, 3.9164490861618795, 2.1532820659268928, 10.575177464099216], "isController": false}, {"data": ["AF-010-GET-Welcome", 1, 0, 0.0, 1105.0, 1105, 1105, 1105.0, 1105.0, 1105.0, 1105.0, 0.9049773755656109, 1.5527785633484164, 0.6822680995475113], "isController": false}, {"data": ["HTTP Request", 2, 0, 0.0, 1933.5, 740, 3127, 1933.5, 3127.0, 3127.0, 3127.0, 0.12826268197268004, 0.05887056692105432, 0.15970206983903035], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.651803861788618, 3.088478150406504], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 114, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
