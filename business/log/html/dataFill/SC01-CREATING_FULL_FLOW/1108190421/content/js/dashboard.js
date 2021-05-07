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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9105504587155964, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.875, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [0.375, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.875, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [0.875, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-030-OPTIONS-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.125, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.375, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.75, 500, 1500, "eProtect/paypage"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [0.375, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.875, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-DEBUG"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.625, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [0.875, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 436, 0, 0.0, 375.7293577981652, 0, 2299, 265.0, 818.2, 1022.15, 1700.9199999999996, 5.354094777301586, 15.165865842164724, 8.258610606265272], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 4, 0, 0.0, 271.75, 256, 294, 268.5, 294.0, 294.0, 294.0, 0.11725391334935803, 0.22775198598815738, 0.32221925016122416], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 4, 0, 0.0, 256.5, 244, 276, 253.0, 276.0, 276.0, 276.0, 0.11715432153003544, 0.07642488943560906, 0.08569197932226225], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 4, 0, 0.0, 259.0, 245, 284, 253.5, 284.0, 284.0, 284.0, 0.11325669630216886, 0.07222326434112918, 0.08472131774166149], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 4, 0, 0.0, 257.75, 245, 277, 254.5, 277.0, 277.0, 277.0, 0.11826971408296622, 0.07715250879630998, 0.09008825877413441], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 4, 0, 0.0, 945.5, 901, 1023, 929.0, 1023.0, 1023.0, 1023.0, 0.11195700850873265, 0.08823174401030004, 0.1304342882333184], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 4, 0, 0.0, 266.5, 251, 292, 261.5, 292.0, 292.0, 292.0, 0.11753989010020276, 0.06462398254532632, 0.3124449031765155], "isController": false}, {"data": ["ST09-020-PUT-businesses", 4, 0, 0.0, 428.75, 420, 438, 428.5, 438.0, 438.0, 438.0, 0.11778563015312132, 0.08983454799764429, 0.3378285114840989], "isController": false}, {"data": ["ST16-010-OPTIONS-pre-sign-contract", 4, 0, 0.0, 257.5, 245, 277, 254.0, 277.0, 277.0, 277.0, 0.11738466956215518, 0.07657515553468718, 0.10030428307313065], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 4, 0, 0.0, 821.75, 815, 834, 819.0, 834.0, 834.0, 834.0, 0.11549011115923198, 0.20007759491843513, 0.07838440161686155], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 4, 0, 0.0, 259.25, 245, 285, 253.5, 285.0, 285.0, 285.0, 0.11791062374719961, 0.07691825846008725, 0.10040826553472468], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 4, 0, 0.0, 264.25, 251, 288, 259.0, 288.0, 288.0, 288.0, 0.12237655265251178, 0.07337812825062719, 0.3327112525240164], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 4, 0, 0.0, 272.75, 263, 287, 270.5, 287.0, 287.0, 287.0, 0.11885659951268794, 0.23086501604564091, 0.32662350686396857], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 4, 0, 0.0, 269.75, 258, 297, 262.0, 297.0, 297.0, 297.0, 0.11831869139527318, 0.0650521711479871, 0.3145151152128257], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 4, 0, 0.0, 257.75, 245, 276, 255.0, 276.0, 276.0, 276.0, 0.11858527763778128, 0.07735836470902137, 0.08905476416352909], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 4, 0, 0.0, 288.75, 272, 306, 288.5, 306.0, 306.0, 306.0, 0.11647884452986226, 0.24922377770012522, 0.3138331367752832], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 4, 0, 0.0, 257.25, 245, 277, 253.5, 277.0, 277.0, 277.0, 0.11739500484254395, 0.07658189769025328, 0.09996918381122884], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 4, 0, 0.0, 411.75, 254, 862, 265.5, 862.0, 862.0, 862.0, 0.12004801920768308, 0.078312575030012, 0.1017594537815126], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 4, 0, 0.0, 1244.0, 995, 1732, 1124.5, 1732.0, 1732.0, 1732.0, 0.11252074601254607, 0.0703254662578413, 0.08186323806576838], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 4, 0, 0.0, 493.25, 265, 1152, 278.0, 1152.0, 1152.0, 1152.0, 0.1188495364868077, 0.06534403226764916, 0.31592620929403376], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 4, 0, 0.0, 1127.5, 1028, 1214, 1134.0, 1214.0, 1214.0, 1214.0, 0.11468547508458055, 0.07145442685933827, 0.31493706634554736], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 4, 0, 0.0, 491.75, 274, 1110, 291.5, 1110.0, 1110.0, 1110.0, 0.11286363251601253, 0.0829944485200756, 0.13347447165712029], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 4, 0, 0.0, 263.5, 251, 283, 260.0, 283.0, 283.0, 283.0, 0.11393414606357526, 0.06264152757206336, 0.08878852398313776], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 4, 0, 0.0, 257.75, 245, 277, 254.5, 277.0, 277.0, 277.0, 0.1135718341851221, 0.07242422629187961, 0.08495705565019876], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 4, 0, 0.0, 258.5, 247, 277, 255.0, 277.0, 277.0, 277.0, 0.11843079200592155, 0.07725758697261288, 0.09021095484826055], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 4, 0, 0.0, 380.5, 244, 745, 266.5, 745.0, 745.0, 745.0, 0.11630949957837806, 0.07417002268035242, 0.08700495769241953], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 4, 0, 0.0, 259.5, 245, 279, 257.0, 279.0, 279.0, 279.0, 0.11666229183072302, 0.07610391693644822, 0.10219343337124859], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 4, 0, 0.0, 256.75, 244, 276, 253.5, 276.0, 276.0, 276.0, 0.11943863839952225, 0.07791504926843834, 0.09086201104807405], "isController": false}, {"data": ["ST15-020-OPTIONS-latestApplicationId", 4, 0, 0.0, 257.0, 244, 276, 254.0, 276.0, 276.0, 276.0, 0.1173123735225973, 0.07652799366513183, 0.08924447165439775], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 4, 0, 0.0, 266.75, 260, 284, 261.5, 284.0, 284.0, 284.0, 0.1188001188001188, 0.06531686219186218, 0.315794847044847], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 4, 0, 0.0, 266.25, 255, 284, 263.0, 284.0, 284.0, 284.0, 0.11847639357857948, 0.0651388765475979, 0.31493431964930985], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 4, 0, 0.0, 256.5, 244, 276, 253.0, 276.0, 276.0, 276.0, 0.11883188259409999, 0.07751923591099491, 0.0905164730697246], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 4, 0, 0.0, 266.5, 252, 285, 264.5, 285.0, 285.0, 285.0, 0.11704462326261887, 0.06435168251645941, 0.31112838332114123], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 4, 0, 0.0, 258.75, 245, 283, 253.5, 283.0, 283.0, 283.0, 0.11895910780669146, 0.07760223048327138, 0.08910315985130111], "isController": false}, {"data": ["ST16-030-OPTIONS-sign-contract", 4, 0, 0.0, 257.25, 245, 276, 254.0, 276.0, 276.0, 276.0, 0.11761938367442955, 0.07672826981886614, 0.10004539373088685], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 4, 0, 0.0, 263.0, 252, 282, 259.0, 282.0, 282.0, 282.0, 0.11334013374135782, 0.062314936812875435, 0.08832561203672219], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 4, 0, 0.0, 422.5, 413, 437, 420.0, 437.0, 437.0, 437.0, 0.11692145801058139, 0.08323803016573617, 0.34037389289994446], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 4, 0, 0.0, 1631.75, 1399, 1967, 1580.5, 1967.0, 1967.0, 1967.0, 0.11589164131537014, 0.07277180211502245, 0.3378286614515428], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 4, 0, 0.0, 258.5, 250, 277, 253.5, 277.0, 277.0, 277.0, 0.11951715071112705, 0.07796626628421177, 0.10142617574997011], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 4, 0, 0.0, 258.75, 245, 277, 256.5, 277.0, 277.0, 277.0, 0.11395037461185654, 0.07266561974759991, 0.08434998433182349], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 4, 0, 0.0, 259.5, 244, 285, 254.5, 285.0, 285.0, 285.0, 0.11937447773665989, 0.07787319446102423, 0.08964743494090963], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 4, 0, 0.0, 258.5, 248, 277, 254.5, 277.0, 277.0, 277.0, 0.1167508245526984, 0.07616167070429934, 0.09828047926213478], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 4, 0, 0.0, 257.25, 244, 278, 253.5, 278.0, 278.0, 278.0, 0.11373006169855848, 0.07252512723550653, 0.08418690114014386], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 4, 0, 0.0, 257.75, 245, 278, 254.0, 278.0, 278.0, 278.0, 0.11387251971417997, 0.0726159720442964, 0.08518198252056822], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 4, 0, 0.0, 263.0, 254, 284, 257.0, 284.0, 284.0, 284.0, 0.11872254541137363, 0.07744791048320077, 0.09043318888756975], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 4, 0, 0.0, 257.5, 244, 279, 253.5, 279.0, 279.0, 279.0, 0.11774402449075709, 0.07680957847639232, 0.08612331478864947], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 4, 0, 0.0, 267.0, 254, 292, 261.0, 292.0, 292.0, 292.0, 0.12191776646651833, 0.06703095949282209, 0.32408218781431924], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 4, 0, 0.0, 383.0, 369, 397, 383.0, 397.0, 397.0, 397.0, 0.11696932479457263, 0.07287737228411849, 0.3239502003099687], "isController": false}, {"data": ["ST14-090-GET-id", 4, 0, 0.0, 1182.5, 862, 1789, 1039.5, 1789.0, 1789.0, 1789.0, 0.1173123735225973, 11.469747613426401, 0.3117255550341672], "isController": false}, {"data": ["eProtect/paypage", 4, 0, 0.0, 924.0, 449, 2299, 474.0, 2299.0, 2299.0, 2299.0, 0.10576694254210847, 0.04854537401835056, 0.1307626457600677], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 4, 0, 0.0, 264.75, 251, 284, 262.0, 284.0, 284.0, 284.0, 0.1196351129056378, 0.0657759458651114, 0.3180144309854942], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 4, 0, 0.0, 259.5, 244, 285, 254.5, 285.0, 285.0, 285.0, 0.12065637065637067, 0.0787094292953668, 0.10251078366312741], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 4, 0, 0.0, 1118.0, 857, 1541, 1037.0, 1541.0, 1541.0, 1541.0, 0.1152704533010576, 11.270050755021469, 0.3062997103829861], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 4, 0, 0.0, 290.25, 275, 312, 287.0, 312.0, 312.0, 312.0, 0.11368157790030126, 0.07771201614278406, 0.10013748365827317], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 4, 0, 0.0, 257.75, 245, 278, 254.0, 278.0, 278.0, 278.0, 0.11403158674952962, 0.07271740834711214, 0.08441010034779634], "isController": false}, {"data": ["ST06-030-GET-suffixes", 4, 0, 0.0, 503.75000000000006, 264, 1188, 281.5, 1188.0, 1188.0, 1188.0, 0.11717491285115857, 0.08936875677417465, 0.30792743211178486], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 4, 0, 0.0, 257.25, 246, 276, 253.5, 276.0, 276.0, 276.0, 0.11988970147464333, 0.07820929744634937, 0.09003435589257884], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 4, 0, 0.0, 264.5, 251, 283, 262.0, 283.0, 283.0, 283.0, 0.12273326992114388, 0.06747932711484765, 0.3262499616458531], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 147.0, 0, 585, 1.5, 585.0, 585.0, 585.0, 0.11516093741003051, 0.0, 0.0], "isController": false}, {"data": ["TEST-01-BUSINESS-DEBUG", 4, 0, 0.0, 6.75, 0, 26, 0.5, 26.0, 26.0, 26.0, 0.11713716762328687, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 4, 0, 0.0, 257.5, 245, 278, 253.5, 278.0, 278.0, 278.0, 0.1174777526505918, 0.0766358777056595, 0.08948500690181797], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 4, 0, 0.0, 265.25, 252, 285, 262.0, 285.0, 285.0, 285.0, 0.11926769634444512, 0.06557393851750254, 0.3170377631343551], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 4, 0, 0.0, 257.25, 245, 277, 253.5, 277.0, 277.0, 277.0, 0.1195814648729447, 0.07800822122571001, 0.09108744394618833], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 4, 0, 0.0, 338.5, 245, 578, 265.5, 578.0, 578.0, 578.0, 0.11420413990007137, 0.06780870806566738, 0.07773465381870093], "isController": false}, {"data": ["ST07-030-GET-core/products", 4, 0, 0.0, 282.0, 271, 303, 277.0, 303.0, 303.0, 303.0, 0.11773709307117207, 0.9207408606581504, 0.30940480220168365], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 4, 0, 0.0, 263.75, 252, 284, 259.5, 284.0, 284.0, 284.0, 0.11386603660793077, 0.06260408067408695, 0.08873544649719606], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 4, 0, 0.0, 634.25, 613, 662, 631.0, 662.0, 662.0, 662.0, 0.11562364503540974, 0.08344323601676543, 0.32157826275473333], "isController": false}, {"data": ["ST14-060-POST-middesk", 4, 0, 0.0, 288.75, 281, 307, 283.5, 307.0, 307.0, 307.0, 0.1220070154033857, 0.08328408570992833, 0.3336129327436328], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 4, 0, 0.0, 259.25, 247, 277, 256.5, 277.0, 277.0, 277.0, 0.11341404632963793, 0.07232360571606794, 0.08395297570104057], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 4, 0, 0.0, 261.75, 245, 281, 260.5, 281.0, 281.0, 281.0, 0.12201445871335753, 0.07959536955129183, 0.09270239148339078], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 4, 0, 0.0, 260.5, 247, 276, 259.5, 276.0, 276.0, 276.0, 0.11831869139527318, 0.07718445883988523, 0.08885456414352057], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 44.75, 0, 177, 1.0, 177.0, 177.0, 177.0, 0.11721955222131052, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 4, 0, 0.0, 272.5, 260, 291, 269.5, 291.0, 291.0, 291.0, 0.1196780660024534, 0.15018194805971935, 0.3226866603835682], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 4, 0, 0.0, 843.25, 838, 853, 841.0, 853.0, 853.0, 853.0, 0.11541679891508208, 0.1976963528291543, 0.09738292408460052], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 4, 0, 0.0, 411.75, 253, 861, 266.5, 861.0, 861.0, 861.0, 0.11380124612364506, 0.07257052120970725, 0.08512866653389854], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 4, 0, 0.0, 257.75, 244, 278, 254.5, 278.0, 278.0, 278.0, 0.12047467020059033, 0.07859089813866635, 0.09176781519185592], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 4, 0, 0.0, 257.25, 244, 276, 254.5, 276.0, 276.0, 276.0, 0.1226692836113837, 0.0800225404808636, 0.09343949337585869], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 4, 0, 0.0, 276.5, 261, 299, 273.0, 299.0, 299.0, 299.0, 0.11342691053452432, 0.07654101091734014, 0.09880547284843329], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 4, 0, 0.0, 575.5, 539, 611, 576.0, 611.0, 611.0, 611.0, 0.11703434958160219, 0.07497513020071392, 0.3304163131254023], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 4, 0, 0.0, 266.75, 259, 283, 262.5, 283.0, 283.0, 283.0, 0.11751917031465758, 0.0646125907101096, 0.31238982577783003], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 4, 0, 0.0, 611.0, 487, 875, 541.0, 875.0, 875.0, 875.0, 0.1171303074670571, 0.0729776720351391, 0.3241672767203514], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 4, 0, 0.0, 258.0, 245, 277, 255.0, 277.0, 277.0, 277.0, 0.11747085254471235, 0.07663137646471468, 0.10037792575842118], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 4, 0, 0.0, 560.75, 515, 653, 537.5, 653.0, 653.0, 653.0, 0.11282861333634209, 0.07591690877806612, 0.10731940370077853], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 4, 0, 0.0, 257.5, 245, 277, 254.0, 277.0, 277.0, 277.0, 0.1190582492484448, 0.07766690478316517, 0.08940995475786528], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 4, 0, 0.0, 264.25, 250, 285, 261.0, 285.0, 285.0, 285.0, 0.11362345188046813, 0.062470706453812065, 0.08854640097716168], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 4, 0, 0.0, 488.25, 477, 510, 483.0, 510.0, 510.0, 510.0, 0.113529929327619, 0.528512864360117, 0.10842995203360487], "isController": false}, {"data": ["ST14-020-POST-senti-link", 4, 0, 0.0, 750.25, 640, 959, 701.0, 959.0, 959.0, 959.0, 0.1187542677314966, 0.07456933022593, 0.3392150714010035], "isController": false}, {"data": ["ST12-010-PUT-businesses", 4, 0, 0.0, 271.5, 262, 286, 269.0, 286.0, 286.0, 286.0, 0.11908660573402007, 0.07512690166423532, 0.3403969677573015], "isController": false}, {"data": ["ST10-010-PUT-businesses", 4, 0, 0.0, 425.5, 416, 438, 424.0, 438.0, 438.0, 438.0, 0.11807420964075921, 0.08982403252944475, 0.32504999704814475], "isController": false}, {"data": ["ST08-010-PUT-businesses", 4, 0, 0.0, 416.0, 374, 456, 417.0, 456.0, 456.0, 456.0, 0.11811953697141507, 0.08997386605244508, 0.3272510999881881], "isController": false}, {"data": ["ST14-010-PUT-businesses", 4, 0, 0.0, 268.75, 257, 287, 265.5, 287.0, 287.0, 287.0, 0.11993283761093787, 0.07566075497721277, 0.33707686195730396], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 12, 0, 0.0, 258.0833333333333, 244, 276, 254.5, 276.0, 276.0, 276.0, 0.35528185693983894, 0.23176589886309804, 0.2772169957958313], "isController": false}, {"data": ["ST15-010-POST-add-payment", 4, 0, 0.0, 398.75, 381, 425, 394.5, 425.0, 425.0, 425.0, 0.1190972428988269, 0.08118151908533318, 0.382413803370452], "isController": false}, {"data": ["ST13-010-PUT-businesses", 4, 0, 0.0, 270.75, 260, 290, 266.5, 290.0, 290.0, 290.0, 0.11944933854928778, 0.0753557350613671, 0.33140192462746737], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 4, 0, 0.0, 334.5, 244, 563, 265.5, 563.0, 563.0, 563.0, 0.11700696191423389, 0.07632876031123852, 0.08912639677060785], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 4, 0, 0.0, 264.5, 251, 285, 261.0, 285.0, 285.0, 285.0, 0.1205436518699334, 0.06627546484645752, 0.32042951209956905], "isController": false}, {"data": ["ST09-010-GET-industries", 4, 0, 0.0, 595.25, 509, 777, 547.5, 777.0, 777.0, 777.0, 0.11723673026759285, 3.371013951170902, 0.31015068583487204], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 4, 0, 0.0, 257.75, 244, 278, 254.5, 278.0, 278.0, 278.0, 0.11920727164357026, 0.07776411861123529, 0.09080241394725078], "isController": false}, {"data": ["ST16-020-OPTIONS-maintenance/configuration", 4, 0, 0.0, 257.5, 245, 277, 254.0, 277.0, 277.0, 277.0, 0.1174674027957242, 0.0766291260425232, 0.08947712322330553], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 4, 0, 0.0, 412.5, 254, 865, 265.5, 865.0, 865.0, 865.0, 0.11980711055201125, 0.0781554197741636, 0.09582228861532932], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 4, 0, 0.0, 258.0, 246, 278, 254.0, 278.0, 278.0, 278.0, 0.11897326075964426, 0.07761146307367418, 0.10131316736563457], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 8, 0, 0.0, 263.625, 249, 283, 260.0, 283.0, 283.0, 283.0, 0.23892008123282762, 0.14652520606857006, 0.6395311940031059], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 12, 0, 0.0, 265.5, 252, 284, 262.0, 283.7, 284.0, 284.0, 0.3437508951846229, 0.18899585350482684, 0.9251733077429889], "isController": false}, {"data": ["AF-010-GET-Welcome", 4, 0, 0.0, 980.5, 960, 1016, 973.0, 1016.0, 1016.0, 1016.0, 0.1145409770345341, 0.19675544785522023, 0.08534645066147414], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 4, 0, 0.0, 257.5, 244, 276, 255.0, 276.0, 276.0, 276.0, 0.11846235858555944, 0.07727817923354854, 0.0889624548362258], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 436, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
