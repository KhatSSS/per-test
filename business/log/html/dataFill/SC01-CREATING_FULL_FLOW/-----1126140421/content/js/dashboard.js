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

    var data = {"OkPercent": 97.29729729729729, "KoPercent": 2.7027027027027026};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8445945945945946, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ST02-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-010-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-OPTIONS-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-FIRST"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [0.875, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-020-OPTIONS-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.25, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 74, 2, 2.7027027027027026, 441.78378378378375, 1, 2959, 267.0, 1000.5, 1577.75, 2959.0, 0.7177288730686789, 0.5120789404769988, 0.6352491561836222], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST02-020-OPTIONS-commercial/lead", 2, 0, 0.0, 261.0, 256, 266, 261.0, 266.0, 266.0, 266.0, 0.03289419581914771, 0.020976474482327593, 0.0234499638163846], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 2, 0, 0.0, 285.5, 272, 299, 285.5, 299.0, 299.0, 299.0, 0.03280463201404038, 0.02412293740876212, 0.03777017689897814], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 4, 0, 0.0, 34.5, 1, 131, 3.0, 131.0, 131.0, 131.0, 0.04644627907246781, 0.0, 0.0], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 2, 0, 0.0, 903.5, 896, 911, 903.5, 911.0, 911.0, 911.0, 0.032387090505724414, 0.05667740838501773, 0.026441023108189077], "isController": false}, {"data": ["ST05-010-OPTIONS-commercial/lead", 2, 0, 0.0, 257.0, 248, 266, 257.0, 266.0, 266.0, 266.0, 0.03305621208865676, 0.02107979149794225, 0.023565463696015074], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 2, 0, 0.0, 264.0, 255, 273, 264.0, 273.0, 273.0, 273.0, 0.032960332240148986, 0.018121745167191283, 0.024784624829018276], "isController": false}, {"data": ["ST01-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 258.5, 249, 268, 258.5, 268.0, 268.0, 268.0, 0.03287581162159941, 0.020964750965726964, 0.02369370017259801], "isController": false}, {"data": ["ST02-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 248, 267, 257.5, 267.0, 267.0, 267.0, 0.03291422552827332, 0.02098924733394773, 0.023721385195181355], "isController": false}, {"data": ["ST03-020-OPTIONS-commercial/lead", 2, 0, 0.0, 258.0, 249, 267, 258.0, 267.0, 267.0, 267.0, 0.03293644912142022, 0.021003419215124417, 0.023480085799449962], "isController": false}, {"data": ["ST03-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.0, 248, 266, 257.0, 266.0, 266.0, 266.0, 0.03295381522795802, 0.021014493499859944, 0.02374991761546193], "isController": false}, {"data": ["ST04-010-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 249, 266, 257.5, 266.0, 266.0, 266.0, 0.033036554948050016, 0.021067256231520178, 0.02380954839029386], "isController": false}, {"data": ["ST05-030-OPTIONS-maintenance/configuration", 2, 0, 0.0, 257.5, 249, 266, 257.5, 266.0, 266.0, 266.0, 0.03312300226892566, 0.021122383282820754, 0.02387185124459681], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 2, 0, 0.0, 278.5, 269, 288, 278.5, 288.0, 288.0, 288.0, 0.0328931138266204, 0.022196427396674507, 0.027753564791210963], "isController": false}, {"data": ["ST05-040-OPTIONS-applicants/email", 2, 0, 0.0, 257.5, 249, 266, 257.5, 266.0, 266.0, 266.0, 0.03317574852782616, 0.021641992203699098, 0.027376472173840923], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 2, 0, 0.0, 934.0, 919, 949, 934.0, 949.0, 949.0, 949.0, 0.032703250703119885, 0.02577297198966577, 0.03720633502845183], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 2, 0, 0.0, 302.5, 297, 308, 302.5, 308.0, 308.0, 308.0, 0.032920726889649726, 0.02250440314722149, 0.028098354786673687], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 2, 0, 0.0, 881.0, 872, 890, 881.0, 890.0, 890.0, 890.0, 0.032407032326014745, 0.055572996840314345, 0.021108877501417808], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 2, 0, 0.0, 536.0, 487, 585, 536.0, 585.0, 585.0, 585.0, 0.03285420944558522, 0.02210600616016427, 0.03035164271047228], "isController": false}, {"data": ["ST04-020-OPTIONS-commercial/lead", 2, 0, 0.0, 258.0, 249, 267, 258.0, 267.0, 267.0, 267.0, 0.0329733740004946, 0.02102696603742478, 0.023506409199571345], "isController": false}, {"data": ["TEST-01-BUSINESS-FIRST", 4, 0, 0.0, 7.0, 2, 21, 2.5, 21.0, 21.0, 21.0, 0.046436573445245474, 0.0, 0.0], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 2, 0, 0.0, 265.5, 254, 277, 265.5, 277.0, 277.0, 277.0, 0.032921268785698996, 0.018100267896824743, 0.02475525094237132], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 2, 0, 0.0, 481.5, 470, 493, 481.5, 493.0, 493.0, 493.0, 0.0329701125929345, 0.15271215237137534, 0.030458717297769573], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, 100.0, 263.5, 254, 273, 263.5, 273.0, 273.0, 273.0, 0.03316089667064597, 0.021891373192731132, 0.08733880695384004], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 4, 0, 0.0, 348.75, 1, 1388, 3.0, 1388.0, 1388.0, 1388.0, 0.04570070607590888, 0.0, 0.0], "isController": false}, {"data": ["ST05-020-OPTIONS-auth/oauth/token", 2, 0, 0.0, 257.5, 248, 267, 257.5, 267.0, 267.0, 267.0, 0.033080816434549604, 0.01964173475801383, 0.021612369330775084], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 2, 0, 0.0, 263.5, 255, 272, 263.5, 272.0, 272.0, 272.0, 0.03304310473012045, 0.018167253870173643, 0.024846865861516347], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 2, 0, 0.0, 1132.0, 1052, 1212, 1132.0, 1212.0, 1212.0, 1212.0, 0.03230600245525619, 0.020191251534535118, 0.022620511484783872], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 6, 0, 0.0, 264.83333333333337, 255, 279, 264.0, 279.0, 279.0, 279.0, 0.09854967724980701, 0.054183074503556, 0.2615801003564213], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 2, 0, 0.0, 264.5, 254, 275, 264.5, 275.0, 275.0, 275.0, 0.03288337909603591, 0.018079435967840056, 0.02472675967182388], "isController": false}, {"data": ["AF-010-GET-Welcome", 2, 0, 0.0, 1616.5, 1065, 2168, 1616.5, 2168.0, 2168.0, 2168.0, 0.03227628499959655, 0.05519118655692729, 0.0231670600338901], "isController": false}, {"data": ["HTTP Request", 4, 0, 0.0, 1631.0, 597, 2959, 1484.0, 2959.0, 2959.0, 2959.0, 0.044205244952313594, 0.02028951672615956, 0.055040710267773275], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 2, 100.0, 2.7027027027027026], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 74, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 2, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
