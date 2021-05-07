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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.85234375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.6, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.65, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.8, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.9, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.8, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.65, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.2, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 640, 0, 0.0, 690.6218749999997, 0, 18105, 272.0, 1031.8, 1351.9499999999985, 15437.650000000116, 2.8095190015671845, 16.821407704831493, 6.221102286246087], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 10, 0, 0.0, 259.3, 246, 273, 259.0, 272.8, 273.0, 273.0, 0.058056163532601436, 0.11282398967761412, 0.15954105877025432], "isController": false}, {"data": ["ST10-030-GET-customers/email", 10, 0, 0.0, 265.0, 258, 275, 263.0, 275.0, 275.0, 275.0, 0.05811419439198024, 0.0816663337207613, 0.15635215385732967], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 10, 0, 0.0, 253.79999999999998, 242, 265, 254.5, 264.7, 265.0, 265.0, 0.05824993883756422, 0.03202608941948111, 0.15484016944907208], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 10, 0, 0.0, 4766.099999999999, 4673, 4951, 4742.5, 4942.0, 4951.0, 4951.0, 0.05691940781048114, 0.03740894673481817, 0.15764007866262159], "isController": false}, {"data": ["ST14-090-GET-id", 10, 0, 0.0, 519.0, 492, 545, 518.0, 544.4, 545.0, 545.0, 0.05828117168467555, 5.701446684384143, 0.15498010790758937], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 10, 0, 0.0, 682.1, 603, 777, 663.5, 776.9, 777.0, 777.0, 0.0569807063328357, 0.04490569336972501, 0.06638474868659472], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 10, 0, 0.0, 253.4, 241, 263, 255.0, 262.9, 263.0, 263.0, 0.058071334827702346, 0.03192789209765276, 0.15436540371191973], "isController": false}, {"data": ["ST09-020-PUT-businesses", 10, 0, 0.0, 298.7, 277, 322, 297.5, 321.0, 322.0, 322.0, 0.05808583925324845, 0.044301797321081096, 0.16659971668631904], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 10, 0, 0.0, 252.7, 242, 262, 254.5, 261.8, 262.0, 262.0, 0.05812061189380202, 0.0319549848595806, 0.1544963921630167], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 10, 0, 0.0, 286.8, 271, 311, 281.5, 310.0, 311.0, 311.0, 0.058388364366749, 5.756784819171235, 0.15526515251040773], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 10, 0, 0.0, 277.20000000000005, 267, 293, 277.0, 291.8, 293.0, 293.0, 0.057088378518784934, 0.03902525875307564, 0.05028683342182032], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 974.6, 818, 1140, 1045.0, 1132.7, 1140.0, 1140.0, 0.05656524518205524, 0.09658073698857947, 0.03839145058743007], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 10, 0, 0.0, 539.6000000000001, 454, 612, 551.5, 609.7, 612.0, 612.0, 0.05823331761033758, 0.0470870966614839, 0.15917485936653797], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 10, 0, 0.0, 257.4, 245, 269, 258.0, 268.9, 269.0, 269.0, 0.05812027409521263, 0.11294857954050112, 0.15971723760149253], "isController": false}, {"data": ["ST06-030-GET-suffixes", 10, 0, 0.0, 254.7, 242, 268, 254.5, 267.6, 268.0, 268.0, 0.058056163532601436, 0.04427916378804855, 0.1525675156896782], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 10, 0, 0.0, 253.60000000000002, 240, 263, 254.5, 263.0, 263.0, 263.0, 0.05810237638719424, 0.0319449588925687, 0.15444791848236591], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 10, 0, 0.0, 289.7, 275, 308, 286.5, 307.4, 308.0, 308.0, 0.05802618141305357, 0.12432562697289015, 0.15634202589708476], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 10, 0, 0.0, 253.20000000000002, 242, 262, 254.5, 262.0, 262.0, 262.0, 0.05836723496897781, 0.03209057938235792, 0.1551519663921461], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 64.60000000000001, 0, 636, 1.0, 572.6000000000003, 636.0, 636.0, 0.05659117404049664, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 10, 0, 0.0, 254.79999999999998, 241, 267, 256.5, 266.6, 267.0, 267.0, 0.05812770657133723, 0.03195888554654576, 0.15451525125701165], "isController": false}, {"data": ["ST07-030-GET-core/products", 10, 0, 0.0, 258.2, 250, 267, 256.0, 266.9, 267.0, 267.0, 0.05807234652930621, 0.4541438974674649, 0.15261004346715137], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 10, 0, 0.0, 253.6, 241, 268, 253.5, 267.4, 268.0, 268.0, 0.05713567437236462, 0.03141346159339969, 0.04452565248940134], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 10, 0, 0.0, 1029.3, 954, 1310, 1001.5, 1283.1000000000001, 1310.0, 1310.0, 0.05659950192438306, 0.03537468870273942, 0.0411783485680326], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 10, 0, 0.0, 460.2, 369, 584, 476.0, 576.6, 584.0, 584.0, 0.05797403922523494, 0.04183868651118029, 0.16124029659518466], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 10, 0, 0.0, 253.2, 241, 263, 254.0, 263.0, 263.0, 263.0, 0.058091238098557596, 0.03193883500926555, 0.15441831064870484], "isController": false}, {"data": ["ST14-060-POST-middesk", 10, 0, 0.0, 728.6, 593, 1135, 662.5, 1104.7, 1135.0, 1135.0, 0.05812601720530109, 0.049043827016972796, 0.1589383282957452], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 10, 0, 0.0, 1056.6, 963, 1126, 1060.5, 1125.4, 1126.0, 1126.0, 0.0582441712145657, 5.8183367485045805, 0.1599439545462488], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 10, 0, 0.0, 268.0999999999999, 257, 281, 267.5, 280.5, 281.0, 281.0, 0.056936259857089985, 0.04186816764881715, 0.06733379949896091], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 13.5, 0, 126, 1.0, 113.80000000000004, 126.0, 126.0, 0.0567959152377761, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 10, 0, 0.0, 259.90000000000003, 245, 287, 259.0, 285.6, 287.0, 287.0, 0.05811993630054981, 0.08212846467470272, 0.1567081485603692], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 997.5, 837, 1272, 1046.5, 1252.8000000000002, 1272.0, 1272.0, 0.05658476964340278, 0.09689036630150628, 0.047743399386621095], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 10, 0, 0.0, 254.0, 240, 275, 253.5, 273.6, 275.0, 275.0, 0.05710141782820467, 0.031394627184842996, 0.04449895647158919], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 986.6, 424, 2673, 594.5, 2600.4, 2673.0, 2673.0, 0.05547911766011274, 0.025464048144778307, 0.0690238241201012], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 10, 0, 0.0, 268.09999999999997, 250, 340, 262.0, 332.90000000000003, 340.0, 340.0, 0.05706231775722267, 0.03850591950218834, 0.049706628358830676], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 10, 0, 0.0, 413.59999999999997, 385, 474, 398.5, 470.5, 474.0, 474.0, 0.058028875168283735, 0.03717474815468177, 0.16382956846826982], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 10, 0, 0.0, 252.5, 241, 262, 253.5, 262.0, 262.0, 262.0, 0.058482952219428036, 0.032154201269080064, 0.15545956634890928], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 10, 0, 0.0, 14070.199999999999, 7732, 18105, 16960.0, 18051.6, 18105.0, 18105.0, 0.05331939919700985, 0.041291292542215634, 0.14756560285578701], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 10, 0, 0.0, 494.4, 470, 567, 483.0, 562.8, 567.0, 567.0, 0.05703335310489574, 0.03837498075124333, 0.05424852141032075], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 20, 0, 0.0, 254.0, 241, 265, 255.0, 263.9, 264.95, 265.0, 0.11548477621937488, 0.06349407130030084, 0.306981993036268], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 10, 0, 0.0, 251.79999999999998, 240, 262, 253.0, 261.8, 262.0, 262.0, 0.05709163778781322, 0.031389250072791836, 0.04449133491667475], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 10, 0, 0.0, 510.3, 481, 590, 497.5, 584.6, 590.0, 590.0, 0.0570304257321281, 0.26549222604009237, 0.054468512076192646], "isController": false}, {"data": ["ST14-020-POST-senti-link", 10, 0, 0.0, 601.7, 555, 677, 587.5, 674.5, 677.0, 677.0, 0.05802685482841459, 0.03762678867780009, 0.16575053747374285], "isController": false}, {"data": ["ST12-010-PUT-businesses", 10, 0, 0.0, 291.40000000000003, 271, 333, 288.5, 329.1, 333.0, 333.0, 0.05811419439198024, 0.04352889365102427, 0.1661135224466076], "isController": false}, {"data": ["ST10-010-PUT-businesses", 20, 0, 0.0, 301.1, 271, 355, 294.5, 334.5, 354.0, 355.0, 0.11545410987767638, 0.08760531579585404, 0.31783704662614226], "isController": false}, {"data": ["ST08-010-PUT-businesses", 10, 0, 0.0, 302.1, 284, 341, 297.0, 339.6, 341.0, 341.0, 0.058076056403465984, 0.0442376210885776, 0.16090016798499315], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 10, 0, 0.0, 254.0, 241, 266, 255.0, 265.6, 266.0, 266.0, 0.05810372677303522, 0.031945701341034013, 0.1544515080822284], "isController": false}, {"data": ["ST14-010-PUT-businesses", 10, 0, 0.0, 305.90000000000003, 271, 346, 295.5, 345.3, 346.0, 346.0, 0.058120949696318036, 0.04393126471186539, 0.16391924094039695], "isController": false}, {"data": ["ST15-010-POST-add-payment", 10, 0, 0.0, 694.8, 541, 1215, 645.5, 1166.5000000000002, 1215.0, 1215.0, 0.05825638635635432, 0.03549998543590341, 0.18705761556610642], "isController": false}, {"data": ["ST13-010-PUT-businesses", 10, 0, 0.0, 293.8, 272, 331, 288.5, 328.9, 331.0, 331.0, 0.05810440198949472, 0.04357830149212104, 0.16120566997280714], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 10, 0, 0.0, 253.79999999999998, 242, 265, 254.5, 264.8, 265.0, 265.0, 0.058169972660112854, 0.03198212364027689, 0.15462760310627655], "isController": false}, {"data": ["ST09-010-GET-industries", 10, 0, 0.0, 507.4, 486, 530, 509.0, 529.6, 530.0, 530.0, 0.058008341599522006, 1.6681023731212548, 0.15346152089170423], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 10, 0, 0.0, 255.10000000000002, 241, 271, 254.5, 270.7, 271.0, 271.0, 0.058051445190728024, 0.031916956682011596, 0.15431253301675946], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 10, 0, 0.0, 265.20000000000005, 246, 307, 260.0, 303.5, 307.0, 307.0, 0.05811993630054981, 0.07299046687744831, 0.1567081485603692], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 20, 0, 0.0, 262.00000000000006, 246, 299, 259.5, 291.6, 298.75, 299.0, 0.11608806440565814, 0.09500175583197415, 0.31244014209179083], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 30, 0, 0.0, 255.90000000000003, 240, 302, 254.5, 267.0, 292.65, 302.0, 0.17352675782605678, 0.09540582485944334, 0.4670310005552857], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 10, 0, 0.0, 254.8, 242, 267, 254.0, 266.6, 267.0, 267.0, 0.05706199214826988, 0.031372950761206976, 0.04446823216242125], "isController": false}, {"data": ["AF-010-GET-Welcome", 10, 0, 0.0, 1170.4, 946, 1353, 1215.0, 1350.9, 1353.0, 1353.0, 0.05642990559276794, 0.096625191861679, 0.04199178521649333], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 10, 0, 0.0, 341.0, 305, 389, 343.5, 387.6, 389.0, 389.0, 0.05803022213969035, 0.041312531191244395, 0.16893368378751653], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 10, 0, 0.0, 1670.0, 1246, 2787, 1607.5, 2685.8, 2787.0, 2787.0, 0.05783991069517789, 0.03790095710592223, 0.16860559904795508], "isController": false}]}, function(index, item){
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
