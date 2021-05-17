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

    var data = {"OkPercent": 99.82046678635548, "KoPercent": 0.17953321364452424};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8653500897666068, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.25, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.7, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.9375, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [0.9375, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.45, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.25, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.55, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.85, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [0.96875, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.375, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 557, 1, 0.17953321364452424, 499.0000000000002, 0, 5593, 282.0, 988.8, 1420.1000000000008, 4495.939999999998, 7.7938069318706535, 39.228318992507035, 16.448355862670883], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 9, 0, 0.0, 266.55555555555554, 256, 284, 265.0, 284.0, 284.0, 284.0, 0.16930341052314754, 0.33034005295434454, 0.4622776717018755], "isController": false}, {"data": ["ST10-030-GET-customers/email", 8, 0, 0.0, 271.12500000000006, 253, 303, 265.5, 303.0, 303.0, 303.0, 0.17424258924487618, 0.24621975257552328, 0.46572457691721303], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 8, 0, 0.0, 255.87500000000003, 243, 273, 253.5, 273.0, 273.0, 273.0, 0.17614161786076005, 0.09701550046237174, 0.4651239596635695], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 7, 0, 0.0, 3261.428571428571, 2958, 3436, 3262.0, 3436.0, 3436.0, 3436.0, 0.1545765706083692, 0.10174278182621178, 0.4253874765374849], "isController": false}, {"data": ["ST14-090-GET-id", 8, 0, 0.0, 1235.25, 503, 1896, 1321.0, 1896.0, 1896.0, 1896.0, 0.17340038148083925, 16.963815201252817, 0.45771604603780125], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 10, 0, 0.0, 511.20000000000005, 484, 544, 510.5, 543.7, 544.0, 544.0, 0.16359382924076105, 0.129085755885288, 0.18611993268113927], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 9, 0, 0.0, 384.0, 246, 845, 261.0, 845.0, 845.0, 845.0, 0.169379881434083, 0.09329126282111602, 0.44726874941187544], "isController": false}, {"data": ["ST09-020-PUT-businesses", 9, 0, 0.0, 299.6666666666667, 280, 315, 301.0, 315.0, 315.0, 315.0, 0.16844784667502669, 0.12863888291003012, 0.47951706353291285], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 8, 0, 0.0, 256.25, 243, 273, 254.0, 273.0, 273.0, 273.0, 0.1743717169075176, 0.09604067220296868, 0.4604503149589137], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 7, 0, 0.0, 1151.857142857143, 285, 1900, 1368.0, 1900.0, 1900.0, 1900.0, 0.16606172751642823, 16.373621465257514, 0.4383445795672906], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 10, 0, 0.0, 282.6, 269, 305, 279.5, 304.7, 305.0, 305.0, 0.16396937052158655, 0.1122485632183908, 0.13979029342318855], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 890.9, 874, 921, 887.5, 919.7, 921.0, 921.0, 0.1619118551860367, 0.17898849616268903, 0.1051478356432758], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 8, 0, 0.0, 475.49999999999994, 441, 544, 470.0, 544.0, 544.0, 544.0, 0.17532325224632916, 0.1409092154284462, 0.476146449704142], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 8, 0, 0.0, 267.0, 253, 282, 266.0, 282.0, 282.0, 282.0, 0.17429193899782133, 0.3400735294117647, 0.47589869281045755], "isController": false}, {"data": ["ST06-030-GET-suffixes", 9, 0, 0.0, 260.22222222222223, 250, 277, 259.0, 277.0, 277.0, 277.0, 0.1693480101608806, 0.12932631244707873, 0.44205784292972056], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 9, 0, 0.0, 257.77777777777777, 243, 273, 261.0, 273.0, 273.0, 273.0, 0.1693862571283383, 0.09329477443396758, 0.44728558522951833], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 9, 0, 0.0, 288.2222222222222, 268, 316, 283.0, 316.0, 316.0, 316.0, 0.16913478162820417, 0.3633755074043449, 0.45273284808877695], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 8, 0, 0.0, 260.25, 245, 273, 262.0, 273.0, 273.0, 273.0, 0.17622698035069168, 0.09706251652127941, 0.46534936998854526], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 20.6, 0, 198, 0.5, 178.70000000000007, 198.0, 198.0, 0.16327330318219668, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 8, 0, 0.0, 323.75, 241, 796, 260.0, 796.0, 796.0, 796.0, 0.17436031559217122, 0.09603439257225056, 0.4604202083605772], "isController": false}, {"data": ["ST07-030-GET-core/products", 9, 0, 0.0, 260.8888888888889, 245, 278, 263.0, 278.0, 278.0, 278.0, 0.1693288931534684, 0.832258124259186, 0.4420079408195518], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 10, 0, 0.0, 254.29999999999998, 242, 272, 250.0, 271.9, 272.0, 272.0, 0.16423867163762382, 0.09045958086290998, 0.12333939305598897], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 10, 0, 0.0, 1092.0, 970, 1688, 1038.5, 1628.0000000000002, 1688.0, 1688.0, 0.1617782667076505, 0.10126940328086324, 0.11311839742449], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 9, 0, 0.0, 368.22222222222223, 332, 461, 350.0, 461.0, 461.0, 461.0, 0.16896966055872636, 0.12210698126314208, 0.46697669861444874], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 9, 0, 0.0, 256.44444444444446, 243, 275, 254.0, 275.0, 275.0, 275.0, 0.169465993823906, 0.09333869191082324, 0.4474961399412518], "isController": false}, {"data": ["ST14-060-POST-middesk", 8, 0, 0.0, 608.125, 556, 713, 594.0, 713.0, 713.0, 713.0, 0.1747984355540018, 0.14663267201258548, 0.47489184346800095], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 6, 0, 0.0, 1669.0, 1018, 2382, 1624.0, 2382.0, 2382.0, 2382.0, 0.16260162601626016, 16.245262745596207, 0.44366107723577236], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 10, 0, 0.0, 270.7, 258, 289, 271.0, 288.6, 289.0, 289.0, 0.16384578834401062, 0.11981223272655776, 0.19040672668884046], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 6.299999999999999, 0, 53, 1.0, 48.100000000000016, 53.0, 53.0, 0.16380284689347901, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 8, 0, 0.0, 270.25, 255, 286, 268.5, 286.0, 286.0, 286.0, 0.1743071291615827, 0.2446087349660101, 0.4669184133693568], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 855.4000000000001, 374, 924, 906.0, 923.8, 924.0, 924.0, 0.16195118791196333, 0.17903197726205322, 0.13205980654930605], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 10, 0, 0.0, 254.3, 242, 273, 250.0, 272.8, 273.0, 273.0, 0.16407160084660946, 0.09036756140379662, 0.12321392680765887], "isController": false}, {"data": ["eProtect/paypage_01", 11, 1, 9.090909090909092, 459.3636363636364, 49, 1416, 399.0, 1223.0000000000007, 1416.0, 1416.0, 0.15730915539284387, 0.0729146928538741, 0.1754365775963161], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 10, 0, 0.0, 272.5, 256, 323, 266.0, 319.40000000000003, 323.0, 323.0, 0.16397205916111895, 0.11080924310497492, 0.1381912959531696], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 9, 0, 0.0, 353.55555555555554, 331, 390, 355.0, 390.0, 390.0, 390.0, 0.16902678135446794, 0.10844784702137249, 0.4742323660462758], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 6, 0, 0.0, 257.0, 245, 274, 253.5, 274.0, 274.0, 274.0, 0.16970725498515063, 0.09347157403478999, 0.4481332201951634], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 6, 0, 0.0, 4791.833333333333, 4472, 5593, 4565.5, 5593.0, 5593.0, 5593.0, 0.14833494029518654, 0.11487266372469036, 0.407921085811763], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 10, 0, 0.0, 498.4, 469, 543, 499.5, 539.2, 543.0, 543.0, 0.16344142259414224, 0.11013142733394352, 0.150832172218227], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 16, 0, 0.0, 275.9375, 243, 561, 260.5, 360.1000000000002, 561.0, 561.0, 0.3406792292132439, 0.18763973171510698, 0.8996060896412221], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 10, 0, 0.0, 254.79999999999998, 241, 276, 251.0, 275.8, 276.0, 276.0, 0.16402316007020193, 0.0903408811324159, 0.1231775489199075], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 10, 0, 0.0, 475.79999999999995, 461, 495, 477.5, 494.4, 495.0, 495.0, 0.1637626097209485, 0.7666776865256125, 0.15256790007205553], "isController": false}, {"data": ["ST14-020-POST-senti-link", 8, 0, 0.0, 581.625, 551, 631, 585.5, 631.0, 631.0, 631.0, 0.17321266184558093, 0.11248673840557745, 0.49172774217295284], "isController": false}, {"data": ["ST12-010-PUT-businesses", 8, 0, 0.0, 297.0, 280, 313, 299.5, 313.0, 313.0, 313.0, 0.17421602787456447, 0.13066202090592335, 0.4949164307491289], "isController": false}, {"data": ["ST10-010-PUT-businesses", 17, 0, 0.0, 334.35294117647055, 281, 901, 299.0, 438.59999999999957, 901.0, 901.0, 0.31815544700840304, 0.24176012482922538, 0.8702669990923212], "isController": false}, {"data": ["ST08-010-PUT-businesses", 9, 0, 0.0, 297.6666666666667, 279, 310, 298.0, 310.0, 310.0, 310.0, 0.16928430358318444, 0.12911234482272171, 0.46487056804288535], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 9, 0, 0.0, 258.77777777777777, 242, 276, 258.0, 276.0, 276.0, 276.0, 0.1685898396523303, 0.09285612262101003, 0.44518254533193463], "isController": false}, {"data": ["ST14-010-PUT-businesses", 8, 0, 0.0, 295.0, 279, 318, 293.5, 318.0, 318.0, 318.0, 0.17422741032732975, 0.13186156543328179, 0.48729228825925036], "isController": false}, {"data": ["ST15-010-POST-add-payment", 7, 0, 0.0, 512.7142857142857, 466, 576, 514.0, 576.0, 576.0, 576.0, 0.1702790143277628, 0.1039300624559099, 0.5437620867693206], "isController": false}, {"data": ["ST13-010-PUT-businesses", 8, 0, 0.0, 297.75, 280, 320, 296.0, 320.0, 320.0, 320.0, 0.17421602787456447, 0.1308321537456446, 0.480285006533101], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 8, 0, 0.0, 259.875, 246, 275, 260.5, 275.0, 275.0, 275.0, 0.17467248908296942, 0.09620633187772927, 0.46124454148471616], "isController": false}, {"data": ["ST09-010-GET-industries", 9, 0, 0.0, 654.8888888888889, 482, 809, 756.0, 809.0, 809.0, 809.0, 0.1678572094671466, 4.827151515610721, 0.44111694401962065], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 9, 0, 0.0, 322.3333333333333, 243, 848, 261.0, 848.0, 848.0, 848.0, 0.16938944515546187, 0.09329653033953174, 0.4472940036136415], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 8, 0, 0.0, 277.25, 262, 300, 277.5, 300.0, 300.0, 300.0, 0.17418568193694478, 0.2170516896011148, 0.4665930913603902], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 16, 0, 0.0, 270.6875, 252, 299, 272.0, 289.2, 299.0, 299.0, 0.34657540181085644, 0.2819309665121518, 0.926683056795044], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 27, 0, 0.0, 257.55555555555554, 242, 286, 255.0, 274.0, 282.79999999999995, 286.0, 0.5029993665933903, 0.27704261988151574, 1.3449338532545922], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 10, 0, 0.0, 254.80000000000004, 241, 272, 250.5, 271.9, 272.0, 272.0, 0.16400164001640016, 0.0903290282902829, 0.12316138786387863], "isController": false}, {"data": ["AF-010-GET-Welcome", 10, 0, 0.0, 1038.3, 992, 1101, 1040.5, 1097.0, 1101.0, 1101.0, 0.16114736926919668, 0.17893023326081703, 0.10528084964950447], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 9, 0, 0.0, 329.3333333333333, 310, 350, 327.0, 350.0, 350.0, 350.0, 0.1691220685508118, 0.12056553715048106, 0.4900245872951744], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 8, 0, 0.0, 1350.7499999999998, 1007, 1712, 1365.5, 1712.0, 1712.0, 1712.0, 0.17063754452573426, 0.11198088859501311, 0.494415619734232], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 1, 100.0, 0.17953321364452424], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 557, 1, "403/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["eProtect/paypage_01", 11, 1, "403/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
