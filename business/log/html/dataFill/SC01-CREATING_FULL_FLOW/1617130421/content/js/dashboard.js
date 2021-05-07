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

    var data = {"OkPercent": 61.607142857142854, "KoPercent": 38.392857142857146};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5111607142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 440.85267857142867, 1, 2726, 275.0, 1029.5, 1121.25, 1379.25, 1.3994314809608597, 0.837757805422797, 1.0783461015837317], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 245.5, 243, 248, 245.5, 248.0, 248.0, 248.0, 0.02596256198561674, 0.019471921489212556, 0.022894720188488198], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1018.5, 1008, 1029, 1018.5, 1029.0, 1029.0, 1029.0, 0.026296413169243714, 0.006984984748080362, 0.023471603160828865], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1017.5, 1009, 1026, 1017.5, 1026.0, 1026.0, 1026.0, 0.026306097753459254, 0.017160618456358183, 0.0185221645314884], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 273.5, 271, 276, 273.5, 276.0, 276.0, 276.0, 0.02664570537843563, 0.01699184141808444, 0.019203643134067867], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 270.5, 263, 278, 270.5, 278.0, 278.0, 278.0, 0.026536109010335814, 0.017310664862211254, 0.019487455054465364], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 786.5, 760, 813, 786.5, 813.0, 813.0, 813.0, 0.026422173487991123, 0.020822943364071127, 0.031015090363833327], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 250.0, 246, 254, 250.0, 254.0, 254.0, 254.0, 0.026537869539833343, 0.007049121596518231, 0.021302860118889655], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 259.5, 249, 270, 259.5, 270.0, 270.0, 270.0, 0.026550199790253422, 0.019912649842690068, 0.026031641200600038], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 819.0, 819, 819, 819.0, 819.0, 819.0, 819.0, 0.026413449728601806, 0.045294939183032006, 0.017204854461891995], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1093.0, 1067, 1119, 1093.0, 1119.0, 1119.0, 1119.0, 0.02626602227358689, 0.017134475467535194, 0.021648948045807942], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 274.0, 249, 299, 274.0, 299.0, 299.0, 299.0, 0.026050146532074242, 0.01953760989905568, 0.021649096385542167], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.0, 1, 21, 3.0, 21.0, 21.0, 21.0, 0.03663540445486518, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1108.0, 1068, 1148, 1108.0, 1148.0, 1148.0, 1148.0, 0.02631128885848473, 0.006988936103035007, 0.023484880875639692], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 269.0, 262, 276, 269.0, 276.0, 276.0, 276.0, 0.02653082882309243, 0.007047251406133928, 0.02129720829353709], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1056.0, 1013, 1099, 1056.0, 1099.0, 1099.0, 1099.0, 0.026306443763399846, 0.017160844173780367, 0.019036205887382113], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.02658019244059327, 0.01993514433044495, 0.019987058768805487], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1018.5, 1002, 1035, 1018.5, 1035.0, 1035.0, 1035.0, 0.02628777224274129, 0.017148663923975762, 0.02166687477819692], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 262.5, 244, 281, 262.5, 281.0, 281.0, 281.0, 0.026280518251819925, 0.017143931828335655, 0.021558237628446032], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 242.5, 240, 245, 242.5, 245.0, 245.0, 245.0, 0.02596155094305334, 0.01693585549800745, 0.019065513973804793], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1173.5, 1156, 1191, 1173.5, 1191.0, 1191.0, 1191.0, 0.02629917946560067, 0.016436987166000422, 0.018414562184409847], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 246.0, 242, 250, 246.0, 250.0, 250.0, 250.0, 0.025968292714595477, 0.01947621953594661, 0.01998341275302855], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 245.0, 240, 250, 245.0, 250.0, 250.0, 250.0, 0.0265717170643567, 0.007058112345219748, 0.02133003069033321], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 295.5, 295, 296, 295.5, 296.0, 296.0, 296.0, 0.026613085654216176, 0.019569974118774203, 0.03069341226330987], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 282.0, 279, 285, 282.0, 285.0, 285.0, 285.0, 0.026621941804435216, 0.014636868394430689, 0.0200184523334132], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 274.0, 271, 277, 274.0, 277.0, 277.0, 277.0, 0.02663754295303801, 0.016986636277669748, 0.019197760448576226], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 255.0, 245, 265, 255.0, 265.0, 265.0, 265.0, 0.026559014129395517, 0.017325606873472857, 0.019504276001274832], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 272.5, 270, 275, 272.5, 275.0, 275.0, 275.0, 0.026588673225206062, 0.016955472281308163, 0.019162539883009838], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 274.5, 271, 278, 274.5, 278.0, 278.0, 278.0, 0.026578779502445245, 0.017338500691048267, 0.021179964916011054], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 242.5, 240, 245, 242.5, 245.0, 245.0, 245.0, 0.025976724854530342, 0.016945754104322527, 0.01986306207138404], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 261.0, 251, 271, 261.0, 271.0, 271.0, 271.0, 0.026618752911426097, 0.007070606242097557, 0.02136778798163306], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1062.0, 1026, 1098, 1062.0, 1098.0, 1098.0, 1098.0, 0.02569769234722722, 0.016763728992136507, 0.021155424461633345], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 255.0, 244, 266, 255.0, 266.0, 266.0, 266.0, 0.026566775590446588, 0.0070567997662123755, 0.021326063999362398], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 242.0, 239, 245, 242.0, 245.0, 245.0, 245.0, 0.025959866047091197, 0.006895589418758599, 0.020838876846395474], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 245.0, 241, 249, 245.0, 249.0, 249.0, 249.0, 0.026568540191559176, 0.01733182114058743, 0.019511271703176267], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 272.5, 270, 275, 272.5, 275.0, 275.0, 275.0, 0.026570305027101712, 0.007057737272823892, 0.021328897199489848], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1070.5, 1013, 1128, 1070.5, 1128.0, 1128.0, 1128.0, 0.026265677326154046, 0.017134250443233304, 0.01895540580471469], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 287.5, 283, 292, 287.5, 292.0, 292.0, 292.0, 0.02663896214603479, 0.014646226258024987, 0.020031250832467568], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 254.5, 249, 260, 254.5, 260.0, 260.0, 260.0, 0.026543152530226016, 0.01990736439766951, 0.027217099762438784], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 250.5, 242, 259, 250.5, 259.0, 259.0, 259.0, 0.026217130272920327, 0.019662847704690244, 0.02693400492882049], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 243.0, 240, 246, 243.0, 246.0, 246.0, 246.0, 0.025974363303419526, 0.01694421356121508, 0.021332460486499828], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 274.0, 271, 277, 274.0, 277.0, 277.0, 277.0, 0.02661273153076432, 0.016970814149989355, 0.019933559652437725], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 995.0, 978, 1012, 995.0, 1012.0, 1012.0, 1012.0, 0.026422522558228634, 0.01723656745009446, 0.01912020431215568], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 273.5, 271, 276, 273.5, 276.0, 276.0, 276.0, 0.02657771989741, 0.017337809464326056, 0.021646307025820252], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 276.0, 272, 280, 276.0, 280.0, 280.0, 280.0, 0.026632222325791974, 0.01698324333861539, 0.018985861618972796], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 273.0, 270, 276, 273.0, 276.0, 276.0, 276.0, 0.026627258324346634, 0.01698007781816245, 0.01919034828453888], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.5, 250, 271, 260.5, 271.0, 271.0, 271.0, 0.026611315131193785, 0.017359725105114694, 0.019542684549470432], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1067.5, 1030, 1105, 1067.5, 1105.0, 1105.0, 1105.0, 0.026264642538215057, 0.017133575405788727, 0.018492975849661187], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 245.5, 238, 253, 245.5, 253.0, 253.0, 253.0, 0.026213350459388968, 0.006962921215775195, 0.021042357497673567], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 987.5, 978, 997, 987.5, 997.0, 997.0, 997.0, 0.02573174654229656, 0.01929880990672242, 0.020605500160823416], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 245.0, 240, 250, 245.0, 250.0, 250.0, 250.0, 0.02641310089804543, 0.007015979926043318, 0.02120270404120444], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 999.5, 969, 1030, 999.5, 1030.0, 1030.0, 1030.0, 0.025975375344173723, 0.01694487375967583, 0.021358658241986597], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 303.5, 298, 309, 303.5, 309.0, 309.0, 309.0, 0.026619461488294093, 0.01819689750176354, 0.022720126309344762], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 274.0, 271, 277, 274.0, 277.0, 277.0, 277.0, 0.026622650551088867, 0.016977139462754913, 0.01897903799052234], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 248.0, 244, 252, 248.0, 252.0, 252.0, 252.0, 0.026570305027101712, 0.007057737272823892, 0.020524522730895948], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 242.0, 239, 245, 242.0, 245.0, 245.0, 245.0, 0.02596761837988029, 0.01693981355250003, 0.019044610745400484], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 242.0, 239, 245, 242.0, 245.0, 245.0, 245.0, 0.02596559558584875, 0.01693849399545602, 0.02147740181759169], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 262.5, 244, 281, 262.5, 281.0, 281.0, 281.0, 0.026306097753459254, 0.017160618456358183, 0.019035955503235648], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 269.5, 245, 294, 269.5, 294.0, 294.0, 294.0, 0.025982799386805935, 0.006901681087120326, 0.020857286226518043], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 354.0, 1, 1409, 3.0, 1409.0, 1409.0, 1409.0, 0.036169962654513554, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.0, 245, 255, 250.0, 255.0, 255.0, 255.0, 0.026541039081680047, 0.017313880963439717, 0.019491075575608783], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 263.5, 246, 281, 263.5, 281.0, 281.0, 281.0, 0.02668018462687762, 0.007086924041514367, 0.021417101331341212], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 615.5, 241, 990, 615.5, 990.0, 990.0, 990.0, 0.026416240704785304, 0.017232469522262286, 0.019399426767576708], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 277.0, 271, 283, 277.0, 283.0, 283.0, 283.0, 0.026589733703816957, 0.015787654386641318, 0.018332374995014424], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 262.0, 253, 271, 262.0, 271.0, 271.0, 271.0, 0.026561835954101148, 0.007055487675308117, 0.020517980702826177], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 282.5, 280, 285, 282.5, 285.0, 285.0, 285.0, 0.02661166921695163, 0.014631220477679462, 0.020010727829153082], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 281.0, 275, 287, 281.0, 287.0, 287.0, 287.0, 0.026572070097120915, 0.019929052572840687, 0.023743597791860978], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 276.0, 248, 304, 276.0, 304.0, 304.0, 304.0, 0.02612091370956156, 0.019590685282171172, 0.02211604705682605], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 274.0, 272, 276, 274.0, 276.0, 276.0, 276.0, 0.026641446097694182, 0.016989125294721, 0.018992437159489017], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1097.0, 995, 1199, 1097.0, 1199.0, 1199.0, 1199.0, 0.025887286753475368, 0.01688740971808745, 0.018960415102643093], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1034.5, 992, 1077, 1034.5, 1077.0, 1077.0, 1077.0, 0.026261538663550296, 0.01713155061255039, 0.019003711083682394], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 41.75, 2, 158, 3.5, 158.0, 158.0, 158.0, 0.03664178079054642, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1062.5, 1003, 1122, 1062.5, 1122.0, 1122.0, 1122.0, 0.026109319721674653, 0.006935288051069829, 0.021953246367540893], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 839.5, 836, 843, 839.5, 843.0, 843.0, 843.0, 0.02640752086194148, 0.04621316150839759, 0.02155926507869441], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 273.5, 271, 276, 273.5, 276.0, 276.0, 276.0, 0.02661662740714124, 0.016973298532092996, 0.01918268654928734], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 262.5, 243, 282, 262.5, 282.0, 282.0, 282.0, 0.026255677790322157, 0.017127727308530467, 0.01928151337726783], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 271.0, 246, 296, 271.0, 296.0, 296.0, 296.0, 0.025999688003743956, 0.016960733971192344, 0.019093520877749466], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 290.0, 286, 294, 290.0, 294.0, 294.0, 294.0, 0.02663435032160978, 0.017972984445539415, 0.022472733083858255], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 274.5, 267, 282, 274.5, 282.0, 282.0, 282.0, 0.02653998248361156, 0.019904986862708668, 0.024777561771809228], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 266.0, 258, 274, 266.0, 274.0, 274.0, 274.0, 0.02597807450511768, 0.019483555878838262, 0.022299538564451604], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 251.0, 245, 257, 251.0, 257.0, 257.0, 257.0, 0.026548437624445802, 0.017318707356572066, 0.021959498699126556], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 541.5, 535, 548, 541.5, 548.0, 548.0, 548.0, 0.026525198938992044, 0.017847521551724137, 0.024504724801061008], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 264.5, 248, 281, 264.5, 281.0, 281.0, 281.0, 0.02664428546687449, 0.017381233097531406, 0.019280679229447265], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 282.5, 280, 285, 282.5, 285.0, 285.0, 285.0, 0.02663257696814744, 0.014642715657292, 0.02002644947800149], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 382.0, 381, 383, 382.0, 383.0, 383.0, 383.0, 0.026550199790253422, 0.017864343413559188, 0.025564938469911987], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 266.0, 247, 285, 266.0, 285.0, 285.0, 285.0, 0.026266367230080242, 0.019699775422560184, 0.025445543254140234], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 268.0, 251, 285, 268.0, 285.0, 285.0, 285.0, 0.026654938493729425, 0.01999120387029707, 0.025874032092545945], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 263.5, 253, 274, 263.5, 274.0, 274.0, 274.0, 0.026602819898909284, 0.01995211492418196, 0.023017674248470336], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 249.0, 245, 253, 249.0, 253.0, 253.0, 253.0, 0.026563952716164164, 0.01992296453712312, 0.023450989507238677], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 266.5, 248, 285, 266.5, 285.0, 285.0, 285.0, 0.026291919178640443, 0.01971893938398033, 0.02523921538340191], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 270.3333333333333, 244, 296, 270.5, 296.0, 296.0, 296.0, 0.07710892921400297, 0.050301528041947256, 0.05805760197655889], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 248.0, 243, 253, 248.0, 253.0, 253.0, 253.0, 0.025970315928893276, 0.019477736946669957, 0.03327446728389451], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 250.5, 247, 254, 250.5, 254.0, 254.0, 254.0, 0.026677693446624604, 0.020008270084968454, 0.023655610985874164], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 273.5, 271, 276, 273.5, 276.0, 276.0, 276.0, 0.0265717170643567, 0.01733389355370144, 0.019513604719136952], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 262.5, 244, 281, 262.5, 281.0, 281.0, 281.0, 0.02624293081051292, 0.006970778496542494, 0.02106610266234533], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 261.0, 244, 278, 261.0, 278.0, 278.0, 278.0, 0.026521681474605492, 0.007044821641692084, 0.02095316436812094], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 263.5, 247, 280, 263.5, 280.0, 280.0, 280.0, 0.026668444562970864, 0.017396993132875523, 0.01958463897593173], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1066.0, 991, 1141, 1066.0, 1141.0, 1141.0, 1141.0, 0.026062706872735802, 0.017001843936511246, 0.020132422984701193], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1070.5, 1006, 1135, 1070.5, 1135.0, 1135.0, 1135.0, 0.026333113890717578, 0.017178242264647793, 0.021704246214614878], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 275.0, 248, 303, 274.5, 303.0, 303.0, 303.0, 0.051531782226688305, 0.038648836670016236, 0.04066179691324624], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 277.1666666666667, 274, 281, 277.0, 281.0, 281.0, 281.0, 0.07916507237007032, 0.05937380427755275, 0.06339390560884538], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1003.5, 953, 1054, 1003.5, 1054.0, 1054.0, 1054.0, 0.026296758924462562, 0.04496643054368549, 0.018875115048320294], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1455.0, 846, 2726, 1124.0, 2726.0, 2726.0, 2726.0, 0.035299204885409954, 0.016201783492326836, 0.04395164670790791], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 998.5, 982, 1015, 998.5, 1015.0, 1015.0, 1015.0, 0.026280172923537837, 0.017143706555589135, 0.019017195445646035], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 36, 41.86046511627907, 16.071428571428573], "isController": false}, {"data": ["500/Internal Server Error", 2, 2.3255813953488373, 0.8928571428571429], "isController": false}, {"data": ["401/Unauthorized", 48, 55.81395348837209, 21.428571428571427], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 86, "401/Unauthorized", 48, "400/Bad Request", 36, "500/Internal Server Error", 2, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, "401/Unauthorized", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, "401/Unauthorized", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
