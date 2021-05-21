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

    var data = {"OkPercent": 98.55682090215792, "KoPercent": 1.443179097842071};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4780787250778017, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5300382304751502, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5274390243902439, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [0.5151600224592925, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.3893728222996516, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.4754050925925926, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.3222520107238606, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.5563457330415755, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5141196013289037, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5765563656758272, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5098550724637682, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [0.5066809192944949, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.6468299711815562, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.15592930444697833, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [0.5249579360628155, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.5286103542234333, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [0.5661157024793388, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.4719804134929271, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.4581166955517042, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [0.5650588895120583, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5603400987383433, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [0.5824852704874129, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.11311239193083573, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.4355277475516866, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.5625, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.48454187745924676, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.35340314136125656, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [0.47339010111761576, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.5687044307347168, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5827089337175793, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5751738897806313, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.7611111111111111, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [0.4877398720682303, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5046728971962616, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.5447934845840605, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.13723776223776224, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.5436062065275549, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [0.5349902804776451, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5319829424307037, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.32392837764514376, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5179573512906847, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.5204711160964667, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.5002773155851359, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.530369961347322, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.5443213296398892, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.549915872125631, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.465836711059641, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.5294447560291643, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [0.5516273849607183, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.3606194690265487, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [0.4997276688453159, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5127635960044395, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [0.1607447413303013, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.48642533936651583, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5111940298507462, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5015804597701149, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.5016411378555798, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.45286195286195285, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 116964, 1688, 1.443179097842071, 2055.1862282411726, 0, 33344, 910.0, 6054.0, 9661.95, 17212.950000000008, 31.68705873365007, 49.38428461964029, 69.88451870110191], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 1831, 1, 0.054614964500273075, 1910.771163298746, 243, 19271, 799.0, 5492.399999999998, 7643.199999999997, 12123.84, 0.5007379800322868, 0.9807998045761326, 1.382897468292292], "isController": false}, {"data": ["ST10-030-GET-customers/email", 1804, 0, 0.0, 1807.529379157428, 246, 12602, 844.5, 4960.5, 6958.25, 10332.400000000001, 0.4932701706895255, 0.7010961606819378, 1.3338526392961878], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1781, 0, 0.0, 1561.8556990454808, 241, 14406, 872.0, 3929.9999999999986, 5730.7, 9643.000000000004, 0.4872075865415812, 0.27119953547724734, 1.3017577702907872], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1722, 1, 0.05807200929152149, 2055.222996515682, 354, 19885, 1288.5, 4998.0, 7380.749999999998, 12775.629999999997, 0.4712946782291691, 0.31296885498588445, 1.311708821243293], "isController": false}, {"data": ["ST14-090-GET-id", 1728, 0, 0.0, 1837.5607638888869, 254, 17727, 969.0, 4972.1, 6637.799999999999, 10059.11, 0.4729739716511226, 1.6585587247275062, 1.2636439339445864], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 1865, 18, 0.9651474530831099, 1868.2589812332446, 294, 16220, 1319.0, 3828.0000000000005, 6203.2999999999965, 10819.619999999997, 0.509584422291108, 0.4044794332137017, 0.5946810396854239], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1828, 4, 0.2188183807439825, 1586.1548140043767, 241, 15235, 743.0, 4597.700000000005, 6728.749999999999, 9651.520000000004, 0.49984687404296274, 0.278351501659776, 1.3355283665835411], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1806, 1, 0.05537098560354374, 1688.3560354374338, 259, 16156, 907.0, 4244.799999999999, 5954.899999999989, 10061.750000000005, 0.4938209491643325, 0.37998154656942096, 1.4211819699094608], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1783, 0, 0.0, 1277.681996634886, 241, 11316, 747.0, 3052.000000000001, 4553.999999999999, 8710.760000000002, 0.487495321220592, 0.2713597002888061, 1.3025265613862693], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1725, 0, 0.0, 1572.4573913043478, 259, 21341, 909.0, 4138.4, 6046.099999999994, 9117.760000000002, 0.4721448239241941, 2.0134474886000975, 1.2614277544005266], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 1871, 1, 0.05344735435595938, 1712.063067878141, 253, 23952, 942.0, 4806.4, 6456.9999999999945, 9770.8, 0.5112474437627812, 0.35297294120094236, 0.44784077837423314], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 3470, 0, 0.0, 701.3403458213252, 224, 1600, 878.0, 924.0, 948.8999999999996, 1020.5799999999999, 0.9469704722599055, 1.6232124141415714, 0.6316219067905424], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1754, 2, 0.11402508551881414, 7546.063283922459, 264, 29455, 6700.5, 15819.5, 17924.5, 22471.50000000001, 0.47892197230662364, 0.3590384243753809, 1.315632332127473], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1783, 0, 0.0, 1906.9158721256288, 242, 18085, 819.0, 6027.8, 7492.6, 10620.920000000004, 0.48751344900043336, 0.9552349614712625, 1.3463750329816655], "isController": false}, {"data": ["ST06-030-GET-suffixes", 1835, 4, 0.21798365122615804, 1878.674659400544, 241, 19836, 797.0, 5437.800000000001, 7399.59999999999, 10932.279999999984, 0.5018336756376843, 0.38606025354223467, 1.325644621679625], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1815, 2, 0.11019283746556474, 1331.809917355373, 241, 12496, 789.0, 3091.2000000000035, 5238.399999999998, 8489.679999999991, 0.4962853791319518, 0.27631081546660397, 1.3260124973681835], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 1838, 0, 0.0, 2413.576713819368, 258, 17901, 1038.5, 7724.200000000001, 9348.749999999998, 12021.469999999998, 0.5026363797710461, 1.0844650585333464, 1.3611432432667099], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1731, 0, 0.0, 2106.515886770653, 241, 17841, 1077.0, 5822.199999999998, 7617.999999999997, 10397.640000000001, 0.4737997756636071, 0.26373620325025005, 1.2659337756012001], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 90, 0, 0.0, 8.444444444444443, 0, 195, 0.0, 1.0, 85.95000000000037, 195.0, 0.08962349171132074, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1783, 0, 0.0, 1501.2473359506462, 241, 12021, 718.0, 4362.400000000003, 5908.399999999998, 10096.520000000002, 0.4875031853124559, 0.2713640777618163, 1.3025475732567182], "isController": false}, {"data": ["ST07-030-GET-core/products", 1823, 1, 0.05485463521667581, 1500.2051563357097, 242, 17545, 726.0, 4140.6, 5916.799999999999, 9882.52, 0.4984788601759961, 2.451799593194902, 1.3167825359141303], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 1867, 0, 0.0, 1253.2758435993594, 240, 15670, 751.0, 2866.600000000003, 4886.4, 7973.439999999999, 0.510163790721905, 0.2839778913198104, 0.3950780137133503], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 3470, 1590, 45.821325648414984, 2058.857636887608, 936, 16034, 1037.0, 4982.700000000001, 7055.049999999998, 10397.979999999998, 0.9469497982887771, 0.6332390985815675, 0.6843191901696241], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 1838, 2, 0.1088139281828074, 2537.1838955386347, 292, 19201, 1221.0, 6967.700000000001, 8774.899999999998, 14279.449999999926, 0.5026337681288624, 0.3661407679125494, 1.4048221136570354], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1808, 0, 0.0, 1357.508849557524, 240, 12160, 786.5, 3118.9000000000024, 5020.999999999999, 8973.19, 0.4943684921022719, 0.2751855864241162, 1.3208908148357579], "isController": false}, {"data": ["ST14-060-POST-middesk", 1779, 1, 0.056211354693648116, 1839.4159640247324, 264, 17549, 994.0, 4801.0, 6893.0, 9671.800000000007, 0.4866346437911, 0.40199924493328265, 1.3372948121368704], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1719, 0, 0.0, 2086.482257126237, 396, 26089, 1329.0, 4992.0, 7012.0, 12881.599999999995, 0.4704546798061913, 2.063666572891602, 1.2983446534495084], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 1879, 0, 0.0, 2566.9856306545994, 248, 25144, 1063.0, 7734.0, 9936.0, 13297.000000000002, 0.5134250120773739, 0.38105762615117594, 0.6096922018418816], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 90, 0, 0.0, 2.51111111111111, 0, 49, 0.0, 1.0, 29.40000000000009, 49.0, 0.08964098784368603, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1783, 0, 0.0, 1306.954570947843, 244, 11915, 824.0, 3004.0000000000045, 4763.399999999999, 8617.800000000025, 0.4874925221982714, 0.6871682836216729, 1.321085692480667], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 3470, 0, 0.0, 887.4674351585022, 231, 3324, 917.0, 1552.0, 1703.0, 1932.87, 0.9469740902976638, 1.630719456145548, 0.7943854917633723], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 1869, 0, 0.0, 1339.3124665596595, 240, 15959, 738.0, 3434.0, 5483.5, 8006.499999999996, 0.5107068083857567, 0.2842801570116028, 0.39549853422842285], "isController": false}, {"data": ["eProtect/paypage_01", 90, 0, 0.0, 658.011111111111, 346, 2691, 485.0, 1193.900000000001, 1768.4, 2691.0, 0.08944383821398544, 0.04105332418024722, 0.09975084300817517], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 1876, 0, 0.0, 2094.624200426438, 245, 14781, 972.5, 5877.9, 7770.9, 10903.060000000001, 0.512612844503976, 0.34941773971071804, 0.44403085261233083], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1819, 3, 0.16492578339747113, 1736.952171522814, 291, 18309, 953.0, 4655.0, 5994.0, 10747.799999999994, 0.49736538528317975, 0.3220374755692154, 1.410982855710583], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1719, 0, 0.0, 1397.8557300756256, 241, 16031, 855.0, 3481.0, 5086.0, 8549.399999999998, 0.4704951119417079, 0.26189669317067726, 1.2571041272192507], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1716, 11, 0.6410256410256411, 9463.490093240092, 378, 33344, 10015.5, 17442.6, 18503.35, 21837.47999999998, 0.47195173770924637, 0.35080632823748303, 1.3126157705038415], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 1869, 0, 0.0, 1514.1252006420575, 258, 21059, 895.0, 3582.0, 6228.5, 9464.599999999999, 0.5107010868451434, 0.34711714496505836, 0.48327085268842174], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 3601, 14, 0.38878089419605666, 1782.191058039436, 240, 13063, 794.0, 5158.200000000002, 7194.699999999992, 10469.580000000002, 0.9843359108483056, 0.5483287132507304, 2.6300225117978164], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 1876, 5, 0.26652452025586354, 1585.7819829424316, 240, 12518, 810.0, 4577.099999999996, 6638.15, 8784.650000000003, 0.5126166264306335, 0.28548867012395973, 0.39697752417919174], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 1843, 0, 0.0, 1753.8572978838858, 447, 14149, 1354.0, 3497.800000000001, 4811.199999999999, 7862.119999999994, 0.5035927778838883, 2.3699351529516193, 0.4853965544642557], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1782, 0, 0.0, 1508.231200897869, 277, 12390, 978.0, 3460.2000000000003, 5606.599999999993, 9148.34, 0.4872001955362401, 0.3192493468797042, 1.3983216549619235], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1783, 0, 0.0, 1918.8182837913625, 259, 16227, 881.0, 5398.000000000001, 7352.599999999998, 11696.840000000002, 0.48749692067634937, 0.36847911777685, 1.4001254333097104], "isController": false}, {"data": ["ST10-010-PUT-businesses", 3606, 4, 0.11092623405435385, 1995.681364392677, 256, 15957, 916.5, 5723.7000000000035, 7849.549999999997, 11010.93, 0.9856875758536613, 0.754558138756164, 2.727004787493576], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1811, 1, 0.05521811154058531, 1479.868580894531, 259, 18356, 921.0, 3221.5999999999985, 5462.4, 9320.839999999986, 0.4951845963958436, 0.380547604250576, 1.3752978438962686], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1805, 0, 0.0, 1545.6897506925188, 241, 17543, 801.0, 4212.600000000003, 5887.099999999994, 9015.220000000001, 0.4935568275315569, 0.274733780950183, 1.3187221485608784], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1783, 0, 0.0, 1374.588895120583, 258, 15515, 893.0, 3294.8, 4960.799999999999, 8758.800000000017, 0.4874791939614916, 0.3717980961757079, 1.3786520954223433], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1727, 1, 0.05790387955993052, 1831.900405327159, 279, 20065, 1014.0, 4930.400000000001, 6614.399999999998, 9996.16, 0.47268693372337983, 0.28944232427377414, 1.5242307179244143], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1783, 0, 0.0, 1576.7577117218161, 258, 13713, 824.0, 3970.000000000001, 6046.0, 10331.520000000019, 0.4874903896314102, 0.3689502460589287, 1.3591650999977307], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1782, 0, 0.0, 1291.8030303030298, 241, 11414, 805.5, 3012.400000000001, 4424.0, 7699.5700000000015, 0.48721511449555194, 0.27120372584225055, 1.3017778840428027], "isController": false}, {"data": ["ST09-010-GET-industries", 1808, 0, 0.0, 1738.43971238938, 486, 11174, 1128.0, 3830.2000000000003, 5506.7999999999965, 8929.690000000004, 0.4943364572043523, 14.218544756298005, 1.314529465788527], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 1836, 1, 0.054466230936819175, 1943.8355119825703, 241, 19877, 899.0, 5333.799999999999, 7577.249999999998, 10146.039999999999, 0.5021064679025159, 0.2795219686108251, 1.3415657189270347], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 1802, 0, 0.0, 2067.7630410654783, 244, 14345, 855.5, 6046.200000000001, 8368.549999999994, 11037.950000000004, 0.49272263434347857, 0.6170744533772828, 1.3352590920929228], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 3518, 16, 0.4548038658328596, 7050.855599772613, 260, 31031, 6340.0, 15053.4, 17213.3, 20435.59999999999, 0.9605306016913311, 0.7198044241403346, 2.5983103190283074], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 5525, 4, 0.07239819004524888, 2070.819185520364, 241, 19285, 979.0, 5745.800000000001, 7854.4, 10701.919999999998, 1.5106909066250838, 0.8410283510542162, 4.086546003819246], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 1876, 0, 0.0, 1999.639658848615, 240, 15733, 868.5, 5689.2, 8027.599999999997, 9873.51, 0.5126162062138047, 0.28534300541198115, 0.39697719875737025], "isController": false}, {"data": ["AF-010-GET-Welcome", 3480, 0, 0.0, 1068.5879310344803, 320, 3788, 1059.0, 1733.0, 1924.9499999999998, 2365.57, 0.9493225437915943, 1.6426272747766364, 0.6313365745332771], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1828, 0, 0.0, 2023.080962800875, 268, 15917, 947.0, 6119.800000000001, 8344.3, 11662.550000000003, 0.4998378534753223, 0.3592584571853879, 1.4633924655459143], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1782, 0, 0.0, 1836.7008978675667, 308, 19894, 1066.5, 4203.500000000001, 6783.25, 10939.87, 0.4871903388679468, 0.32257329077389446, 1.4268396740868872], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 1336, 79.14691943127963, 1.142231797818132], "isController": false}, {"data": ["502/Bad Gateway", 334, 19.786729857819907, 0.285557949454533], "isController": false}, {"data": ["500/Internal Server Error", 18, 1.066350710900474, 0.015389350569405972], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 116964, 1688, "503/Service Temporarily Unavailable", 1336, "502/Bad Gateway", 334, "500/Internal Server Error", 18, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 1831, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1722, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 1865, 18, "500/Internal Server Error", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1828, 4, "502/Bad Gateway", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1806, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 1871, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1754, 2, "502/Bad Gateway", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-030-GET-suffixes", 1835, 4, "502/Bad Gateway", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1815, 2, "502/Bad Gateway", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-030-GET-core/products", 1823, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 3470, 1590, "503/Service Temporarily Unavailable", 1336, "502/Bad Gateway", 254, null, null, null, null, null, null], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 1838, 2, "502/Bad Gateway", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-060-POST-middesk", 1779, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1819, 3, "502/Bad Gateway", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1716, 11, "502/Bad Gateway", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 3601, 14, "502/Bad Gateway", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 1876, 5, "502/Bad Gateway", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST10-010-PUT-businesses", 3606, 4, "502/Bad Gateway", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1811, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1727, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 1836, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 3518, 16, "502/Bad Gateway", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 5525, 4, "502/Bad Gateway", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
