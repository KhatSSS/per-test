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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8471354166666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9966666666666667, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.995, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.39166666666666666, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.7566666666666667, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.995, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.995, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.445, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [0.995, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [0.995, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.995, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.99, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [0.995, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.495, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.995, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5016666666666667, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5133333333333333, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.6116666666666667, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.99, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [0.9941666666666666, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.975, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.995, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.99, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.61, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.7233333333333334, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [0.995, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [0.9941666666666666, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.9938888888888889, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5016666666666667, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.4633333333333333, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19200, 0, 0.0, 545.1851041666687, 0, 16693, 278.0, 1037.0, 1680.9000000000015, 4664.980000000003, 9.023921852836756, 53.37853104270242, 19.781688065581353], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 300, 0, 0.0, 266.2166666666664, 247, 875, 257.0, 279.0, 283.95, 372.5700000000004, 0.14355756706291745, 0.2801054872965909, 0.3919794506913254], "isController": false}, {"data": ["ST10-030-GET-customers/email", 300, 0, 0.0, 277.10666666666646, 251, 1365, 264.5, 285.0, 293.0, 866.0600000000045, 0.1435826454528094, 0.20289461715841328, 0.38377509824642514], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 300, 0, 0.0, 255.14333333333323, 240, 877, 249.0, 269.0, 275.95, 311.84000000000015, 0.14365697014041992, 0.07912356558515315, 0.3793441867770463], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 300, 0, 0.0, 3309.220000000001, 2799, 4036, 3298.0, 3480.7000000000003, 3571.6, 3988.4600000000005, 0.1434846490556797, 0.09444204439797668, 0.39486302835830606], "isController": false}, {"data": ["ST14-090-GET-id", 300, 0, 0.0, 1506.9633333333334, 1201, 7453, 1445.5, 1710.3000000000002, 2168.6, 3175.3400000000006, 0.14359288545116886, 14.04898488056662, 0.37903473571729435], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 300, 0, 0.0, 509.78000000000037, 475, 1551, 500.0, 527.0, 553.75, 820.4900000000005, 0.14352370796369998, 0.11324917581510703, 0.16328624978292042], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 300, 0, 0.0, 261.77999999999963, 239, 1046, 248.5, 269.0, 275.0, 855.95, 0.14356271944159843, 0.07907165406744289, 0.37909530602547087], "isController": false}, {"data": ["ST09-020-PUT-businesses", 300, 0, 0.0, 303.02333333333354, 277, 1139, 291.0, 313.0, 324.9, 1128.7200000000066, 0.14357481180931542, 0.10964404573719204, 0.4087115004142133], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 300, 0, 0.0, 258.84, 240, 868, 248.0, 269.0, 274.95, 837.2200000000043, 0.143596734418797, 0.07909038887910302, 0.3791851268246358], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 300, 0, 0.0, 1238.830000000001, 980, 2843, 1219.0, 1548.9, 1697.75, 2409.3200000000024, 0.1436251956893291, 14.162705223199538, 0.3791200233869694], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 300, 0, 0.0, 286.1600000000001, 265, 1089, 279.0, 297.0, 304.0, 602.8800000000019, 0.14353139868955833, 0.09825733445447303, 0.12236612407810978], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 300, 0, 0.0, 865.7833333333335, 249, 1566, 880.5, 896.0, 905.0, 1005.4500000000005, 0.14345507728164106, 0.15864254303174136, 0.09316174452372197], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 300, 0, 0.0, 472.7766666666667, 419, 1207, 461.0, 500.80000000000007, 522.6999999999999, 1054.7100000000012, 0.14365325551796096, 0.11545569266726745, 0.3901364292924311], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 300, 0, 0.0, 267.2366666666668, 247, 831, 261.0, 280.0, 285.0, 373.4700000000005, 0.14358896796386536, 0.2801667558513701, 0.3920651898700855], "isController": false}, {"data": ["ST06-030-GET-suffixes", 300, 0, 0.0, 259.55666666666684, 242, 874, 251.0, 272.0, 275.95, 367.3400000000006, 0.14355667402155362, 0.10963019441880363, 0.3747333883394656], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 300, 0, 0.0, 258.70333333333355, 239, 865, 248.0, 269.0, 274.0, 769.9300000000037, 0.14356835313220684, 0.07907475699859828, 0.3791101824897336], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 300, 0, 0.0, 291.49999999999983, 260, 1265, 279.0, 301.90000000000003, 308.0, 886.0300000000045, 0.14354437865858735, 0.30839612602430877, 0.384233537014832], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 300, 0, 0.0, 266.39666666666665, 239, 1045, 251.0, 272.80000000000007, 280.0, 856.98, 0.14367355070503005, 0.07913269784925483, 0.37938796983047], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 300, 0, 0.0, 0.7966666666666672, 0, 175, 0.0, 1.0, 1.0, 1.0, 0.14349755193176406, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 300, 0, 0.0, 262.26333333333315, 239, 925, 250.5, 270.0, 276.0, 873.9100000000001, 0.1435923356154942, 0.07908796610072141, 0.3791735112346643], "isController": false}, {"data": ["ST07-030-GET-core/products", 300, 0, 0.0, 268.0399999999999, 242, 1584, 251.0, 272.0, 279.0, 872.8300000000002, 0.14356388736551653, 0.705622114365864, 0.3747522177031501], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 300, 0, 0.0, 256.5166666666668, 238, 1065, 246.0, 268.0, 274.0, 568.9300000000019, 0.14353922759627774, 0.07905871519951234, 0.10779459572415778], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 300, 0, 0.0, 1018.2333333333331, 948, 2064, 986.5, 1076.0, 1131.6999999999998, 1643.2000000000016, 0.14344958966244878, 0.0897960810289352, 0.10030264277179034], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 300, 0, 0.0, 356.76, 328, 1287, 348.0, 370.0, 376.0, 945.2800000000043, 0.14354382919432676, 0.1037328453162127, 0.3967080435741648], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 300, 0, 0.0, 255.0133333333333, 240, 859, 248.0, 268.0, 273.84999999999997, 297.96000000000004, 0.1435711701433223, 0.07907630855550174, 0.3791176211597105], "isController": false}, {"data": ["ST14-060-POST-middesk", 300, 0, 0.0, 601.5899999999998, 493, 1498, 585.5, 648.0, 691.9, 1214.92, 0.14363654209388563, 0.1204919820885232, 0.39023130869647443], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 300, 0, 0.0, 1827.5466666666657, 1482, 3601, 1767.0, 2048.9000000000005, 2165.45, 2785.6200000000013, 0.14360422675107404, 14.348177983976163, 0.39182637650634855], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 300, 0, 0.0, 269.05, 253, 398, 264.0, 285.0, 289.0, 328.7700000000002, 0.14352315865767573, 0.10568013830848388, 0.16678960820569738], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 300, 0, 0.0, 0.27666666666666656, 0, 44, 0.0, 1.0, 1.0, 1.0, 0.14350963332331954, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 300, 0, 0.0, 278.8633333333334, 251, 1494, 263.0, 285.0, 291.0, 943.2000000000007, 0.14359728428815952, 0.2015129858614114, 0.38465561601798987], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 300, 0, 0.0, 882.0400000000001, 237, 1556, 904.0, 926.9000000000001, 963.8499999999999, 1391.5200000000004, 0.1434524020148368, 0.15886466284979672, 0.11697534734608274], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 300, 0, 0.0, 253.71666666666667, 239, 564, 247.0, 269.0, 272.0, 366.97, 0.14353538171081737, 0.07905659695791112, 0.10779170755431497], "isController": false}, {"data": ["eProtect/paypage_01", 300, 0, 0.0, 900.1199999999991, 359, 16693, 546.0, 1469.300000000002, 2004.4499999999998, 13689.260000000075, 0.14330822254811573, 0.06577623495860781, 0.15982225600580877], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 300, 0, 0.0, 268.8566666666669, 253, 620, 263.0, 283.90000000000003, 289.95, 382.6400000000003, 0.14352899524919027, 0.09699420382074185, 0.12096242470708124], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 300, 0, 0.0, 354.16999999999985, 319, 951, 342.0, 366.0, 378.84999999999997, 938.97, 0.1435597653659195, 0.09210816977090731, 0.4027804745080924], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 300, 0, 0.0, 260.75333333333333, 239, 877, 251.0, 271.0, 277.95, 785.9100000000019, 0.14369749951981087, 0.07914588840739582, 0.3794512096695005], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 300, 0, 0.0, 4916.189999999999, 4227, 8019, 4802.5, 5571.800000000001, 6030.95, 6754.27, 0.1434232549334014, 0.11106898550994856, 0.3944139510668539], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 300, 0, 0.0, 600.5100000000001, 537, 837, 595.0, 640.0, 650.0, 747.4400000000005, 0.14350963332331954, 0.09670082714168993, 0.1324380893462275], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 600, 0, 0.0, 261.8716666666663, 239, 1114, 251.0, 270.0, 276.94999999999993, 858.8900000000001, 0.28702269919016543, 0.1580867210383333, 0.7579193150490307], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 300, 0, 0.0, 260.79333333333324, 239, 1504, 247.0, 268.0, 271.95, 574.8900000000019, 0.14353160470247814, 0.07905451665253678, 0.10778887110957586], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 300, 0, 0.0, 481.24666666666684, 453, 1767, 466.5, 488.0, 497.0, 800.1000000000008, 0.14353146736046588, 0.6719627485606186, 0.13371974595887154], "isController": false}, {"data": ["ST14-020-POST-senti-link", 300, 0, 0.0, 587.1933333333328, 536, 1379, 576.0, 613.0, 627.9, 1162.2900000000043, 0.14357769778904705, 0.09324137600558231, 0.40759801511011695], "isController": false}, {"data": ["ST12-010-PUT-businesses", 300, 0, 0.0, 304.4000000000001, 276, 1171, 291.0, 312.90000000000003, 320.95, 1102.2200000000025, 0.14358855560921513, 0.10769141670691135, 0.4079092854171942], "isController": false}, {"data": ["ST10-010-PUT-businesses", 600, 0, 0.0, 298.5450000000003, 274, 920, 290.0, 310.9, 316.0, 858.5000000000041, 0.287014598519196, 0.21806382582806105, 0.7850858305197931], "isController": false}, {"data": ["ST08-010-PUT-businesses", 300, 0, 0.0, 302.8233333333332, 274, 998, 290.0, 312.90000000000003, 326.9, 898.8700000000001, 0.1435667042013839, 0.10949765232546954, 0.394247629115519], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 300, 0, 0.0, 264.72666666666674, 240, 980, 249.0, 270.90000000000003, 277.9, 865.3300000000006, 0.1435790721058886, 0.07908066080832146, 0.37913848727961214], "isController": false}, {"data": ["ST14-010-PUT-businesses", 300, 0, 0.0, 297.8066666666666, 275, 1027, 290.0, 311.0, 327.5999999999999, 404.96000000000004, 0.14359700935295186, 0.1086793771958376, 0.4016228855340373], "isController": false}, {"data": ["ST15-010-POST-add-payment", 300, 0, 0.0, 547.1233333333334, 461, 1510, 526.5, 603.0, 627.8, 1254.860000000001, 0.14367217457893275, 0.0876905362420244, 0.45879688561827164], "isController": false}, {"data": ["ST13-010-PUT-businesses", 300, 0, 0.0, 296.08333333333354, 277, 883, 291.0, 310.90000000000003, 316.9, 403.6800000000003, 0.1435926792622974, 0.10783473667256514, 0.39586145855221244], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 300, 0, 0.0, 264.6700000000002, 239, 988, 248.0, 270.0, 276.0, 793.98, 0.1436058078018163, 0.07909538632834415, 0.3792090862266712], "isController": false}, {"data": ["ST09-010-GET-industries", 300, 0, 0.0, 561.4433333333329, 478, 1331, 511.0, 747.4000000000002, 795.8499999999999, 1234.0700000000008, 0.14354073853623853, 4.12770924920299, 0.37721496816505656], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 300, 0, 0.0, 258.05666666666673, 240, 1031, 247.0, 269.0, 272.95, 560.0300000000018, 0.14355516274609542, 0.07906749198124786, 0.37907535162640815], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 300, 0, 0.0, 269.5466666666664, 251, 897, 264.0, 284.90000000000003, 291.0, 351.7800000000002, 0.14358408858563929, 0.17891923538601148, 0.3846202685453209], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 600, 0, 0.0, 272.4583333333328, 250, 1026, 261.0, 284.0, 290.0, 836.4300000000023, 0.2872345772984152, 0.2336585965718553, 0.768015891252989], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 900, 0, 0.0, 260.67000000000013, 239, 1046, 248.0, 269.0, 275.94999999999993, 839.7100000000003, 0.4305268404783249, 0.23712611135720238, 1.1511547746383335], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 300, 0, 0.0, 253.8266666666667, 239, 604, 248.0, 269.0, 273.0, 361.5400000000004, 0.1435278965604018, 0.0790524742774088, 0.1077860863817861], "isController": false}, {"data": ["AF-010-GET-Welcome", 300, 0, 0.0, 1002.1433333333331, 317, 1697, 1009.5, 1059.9, 1076.0, 1377.4800000000014, 0.1434382727736946, 0.15913383768023018, 0.09371113719297036], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 300, 0, 0.0, 327.95666666666665, 302, 1159, 319.0, 340.90000000000003, 351.95, 485.4700000000005, 0.14355536882723877, 0.10233927660535576, 0.41594607354532953], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 300, 0, 0.0, 1177.9233333333332, 970, 4499, 1111.0, 1429.9, 1548.95, 1851.94, 0.14355516274609542, 0.09420807555212511, 0.4159454764332667], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19200, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
