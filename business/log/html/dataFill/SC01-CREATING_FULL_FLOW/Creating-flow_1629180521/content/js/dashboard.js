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

    var data = {"OkPercent": 99.33774834437087, "KoPercent": 0.6622516556291391};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8509933774834437, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-CREATING-FLOW"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [0.875, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 151, 1, 0.6622516556291391, 492.8609271523182, 0, 6422, 267.0, 1031.0, 1598.6000000000001, 4855.239999999969, 1.6449160112420749, 5.070129353308351, 2.5570644070404582], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 1, 50.0, 256.5, 248, 265, 256.5, 265.0, 265.0, 265.0, 0.02619515389652914, 0.03392067779960708, 0.07112854043876883], "isController": false}, {"data": ["ST10-030-GET-customers/email", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 5.30501057330827, 10.022615131578947], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.0515100279850746, 9.827571128731343], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1, 0, 0.0, 3409.0, 3409, 3409, 3409.0, 3409.0, 3409.0, 3409.0, 0.2933411557641537, 0.1927915994426518, 0.8052558484892931], "isController": false}, {"data": ["ST14-090-GET-id", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 184.94875354442343, 4.980653355387523], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 4, 0, 0.0, 388.75, 245, 531, 389.5, 531.0, 531.0, 531.0, 0.051517844493386394, 0.036135441218139434, 0.05745447110492897], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 10.369248277559056], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 2.492468341503268, 9.280535130718954], "isController": false}, {"data": ["TEST-01-BUSINESS-CREATING-FLOW", 3, 0, 0.0, 4.333333333333333, 1, 11, 1.0, 11.0, 11.0, 11.0, 0.038422131147540985, 0.0, 0.0], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 2.0669349154135337, 9.901462640977442], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 341.1818771626298, 9.116836072664361], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 6, 0, 0.0, 262.5, 246, 285, 256.5, 285.0, 285.0, 285.0, 0.0768925170765465, 0.04899645253168612, 0.06345134465789237], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 6, 0, 0.0, 1162.5, 887, 1786, 899.0, 1786.0, 1786.0, 1786.0, 0.07551159102922299, 0.1315676402942435, 0.04881706373178283], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 1.4810597324723247, 4.998126153136531], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 7.273204291044776, 10.162809001865671], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 261.0, 254, 268, 261.0, 268.0, 268.0, 268.0, 0.02618726513296584, 0.019972904364107733, 0.06817895394969425], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.098491173664122, 10.052630009541984], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 4, 0, 0.0, 349.75, 319, 415, 332.5, 415.0, 415.0, 415.0, 0.05221659443371103, 0.11317844857970863, 0.13941422771656833], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.9090440538194446, 9.145100911458334], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 3, 0, 0.0, 61.0, 1, 180, 2.0, 180.0, 180.0, 180.0, 0.03833375926399182, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.328584558823529], "isController": false}, {"data": ["ST07-030-GET-core/products", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 28.541286496350363, 9.501881843065693], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 4, 0, 0.0, 257.25, 246, 264, 259.5, 264.0, 264.0, 264.0, 0.05150656708730363, 0.02831855202163276, 0.03802633273242339], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 6, 0, 0.0, 647.1666666666667, 246, 1128, 618.0, 1128.0, 1128.0, 1128.0, 0.07593302707012416, 0.0474581419188276, 0.052797182884695704], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 328.0, 264, 392, 328.0, 392.0, 392.0, 392.0, 0.02613798240913784, 0.01807196440006796, 0.07184116356495943], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.1560968137254903, 10.328584558823529], "isController": false}, {"data": ["ST14-060-POST-middesk", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 0.8111235479186835, 2.6233890972894485], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1, 0, 0.0, 1178.0, 1178, 1178, 1178.0, 1178.0, 1178.0, 1178.0, 0.8488964346349746, 84.80923042232598, 2.3104241829371817], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 6, 0, 0.0, 262.66666666666663, 249, 280, 262.0, 280.0, 280.0, 280.0, 0.07678722260615835, 0.057390450229081874, 0.08878522613837057], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 3, 0, 0.0, 20.333333333333336, 0, 60, 1.0, 60.0, 60.0, 60.0, 0.03842803709586514, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 5.178303736162361, 9.859317343173432], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 6, 0, 0.0, 1061.3333333333335, 258, 2155, 927.5, 2155.0, 2155.0, 2155.0, 0.0751625389905671, 0.1309839363561201, 0.060996162012852795], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 6, 0, 0.0, 264.16666666666663, 254, 271, 265.0, 271.0, 271.0, 271.0, 0.07692307692307693, 0.04229266826923077, 0.056565504807692304], "isController": false}, {"data": ["eProtect/paypage_01", 3, 0, 0.0, 1445.6666666666665, 410, 2338, 1589.0, 2338.0, 2338.0, 2338.0, 0.03734548306382343, 0.017140993203122082, 0.04164896646375621], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 6, 0, 0.0, 256.33333333333337, 245, 271, 253.5, 271.0, 271.0, 271.0, 0.07687182903705223, 0.0486955010762056, 0.06268357152923691], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 1.642628205128205, 7.176482371794871], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 10.369248277559056], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1, 0, 0.0, 6422.0, 6422, 6422, 6422.0, 6422.0, 6422.0, 6422.0, 0.15571473061351604, 0.12058767712550608, 0.4271510530208658], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 4, 0, 0.0, 384.25, 247, 561, 364.5, 561.0, 561.0, 561.0, 0.05129849310676499, 0.03302590974671369, 0.0462387784546329], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 261.5, 260, 263, 261.5, 263.0, 263.0, 263.0, 1.463057790782736, 0.8043960314557425, 3.8533856071689834], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 6, 0, 0.0, 256.5, 251, 270, 254.5, 270.0, 270.0, 270.0, 0.07688857563913627, 0.04227369930159544, 0.05654013423463831], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 4, 0, 0.0, 467.5, 450, 483, 468.5, 483.0, 483.0, 483.0, 0.051568321580053374, 0.2410214717598979, 0.04774098521278379], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 1.176837568058076, 5.139802631578947], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 2.5050951086956523, 9.478208612040135], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 302.0, 300, 304, 302.0, 304.0, 304.0, 304.0, 1.4184397163120568, 1.0762965425531916, 3.8702349290780145], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.5561031879194633, 9.192140310402685], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.147674560546875, 10.288238525390625], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 2.570950255102041, 9.489928784013607], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 1.0634816753926701, 5.561122927574171], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.5337837837837838, 9.29054054054054], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 2.059193586142322, 9.864378511235955], "isController": false}, {"data": ["ST09-010-GET-industries", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 51.5302979390681, 4.697300627240143], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 251.5, 248, 255, 251.5, 255.0, 255.0, 255.0, 0.02618726513296584, 0.014397881122909928, 0.06897173248399303], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 4.581227022058823, 9.823069852941176], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 2, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 1.863932898415657, 1.5144454799627214, 4.971094478098789], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 12, 0, 0.0, 264.33333333333337, 253, 293, 262.0, 287.0, 293.0, 293.0, 0.15572685509616133, 0.08561935490150276, 0.41440984388382773], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 6, 0, 0.0, 256.8333333333333, 246, 267, 254.5, 267.0, 267.0, 267.0, 0.07686592021317482, 0.04226124324220451, 0.05652347453175843], "isController": false}, {"data": ["AF-010-GET-Welcome", 6, 0, 0.0, 997.1666666666667, 924, 1101, 987.5, 1101.0, 1101.0, 1101.0, 0.07591477301482868, 0.13233190413229415, 0.049448392188369855], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 2.1507977719033233, 8.730055702416918], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1, 0, 0.0, 1580.0, 1580, 1580, 1580.0, 1580.0, 1580.0, 1580.0, 0.6329113924050633, 0.4147300237341772, 1.829509493670886], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 1, 100.0, 0.6622516556291391], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 151, 1, "406/Not Acceptable", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 1, "406/Not Acceptable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
