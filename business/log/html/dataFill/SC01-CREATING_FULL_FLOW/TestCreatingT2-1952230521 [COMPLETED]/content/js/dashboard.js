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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6401353637901861, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.728328173374613, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.8069767441860465, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [0.568075117370892, 500, 1500, "ST03-1.1-020-POST-commercial/lead"], "isController": false}, {"data": [0.5563380281690141, 500, 1500, "ST04-1.1-020-POST-commercial/lead"], "isController": false}, {"data": [0.5528846153846154, 500, 1500, "AF-1.2-030-POST-commercial/lead"], "isController": false}, {"data": [0.7993779160186625, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.3850393700787402, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.6960629921259842, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.5821596244131455, 500, 1500, "ST02-1.1-020-POST-commercial/lead"], "isController": false}, {"data": [0.6291079812206573, 500, 1500, "AF-1.1-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.36517719568567025, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.8080495356037152, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.6217054263565891, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.6056338028169014, 500, 1500, "AF-1.1-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.7769953051643192, 500, 1500, "ST02-1.1-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "AF-1.2-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-CREATING-FLOW"], "isController": false}, {"data": [0.8190993788819876, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.7141732283464567, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [0.5878274268104776, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.8028169014084507, 500, 1500, "ST04-1.1-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5474006116207951, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [0.7449612403100775, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.8397832817337462, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [0.625, 500, 1500, "ST02-1.2-020-POST-commercial/lead"], "isController": false}, {"data": [0.8103715170278638, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.3826291079812207, 500, 1500, "ST05-1.1-010-POST-commercial/lead"], "isController": false}, {"data": [0.7137345679012346, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.6543307086614173, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [0.8116279069767441, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "ST01-1.2-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5845070422535211, 500, 1500, "AF-1.1-030-POST-commercial/lead"], "isController": false}, {"data": [0.836687306501548, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [0.7980769230769231, 500, 1500, "ST03-1.2-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.7850539291217258, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "AF-1.2-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.333843797856049, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5494590417310664, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.7906976744186046, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.7109872611464968, 500, 1500, "ST05-1.1-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.723950233281493, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.36908517350157727, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [0.5629800307219662, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.7135093167701864, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.6476190476190476, 500, 1500, "AF-1.2-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.636085626911315, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.7873651771956857, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.65, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [0.6238095238095238, 500, 1500, "AF-1.2-010-GET-Welcome"], "isController": false}, {"data": [0.6084615384615385, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.6199690402476781, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.8201892744479495, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0031545741324921135, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.7582159624413145, 500, 1500, "ST01-1.1-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.7981220657276995, 500, 1500, "ST03-1.1-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.6057692307692307, 500, 1500, "ST03-1.2-020-POST-commercial/lead"], "isController": false}, {"data": [0.5657276995305164, 500, 1500, "AF-1.1-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.573959938366718, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [0.8116279069767441, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.800462249614792, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.6451863354037267, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.6713178294573643, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.6573643410852713, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.6503875968992248, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.8093023255813954, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.6692546583850931, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5881889763779528, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.6220657276995305, 500, 1500, "ST05-1.1-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.6496124031007752, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [0.8328149300155521, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5193798449612403, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [0.804953560371517, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.7980769230769231, 500, 1500, "ST02-1.2-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.6961722488038278, 500, 1500, "ST05-1.1-040-GET-applicants/email"], "isController": false}, {"data": [0.7217054263565892, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.7487139917695473, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.76, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.6335877862595419, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.6486068111455109, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.49611197511664074, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [0.6173708920187794, 500, 1500, "AF-1.1-010-GET-Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 44325, 0, 0.0, 1723.047151720256, 0, 44292, 680.5, 4830.9000000000015, 9656.650000000078, 18822.900000000016, 13.627446368735178, 20.629345273739503, 29.664174563264556], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 646, 0, 0.0, 921.2306501547992, 241, 9197, 381.5, 2362.100000000004, 4016.899999999998, 7747.849999999982, 0.1996790298690155, 0.39136309858116614, 0.5514573207710701], "isController": false}, {"data": ["ST10-030-GET-customers/email", 645, 0, 0.0, 693.513178294574, 249, 9008, 317.0, 1483.9999999999982, 2683.8999999999987, 5926.679999999989, 0.20035803514932266, 0.2848840812279431, 0.5417884759067133], "isController": false}, {"data": ["ST03-1.1-020-POST-commercial/lead", 213, 0, 0.0, 1539.2441314553987, 259, 12220, 780.0, 4599.0, 5846.499999999997, 10819.899999999967, 0.06675063248574656, 0.046086618327561335, 0.058471989589565086], "isController": false}, {"data": ["ST04-1.1-020-POST-commercial/lead", 213, 0, 0.0, 1516.5023474178404, 261, 14274, 761.0, 4222.8, 6246.999999999999, 9499.639999999989, 0.06674791318760144, 0.04536772224469785, 0.06316282019412675], "isController": false}, {"data": ["AF-1.2-030-POST-commercial/lead", 104, 0, 0.0, 1897.89423076923, 254, 21638, 683.0, 4848.0, 8467.75, 21174.700000000026, 0.0328617150592285, 0.024389554145521155, 0.039151652707283956], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 643, 0, 0.0, 699.8087091757383, 236, 8368, 281.0, 1502.6000000000004, 2779.9999999999955, 5426.759999999986, 0.19974148543673337, 0.11118422529193166, 0.5336842814012719], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 635, 0, 0.0, 1988.1401574803149, 350, 17008, 1088.0, 5324.999999999998, 7553.9999999999945, 12677.679999999988, 0.19848550868241255, 0.13180678310941457, 0.5524254880321052], "isController": false}, {"data": ["ST14-090-GET-id", 635, 0, 0.0, 1017.4346456692912, 250, 10958, 443.0, 2466.2, 4454.399999999997, 7486.159999999996, 0.19848830059943467, 0.6962597419464545, 0.5305297643951686], "isController": false}, {"data": ["ST02-1.1-020-POST-commercial/lead", 213, 0, 0.0, 1826.8873239436623, 249, 17310, 597.0, 6165.4, 7913.499999999998, 12682.959999999995, 0.06675243152783153, 0.04550116914690079, 0.05782168629412751], "isController": false}, {"data": ["AF-1.1-020-GET-maintenance/configuration", 213, 0, 0.0, 748.4647887323939, 236, 2030, 847.0, 1213.9999999999986, 1469.3999999999996, 1520.1599999999999, 0.06675322648429559, 0.1156107782133452, 0.05599709135743156], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 649, 0, 0.0, 2318.2865947611717, 437, 19335, 1061.0, 6767.0, 9001.0, 14396.0, 0.20062592816540725, 0.15948193899086086, 0.23412889077896648], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 646, 0, 0.0, 666.684210526316, 238, 10125, 278.0, 1335.6000000000029, 2674.399999999999, 6702.509999999996, 0.19967637590468698, 0.1111479826813199, 0.5335103168703356], "isController": false}, {"data": ["ST09-020-PUT-businesses", 645, 0, 0.0, 1280.3317829457376, 259, 14219, 565.0, 3614.1999999999966, 5667.299999999965, 8331.559999999989, 0.20035560790687099, 0.15417990139708432, 0.5766093520522938], "isController": false}, {"data": ["AF-1.1-030-OPTIONS-commercial/lead", 213, 0, 0.0, 1222.211267605634, 229, 8880, 606.0, 3380.3999999999996, 4463.9, 7073.219999999993, 0.06675343568651207, 0.04217721961833331, 0.04823978750783099], "isController": false}, {"data": ["ST02-1.1-010-GET-maintenance/configuration", 213, 0, 0.0, 865.5962441314554, 235, 9205, 285.0, 2161.5999999999995, 3857.8999999999996, 8166.879999999993, 0.066753268324634, 0.037157581001016966, 0.05169466970843238], "isController": false}, {"data": ["AF-1.2-020-OPTIONS-maintenance/configuration", 105, 0, 0.0, 743.5047619047617, 229, 865, 825.0, 834.8, 845.7, 864.94, 0.0331759005203245, 0.05675263562782074, 0.02212806646033363], "isController": false}, {"data": ["TEST-01-BUSINESS-CREATING-FLOW", 30, 0, 0.0, 1.0, 0, 11, 0.0, 5.500000000000011, 11.0, 11.0, 0.04014634681626088, 0.0, 0.0], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 644, 0, 0.0, 676.2562111801236, 236, 10361, 278.0, 1372.5, 2952.5, 5193.549999999997, 0.2000543004529801, 0.11135835083808461, 0.5345200840228062], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 635, 0, 0.0, 926.5763779527562, 257, 8647, 440.0, 2112.4, 3916.1999999999975, 6850.199999999997, 0.1984929539690151, 0.8466965067740799, 0.5305422021613225], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 649, 0, 0.0, 1534.8104776579355, 253, 14633, 666.0, 4676.0, 6554.5, 11664.5, 0.20065334460372355, 0.13853702601057866, 0.1757676270600977], "isController": false}, {"data": ["ST04-1.1-010-GET-maintenance/configuration", 213, 0, 0.0, 697.0234741784037, 236, 6678, 277.0, 1653.7999999999993, 2602.7999999999997, 5536.7599999999975, 0.06674826877553591, 0.0371547980488823, 0.051690797987304665], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 654, 0, 0.0, 775.6804281345574, 229, 1785, 826.0, 835.0, 842.0, 1110.7500000000043, 0.20216208329572416, 0.3458211832903765, 0.13484053016697228], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 642, 0, 0.0, 14722.735202492211, 2032, 44292, 15639.0, 19637.100000000002, 21147.25, 25630.680000000015, 0.19917692153763342, 0.14957719986566417, 0.5471530080911746], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 645, 0, 0.0, 901.488372093023, 239, 9387, 356.0, 2168.6, 3645.699999999998, 8072.439999999999, 0.20036270308856777, 0.3927030713855035, 0.5533454339203806], "isController": false}, {"data": ["ST06-030-GET-suffixes", 646, 0, 0.0, 640.7770897832819, 236, 8474, 273.0, 1035.5000000000005, 2744.5499999999993, 6973.089999999996, 0.19967865954417627, 0.1536589684773544, 0.5274714590498016], "isController": false}, {"data": ["ST02-1.2-020-POST-commercial/lead", 104, 0, 0.0, 1325.9326923076928, 244, 7396, 552.0, 4293.5, 5224.25, 7347.300000000003, 0.03286217194309915, 0.022400191422151567, 0.02846557276711811], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 646, 0, 0.0, 657.5572755417949, 237, 8581, 279.0, 1129.7000000000012, 2537.8999999999996, 6295.939999999997, 0.19967008073656625, 0.11114447853500269, 0.533493496968013], "isController": false}, {"data": ["ST05-1.1-010-POST-commercial/lead", 213, 0, 0.0, 1979.018779342723, 439, 12760, 1037.0, 4797.199999999997, 7861.999999999998, 12493.179999999991, 0.06674529868677842, 0.05305729797952894, 0.07789124211982443], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 648, 0, 0.0, 908.2700617283955, 265, 8671, 397.0, 2265.2000000000007, 3752.299999999997, 6314.8399999999965, 0.20027822601706877, 0.43243667746458897, 0.542355000727863], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 635, 0, 0.0, 1094.0031496062998, 238, 10528, 544.0, 2978.7999999999984, 4221.199999999999, 7355.879999999994, 0.1984798630457688, 0.11048195501571116, 0.5303133840754136], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 30, 0, 0.0, 11.899999999999999, 0, 180, 0.0, 4.6000000000000085, 172.29999999999998, 180.0, 0.04013662507174422, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 645, 0, 0.0, 687.1891472868211, 237, 10358, 278.0, 1390.5999999999995, 3265.599999999998, 5665.279999999999, 0.20036332549690106, 0.11153036673167344, 0.5353457603120325], "isController": false}, {"data": ["ST01-1.2-010-GET-maintenance/configuration", 104, 0, 0.0, 850.9038461538461, 234, 8448, 292.5, 2738.0, 3516.0, 8301.950000000008, 0.03286206810474026, 0.018292362128615184, 0.02544884766314358], "isController": false}, {"data": ["AF-1.1-030-POST-commercial/lead", 213, 0, 0.0, 1335.4647887323945, 249, 11036, 630.0, 3653.0, 4622.299999999986, 9281.039999999985, 0.06675253612628453, 0.04954289790622679, 0.07952938874420616], "isController": false}, {"data": ["ST07-030-GET-core/products", 646, 0, 0.0, 614.2291021671822, 237, 8508, 271.0, 1163.500000000001, 2508.7499999999964, 5368.39999999999, 0.19967489465294744, 0.9825798771056661, 0.5274615137072488], "isController": false}, {"data": ["ST03-1.2-010-GET-maintenance/configuration", 104, 0, 0.0, 705.9134615384614, 236, 6867, 275.5, 1275.5, 3022.0, 6857.35, 0.032862992289204446, 0.01829287656723294, 0.02544956336458899], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 649, 0, 0.0, 771.7950693374424, 235, 8196, 277.0, 2118.0, 3425.0, 6227.5, 0.20064459782197044, 0.11168693433449527, 0.15538199811799078], "isController": false}, {"data": ["AF-1.2-020-GET-maintenance/configuration", 105, 0, 0.0, 742.257142857143, 237, 1523, 849.0, 1049.6000000000001, 1457.2999999999995, 1520.7199999999998, 0.03316965425216013, 0.05747925948904833, 0.02782493457285699], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 653, 0, 0.0, 1843.8820826952538, 930, 10513, 1117.0, 3696.8, 5037.5999999999985, 8642.260000000013, 0.2018418610746889, 0.12753094151887082, 0.14586228241725566], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 647, 0, 0.0, 1610.098918083462, 296, 15707, 722.0, 4574.200000000002, 6630.200000000003, 10860.519999999999, 0.19996804220160178, 0.14567984324452632, 0.55889505545018], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 645, 0, 0.0, 721.2170542635665, 235, 8310, 283.0, 1531.3999999999996, 3407.999999999992, 6196.079999999996, 0.20037035897980734, 0.1115342818539943, 0.5353645528991726], "isController": false}, {"data": ["ST05-1.1-030-GET-maintenance/configuration", 628, 0, 0.0, 1013.7213375796179, 236, 9857, 334.0, 2869.700000000001, 4346.549999999999, 7588.350000000021, 0.19851430377746168, 0.11050112612612613, 0.5391344263671566], "isController": false}, {"data": ["ST14-060-POST-middesk", 643, 0, 0.0, 915.8444790046651, 267, 10226, 443.0, 1886.0000000000014, 4024.7999999999993, 7526.959999999926, 0.19973968607009837, 0.16501931095244457, 0.5488940201184148], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 634, 0, 0.0, 1910.3706624605682, 406, 14520, 1066.5, 4809.0, 7669.5, 12185.849999999999, 0.19817584449010198, 0.8695352239199494, 0.5469188833291291], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 651, 0, 0.0, 1680.8786482334863, 247, 13504, 698.0, 5099.600000000006, 7222.4, 10169.920000000026, 0.20127312206148198, 0.14938239528000616, 0.23901183244800986], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 30, 0, 0.0, 5.9, 0, 83, 0.0, 3.8000000000000043, 83.0, 83.0, 0.04014688406650465, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 644, 0, 0.0, 954.7158385093165, 240, 10132, 421.5, 2386.5, 4117.5, 7437.349999999995, 0.20005231181569838, 0.28210501783385594, 0.5421339504771123], "isController": false}, {"data": ["AF-1.2-030-OPTIONS-commercial/lead", 105, 0, 0.0, 1379.657142857143, 232, 7768, 362.0, 4617.000000000001, 6358.799999999996, 7757.5599999999995, 0.033169790471172134, 0.020957865659031613, 0.02397035639518299], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 654, 0, 0.0, 754.7889908256884, 235, 1910, 846.0, 1248.5, 1449.25, 1519.5000000000014, 0.20216102094406724, 0.3501445570115717, 0.16958624706147826], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 649, 0, 0.0, 734.2018489984588, 236, 11397, 278.0, 1724.0, 2894.5, 6974.5, 0.20065272423946745, 0.1116914578286098, 0.1553882913299782], "isController": false}, {"data": ["eProtect/paypage_01", 30, 0, 0.0, 648.8333333333335, 446, 1558, 534.0, 1281.1000000000004, 1536.55, 1558.0, 0.0400253493879457, 0.01837100997298289, 0.04463764550882226], "isController": false}, {"data": ["AF-1.2-010-GET-Welcome", 105, 0, 0.0, 827.1523809523806, 256, 1803, 952.0, 1244.0000000000005, 1548.8999999999999, 1795.7399999999998, 0.033180398032054796, 0.05719761192380264, 0.022066260800614565], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 650, 0, 0.0, 1499.6492307692297, 245, 16707, 557.0, 4522.499999999999, 6701.94999999999, 9964.43000000001, 0.20096636997846878, 0.1369868420361047, 0.1740792677450213], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 646, 0, 0.0, 1286.4643962848288, 293, 21589, 584.0, 3013.5000000000005, 5134.749999999998, 9751.039999999995, 0.19966761215153597, 0.12927697935201987, 0.5664398567384883], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 634, 0, 0.0, 658.5772870662456, 237, 8483, 279.0, 1338.5, 2618.75, 5239.499999999999, 0.19819461585882042, 0.1103231748432887, 0.5295512392477858], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 634, 0, 0.0, 7175.867507886435, 534, 27105, 6766.5, 12856.0, 14291.5, 16490.249999999996, 0.19809955658820072, 0.1546078281039529, 0.5509643917609331], "isController": false}, {"data": ["ST01-1.1-010-GET-maintenance/configuration", 213, 0, 0.0, 786.8826291079811, 237, 7367, 282.0, 1887.7999999999997, 3998.699999999998, 6014.499999999997, 0.06675310096359512, 0.03715748784106369, 0.05169454010169036], "isController": false}, {"data": ["ST03-1.1-010-GET-maintenance/configuration", 213, 0, 0.0, 762.9906103286379, 237, 8837, 283.0, 1758.1999999999978, 3621.1999999999985, 7011.559999999997, 0.06674912638555361, 0.037155275429458554, 0.05169146213256251], "isController": false}, {"data": ["ST03-1.2-020-POST-commercial/lead", 104, 0, 0.0, 1504.4711538461531, 262, 11737, 618.5, 4897.5, 6744.75, 11733.0, 0.03286252499842797, 0.02268926286512556, 0.02878680168319325], "isController": false}, {"data": ["AF-1.1-020-OPTIONS-maintenance/configuration", 213, 0, 0.0, 752.0140845070423, 229, 1432, 825.0, 833.0, 839.3, 907.3799999999995, 0.06675519303690057, 0.11418458139949599, 0.04452519223066709], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 649, 0, 0.0, 1535.9953775038532, 256, 16937, 617.0, 4358.0, 6404.5, 9824.0, 0.2006434812664221, 0.13637486617327127, 0.18986673178433888], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 1290, 0, 0.0, 659.0705426356593, 236, 9113, 279.5, 1360.6000000000004, 2442.9500000000025, 5833.70999999999, 0.4005931262567056, 0.22298640817023657, 1.0703347592171355], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 649, 0, 0.0, 765.0955315870566, 235, 8996, 278.0, 1680.0, 3562.0, 6476.0, 0.2006566946369938, 0.11169366791317037, 0.15539136606165632], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 649, 0, 0.0, 944.841294298921, 440, 8631, 552.0, 1635.0, 3287.5, 6850.5, 0.20061972639055128, 0.9441274037852212, 0.19337077143308018], "isController": false}, {"data": ["ST14-020-POST-senti-link", 644, 0, 0.0, 1170.1242236024827, 281, 12765, 553.5, 2502.5, 4653.75, 9281.499999999989, 0.20004883179558736, 0.13108668567855383, 0.5741635904758118], "isController": false}, {"data": ["ST12-010-PUT-businesses", 645, 0, 0.0, 1138.0728682170525, 258, 10778, 507.0, 3224.3999999999987, 5088.89999999999, 7795.839999999973, 0.20036152052338776, 0.15144513367685755, 0.5754523748625815], "isController": false}, {"data": ["ST10-010-PUT-businesses", 1290, 0, 0.0, 1147.3992248062004, 255, 13175, 507.0, 2823.4000000000005, 4765.250000000001, 8439.219999999996, 0.4005897675088782, 0.30670154074898487, 1.1082722767115742], "isController": false}, {"data": ["ST08-010-PUT-businesses", 645, 0, 0.0, 1227.8031007751943, 261, 11705, 529.0, 3231.5999999999995, 5345.499999999987, 8322.519999999984, 0.2003680559266075, 0.15399380860765635, 0.5564909678274138], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 645, 0, 0.0, 697.4449612403095, 239, 9024, 280.0, 1415.7999999999995, 2985.6999999999994, 5920.01999999997, 0.20035840857645815, 0.11152762977400503, 0.5353326229152241], "isController": false}, {"data": ["ST14-010-PUT-businesses", 644, 0, 0.0, 1170.2857142857142, 258, 11678, 500.5, 2913.5, 4829.0, 9065.749999999993, 0.20005113108101855, 0.15257805993581589, 0.5657696050885055], "isController": false}, {"data": ["ST15-010-POST-add-payment", 635, 0, 0.0, 1377.825196850394, 277, 17360, 625.0, 3672.5999999999976, 5753.7999999999965, 9718.08, 0.19848550868241255, 0.12153360736706316, 0.6400382320989514], "isController": false}, {"data": ["ST05-1.1-020-POST-auth/oauth/token", 213, 0, 0.0, 990.0892018779347, 440, 9345, 571.0, 1828.1999999999991, 3397.6999999999975, 6646.679999999976, 0.06674523594127547, 0.31580143372605435, 0.0645942664236367], "isController": false}, {"data": ["ST13-010-PUT-businesses", 645, 0, 0.0, 1190.948837209302, 258, 11048, 529.0, 3258.999999999999, 5224.399999999997, 8435.96, 0.20036282756992507, 0.15164178844403509, 0.5586287819454454], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 643, 0, 0.0, 565.1041990668737, 238, 6863, 277.0, 1086.8000000000002, 1826.1999999999978, 4291.919999999993, 0.19974123724630455, 0.11118408713905625, 0.53368361826747], "isController": false}, {"data": ["ST09-010-GET-industries", 645, 0, 0.0, 905.4899224806214, 478, 8509, 568.0, 1393.0, 2625.399999999999, 5983.719999999994, 0.20034179241608474, 5.76225952238905, 0.532744824950194], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 646, 0, 0.0, 697.2863777089785, 236, 11038, 284.0, 1221.300000000003, 2498.899999999998, 7496.999999999989, 0.19966458821805846, 0.11114142117606769, 0.533478821645125], "isController": false}, {"data": ["ST02-1.2-010-GET-maintenance/configuration", 104, 0, 0.0, 677.8269230769231, 236, 4230, 280.5, 1563.0, 3507.0, 4216.1, 0.03286258730309702, 0.018292651135512986, 0.025449249737652276], "isController": false}, {"data": ["ST05-1.1-040-GET-applicants/email", 209, 0, 0.0, 1012.8803827751201, 268, 8503, 419.0, 2809.0, 4565.5, 6283.100000000005, 0.06607536068768959, 0.14292668351878168, 0.18080386781924437], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 645, 0, 0.0, 935.6806201550388, 240, 12993, 418.0, 2087.399999999999, 3540.999999999988, 7981.21999999998, 0.2003587197668011, 0.2510353881453182, 0.5429643040555401], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 1283, 0, 0.0, 14509.583787996864, 2028, 27881, 15581.0, 19084.0, 20822.199999999997, 24131.36000000001, 0.3970437416560469, 0.2981705442709961, 1.0740343402219237], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 1944, 0, 0.0, 910.2052469135806, 236, 9909, 290.0, 2470.0, 4165.0, 6941.949999999995, 0.6007503817268051, 0.33440206795339733, 1.62507671619458], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 650, 0, 0.0, 878.898461538462, 235, 9465, 292.5, 2529.7999999999984, 3924.549999999996, 6994.780000000001, 0.20096587290299842, 0.11186576909639559, 0.15563079805866967], "isController": false}, {"data": ["AF-010-GET-Welcome", 655, 0, 0.0, 829.9648854961832, 335, 2353, 964.0, 1146.7999999999997, 1521.3999999999985, 1772.4399999999985, 0.20163381882447176, 0.3476611116741979, 0.13409436583932155], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 646, 0, 0.0, 1180.7678018575855, 271, 15505, 539.0, 2780.9, 4355.049999999997, 9860.979999999992, 0.19967514152671118, 0.14351650797232365, 0.5845957756807423], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 643, 0, 0.0, 1619.583203732505, 315, 11375, 803.0, 4402.4000000000015, 6974.799999999992, 9928.359999999957, 0.19973565312471364, 0.13224684845562093, 0.5849679919150549], "isController": false}, {"data": ["AF-1.1-010-GET-Welcome", 213, 0, 0.0, 828.8967136150238, 241, 1853, 958.0, 1091.2, 1465.8999999999999, 1831.0799999999988, 0.06675448171726374, 0.11509877812267594, 0.04439433793892247], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 44325, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
