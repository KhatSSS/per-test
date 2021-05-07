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

    var data = {"OkPercent": 62.5, "KoPercent": 37.5};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5825892857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [0.75, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP Request"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 84, 37.5, 312.9285714285714, 1, 2579, 249.0, 278.0, 981.0, 1700.75, 1.5426253555269376, 1.086817278523074, 1.1731501193124299], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 249.5, 249, 250, 249.5, 250.0, 250.0, 250.0, 0.026453626792233214, 0.019840220094174913, 0.022888587244061162], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 260.5, 247, 274, 260.5, 274.0, 274.0, 274.0, 0.02645292701637436, 0.019839695262280774, 0.02231965717006587], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.02646622909167902, 0.017265079134024985, 0.018634913256934154], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.02673082063619353, 0.017046119018978883, 0.01926498596631917], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 244, 273, 258.5, 273.0, 273.0, 273.0, 0.026360533009977462, 0.017196128955727485, 0.0193585164292022], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 263.5, 250, 277, 263.5, 277.0, 277.0, 277.0, 0.026591501356166572, 0.016347021585651225, 0.030278994708291228], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 260.5, 248, 273, 260.5, 273.0, 273.0, 273.0, 0.026406823523198394, 0.019805117642398794, 0.02034666382793314], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 261.5, 246, 277, 261.5, 277.0, 277.0, 277.0, 0.02627602969191355, 0.019707022268935167, 0.025557544505025294], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 882.0, 870, 894, 882.0, 894.0, 894.0, 894.0, 0.02652906922760615, 0.04549320855827774, 0.017280165209778615], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 257.0, 244, 270, 257.0, 270.0, 270.0, 270.0, 0.026380003957000596, 0.017208830706324608, 0.021304944601991692], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 247.5, 247, 248, 247.5, 248.0, 248.0, 248.0, 0.026033531188170363, 0.01952514839112777, 0.021635288126106426], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 11.0, 2, 36, 3.0, 36.0, 36.0, 36.0, 0.03667941276260167, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 261.0, 247, 275, 261.0, 275.0, 275.0, 275.0, 0.026214724810926297, 0.01966104360819472, 0.02211867405921906], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 260.5, 247, 274, 260.5, 274.0, 274.0, 274.0, 0.026350461133069828, 0.01976284584980237, 0.020303236166007904], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.026252231439672372, 0.017125479103223776, 0.018996976071091045], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 261.0, 246, 276, 261.0, 276.0, 276.0, 276.0, 0.026523440090179696, 0.019892580067634773, 0.020384714209933028], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 257.0, 244, 270, 257.0, 270.0, 270.0, 270.0, 0.02644488225416176, 0.017251153657988336, 0.021357341429874784], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.026089565478286957, 0.01701936497997626, 0.020968469129521647], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 0.026455376393867643, 0.017257999444437094, 0.01942816703924655], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1071.0, 1006, 1136, 1071.0, 1136.0, 1136.0, 1136.0, 0.0264515275757175, 0.016532204734823436, 0.01852123561698188], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 249.5, 249, 250, 249.5, 250.0, 250.0, 250.0, 0.02645222727753677, 0.019839170458152575, 0.020355815522166965], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 262.0, 250, 274, 262.0, 274.0, 274.0, 274.0, 0.02631301968213872, 0.019734764761604042, 0.020274387235554154], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 272.0, 265, 279, 272.0, 279.0, 279.0, 279.0, 0.026708688336315806, 0.020057598955690283, 0.030803672778504845], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 253, 278, 265.5, 278.0, 278.0, 278.0, 0.02664783552955911, 0.014651104885880645, 0.019569504217019973], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.0, 244, 270, 257.0, 270.0, 270.0, 270.0, 0.026695854133853014, 0.017023821044341813, 0.019239785498812032], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 246, 271, 258.5, 271.0, 271.0, 271.0, 0.02626947224630257, 0.017136726035673944, 0.01929164368087845], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 256.5, 243, 270, 256.5, 270.0, 270.0, 270.0, 0.026561835954101148, 0.016938358279324266, 0.01914319817785805], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.02651429783510758, 0.017296436478370963, 0.021128581087351356], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 850.5, 244, 1457, 850.5, 1457.0, 1457.0, 1457.0, 0.0260345478449903, 0.016983474570755393, 0.019907276330690827], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 259.5, 246, 273, 259.5, 273.0, 273.0, 273.0, 0.026224349308332787, 0.01966826198124959, 0.020206066019799383], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 243.5, 243, 244, 243.5, 244.0, 244.0, 244.0, 0.026456426265939997, 0.017258684321921795, 0.021340828218424254], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 260.5, 247, 274, 260.5, 274.0, 274.0, 274.0, 0.026260159399167555, 0.019695119549375664, 0.020233657974553905], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 247.0, 246, 248, 247.0, 248.0, 248.0, 248.0, 0.026454676525442783, 0.01984100739408209, 0.02038353494001402], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 256.5, 243, 270, 256.5, 270.0, 270.0, 270.0, 0.02632375587348803, 0.017172137620595707, 0.019331508219592772], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 261.5, 247, 276, 261.5, 276.0, 276.0, 276.0, 0.026474637297469024, 0.01985597797310177, 0.02039891487080377], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 257.0, 244, 270, 257.0, 270.0, 270.0, 270.0, 0.026306097753459254, 0.017160618456358183, 0.018984576406060924], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 265.0, 252, 278, 265.0, 278.0, 278.0, 278.0, 0.026719035977181945, 0.014690251225735777, 0.019621792045742992], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 259.5, 246, 273, 259.5, 273.0, 273.0, 273.0, 0.02642566460546483, 0.01981924845409862, 0.026657921423286296], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 261.0, 248, 274, 261.0, 274.0, 274.0, 274.0, 0.026043023074118443, 0.01953226730558883, 0.02632278211104745], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 244.0, 243, 245, 244.0, 245.0, 245.0, 245.0, 0.02645292701637436, 0.017256401608337964, 0.021286339708488745], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.026603173758629407, 0.016964719203500976, 0.01992640065709839], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 257.5, 243, 272, 257.5, 272.0, 272.0, 272.0, 0.026162258326138714, 0.01706678570494205, 0.0189318685738953], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.026505161880276185, 0.01729047669533642, 0.021147184820493794], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 258.0, 244, 272, 258.0, 272.0, 272.0, 272.0, 0.02667733760170735, 0.01701201313858877, 0.019018023876217153], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.026659557451346308, 0.017000674820047988, 0.01921362636630232], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.0, 243, 271, 257.0, 271.0, 271.0, 271.0, 0.026234324990817987, 0.01711379794322892, 0.019265832415131957], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 257.5, 245, 270, 257.5, 270.0, 270.0, 270.0, 0.026399155227032733, 0.017221323917634635, 0.018587686444033788], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 256.5, 243, 270, 256.5, 270.0, 270.0, 270.0, 0.026035564581217946, 0.0069156968418860165, 0.020899642661876123], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 247.0, 246, 248, 247.0, 248.0, 248.0, 248.0, 0.026033531188170363, 0.01952514839112777, 0.02084716364677705], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 260.5, 247, 274, 260.5, 274.0, 274.0, 274.0, 0.02613388388715389, 0.019600412915365416, 0.020136361706019942], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.02605354002475086, 0.016995864000521072, 0.02099040089884713], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 264.5, 251, 278, 264.5, 278.0, 278.0, 278.0, 0.02666595557451801, 0.016379771539425617, 0.02182233473774033], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 257.0, 244, 270, 257.0, 270.0, 270.0, 270.0, 0.026641800985746637, 0.016989351605168512, 0.018992690155854537], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 273.5, 269, 278, 273.5, 278.0, 278.0, 278.0, 0.026454326605116266, 0.0198407449538372, 0.01958240192058411], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 0.026454676525442783, 0.017257542889644317, 0.019401818428327666], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 245.5, 244, 247, 245.5, 247.0, 247.0, 247.0, 0.026454326605116266, 0.017257314621306315, 0.021442471760006347], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 256.5, 243, 270, 256.5, 270.0, 270.0, 270.0, 0.026107956399712813, 0.017031362182625156, 0.018892573918151554], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 251.0, 248, 254, 251.0, 254.0, 254.0, 254.0, 0.026032514610748823, 0.019524385958061618, 0.02005825588660237], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 447.00000000000006, 1, 1782, 2.5, 1782.0, 1782.0, 1782.0, 0.036091311016872685, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.026416938540992484, 0.017232924751350565, 0.019399939241041355], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 260.5, 247, 274, 260.5, 274.0, 274.0, 274.0, 0.026170474470702153, 0.019627855853026618, 0.02016455503650781], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.0, 243, 271, 257.0, 271.0, 271.0, 271.0, 0.026144132603040562, 0.017054961502764743, 0.019199597380357914], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.02658443215652914, 0.015784506592939174, 0.018328719826669504], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 262.0, 248, 276, 262.0, 276.0, 276.0, 276.0, 0.02638800928857927, 0.019791006966434453, 0.01953331156322567], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 265.0, 251, 279, 265.0, 279.0, 279.0, 279.0, 0.026610252930454107, 0.014630441796724276, 0.01954190449580223], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 260.5, 247, 274, 260.5, 274.0, 274.0, 274.0, 0.026494628214129585, 0.01987097116059719, 0.02323454700809411], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 0.026033192320208263, 0.019524894240156198, 0.021838390823299705], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 257.5, 245, 270, 257.5, 270.0, 270.0, 270.0, 0.02671261235992574, 0.017034507686554207, 0.019043170920650186], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 1004.0, 1003, 1005, 1004.0, 1005.0, 1005.0, 1005.0, 0.025779840164990974, 0.016817317607630833, 0.018881718870843], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 257.0, 244, 270, 257.0, 270.0, 270.0, 270.0, 0.02628777224274129, 0.017148663923975762, 0.01902269456237431], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 65.25, 2, 252, 3.5, 252.0, 252.0, 252.0, 0.036691525174972706, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 260.5, 247, 274, 260.5, 274.0, 274.0, 274.0, 0.026124325665843752, 0.019593244249382812, 0.02097089423566754], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 907.0, 899, 915, 907.0, 915.0, 915.0, 915.0, 0.02652730986550654, 0.04642279226463644, 0.021657061569886196], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 259.0, 245, 273, 259.0, 273.0, 273.0, 273.0, 0.026622296173044926, 0.016976913477537436, 0.01918677204658902], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.0, 243, 271, 257.0, 271.0, 271.0, 271.0, 0.02607188017363872, 0.017007828082022135, 0.019146537002515937], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 244.0, 243, 245, 244.0, 245.0, 245.0, 245.0, 0.026035903510941587, 0.016984358930965802, 0.019120116640847732], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 266.0, 255, 277, 266.0, 277.0, 277.0, 277.0, 0.026701200218949842, 0.016375345446777833, 0.02159042361454147], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 261.5, 248, 275, 261.5, 275.0, 275.0, 275.0, 0.026369221844263376, 0.01977691638319753, 0.024180370421643855], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 249.5, 248, 251, 249.5, 251.0, 251.0, 251.0, 0.026453976694046533, 0.0198404825205349, 0.022268874912371204], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 257.0, 244, 270, 257.0, 270.0, 270.0, 270.0, 0.026435794065164234, 0.01724522503469698, 0.021427450267662414], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 264.0, 251, 277, 264.0, 277.0, 277.0, 277.0, 0.026630094669986552, 0.01638374965048001, 0.023665416161804457], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 258.0, 246, 270, 258.0, 270.0, 270.0, 270.0, 0.026197555768046842, 0.017089811770561805, 0.018957410961057332], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 253, 278, 265.5, 278.0, 278.0, 278.0, 0.02668410027884885, 0.014671043415031155, 0.019596136142279626], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 491.5, 471, 512, 491.5, 512.0, 512.0, 512.0, 0.02649041709161711, 0.12300970045960874, 0.025481504721916848], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 260.0, 246, 274, 260.0, 274.0, 274.0, 274.0, 0.02607969956186105, 0.019559774671395785, 0.02483174518829543], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 259.5, 247, 272, 259.5, 272.0, 272.0, 272.0, 0.026188636750513954, 0.019641477562885465, 0.025216792808600348], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 259.5, 246, 273, 259.5, 273.0, 273.0, 273.0, 0.026242586469322416, 0.019681939851991813, 0.022500967695376056], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 261.0, 247, 275, 261.0, 275.0, 275.0, 275.0, 0.02633172709798036, 0.01974879532348527, 0.023014546633488692], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 259.5, 246, 273, 259.5, 273.0, 273.0, 273.0, 0.026098076571756664, 0.019573557428817497, 0.02484924282955346], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 244.16666666666666, 244, 245, 244.0, 245.0, 245.0, 245.0, 0.07711388435487809, 0.05030476049712751, 0.0580613328492295], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 247.5, 247, 248, 247.5, 248.0, 248.0, 248.0, 0.026451877422000027, 0.01983890806650002, 0.033452325450673864], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 260.5, 247, 274, 260.5, 274.0, 274.0, 274.0, 0.026151995397248808, 0.019613996547936607, 0.022985152204613214], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 256.5, 243, 270, 256.5, 270.0, 270.0, 270.0, 0.026486207307544595, 0.017278111798281048, 0.019450808491478063], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 260.0, 246, 274, 260.0, 274.0, 274.0, 274.0, 0.026062027625749284, 0.019546520719311965, 0.02008099589523065], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 259.5, 246, 273, 259.5, 273.0, 273.0, 273.0, 0.026296067423116874, 0.019722050567337654, 0.019927488594080753], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 256.5, 243, 270, 256.5, 270.0, 270.0, 270.0, 0.026180751911194892, 0.017078849879568543, 0.019226489684783746], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 257.0, 244, 270, 257.0, 270.0, 270.0, 270.0, 0.026116820538267672, 0.017037144648010552, 0.020021195432168088], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 258.0, 245, 271, 258.0, 271.0, 271.0, 271.0, 0.02620648086271735, 0.01709563400028827, 0.021164804368620362], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 247.25, 246, 249, 247.0, 249.0, 249.0, 249.0, 0.051570981008986244, 0.03867823575673968, 0.0406927272024032], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 260.1666666666667, 247, 274, 260.0, 274.0, 274.0, 274.0, 0.07907847220391702, 0.05930885415293777, 0.06371068317210112], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1078.0, 1029, 1127, 1078.0, 1127.0, 1127.0, 1127.0, 0.026413449728601806, 0.045165967260529065, 0.01895887260793196], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1395.75, 617, 2579, 1193.5, 2579.0, 2579.0, 2579.0, 0.035269636370049026, 0.01618821200578422, 0.04391483044122315], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 257.5, 244, 271, 257.5, 271.0, 271.0, 271.0, 0.02634247856380807, 0.01718435125060917, 0.019062281851349394], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2, 2.380952380952381, 0.8928571428571429], "isController": false}, {"data": ["401/Unauthorized", 82, 97.61904761904762, 36.607142857142854], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 84, "401/Unauthorized", 82, "400/Bad Request", 2, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, "400/Bad Request", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, "401/Unauthorized", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, "401/Unauthorized", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
