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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5848214285714286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ST15-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-OPTIONS-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-OPTIONS-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [0.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-040-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-020-OPTIONS-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-124"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-090-OPTIONS-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-030-OPTIONS-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-010-OPTIONS-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-OPTIONS-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST07-030-OPTIONS-core/products"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-040-OPTIONS-factor-trust"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-020-OPTIONS-124"], "isController": false}, {"data": [1.0, 500, 1500, "ST15-010-OPTIONS-pre-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-OPTIONS-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-060-OPTIONS-middesk"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.75, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [0.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-OPTIONS-verifyPersonalInfo"], "isController": false}, {"data": [0.75, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-OPTIONS-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [0.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-OPTIONS-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [0.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-OPTIONS-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-OPTIONS-getPersonalInfo"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP Request"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-OPTIONS-businesses"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 84, 37.5, 310.2098214285714, 1, 2374, 253.0, 376.0, 915.5, 1790.5, 1.5420731245568262, 1.0980252299341178, 1.1812279058440442], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.026200301303464988, 0.019650225977598745, 0.023104367262723524], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, 100.0, 252.5, 248, 257, 252.5, 257.0, 257.0, 257.0, 0.026179038443917956, 0.019634278832938466, 0.02252317662997238], "isController": false}, {"data": ["ST06-030-OPTIONS-suffixes", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.02618692225102784, 0.017082875062193942, 0.018438252874014717], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.0, 246, 254, 250.0, 254.0, 254.0, 254.0, 0.026477441220080493, 0.01688454015303961, 0.01908237462931582], "isController": false}, {"data": ["ST07-050-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.0259144563794913, 0.016905133653808777, 0.01903092890368892], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 787.0, 786, 788, 787.0, 788.0, 788.0, 788.0, 0.02627499408812633, 0.020706953348748, 0.030842327044851417], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.026164654168683524, 0.019623490626512644, 0.02016007044833135], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, 100.0, 252.5, 248, 257, 252.5, 257.0, 257.0, 257.0, 0.02588494143532, 0.01941370607649, 0.02537937617291141], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 880.0, 878, 882, 880.0, 882.0, 882.0, 882.0, 0.02645222727753677, 0.04536143662046344, 0.017230112884879904], "isController": false}, {"data": ["ST07-040-OPTIONS-selected-offer", 2, 0, 0.0, 250.0, 245, 255, 250.0, 255.0, 255.0, 255.0, 0.02592117371074562, 0.016909515662869214, 0.02136471739440362], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, 100.0, 251.5, 247, 256, 251.5, 256.0, 256.0, 256.0, 0.026238110856018366, 0.019678583142013775, 0.021805305018038703], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 9.5, 1, 33, 2.0, 33.0, 33.0, 33.0, 0.03678025635838682, 0.0, 0.0], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, 100.0, 587.5, 257, 918, 587.5, 918.0, 918.0, 918.0, 0.026089225150013044, 0.019566918862509785, 0.02244590562222802], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, 100.0, 252.5, 248, 257, 252.5, 257.0, 257.0, 257.0, 0.025910427651608392, 0.019432820738706294, 0.019964186930780295], "isController": false}, {"data": ["ST10-010-OPTIONS-businesses", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.02587723838111997, 0.01688085472518373, 0.01872561878946279], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.0264385897656219, 0.019828942324216423, 0.02031950209525824], "isController": false}, {"data": ["ST06-040-OPTIONS-getPersonalInfo", 2, 0, 0.0, 249.5, 245, 254, 249.5, 254.0, 254.0, 254.0, 0.026176982579218095, 0.017076390979411802, 0.02157555986021491], "isController": false}, {"data": ["ST14-020-OPTIONS-senti-link", 2, 0, 0.0, 249.5, 245, 254, 249.5, 254.0, 254.0, 254.0, 0.02627602969191355, 0.01714100374433423, 0.021554555606647836], "isController": false}, {"data": ["ST15-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 244, 253, 248.5, 253.0, 253.0, 253.0, 0.026198242097955227, 0.017090259493587983, 0.01923933404068587], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1077.5, 1073, 1082, 1077.5, 1082.0, 1082.0, 1082.0, 0.02615986292231829, 0.01634991432644893, 0.018317013393849814], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, 100.0, 251.5, 247, 256, 251.5, 256.0, 256.0, 256.0, 0.026209915210924292, 0.01965743640819322, 0.020169348814656585], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.025898348980252506, 0.019423761735189383, 0.019954880220135966], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 270.5, 270, 271, 270.5, 271.0, 271.0, 271.0, 0.026440337378704954, 0.019442943404457843, 0.03054581945215621], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 264.5, 253, 276, 264.5, 276.0, 276.0, 276.0, 0.02644488225416176, 0.014539520223723703, 0.01988531185127398], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 245, 254, 249.5, 254.0, 254.0, 254.0, 0.026467279825315954, 0.016878060279229803, 0.019075051280354662], "isController": false}, {"data": ["ST09-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.025882931500821785, 0.01688456859623921, 0.019007777820916], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026451877422000027, 0.016868238238834002, 0.019063950720152364], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 250.5, 245, 256, 250.5, 256.0, 256.0, 256.0, 0.026435794065164234, 0.01724522503469698, 0.021066023395677747], "isController": false}, {"data": ["ST14-090-OPTIONS-id", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026220223658507808, 0.017104599027229703, 0.02004925305137853], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.026092628832354862, 0.019569471624266144, 0.02010457436399217], "isController": false}, {"data": ["ST15-030-OPTIONS-sign-contract", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026191380416704862, 0.017085783318709812, 0.02156184930789277], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, 100.0, 253.5, 251, 256, 253.5, 256.0, 256.0, 256.0, 0.02587824286730931, 0.019408682150481985, 0.019939388303034225], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, 100.0, 252.5, 248, 257, 252.5, 257.0, 257.0, 257.0, 0.02619378159624905, 0.019645336197186787, 0.020182513358828615], "isController": false}, {"data": ["ST08-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 244, 253, 248.5, 253.0, 253.0, 253.0, 0.025902373952572753, 0.016897251758123632, 0.019022055871420616], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.02618932261317061, 0.019641991959877956, 0.02017907767753087], "isController": false}, {"data": ["ST09-010-OPTIONS-industries", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.025896336963136563, 0.01689331356579612, 0.018688860366951096], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 258.0, 254, 262, 258.0, 262.0, 262.0, 262.0, 0.026472184352291827, 0.014554531045254199, 0.019905841749281943], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, 100.0, 253.0, 249, 257, 253.0, 257.0, 257.0, 257.0, 0.026169789594891656, 0.01962734219616874, 0.02683425690882445], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, 100.0, 252.5, 248, 257, 252.5, 257.0, 257.0, 257.0, 0.026259469821304306, 0.019694602365978232, 0.026977502199230598], "isController": false}, {"data": ["ST15-010-OPTIONS-add-payment", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026217130272920327, 0.01710258107647537, 0.021531842343287103], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 249.5, 244, 255, 249.5, 255.0, 255.0, 255.0, 0.02646307739126983, 0.0168753804067375, 0.019821465194437463], "isController": false}, {"data": ["ST13-010-OPTIONS-businesses", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026301946344029457, 0.017157910310362966, 0.01903295140715413], "isController": false}, {"data": ["ST06-010-OPTIONS-ssn", 2, 0, 0.0, 249.5, 245, 254, 249.5, 254.0, 254.0, 254.0, 0.026432649608796786, 0.01724317376823853, 0.02152815407591457], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026461326770924293, 0.016874264044349184, 0.018864031780053452], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.5, 245, 254, 249.5, 254.0, 254.0, 254.0, 0.026455726341966718, 0.01687069267705495, 0.019066724648800232], "isController": false}, {"data": ["ST10-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.02609671442365406, 0.01702402854980558, 0.01916477465487095], "isController": false}, {"data": ["ST07-030-OPTIONS-core/products", 2, 0, 0.0, 588.0, 245, 931, 588.0, 931.0, 931.0, 931.0, 0.02593260116956031, 0.016916970294205358, 0.01825918500317674], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, 100.0, 252.5, 248, 257, 252.5, 257.0, 257.0, 257.0, 0.026256711871972274, 0.019692533903979202, 0.020231001627916134], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.026222286321144338, 0.019666714740858255, 0.020998315218103865], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, 100.0, 252.5, 247, 258, 252.5, 258.0, 258.0, 258.0, 0.026291227931800557, 0.019718420948850415, 0.020257596521670546], "isController": false}, {"data": ["ST14-040-OPTIONS-factor-trust", 2, 0, 0.0, 248.5, 244, 253, 248.5, 253.0, 253.0, 253.0, 0.026263952724885093, 0.01713312541037426, 0.021595945502298094], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 282.0, 279, 285, 282.0, 285.0, 285.0, 285.0, 0.026446980416011002, 0.01807899051875752, 0.02257291101913439], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 249.5, 245, 254, 249.5, 254.0, 254.0, 254.0, 0.02644453259288642, 0.016863554475737143, 0.01885205936797567], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, 100.0, 254.0, 249, 259, 254.0, 259.0, 259.0, 259.0, 0.026181780099228946, 0.01963633507442171, 0.01938065362814018], "isController": false}, {"data": ["ST15-020-OPTIONS-124", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026207511072673426, 0.01709630605131431, 0.019220547671462643], "isController": false}, {"data": ["ST15-010-OPTIONS-pre-sign-contract", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.02620442068576969, 0.01709429005673257, 0.02167494562582708], "isController": false}, {"data": ["ST14-010-OPTIONS-businesses", 2, 0, 0.0, 248.5, 244, 253, 248.5, 253.0, 253.0, 253.0, 0.026282590412111017, 0.017145283589150545, 0.019018944819701428], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.026226068712300026, 0.01966955153422502, 0.020207390833988984], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 505.50000000000006, 1, 2018, 1.5, 2018.0, 2018.0, 2018.0, 0.036111186342749325, 0.0, 0.0], "isController": false}, {"data": ["ST07-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 248.5, 244, 253, 248.5, 253.0, 253.0, 253.0, 0.026168762348384736, 0.017071028563204103, 0.019217684849595035], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, 100.0, 252.5, 249, 256, 252.5, 256.0, 256.0, 256.0, 0.026304021884946207, 0.019728016413709654, 0.020267454362522027], "isController": false}, {"data": ["ST13-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 250.5, 247, 254, 250.5, 254.0, 254.0, 254.0, 0.026294684529522355, 0.0171531731110556, 0.01931015895136798], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 248.5, 244, 253, 248.5, 253.0, 253.0, 253.0, 0.026460976674649063, 0.01571120490057288, 0.018243603058888905], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, 100.0, 260.5, 248, 273, 260.5, 273.0, 273.0, 273.0, 0.02592318958924706, 0.019442392191935297, 0.019189236043602807], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 256.5, 251, 262, 256.5, 262.0, 262.0, 262.0, 0.026464478054331574, 0.01455029408651238, 0.019900046974448547], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, 100.0, 587.5, 248, 927, 587.5, 927.0, 927.0, 927.0, 0.026196526340607235, 0.019647394755455426, 0.023408028907866817], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.026250164063525396, 0.01968762304764405, 0.022225480706129414], "isController": false}, {"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 250.0, 245, 255, 250.0, 255.0, 255.0, 255.0, 0.026471483594298045, 0.016880741003004514, 0.01887127248421638], "isController": false}, {"data": ["ST14-060-OPTIONS-middesk", 2, 0, 0.0, 248.0, 243, 253, 248.0, 253.0, 253.0, 253.0, 0.02625498844780508, 0.017127277620247846, 0.019229727867044737], "isController": false}, {"data": ["ST09-020-OPTIONS-businesses", 2, 0, 0.0, 248.5, 243, 254, 248.5, 254.0, 254.0, 254.0, 0.02588963249666671, 0.016888939948997424, 0.018734587578154327], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 60.49999999999999, 1, 234, 3.5, 234.0, 234.0, 234.0, 0.03679074344894824, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, 100.0, 252.0, 248, 256, 252.0, 256.0, 256.0, 256.0, 0.026288117770767613, 0.01971608832807571, 0.021256407728706624], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 586.5, 259, 914, 586.5, 914.0, 914.0, 914.0, 0.026441036488630353, 0.04627181385510312, 0.021586627445795877], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 245, 253, 249.0, 253.0, 253.0, 253.0, 0.026470432526867486, 0.01688007074223093, 0.019077323442215046], "isController": false}, {"data": ["ST14-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026270507414850718, 0.017137401321406523, 0.019292403882780997], "isController": false}, {"data": ["ST14-080-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.02623054021797579, 0.017111328970320142, 0.01926305297257597], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 265.0, 261, 269, 265.0, 269.0, 269.0, 269.0, 0.026463427543135385, 0.01785764495342437, 0.022328516989520486], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, 100.0, 254.0, 248, 260, 254.0, 260.0, 260.0, 260.0, 0.025916135385891256, 0.019437101539418442, 0.024195142020421917], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.02618692225102784, 0.01964019168827088, 0.02247881314321628], "isController": false}, {"data": ["ST07-010-OPTIONS-verifyPersonalInfo", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026174241928518145, 0.017074603133056757, 0.02164998331392077], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 531.0, 491, 571, 531.0, 571.0, 571.0, 571.0, 0.026359143327841845, 0.017735790774299834, 0.024351317957166392], "isController": false}, {"data": ["ST12-010-OPTIONS-businesses", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.026314404505026052, 0.017166037313825586, 0.019041966541234672], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 257.0, 253, 261, 257.0, 261.0, 261.0, 261.0, 0.026461676876463662, 0.014548753985790079, 0.019897940619997088], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 475.5, 467, 484, 475.5, 484.0, 484.0, 484.0, 0.02637722063226198, 0.12279317456444616, 0.025424137464885328], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, 100.0, 253.5, 249, 258, 253.5, 258.0, 258.0, 258.0, 0.02627188776649546, 0.019703915824871597, 0.02545089127379248], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.02631025047358451, 0.01973268785518838, 0.025539442354241212], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, 100.0, 586.5, 257, 916, 586.5, 916.0, 916.0, 916.0, 0.0258732212160414, 0.01940491591203105, 0.022386400388098318], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.025904386907922856, 0.019428290180942144, 0.02286871656715065], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.026278101144411304, 0.01970857585830848, 0.0252259506103089], "isController": false}, {"data": ["ST14-070-OPTIONS-middesk/objectId", 6, 0, 0.0, 249.5, 244, 254, 250.5, 254.0, 254.0, 254.0, 0.0777000777000777, 0.050687160062160064, 0.058502695221445224], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.026212663337658423, 0.019659497503243816, 0.03358497490137485], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, 100.0, 251.5, 246, 257, 251.5, 257.0, 257.0, 257.0, 0.026297450462177692, 0.01972308784663327, 0.023318442402009126], "isController": false}, {"data": ["ST06-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 244, 254, 249.0, 254.0, 254.0, 254.0, 0.02619378159624905, 0.01708734971317809, 0.019236058359745397], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, 100.0, 252.0, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.02626602227358689, 0.019699516705190163, 0.02023817536509771], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, 100.0, 252.5, 247, 258, 252.5, 258.0, 258.0, 258.0, 0.02589164347206939, 0.019418732604052042, 0.01962101106867758], "isController": false}, {"data": ["ST12-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 249.0, 245, 253, 249.0, 253.0, 253.0, 253.0, 0.026307827894189915, 0.017161747102850455, 0.01931981110979572], "isController": false}, {"data": ["ST13-030-OPTIONS-businesses/applications", 2, 0, 0.0, 248.0, 243, 253, 248.0, 253.0, 253.0, 253.0, 0.026286044738848147, 0.01714753699760797, 0.02030494276213758], "isController": false}, {"data": ["ST11-030-OPTIONS-getPersonalInfo", 2, 0, 0.0, 248.5, 244, 253, 248.5, 253.0, 253.0, 253.0, 0.02631786720004211, 0.01716829618127747, 0.02169167960628471], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, 100.0, 252.5, 246, 257, 253.5, 257.0, 257.0, 257.0, 0.0519588485919152, 0.0389691364439364, 0.04099877896705809], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, 100.0, 252.16666666666669, 247, 257, 252.0, 257.0, 257.0, 257.0, 0.07880531147799362, 0.05910398360849521, 0.06441410713582095], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1107.0, 1106, 1108, 1107.0, 1108.0, 1108.0, 1108.0, 0.02634872538040972, 0.04505529115341545, 0.01891241519004018], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1194.25, 587, 2374, 908.0, 2374.0, 2374.0, 2374.0, 0.03535161601074689, 0.016225839379932654, 0.04401690470088114], "isController": false}, {"data": ["ST08-010-OPTIONS-businesses", 2, 0, 0.0, 248.5, 244, 253, 248.5, 253.0, 253.0, 253.0, 0.025908749384667203, 0.016901410731403995, 0.018748421185584372], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 84, 100.0, 37.5], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 84, "401/Unauthorized", 84, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ST15-010-POST-pre-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST06-040-GET-getPersonalInfo", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-020-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-020-GET-124", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-090-GET-id", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-030-GET-core/products", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-060-POST-middesk", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST15-030-GET-sign-contract", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-020-POST-senti-link", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST12-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST08-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST14-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST15-010-POST-add-payment", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST13-010-PUT-businesses", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST09-010-GET-industries", 2, 2, "401/Unauthorized", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 4, 4, "401/Unauthorized", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 6, "401/Unauthorized", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
