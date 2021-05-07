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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5089285714285714, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [0.75, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.75, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.125, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.5, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 86, 38.392857142857146, 458.0178571428573, 1, 2425, 256.0, 1107.5, 1171.0, 2169.5, 1.3924806047344342, 0.8335420856282325, 1.0729900335065645], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 250.5, 250, 251, 250.5, 251.0, 251.0, 251.0, 0.026832671460770636, 0.020124503595577974, 0.023662013993238168], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 1707.0, 1032, 2382, 1707.0, 2382.0, 2382.0, 2382.0, 0.025803455082635565, 0.006854042756325072, 0.023031599556180574], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 1013.5, 1010, 1017, 1013.5, 1017.0, 1017.0, 1017.0, 0.02581144737691166, 0.016837936374782217, 0.018173880428470027], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 245.5, 245, 246, 245.5, 246.0, 246.0, 246.0, 0.026520626417195974, 0.016912079150809542, 0.019113498335830693], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 260.0, 244, 276, 260.0, 276.0, 276.0, 276.0, 0.026643220632510057, 0.017380538459488983, 0.019566115151999575], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 617.0, 587, 647, 617.0, 647.0, 647.0, 647.0, 0.025951444846691842, 0.020451968741484684, 0.030462535845433198], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 267.5, 259, 276, 267.5, 276.0, 276.0, 276.0, 0.02657312925170068, 0.007058487457482994, 0.021331164301658163], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 292.5, 281, 304, 292.5, 304.0, 304.0, 304.0, 0.026629030969563015, 0.019971773227172265, 0.026108932708438743], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 957.0, 889, 1025, 957.0, 1025.0, 1025.0, 1025.0, 0.026279827604330917, 0.04502730227714706, 0.01711781739461789], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 1055.0, 991, 1119, 1055.0, 1119.0, 1119.0, 1119.0, 0.02632479532471635, 0.01717281570010793, 0.021697389896543552], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 272.0, 252, 292, 272.0, 292.0, 292.0, 292.0, 0.026893649064773355, 0.020170236798580016, 0.022350093119259885], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.75, 1, 22, 4.0, 22.0, 22.0, 22.0, 0.036349096724946385, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 1116.5, 1014, 1219, 1116.5, 1219.0, 1219.0, 1219.0, 0.02630678978244285, 0.006987741035961382, 0.023480865098781997], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 261.0, 244, 278, 261.0, 278.0, 278.0, 278.0, 0.0266545832555908, 0.007080123677266305, 0.021396550230562143], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 1019.0, 999, 1039, 1019.0, 1039.0, 1039.0, 1039.0, 0.026359838150593756, 0.017195675668551395, 0.019074843817958955], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 0.02607086059910838, 0.01955314544933128, 0.019604065098938916], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1090.0, 1055, 1125, 1090.0, 1125.0, 1125.0, 1125.0, 0.026252920637420914, 0.017125928697067548, 0.021638149431624266], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 251.5, 248, 255, 251.5, 255.0, 255.0, 255.0, 0.026844556595036442, 0.017511878716293304, 0.02202092533186583], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 246.5, 246, 247, 246.5, 247.0, 247.0, 247.0, 0.026834111522567487, 0.017505064938549884, 0.0197063006493855], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1047.5, 1046, 1049, 1047.5, 1049.0, 1049.0, 1049.0, 0.02622159873087462, 0.01638849920679664, 0.01836024051761436], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 249.5, 248, 251, 249.5, 251.0, 251.0, 251.0, 0.026835911817193768, 0.020126933862895328, 0.02065107276557489], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 272.0, 268, 276, 272.0, 276.0, 276.0, 276.0, 0.02667164537380311, 0.007084655802416451, 0.02141024657936148], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 283.5, 272, 295, 283.5, 295.0, 295.0, 295.0, 0.026483401528092268, 0.019474610693997536, 0.03054384492644235], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 865.5, 254, 1477, 865.5, 1477.0, 1477.0, 1477.0, 0.026094671468086215, 0.014346972691926307, 0.019621969756275767], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 0.026521329779475144, 0.016912527681637958, 0.019114005251223296], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 288.0, 276, 300, 288.0, 300.0, 300.0, 300.0, 0.026621941804435216, 0.017366657348987034, 0.01955048851263211], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 245.5, 245, 246, 245.5, 246.0, 246.0, 246.0, 0.02607052075865215, 0.01662504888222642, 0.018789105781137978], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 0.026071540306601314, 0.017007606371884452, 0.020775758681822923], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 246.0, 245, 247, 246.0, 247.0, 247.0, 247.0, 0.026838072489633796, 0.017507648850659547, 0.020521690194710215], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 250.0, 245, 255, 250.0, 255.0, 255.0, 255.0, 0.02664428546687449, 0.007077388327138536, 0.02138828384157308], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 1082.5, 1006, 1159, 1082.5, 1159.0, 1159.0, 1159.0, 0.026562188724350885, 0.017327677800650775, 0.02186711435022246], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 286.5, 274, 299, 286.5, 299.0, 299.0, 299.0, 0.026613793929393604, 0.007069289012495176, 0.02136380723629057], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 245.5, 244, 247, 245.5, 247.0, 247.0, 247.0, 0.026833751492627428, 0.00712771524022916, 0.021540374733339595], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 272.5, 269, 276, 272.5, 276.0, 276.0, 276.0, 0.02666880017068032, 0.01739722511134224, 0.01958490012534336], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 0.026071200448424647, 0.006925162619112798, 0.02092824879746588], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 1006.5, 1005, 1008, 1006.5, 1008.0, 1008.0, 1008.0, 0.02641484514297035, 0.017231559136234562, 0.019063057188139734], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 0.02651711016533418, 0.014579231467854633, 0.019939623854792303], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 275.0, 266, 284, 275.0, 284.0, 284.0, 284.0, 0.02655866144346325, 0.019918996082597434, 0.027233002456676182], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 274.0, 251, 297, 274.0, 297.0, 297.0, 297.0, 0.02675692669939931, 0.02006769502454948, 0.027488561413836005], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 247.0, 246, 248, 247.0, 248.0, 248.0, 248.0, 0.0268373522268293, 0.017507178991720676, 0.022041223850354924], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 246.5, 246, 247, 246.5, 247.0, 247.0, 247.0, 0.026087183366811886, 0.016635674549343907, 0.019539911760102262], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 1075.0, 1023, 1127, 1075.0, 1127.0, 1127.0, 1127.0, 0.02651324336506085, 0.017295748601426412, 0.019185852864755947], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 246.5, 246, 247, 246.5, 247.0, 247.0, 247.0, 0.026071200448424647, 0.017007384667527017, 0.021233770677720858], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 0.026520978093672095, 0.01691230341324988, 0.018906556648809206], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 246.0, 245, 247, 246.0, 247.0, 247.0, 247.0, 0.02652027475004641, 0.016911854894316704, 0.019113244888217043], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.5, 245, 256, 250.5, 256.0, 256.0, 256.0, 0.026640381490262943, 0.017378686362788717, 0.019564030156911848], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 1128.0, 1125, 1131, 1128.0, 1131.0, 1131.0, 1131.0, 0.026276720139792153, 0.017141454153692535, 0.018501479707802873], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 270.5, 247, 294, 270.5, 294.0, 294.0, 294.0, 0.026741542987030353, 0.007103222355929937, 0.02146635579622944], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 1007.0, 1005, 1009, 1007.0, 1009.0, 1009.0, 1009.0, 0.026566775590446588, 0.019925081692834943, 0.021274175765787308], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 264.0, 252, 276, 264.0, 276.0, 276.0, 276.0, 0.02684203462622467, 0.007129915447590927, 0.021547023889410814], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 1092.5, 1002, 1183, 1092.5, 1183.0, 1183.0, 1183.0, 0.02650621570758343, 0.01729116415299388, 0.021795150025180905], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 280.5, 280, 281, 280.5, 281.0, 281.0, 281.0, 0.02650867496388193, 0.018121164526091162, 0.022625568279719538], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 0.0260973954799311, 0.016642186766010755, 0.01860458857456026], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 249.5, 248, 251, 249.5, 251.0, 251.0, 251.0, 0.026066783098297838, 0.0069239892604853635, 0.020135571709720305], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 246.0, 245, 247, 246.0, 247.0, 247.0, 247.0, 0.026836271905106943, 0.017506474250597107, 0.019681679883530583], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 247.0, 245, 249, 247.0, 249.0, 249.0, 249.0, 0.026834831611431638, 0.017505534684019858, 0.022196389037971286], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 251.0, 247, 255, 251.0, 255.0, 255.0, 255.0, 0.026850322875132573, 0.017515640313074766, 0.019429774658665272], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 267.0, 247, 287, 267.0, 287.0, 287.0, 287.0, 0.02683699210992432, 0.007128576029198647, 0.02154297608824003], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 360.5, 2, 1433, 3.5, 1433.0, 1433.0, 1433.0, 0.035883128649986995, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.5, 261, 276, 268.5, 276.0, 276.0, 276.0, 0.02656712849191695, 0.01733090022714895, 0.01951023498625151], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 261.0, 246, 276, 261.0, 276.0, 276.0, 276.0, 0.026778421947594628, 0.007113018329829824, 0.021495959805588657], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 265.5, 254, 277, 265.5, 277.0, 277.0, 277.0, 0.02683339147234819, 0.017504595218289638, 0.0197057718625057], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 246.0, 245, 247, 246.0, 247.0, 247.0, 247.0, 0.026066783098297838, 0.015477152464614343, 0.01797182506581863], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 0.02657560094077627, 0.007059143999893697, 0.02052861361733792], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 254.5, 254, 255, 254.5, 255.0, 255.0, 255.0, 0.02608480169029515, 0.014341546241832197, 0.01961454814602272], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 249.5, 249, 250, 249.5, 250.0, 250.0, 250.0, 0.026069841104318467, 0.019552380828238854, 0.023294828721143947], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 673.5, 293, 1054, 673.5, 1054.0, 1054.0, 1054.0, 0.026664178010052397, 0.019998133507539297, 0.022576017904995534], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 0.02652027475004641, 0.016911854894316704, 0.018906055241732302], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1089.0, 1003, 1175, 1089.0, 1175.0, 1175.0, 1175.0, 0.026414147417356735, 0.01723110397929131, 0.019346299377946827], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 1163.0, 1117, 1209, 1163.0, 1209.0, 1209.0, 1209.0, 0.02634421349350615, 0.017185483021154403, 0.019063537303406305], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 44.0, 2, 168, 3.0, 168.0, 168.0, 168.0, 0.03635570420999055, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 1110.5, 1093, 1128, 1110.5, 1128.0, 1128.0, 1128.0, 0.026550904722078404, 0.007052584066802077, 0.02232454000557569], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 918.5, 912, 925, 918.5, 925.0, 925.0, 925.0, 0.026267402153926974, 0.04592947612949829, 0.021444871289729446], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 245.5, 245, 246, 245.5, 246.0, 246.0, 246.0, 0.02608820421846262, 0.01663632554165634, 0.018801850305884195], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 251.5, 247, 256, 251.5, 256.0, 256.0, 256.0, 0.026841674383648054, 0.01750999852370791, 0.019711854625491538], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 268.0, 247, 289, 268.0, 289.0, 289.0, 289.0, 0.02685140432844638, 0.01751634579238494, 0.01971900005370281], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 261.5, 260, 263, 261.5, 263.0, 263.0, 263.0, 0.02651535238903325, 0.01789268408283396, 0.022372328578246805], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 266.5, 250, 283, 266.5, 283.0, 283.0, 283.0, 0.026629385526928968, 0.019972039145196723, 0.024861027894281337], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 273.0, 253, 293, 273.0, 293.0, 293.0, 293.0, 0.026885695465727458, 0.020164271599295597, 0.023078638978881287], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 269.0, 260, 278, 269.0, 278.0, 278.0, 278.0, 0.026554429942775203, 0.01732261640798226, 0.021964455235869727], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 501.5, 488, 515, 501.5, 515.0, 515.0, 515.0, 0.026006111436187505, 0.01749825271438788, 0.02402517716663416], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 261.5, 247, 276, 261.5, 276.0, 276.0, 276.0, 0.026619461488294093, 0.01736503933025435, 0.01926271578400969], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 256.5, 254, 259, 256.5, 259.0, 259.0, 259.0, 0.026517461748561427, 0.014579424769961019, 0.01993988822889873], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 2, 100.0, 353.0, 349, 357, 353.0, 357.0, 357.0, 357.0, 0.026031498112716385, 0.017515334179357023, 0.025065485487439802], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 255.5, 252, 259, 255.5, 259.0, 259.0, 259.0, 0.02684275514038761, 0.020132066355290707, 0.0260039190422505], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 444.0, 251, 637, 444.0, 637.0, 637.0, 637.0, 0.026628321883154924, 0.01997124141236619, 0.025848195265484368], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 256.5, 254, 259, 256.5, 259.0, 259.0, 259.0, 0.026635414447048793, 0.019976560835286598, 0.02304587617195824], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 275.5, 273, 278, 275.5, 278.0, 278.0, 278.0, 0.02666524452029225, 0.019998933390219187, 0.0235404111780705], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 256.0, 252, 260, 256.0, 260.0, 260.0, 260.0, 0.026845637583892617, 0.020134228187919462, 0.025770763422818792], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 269.0, 247, 289, 269.5, 289.0, 289.0, 289.0, 0.07957032027053909, 0.05190720111398448, 0.05991085637557191], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 250.5, 249, 252, 250.5, 252.0, 252.0, 252.0, 0.026835911817193768, 0.020126933862895328, 0.034383512015779515], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 269.5, 256, 283, 269.5, 283.0, 283.0, 283.0, 0.02682295508496171, 0.020117216313721282, 0.02378441720424339], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 0.026071200448424647, 0.017007384667527017, 0.019146037829311853], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 250.0, 246, 254, 250.0, 254.0, 254.0, 254.0, 0.0268395131312318, 0.007129245675483447, 0.021544999798703654], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 247.5, 247, 248, 247.5, 248.0, 248.0, 248.0, 0.026682320294572816, 0.007087491328245904, 0.02108007531084903], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 261.5, 246, 277, 261.5, 277.0, 277.0, 277.0, 0.026767311758880058, 0.01746148853020691, 0.01965724457292754], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 1016.0, 1000, 1032, 1016.0, 1032.0, 1032.0, 1032.0, 0.02658443215652914, 0.017342188164610806, 0.020535435386537643], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 1067.0, 1004, 1130, 1067.0, 1130.0, 1130.0, 1130.0, 0.02631025047358451, 0.017163327457377392, 0.02168540175752473], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 271.0, 250, 292, 271.0, 292.0, 292.0, 292.0, 0.05319148936170213, 0.03989361702127659, 0.041971409574468085], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 248.83333333333334, 248, 250, 249.0, 250.0, 250.0, 250.0, 0.07770309646839427, 0.0582773223512957, 0.062223182718831344], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1179.5, 1098, 1261, 1179.5, 1261.0, 1261.0, 1261.0, 0.026226756537019065, 0.044808311095229356, 0.018824869194051772], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1656.0, 1152, 2425, 1523.5, 2425.0, 2425.0, 2425.0, 0.03511760006321168, 0.016118429716513172, 0.043725527422455945], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 1105.5, 1092, 1119, 1105.5, 1119.0, 1119.0, 1119.0, 0.026368874180916844, 0.017201570266457474, 0.019081382585995493], "isController": false}]}, function(index, item){
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
