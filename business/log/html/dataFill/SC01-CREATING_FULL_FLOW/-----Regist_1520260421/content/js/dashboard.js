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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8269230769230769, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.4, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.95, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.55, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.45, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.4, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.45, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.55, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.9, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.45, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.6, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.45, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.15, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 650, 0, 0.0, 601.0507692307688, 0, 7615, 289.0, 987.5999999999999, 1752.2499999999995, 5981.26, 3.7031550881350914, 21.96279748975935, 8.072944855747865], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 10, 0, 0.0, 271.99999999999994, 256, 297, 267.5, 297.0, 297.0, 297.0, 0.07957855198866802, 0.15464972505610286, 0.21868559110948416], "isController": false}, {"data": ["ST10-030-GET-customers/email", 10, 0, 0.0, 274.8, 258, 301, 271.0, 301.0, 301.0, 301.0, 0.08002496778995047, 0.11245696157201047, 0.215301549083314], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 10, 0, 0.0, 269.2, 251, 318, 260.0, 314.8, 318.0, 318.0, 0.08046217473165865, 0.04423848083390998, 0.21388480431599105], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 10, 0, 0.0, 4160.2, 3964, 4818, 4073.0, 4763.900000000001, 4818.0, 4818.0, 0.07871722411580878, 0.0517350506151751, 0.21800981210198603], "isController": false}, {"data": ["ST14-090-GET-id", 10, 0, 0.0, 808.6, 514, 2063, 539.5, 2031.7, 2063.0, 2063.0, 0.08036582523647644, 7.923662260610298, 0.21370717003801304], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 10, 0, 0.0, 903.5, 791, 1029, 908.5, 1023.7, 1029.0, 1029.0, 0.07767834949043002, 0.0612172148816182, 0.09049831146687796], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 10, 0, 0.0, 261.0, 248, 287, 256.5, 287.0, 287.0, 287.0, 0.07963178263708612, 0.04378192736785105, 0.21167745345522304], "isController": false}, {"data": ["ST09-020-PUT-businesses", 10, 0, 0.0, 419.7, 369, 473, 413.0, 473.0, 473.0, 473.0, 0.07983585747702723, 0.06089043426714674, 0.22898233731448142], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 10, 0, 0.0, 329.20000000000005, 247, 931, 262.5, 866.7000000000003, 931.0, 931.0, 0.08018474565398678, 0.044085949026557186, 0.21314734147475783], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 10, 0, 0.0, 797.5, 286, 1799, 529.5, 1792.3, 1799.0, 1799.0, 0.08032451102453915, 7.9814873965821915, 0.21359730812482428], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 10, 0, 0.0, 288.8, 270, 323, 282.5, 322.4, 323.0, 323.0, 0.0779806140193548, 0.05330706036479332, 0.0686899549272051], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 969.3, 813, 1774, 875.5, 1699.5000000000002, 1774.0, 1774.0, 0.07628579711029401, 0.1317568952824863, 0.05177600487466243], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 10, 0, 0.0, 587.5, 508, 632, 599.0, 631.8, 632.0, 632.0, 0.0802845283685381, 0.0649175678604976, 0.21944960439798647], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 10, 0, 0.0, 271.1000000000001, 258, 296, 268.5, 295.8, 296.0, 296.0, 0.08009868157570127, 0.1556605237652788, 0.22011493159572593], "isController": false}, {"data": ["ST06-030-GET-suffixes", 10, 0, 0.0, 261.4000000000001, 246, 290, 256.5, 289.8, 290.0, 290.0, 0.07956462238630214, 0.06068356453486522, 0.20909023324369053], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 10, 0, 0.0, 260.8, 247, 287, 257.0, 286.9, 287.0, 287.0, 0.07967048288279675, 0.043803204944350166, 0.21178032656930934], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 10, 0, 0.0, 295.20000000000005, 276, 332, 288.5, 331.7, 332.0, 332.0, 0.07946472560830248, 0.1702593827974762, 0.21410466597002592], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 10, 0, 0.0, 262.5, 248, 287, 259.0, 286.7, 287.0, 287.0, 0.08053280503813229, 0.04427731370748875, 0.21407255401737899], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 68.39999999999999, 0, 675, 1.0, 607.7000000000003, 675.0, 675.0, 0.07560064714153952, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 10, 0, 0.0, 3.1000000000000005, 0, 26, 0.5, 23.60000000000001, 26.0, 26.0, 0.07598784194528876, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 10, 0, 0.0, 260.4, 246, 287, 258.0, 286.8, 287.0, 287.0, 0.08014169050881959, 0.044062277105923274, 0.21303289215332707], "isController": false}, {"data": ["ST07-030-GET-core/products", 10, 0, 0.0, 263.4, 248, 289, 260.5, 288.9, 289.0, 289.0, 0.07964763884574642, 0.6228694256608763, 0.20930839466201526], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 10, 0, 0.0, 259.8, 246, 287, 256.0, 286.9, 287.0, 287.0, 0.07806462189400386, 0.04292029504523845, 0.060835515890053794], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 10, 0, 0.0, 1047.3, 977, 1248, 1025.5, 1237.2, 1248.0, 1248.0, 0.07729169887154119, 0.04830731179471325, 0.056232730136033394], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 10, 0, 0.0, 623.9000000000001, 546, 697, 623.0, 694.4, 697.0, 697.0, 0.07927322309070442, 0.057209874867217354, 0.22047865172102168], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 10, 0, 0.0, 262.8, 247, 294, 259.5, 293.3, 294.0, 294.0, 0.0796933400275739, 0.043815771909691506, 0.21184108550298453], "isController": false}, {"data": ["ST14-060-POST-middesk", 10, 0, 0.0, 764.9000000000001, 688, 925, 727.5, 917.6, 925.0, 925.0, 0.080126921042932, 0.06760708962997387, 0.2190970497267672], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 10, 0, 0.0, 1235.4, 963, 2476, 1034.0, 2396.6000000000004, 2476.0, 2476.0, 0.08072849392921726, 8.126962711508654, 0.22168801262593646], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 10, 0, 0.0, 277.1, 261, 318, 271.5, 316.9, 318.0, 318.0, 0.07787980031619199, 0.05726903284969978, 0.09210199041299659], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 18.499999999999996, 1, 174, 1.0, 156.80000000000007, 174.0, 174.0, 0.07600228006840205, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 10, 0, 0.0, 276.4, 257, 304, 267.5, 303.7, 304.0, 304.0, 0.08017831657606517, 0.11329885164606085, 0.21618391803370698], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 1010.0, 838, 1799, 904.0, 1741.2000000000003, 1799.0, 1799.0, 0.0768344218209758, 0.13124879946215903, 0.06482904341144832], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 10, 0, 0.0, 259.5, 247, 286, 255.0, 286.0, 286.0, 286.0, 0.07801955169965594, 0.042895515241119425, 0.06080039282844281], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 954.9, 456, 2977, 657.5, 2807.6000000000004, 2977.0, 2977.0, 0.07346782843792703, 0.033433601613353514, 0.09068685072806618], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 10, 0, 0.0, 272.70000000000005, 258, 301, 268.5, 300.8, 301.0, 301.0, 0.07796602240743485, 0.05261183738626707, 0.06791571483147645], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 10, 0, 0.0, 570.1999999999999, 521, 615, 582.0, 614.8, 615.0, 615.0, 0.0794634626998506, 0.0509062807920918, 0.2243446002590509], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 10, 0, 0.0, 260.2, 247, 285, 256.0, 285.0, 285.0, 285.0, 0.08120178643930166, 0.044645122817701985, 0.2158508424685343], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 10, 0, 0.0, 6426.8, 5801, 7615, 6093.5, 7581.4, 7615.0, 7615.0, 0.0779982528391364, 0.06040294384905778, 0.21586625834581305], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 10, 0, 0.0, 403.40000000000003, 376, 465, 395.5, 462.0, 465.0, 465.0, 0.07793807040925281, 0.05244075245310077, 0.07413250056505102], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 20, 0, 0.0, 260.29999999999995, 246, 286, 256.5, 285.9, 286.0, 286.0, 0.15847734962480486, 0.08713158968629409, 0.4212649860143739], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 10, 0, 0.0, 261.8, 246, 287, 260.5, 286.9, 287.0, 287.0, 0.07799156131306592, 0.0428801259953673, 0.060778580007643176], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 10, 0, 0.0, 485.4, 471, 524, 479.5, 522.7, 524.0, 524.0, 0.07797818170475901, 0.363009757994713, 0.07447525557349052], "isController": false}, {"data": ["ST14-020-POST-senti-link", 10, 0, 0.0, 834.2000000000002, 698, 1755, 737.0, 1655.9000000000003, 1755.0, 1755.0, 0.07992135738433381, 0.051824005178903954, 0.22829098666911757], "isController": false}, {"data": ["ST12-010-PUT-businesses", 10, 0, 0.0, 426.40000000000003, 412, 455, 418.5, 454.9, 455.0, 455.0, 0.0800172837332864, 0.05993482092131901, 0.22872127879621998], "isController": false}, {"data": ["ST10-010-PUT-businesses", 20, 0, 0.0, 418.85, 371, 460, 415.5, 448.8, 459.45, 460.0, 0.1582265963085735, 0.12006061067554846, 0.43558669432994995], "isController": false}, {"data": ["ST08-010-PUT-businesses", 10, 0, 0.0, 412.8, 365, 444, 416.0, 444.0, 444.0, 444.0, 0.07957728545963841, 0.06061551040870894, 0.22046949106347083], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 10, 0, 0.0, 261.09999999999997, 247, 294, 256.5, 293.5, 294.0, 294.0, 0.07997184990883209, 0.04396889794792233, 0.21258142133968844], "isController": false}, {"data": ["ST14-010-PUT-businesses", 10, 0, 0.0, 419.0999999999999, 366, 479, 421.5, 477.4, 479.0, 479.0, 0.08009419076834356, 0.060539944975290944, 0.22589064740134399], "isController": false}, {"data": ["ST15-010-POST-add-payment", 10, 0, 0.0, 745.2, 693, 813, 741.0, 811.5, 813.0, 813.0, 0.08097559395598167, 0.04934450256692633, 0.25969126030414436], "isController": false}, {"data": ["ST13-010-PUT-businesses", 10, 0, 0.0, 424.6, 412, 464, 418.5, 462.3, 464.0, 464.0, 0.08005443701717169, 0.06004082776287875, 0.22210415582596163], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 10, 0, 0.0, 260.9, 247, 295, 256.0, 294.0, 295.0, 295.0, 0.0802432976785614, 0.04411814120413093, 0.21330298464945716], "isController": false}, {"data": ["ST09-010-GET-industries", 10, 0, 0.0, 577.8, 494, 851, 517.0, 850.8, 851.0, 851.0, 0.07954753362871984, 2.28736447088958, 0.2104436216798848], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 10, 0, 0.0, 260.2, 247, 287, 256.5, 286.8, 287.0, 287.0, 0.0795487992108759, 0.043736302691135875, 0.2114568666523479], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 10, 0, 0.0, 274.2, 258, 300, 270.0, 299.8, 300.0, 300.0, 0.08004354368776614, 0.10052343474850318, 0.21582053136906476], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 20, 0, 0.0, 278.8, 256, 361, 270.0, 309.8, 358.49999999999994, 361.0, 0.15984399226355075, 0.13080982960630425, 0.4302051198030722], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 30, 0, 0.0, 260.6666666666667, 247, 292, 258.0, 286.9, 289.25, 292.0, 0.23730234692021104, 0.1304699426914832, 0.6386770196407242], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 10, 0, 0.0, 260.1, 246, 287, 255.5, 286.8, 287.0, 287.0, 0.07795751315533035, 0.04286140615864354, 0.06075204638472032], "isController": false}, {"data": ["AF-010-GET-Welcome", 10, 0, 0.0, 1117.4, 937, 1998, 986.5, 1927.7000000000003, 1998.0, 1998.0, 0.07555495111594662, 0.12888612168880426, 0.056223508545264964], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 10, 0, 0.0, 448.9, 426, 489, 439.5, 488.5, 489.0, 489.0, 0.07948809665752554, 0.05658869381185167, 0.23140040638289414], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 10, 0, 0.0, 1688.9, 1435, 1960, 1673.5, 1956.3, 1960.0, 1960.0, 0.07937641885348701, 0.05201325883856424, 0.23138536159927608], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 650, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
