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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.86015625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.75, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.6, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.95, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.6, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.4, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.9, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.95, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.2, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 640, 0, 0.0, 684.0265624999994, 0, 26346, 266.5, 984.0, 1320.6999999999996, 11088.310000000003, 4.308342701734781, 25.795031752990596, 9.539939262465584], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 10, 0, 0.0, 254.6, 245, 271, 255.0, 270.0, 271.0, 271.0, 0.0981730004614131, 0.19078542081856648, 0.26978400712735984], "isController": false}, {"data": ["ST10-030-GET-customers/email", 10, 0, 0.0, 258.6, 248, 281, 258.0, 279.4, 281.0, 281.0, 0.09828106418736302, 0.1381117689117338, 0.26441829280877455], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 10, 0, 0.0, 249.7, 239, 260, 250.5, 259.9, 260.0, 260.0, 0.09868161364174627, 0.05425561375029605, 0.26231577376253257], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 10, 0, 0.0, 4880.4, 4690, 5326, 4863.0, 5286.900000000001, 5326.0, 5326.0, 0.0941947759577254, 0.061907308808153504, 0.2608753756016691], "isController": false}, {"data": ["ST14-090-GET-id", 10, 0, 0.0, 508.7, 488, 551, 507.5, 548.0, 551.0, 551.0, 0.09883278481137764, 9.667969715163915, 0.26281413382947394], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 10, 0, 0.0, 690.1, 617, 759, 674.0, 758.6, 759.0, 759.0, 0.09481009537895595, 0.07471850290118892, 0.11045746463583442], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 10, 0, 0.0, 258.6, 241, 310, 253.5, 306.5, 310.0, 310.0, 0.09820288716488265, 0.053992407689286065, 0.26104322154571347], "isController": false}, {"data": ["ST09-020-PUT-businesses", 10, 0, 0.0, 295.4, 272, 334, 290.0, 332.9, 334.0, 334.0, 0.09823761714835845, 0.07492537011022261, 0.2817616030905554], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 10, 0, 0.0, 250.39999999999998, 240, 266, 249.5, 265.3, 266.0, 266.0, 0.09822893234973429, 0.054006727454004304, 0.2611124549374773], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 10, 0, 0.0, 301.1, 267, 521, 272.0, 499.30000000000007, 521.0, 521.0, 0.09887187194115146, 9.748196901479123, 0.26291807353101115], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 10, 0, 0.0, 269.0, 257, 299, 267.0, 296.6, 299.0, 299.0, 0.09479122233281198, 0.0647986871415707, 0.0834977368595668], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 956.5, 815, 1062, 1040.5, 1061.3, 1062.0, 1062.0, 0.09319751349034007, 0.15912747322901424, 0.0632541717536976], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 10, 0, 0.0, 539.4, 481, 609, 535.5, 606.5, 609.0, 609.0, 0.09873910167165299, 0.07983982049231315, 0.2698933062294499], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 10, 0, 0.0, 254.3, 244, 265, 256.0, 264.5, 265.0, 265.0, 0.09827044025157233, 0.19097478134827042, 0.27005177623820753], "isController": false}, {"data": ["ST06-030-GET-suffixes", 10, 0, 0.0, 247.6, 239, 263, 247.5, 262.4, 263.0, 263.0, 0.09816914543758896, 0.07487314705737987, 0.2579816116919452], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 10, 0, 0.0, 253.8, 239, 307, 248.0, 303.6, 307.0, 307.0, 0.0983139163348572, 0.054053452047387304, 0.26133835963230595], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 10, 0, 0.0, 286.3, 270, 317, 281.0, 315.3, 317.0, 317.0, 0.09802960494069209, 0.21003608714831878, 0.26412468753063423], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 10, 0, 0.0, 249.3, 239, 259, 250.0, 258.8, 259.0, 259.0, 0.09908838684106223, 0.05447925956202933, 0.2633970595521205], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 49.5, 0, 486, 1.0, 437.70000000000016, 486.0, 486.0, 0.09286344430514928, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 10, 0, 0.0, 249.8, 240, 263, 249.5, 262.7, 263.0, 263.0, 0.09824051242251279, 0.05401309423229952, 0.2611432371231248], "isController": false}, {"data": ["ST07-030-GET-core/products", 10, 0, 0.0, 249.8, 241, 268, 249.0, 267.0, 268.0, 268.0, 0.09821928437429406, 0.7681054973333464, 0.2581133732922122], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 10, 0, 0.0, 247.9, 239, 261, 247.5, 260.3, 261.0, 261.0, 0.09518098664610757, 0.052330952618904844, 0.07417424545272835], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 10, 0, 0.0, 994.0, 941, 1182, 977.0, 1165.0, 1182.0, 1182.0, 0.09390112211840931, 0.05868820132400582, 0.06831673435372553], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 10, 0, 0.0, 426.90000000000003, 363, 509, 409.5, 505.8, 509.0, 509.0, 0.09792401096748922, 0.0706697696337642, 0.2723511555033294], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 10, 0, 0.0, 255.20000000000005, 240, 305, 251.5, 300.6, 305.0, 305.0, 0.09829555507499951, 0.05404335694064915, 0.26128955167397333], "isController": false}, {"data": ["ST14-060-POST-middesk", 10, 0, 0.0, 708.3999999999999, 615, 970, 698.5, 946.0000000000001, 970.0, 970.0, 0.09828299605885187, 0.08292627792465626, 0.26874256734842306], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 10, 0, 0.0, 1057.0, 927, 1321, 1050.5, 1299.7, 1321.0, 1321.0, 0.09777751703773234, 9.767697043085663, 0.26850622842783534], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 10, 0, 0.0, 263.09999999999997, 250, 297, 261.5, 294.2, 297.0, 297.0, 0.09471401104365369, 0.069648096011593, 0.11201041735728966], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 14.899999999999999, 0, 141, 1.0, 127.10000000000005, 141.0, 141.0, 0.09328358208955224, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 10, 0, 0.0, 254.0, 244, 269, 252.0, 268.2, 269.0, 269.0, 0.09822796746689717, 0.13880455949667989, 0.2648509943126007], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 850.5999999999999, 234, 1094, 1022.0, 1093.0, 1094.0, 1094.0, 0.09392405301073552, 0.16082659623928092, 0.07924841972780809], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 10, 0, 0.0, 247.89999999999998, 238, 261, 247.5, 260.8, 261.0, 261.0, 0.09483077448293521, 0.052138404329973166, 0.07390132620838115], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 1156.1999999999998, 587, 3129, 720.0, 3060.4, 3129.0, 3129.0, 0.09016807328860997, 0.041385736763326846, 0.11218176305633702], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 10, 0, 0.0, 257.50000000000006, 248, 270, 259.0, 269.4, 270.0, 270.0, 0.09478942529171445, 0.06396434851227997, 0.08257047593770439], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 10, 0, 0.0, 419.20000000000005, 352, 513, 409.5, 512.1, 513.0, 513.0, 0.0981152068759137, 0.0628550544048822, 0.2770029912873696], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 10, 0, 0.0, 248.20000000000002, 239, 259, 248.0, 258.8, 259.0, 259.0, 0.09850760971285032, 0.054159945574545634, 0.26185323597497906], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 10, 0, 0.0, 13989.9, 7247, 26346, 11390.5, 26081.7, 26346.0, 26346.0, 0.09219308920603313, 0.071395624746469, 0.25515157696279084], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 10, 0, 0.0, 512.6, 457, 862, 479.0, 824.1000000000001, 862.0, 862.0, 0.09463334311211213, 0.06367419277758325, 0.09001257440546602], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 20, 0, 0.0, 248.25, 240, 260, 248.5, 259.9, 260.0, 260.0, 0.19442203190465543, 0.10689414449445411, 0.5168132527778048], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 10, 0, 0.0, 247.2, 238, 260, 246.5, 259.7, 260.0, 260.0, 0.09480290476100188, 0.0521230814262149, 0.07387960742117139], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 10, 0, 0.0, 468.70000000000005, 455, 489, 467.5, 488.9, 489.0, 489.0, 0.09499111833043611, 0.44220962996209856, 0.09072393918668605], "isController": false}, {"data": ["ST14-020-POST-senti-link", 10, 0, 0.0, 599.7000000000002, 503, 660, 614.0, 657.4, 660.0, 660.0, 0.09788471138692847, 0.06347211753996143, 0.2796023250066072], "isController": false}, {"data": ["ST12-010-PUT-businesses", 10, 0, 0.0, 294.8, 269, 329, 288.5, 328.0, 329.0, 329.0, 0.09820867379006915, 0.07356059843455375, 0.2807195197104808], "isController": false}, {"data": ["ST10-010-PUT-businesses", 20, 0, 0.0, 288.90000000000003, 268, 336, 284.0, 320.20000000000005, 335.25, 336.0, 0.19435023856491782, 0.14747083531732535, 0.5350325415180698], "isController": false}, {"data": ["ST08-010-PUT-businesses", 10, 0, 0.0, 296.9, 272, 333, 287.5, 332.9, 333.0, 333.0, 0.098256922200169, 0.07484413995715998, 0.2722215705877729], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 10, 0, 0.0, 248.1, 239, 260, 249.0, 259.7, 260.0, 260.0, 0.09827526902854897, 0.054032203577219794, 0.2612356272419046], "isController": false}, {"data": ["ST14-010-PUT-businesses", 10, 0, 0.0, 300.4, 279, 342, 290.0, 341.3, 342.0, 342.0, 0.09821349649868885, 0.07423559208006364, 0.2769927518439584], "isController": false}, {"data": ["ST15-010-POST-add-payment", 10, 0, 0.0, 651.5999999999999, 555, 716, 650.0, 715.7, 716.0, 716.0, 0.09868356129235993, 0.06013529516253183, 0.3168667475871869], "isController": false}, {"data": ["ST13-010-PUT-businesses", 10, 0, 0.0, 307.70000000000005, 279, 335, 320.0, 334.3, 335.0, 335.0, 0.09816914543758896, 0.07362685907819173, 0.27236185760565457], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 10, 0, 0.0, 249.99999999999997, 240, 261, 250.5, 260.8, 261.0, 261.0, 0.09824630348283146, 0.054016278184408316, 0.261158630937761], "isController": false}, {"data": ["ST09-010-GET-industries", 10, 0, 0.0, 505.4, 483, 546, 501.0, 544.2, 546.0, 546.0, 0.09804978968320112, 2.8195442645775524, 0.25939148462089046], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 10, 0, 0.0, 248.09999999999997, 239, 261, 249.0, 260.6, 261.0, 261.0, 0.09816432708353784, 0.05397120717581231, 0.2609407210169824], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 10, 0, 0.0, 255.29999999999998, 245, 269, 255.5, 268.7, 269.0, 269.0, 0.09830038632051824, 0.1234514617267446, 0.265046256475538], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 20, 0, 0.0, 260.2, 244, 309, 256.5, 284.20000000000005, 307.84999999999997, 309.0, 0.19640963192834976, 0.16073366362886435, 0.52861811093216], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 30, 0, 0.0, 248.20000000000002, 239, 260, 248.5, 259.9, 260.0, 260.0, 0.2926715055022243, 0.16091216562280494, 0.7876979191055958], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 10, 0, 0.0, 248.5, 239, 261, 248.5, 260.8, 261.0, 261.0, 0.09479212087891255, 0.05211715239729274, 0.0738712035755588], "isController": false}, {"data": ["AF-010-GET-Welcome", 10, 0, 0.0, 1173.1, 954, 1384, 1236.0, 1377.1, 1384.0, 1384.0, 0.0925823056697404, 0.15852911597785432, 0.06889425480502166], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 10, 0, 0.0, 340.59999999999997, 294, 386, 339.0, 385.2, 386.0, 386.0, 0.09808441144448914, 0.06982767181936775, 0.2855367485508028], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 10, 0, 0.0, 1545.9, 1114, 1818, 1630.5, 1809.4, 1818.0, 1818.0, 0.097183618729227, 0.06368184391338996, 0.28329404483080334], "isController": false}]}, function(index, item){
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
