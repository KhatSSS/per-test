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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.85078125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.55, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.65, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.95, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.45, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.9, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.35, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.95, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.9, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.9, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.35, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 640, 0, 0.0, 584.8499999999998, 0, 10520, 261.0, 942.9, 1463.349999999999, 7243.700000000007, 4.377984211894436, 26.212485720246807, 9.69414607075917], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 10, 0, 0.0, 248.4, 242, 262, 247.0, 261.2, 262.0, 262.0, 0.09812964889211627, 0.1907011731399525, 0.2696648749828273], "isController": false}, {"data": ["ST10-030-GET-customers/email", 10, 0, 0.0, 254.1, 247, 279, 250.0, 277.1, 279.0, 279.0, 0.09805075106875319, 0.13778811600384358, 0.2637986515570459], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 10, 0, 0.0, 246.8, 239, 261, 246.0, 260.2, 261.0, 261.0, 0.09845523732634957, 0.05413115099095196, 0.2617140195335191], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 10, 0, 0.0, 4820.699999999999, 4625, 4971, 4815.5, 4968.5, 4971.0, 4971.0, 0.09456175355315789, 0.06214849623171412, 0.2618917315202693], "isController": false}, {"data": ["ST14-090-GET-id", 10, 0, 0.0, 685.0999999999999, 505, 774, 720.0, 770.1, 774.0, 774.0, 0.09828009828009827, 9.61423141891892, 0.26134444103194104], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 10, 0, 0.0, 674.5, 529, 901, 667.0, 880.9000000000001, 901.0, 901.0, 0.0949721731532661, 0.07484623411590405, 0.1106462915740688], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 10, 0, 0.0, 252.0, 241, 304, 243.5, 299.6, 304.0, 304.0, 0.09811424422597673, 0.05394367138596182, 0.26080759060850456], "isController": false}, {"data": ["ST09-020-PUT-businesses", 10, 0, 0.0, 291.9, 271, 326, 287.5, 325.3, 326.0, 326.0, 0.09798734003566739, 0.0747344849295471, 0.2810437672702687], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 10, 0, 0.0, 244.9, 240, 258, 241.5, 257.7, 258.0, 258.0, 0.09805171247315835, 0.05390929113514468, 0.260641368507751], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 10, 0, 0.0, 667.7999999999998, 280, 781, 726.0, 778.6, 781.0, 781.0, 0.0984852961452855, 9.710275109441787, 0.2618900990269653], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 10, 0, 0.0, 263.0, 256, 277, 260.5, 276.7, 277.0, 277.0, 0.095495478289103, 0.06528011211169152, 0.08411808732106535], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 10, 0, 0.0, 879.1, 819, 1125, 827.0, 1107.7, 1125.0, 1125.0, 0.09502361336792192, 0.1623010740043901, 0.06449356571357982], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 10, 0, 0.0, 603.9, 483, 1316, 522.5, 1243.6000000000004, 1316.0, 1316.0, 0.09827720067221604, 0.0794663302310497, 0.2686307467593093], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 10, 0, 0.0, 248.3, 242, 263, 246.0, 262.1, 263.0, 263.0, 0.09803056593045711, 0.19050861933750943, 0.26939259035967417], "isController": false}, {"data": ["ST06-030-GET-suffixes", 10, 0, 0.0, 246.9, 239, 267, 242.5, 266.2, 267.0, 267.0, 0.09812868595876634, 0.07484228880253564, 0.25787528702640644], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 10, 0, 0.0, 246.4, 240, 259, 242.5, 258.9, 259.0, 259.0, 0.09809884439561302, 0.053935204487041144, 0.2607666547313073], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 10, 0, 0.0, 277.90000000000003, 267, 289, 278.5, 288.8, 289.0, 289.0, 0.09807094452126669, 0.2101246604293546, 0.26423607024821755], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 10, 0, 0.0, 244.29999999999998, 239, 259, 241.0, 258.3, 259.0, 259.0, 0.09853575862680566, 0.054175421979386316, 0.26192806150602055], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 64.2, 0, 633, 1.0, 570.2000000000003, 633.0, 633.0, 0.0951040438239434, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 10, 0, 0.0, 244.89999999999998, 239, 260, 241.0, 259.6, 260.0, 260.0, 0.09802383939774154, 0.05389396638762547, 0.26056727621157466], "isController": false}, {"data": ["ST07-030-GET-core/products", 10, 0, 0.0, 246.3, 242, 261, 242.5, 260.3, 261.0, 261.0, 0.09810943125962698, 0.7672464116475516, 0.25782468703091427], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 10, 0, 0.0, 244.1, 239, 258, 240.5, 257.4, 258.0, 258.0, 0.0955684891577549, 0.05254400331622657, 0.07447622494910978], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 10, 0, 0.0, 1032.0, 942, 1658, 959.0, 1594.3000000000002, 1658.0, 1658.0, 0.09482627825823092, 0.05926642391139433, 0.06898982158435746], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 10, 0, 0.0, 449.4, 346, 532, 460.0, 529.8, 532.0, 532.0, 0.0979038779726065, 0.07065524006030878, 0.2722951606113118], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 10, 0, 0.0, 246.70000000000002, 240, 261, 243.5, 260.3, 261.0, 261.0, 0.09806421244630983, 0.05391616367897699, 0.26067459597544473], "isController": false}, {"data": ["ST14-060-POST-middesk", 10, 0, 0.0, 672.9, 551, 750, 664.0, 748.2, 750.0, 750.0, 0.09805555827932107, 0.08273437729817715, 0.26812066717001853], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 10, 0, 0.0, 1438.3, 969, 1686, 1474.5, 1671.5, 1686.0, 1686.0, 0.09824919926902596, 9.814989465843666, 0.2698015120551768], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 10, 0, 0.0, 257.3, 251, 269, 254.5, 268.5, 269.0, 269.0, 0.09546721655783404, 0.07020196686332913, 0.11290117114407912], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 13.299999999999997, 0, 127, 1.0, 114.40000000000005, 127.0, 127.0, 0.09568004592642204, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 10, 0, 0.0, 250.6, 244, 266, 248.0, 265.1, 266.0, 266.0, 0.09803729338640418, 0.1385351206348895, 0.2643368818748652], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 897.4000000000001, 841, 1039, 884.0, 1029.7, 1039.0, 1039.0, 0.09494512171964604, 0.1626306088830656, 0.08010994645095135], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 10, 0, 0.0, 245.1, 239, 259, 244.0, 258.3, 259.0, 259.0, 0.09551463284175135, 0.05251439286123634, 0.0744342548903492], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 760.9, 479, 2416, 561.5, 2247.8000000000006, 2416.0, 2416.0, 0.09227731177735331, 0.042353844272808645, 0.1148059523479962], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 10, 0, 0.0, 252.3, 246, 267, 250.0, 266.3, 267.0, 267.0, 0.09551280826758869, 0.0644524907352576, 0.08320061032684484], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 10, 0, 0.0, 434.9, 377, 508, 426.0, 506.2, 508.0, 508.0, 0.09797581956773067, 0.06276575941057747, 0.27660946715850526], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 10, 0, 0.0, 245.0, 240, 260, 242.0, 259.2, 260.0, 260.0, 0.09895699329071585, 0.05440701877214162, 0.2630477888059849], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 10, 0, 0.0, 7598.8, 6700, 10520, 7446.0, 10266.0, 10520.0, 10520.0, 0.09274459067174906, 0.07182271523700881, 0.2566779003552118], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 10, 0, 0.0, 479.1, 457, 538, 469.0, 534.5, 538.0, 538.0, 0.0953034461726136, 0.06412507266887771, 0.09064995758996645], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 20, 0, 0.0, 246.0, 240, 260, 242.5, 259.3, 260.0, 260.0, 0.19413140754977043, 0.10673435786183669, 0.5160407142094484], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 10, 0, 0.0, 243.70000000000002, 238, 259, 240.5, 258.3, 259.0, 259.0, 0.09551463284175135, 0.05251439286123634, 0.0744342548903492], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 10, 0, 0.0, 464.7, 454, 481, 461.5, 480.8, 481.0, 481.0, 0.09516830514765362, 0.4430344830457664, 0.09089316643984888], "isController": false}, {"data": ["ST14-020-POST-senti-link", 10, 0, 0.0, 567.3000000000001, 527, 613, 566.0, 612.3, 613.0, 613.0, 0.09779855453736393, 0.06341625020782192, 0.2793562226775288], "isController": false}, {"data": ["ST12-010-PUT-businesses", 10, 0, 0.0, 294.5, 271, 327, 288.5, 326.4, 327.0, 327.0, 0.09795758436596953, 0.07337252657099476, 0.28000180609296177], "isController": false}, {"data": ["ST10-010-PUT-businesses", 20, 0, 0.0, 291.2, 269, 331, 282.0, 324.8, 330.7, 331.0, 0.19398830250535892, 0.1471962021940077, 0.5340361569947332], "isController": false}, {"data": ["ST08-010-PUT-businesses", 10, 0, 0.0, 301.90000000000003, 269, 355, 286.5, 353.4, 355.0, 355.0, 0.09803729338640418, 0.07467684457167507, 0.2716130872433874], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 10, 0, 0.0, 246.5, 239, 260, 242.5, 259.5, 260.0, 260.0, 0.09801231034617948, 0.05388762766103422, 0.26053662965068414], "isController": false}, {"data": ["ST14-010-PUT-businesses", 10, 0, 0.0, 312.7, 272, 386, 314.0, 379.70000000000005, 386.0, 386.0, 0.0979671809943669, 0.07404941219691404, 0.27629806514817534], "isController": false}, {"data": ["ST15-010-POST-add-payment", 10, 0, 0.0, 631.1999999999999, 528, 704, 638.0, 699.4, 704.0, 704.0, 0.09834195464469052, 0.05992712861160828, 0.31576986999193596], "isController": false}, {"data": ["ST13-010-PUT-businesses", 10, 0, 0.0, 296.9, 269, 344, 288.0, 342.4, 344.0, 344.0, 0.09798445966469718, 0.07348834474852288, 0.2718494628001999], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 10, 0, 0.0, 247.2, 239, 263, 241.5, 262.8, 263.0, 263.0, 0.09812098317225139, 0.05394737649021243, 0.26082550409655103], "isController": false}, {"data": ["ST09-010-GET-industries", 10, 0, 0.0, 494.6, 484, 523, 490.0, 521.6, 523.0, 523.0, 0.09782629962239048, 2.8129646749232067, 0.25880023991899986], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 10, 0, 0.0, 245.0, 240, 260, 240.0, 259.4, 260.0, 260.0, 0.09812483441434193, 0.053949493921166505, 0.26083574148031125], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 10, 0, 0.0, 251.3, 245, 270, 249.0, 268.7, 270.0, 270.0, 0.09804690563965801, 0.12313312563730489, 0.26436279928817946], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 20, 0, 0.0, 250.70000000000002, 244, 266, 247.5, 263.3, 265.9, 266.0, 0.19559137050873315, 0.16006403172492029, 0.5264158370332701], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 30, 0, 0.0, 246.06666666666666, 239, 261, 243.0, 258.5, 259.9, 261.0, 0.29288866325614094, 0.16103155997383528, 0.788282378841723], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 10, 0, 0.0, 244.70000000000002, 240, 259, 241.0, 258.4, 259.0, 259.0, 0.09552466924583274, 0.05251991092324593, 0.07444207622868605], "isController": false}, {"data": ["AF-010-GET-Welcome", 10, 0, 0.0, 1041.6999999999998, 940, 1240, 1028.0, 1226.4, 1240.0, 1240.0, 0.0947939180222197, 0.16237161348727866, 0.07054000540325332], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 10, 0, 0.0, 319.79999999999995, 289, 375, 317.0, 371.7, 375.0, 375.0, 0.09807190632171509, 0.06981876924661162, 0.28550034447757094], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 10, 0, 0.0, 1443.2, 1182, 2202, 1364.5, 2135.6000000000004, 2202.0, 2202.0, 0.09722235725327395, 0.06370722823920588, 0.28340696914162383], "isController": false}]}, function(index, item){
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
