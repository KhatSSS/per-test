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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.84765625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.95, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.4, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.85, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.55, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.85, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.35, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.65, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.95, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.55, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.2, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 640, 0, 0.0, 597.7546875000002, 0, 8722, 272.0, 989.2999999999998, 1547.1499999999933, 7262.4100000000035, 4.366156826895526, 26.140545213174196, 9.667956757992114], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 10, 0, 0.0, 372.0, 251, 1383, 260.0, 1271.6000000000004, 1383.0, 1383.0, 0.09737572423194897, 0.18923602658357272, 0.26759305467646916], "isController": false}, {"data": ["ST10-030-GET-customers/email", 10, 0, 0.0, 267.0, 256, 300, 261.5, 298.1, 300.0, 300.0, 0.0988113000602749, 0.13885689529954645, 0.2658448551426341], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 10, 0, 0.0, 258.20000000000005, 246, 272, 257.0, 271.3, 272.0, 272.0, 0.09890805507200506, 0.05438011231009653, 0.26291770108007595], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 10, 0, 0.0, 4833.299999999999, 4629, 5039, 4823.5, 5030.8, 5039.0, 5039.0, 0.09718834128657926, 0.06387475945885532, 0.26916614832884644], "isController": false}, {"data": ["ST14-090-GET-id", 10, 0, 0.0, 856.8000000000001, 505, 1947, 526.0, 1907.5, 1947.0, 1947.0, 0.098837669012414, 9.668293061101446, 0.26282712179765955], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 10, 0, 0.0, 738.1, 665, 798, 743.0, 797.6, 798.0, 798.0, 0.09491268033409264, 0.07479934866173121, 0.11057698011579348], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 10, 0, 0.0, 254.39999999999998, 247, 266, 253.5, 265.1, 266.0, 266.0, 0.0984688100044311, 0.05413861331298311, 0.26175009846881], "isController": false}, {"data": ["ST09-020-PUT-businesses", 10, 0, 0.0, 313.0, 275, 339, 326.0, 339.0, 339.0, 339.0, 0.09879080060064807, 0.07534728053623646, 0.28334822398838216], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 10, 0, 0.0, 253.5, 244, 264, 253.0, 263.7, 264.0, 264.0, 0.09878884871475707, 0.05431457209610179, 0.2626008263687195], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 10, 0, 0.0, 592.1, 268, 1455, 283.5, 1439.9, 1455.0, 1455.0, 0.10059046603562914, 9.917306385357046, 0.2674881240381037], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 10, 0, 0.0, 273.8, 266, 284, 273.5, 283.8, 284.0, 284.0, 0.09527075949849473, 0.06512649575092412, 0.08392014166761938], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 869.4000000000001, 820, 934, 886.5, 931.2, 934.0, 934.0, 0.09449562957713205, 0.16139927356484762, 0.06413521733994802], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 10, 0, 0.0, 558.4, 496, 619, 538.5, 618.2, 619.0, 619.0, 0.09880056118718754, 0.07988951627245243, 0.2700612995731816], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 10, 0, 0.0, 258.4, 251, 273, 255.0, 272.6, 273.0, 273.0, 0.09876640756945748, 0.19193862408517615, 0.271414717676224], "isController": false}, {"data": ["ST06-030-GET-suffixes", 10, 0, 0.0, 253.20000000000002, 244, 264, 252.5, 263.4, 264.0, 264.0, 0.09738425880840622, 0.07427451770445824, 0.255918984817794], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 10, 0, 0.0, 254.39999999999998, 247, 268, 251.5, 267.9, 268.0, 268.0, 0.09867090293743278, 0.05424972495485807, 0.2622873025348555], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 10, 0, 0.0, 286.09999999999997, 279, 295, 286.5, 294.6, 295.0, 295.0, 0.09736719115126967, 0.20861681385340397, 0.2623399222522979], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 10, 0, 0.0, 255.9, 248, 269, 253.5, 268.8, 269.0, 269.0, 0.09911981603362144, 0.05449653947942272, 0.2634806047299976], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 53.0, 0, 519, 1.0, 467.4000000000002, 519.0, 519.0, 0.09414422895876483, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 10, 0, 0.0, 255.6, 246, 271, 256.0, 269.7, 271.0, 271.0, 0.09878299351983562, 0.05431135288248775, 0.2625852620712818], "isController": false}, {"data": ["ST07-030-GET-core/products", 10, 0, 0.0, 280.20000000000005, 247, 499, 254.5, 475.70000000000005, 499.0, 499.0, 0.09846396218983852, 0.7700189543127215, 0.25875636938755414], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 10, 0, 0.0, 257.3, 244, 277, 256.5, 275.8, 277.0, 277.0, 0.09534069999141934, 0.05241876376481356, 0.07429870956362561], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 10, 0, 0.0, 1020.9, 967, 1087, 1012.5, 1087.0, 1087.0, 1087.0, 0.09448045199448235, 0.05905028249655146, 0.06873821946864193], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 10, 0, 0.0, 466.3, 402, 561, 455.5, 558.1, 561.0, 561.0, 0.09713264433910948, 0.07009865641269718, 0.27015016706814826], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 10, 0, 0.0, 257.5, 246, 306, 252.5, 301.1, 306.0, 306.0, 0.09862905611993293, 0.05422671737843969, 0.2621760651938061], "isController": false}, {"data": ["ST14-060-POST-middesk", 10, 0, 0.0, 668.4, 610, 834, 660.0, 817.8000000000001, 834.0, 834.0, 0.09851731441800897, 0.08312398404019507, 0.2693832816117433], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 10, 0, 0.0, 1263.9, 805, 2029, 1043.5, 2014.2, 2029.0, 2029.0, 0.1011582621010571, 10.10503862981134, 0.2777900713165748], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 10, 0, 0.0, 266.1, 261, 275, 266.0, 274.6, 275.0, 275.0, 0.09522449173927534, 0.07002347878874446, 0.11261412060181879], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 15.900000000000002, 0, 150, 1.0, 135.20000000000005, 150.0, 150.0, 0.09460648432843587, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 10, 0, 0.0, 259.5, 253, 269, 257.5, 269.0, 269.0, 269.0, 0.0987790904421352, 0.1395833436228219, 0.26633698116282745], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 891.5, 841, 931, 914.5, 930.8, 931.0, 931.0, 0.09453314804836316, 0.1619249430437783, 0.07976234366580641], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 10, 0, 0.0, 252.5, 245, 263, 252.5, 262.3, 263.0, 263.0, 0.09530162965786715, 0.052397282712284374, 0.07426826217478319], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 771.6, 454, 1805, 578.0, 1737.8000000000002, 1805.0, 1805.0, 0.09184338865366777, 0.042154680339085794, 0.11426609096169212], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 10, 0, 0.0, 261.40000000000003, 252, 272, 260.5, 271.5, 272.0, 272.0, 0.09528346831824679, 0.06429773106241067, 0.08300083373034778], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 10, 0, 0.0, 452.90000000000003, 428, 479, 450.5, 478.5, 479.0, 479.0, 0.09849111610132766, 0.06309587125241303, 0.2780642740712288], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 10, 0, 0.0, 252.9, 245, 265, 252.5, 264.1, 265.0, 265.0, 0.10192952592577491, 0.056041331148643826, 0.2709493843456634], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 10, 0, 0.0, 7684.199999999999, 6929, 8722, 7505.0, 8705.6, 8722.0, 8722.0, 0.09613905552991847, 0.07445143655783726, 0.2660723470427626], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 10, 0, 0.0, 485.5, 473, 546, 480.0, 540.0, 546.0, 546.0, 0.09509590421940527, 0.06398542774137718, 0.09045254952119212], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 20, 0, 0.0, 253.85, 245, 266, 252.5, 264.0, 265.9, 266.0, 0.19553400336318486, 0.10750551161471979, 0.5197690987837784], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 10, 0, 0.0, 252.20000000000002, 244, 264, 251.0, 263.1, 264.0, 264.0, 0.09529345619836285, 0.052392788905935836, 0.07426189262333356], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 10, 0, 0.0, 471.3, 463, 481, 471.0, 480.4, 481.0, 481.0, 0.09518914082281493, 0.44313147881089726, 0.09091306613741504], "isController": false}, {"data": ["ST14-020-POST-senti-link", 10, 0, 0.0, 627.0, 567, 750, 613.5, 741.4000000000001, 750.0, 750.0, 0.09850469867412676, 0.06387414054650407, 0.28137328478693435], "isController": false}, {"data": ["ST12-010-PUT-businesses", 10, 0, 0.0, 315.0, 276, 341, 323.5, 341.0, 341.0, 341.0, 0.09869622289554979, 0.07392578414149091, 0.2821131293117912], "isController": false}, {"data": ["ST10-010-PUT-businesses", 20, 0, 0.0, 305.15, 273, 349, 291.5, 342.5, 348.7, 349.0, 0.1953926415131206, 0.14826179927313937, 0.5379022035405147], "isController": false}, {"data": ["ST08-010-PUT-businesses", 10, 0, 0.0, 301.9, 283, 332, 298.0, 331.0, 332.0, 332.0, 0.09859016070196194, 0.07509797397219757, 0.27314481046041605], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 10, 0, 0.0, 253.7, 246, 269, 253.0, 267.7, 269.0, 269.0, 0.09883083126612177, 0.05433765429963531, 0.2627124245179526], "isController": false}, {"data": ["ST14-010-PUT-businesses", 10, 0, 0.0, 312.5, 276, 352, 323.5, 349.6, 352.0, 352.0, 0.09871278527994946, 0.0746129841862118, 0.2784009022348575], "isController": false}, {"data": ["ST15-010-POST-add-payment", 10, 0, 0.0, 611.1, 549, 654, 615.0, 653.7, 654.0, 654.0, 0.10020742937881415, 0.06106390227771487, 0.321759792771036], "isController": false}, {"data": ["ST13-010-PUT-businesses", 10, 0, 0.0, 305.59999999999997, 280, 345, 293.5, 344.3, 345.0, 345.0, 0.0987605550343193, 0.07407041627573947, 0.27400267270752066], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 10, 0, 0.0, 256.79999999999995, 245, 272, 253.5, 271.9, 272.0, 272.0, 0.0989060985500366, 0.05437903660514708, 0.26291250024726526], "isController": false}, {"data": ["ST09-010-GET-industries", 10, 0, 0.0, 536.0, 495, 753, 514.0, 731.2, 753.0, 753.0, 0.09837678307919331, 2.8287167978357104, 0.2602565482046237], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 10, 0, 0.0, 254.20000000000002, 245, 265, 253.5, 264.8, 265.0, 265.0, 0.0973890008862399, 0.05354492919819636, 0.2588797464964307], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 10, 0, 0.0, 262.20000000000005, 250, 278, 260.5, 277.2, 278.0, 278.0, 0.0988113000602749, 0.12409309753663429, 0.2664238276039248], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 20, 0, 0.0, 262.7500000000001, 249, 278, 262.0, 273.6, 277.8, 278.0, 0.19656212837472603, 0.16085846052541058, 0.52902854082104], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 30, 0, 0.0, 253.83333333333334, 245, 267, 252.0, 266.8, 267.0, 267.0, 0.29078502263276756, 0.15987496849828922, 0.7826206273202222], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 10, 0, 0.0, 254.2, 244, 265, 253.0, 264.6, 265.0, 265.0, 0.09529073202340341, 0.05239129114177356, 0.0742597696823007], "isController": false}, {"data": ["AF-010-GET-Welcome", 10, 0, 0.0, 1079.0, 960, 1382, 1077.5, 1354.0, 1382.0, 1382.0, 0.09386762787117607, 0.1607849797715262, 0.06985071527132437], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 10, 0, 0.0, 359.5, 314, 407, 357.5, 406.3, 407.0, 407.0, 0.09831874938550782, 0.06999450029495626, 0.28621893742011606], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 10, 0, 0.0, 1534.0000000000002, 1155, 1795, 1561.0, 1790.8, 1795.0, 1795.0, 0.09766101860442404, 0.0639946713706724, 0.2846856841154353], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 640, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
