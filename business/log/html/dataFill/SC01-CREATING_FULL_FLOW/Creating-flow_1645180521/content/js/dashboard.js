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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8443708609271523, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "ST06-040-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-030-GET-customers/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-050-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-010-POST-pre-sign-contract"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-090-GET-id"], "isController": false}, {"data": [0.875, 500, 1500, "ST05-010-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-020-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-CREATING-FLOW"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-020-GET-latestApplicationId"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-020-POST-commercial/lead"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-OPTIONS-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST14-070-PUT-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST11-030-GET-getPersonalInfo"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-030-GET-suffixes"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-050-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-040-GET-applicants/email"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-080-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-030-GET-core/products"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.75, 500, 1500, "AF-030-OPTIONS-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-010-PATCH-ssn"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-060-POST-middesk"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-GET-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "AF-030-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-030-GET-businesses/applications"], "isController": false}, {"data": [0.5, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST03-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-040-POST-selected-offer"], "isController": false}, {"data": [1.0, 500, 1500, "ST16-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "ST16-030-POST-sign-contract"], "isController": false}, {"data": [1.0, 500, 1500, "ST04-020-POST-commercial/lead"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST02-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.625, 500, 1500, "ST05-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-020-POST-senti-link"], "isController": false}, {"data": [1.0, 500, 1500, "ST12-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST08-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST09-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-010-PUT-businesses"], "isController": false}, {"data": [0.5, 500, 1500, "ST15-010-POST-add-payment"], "isController": false}, {"data": [1.0, 500, 1500, "ST13-010-PUT-businesses"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-030-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "ST09-010-GET-industries"], "isController": false}, {"data": [1.0, 500, 1500, "ST06-020-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST10-040-GET-businesses/applications"], "isController": false}, {"data": [1.0, 500, 1500, "ST14-070-GET-middesk/objectId"], "isController": false}, {"data": [1.0, 500, 1500, "ST05-030-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "ST01-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "ST07-010-PUT-verifyPersonalInfos"], "isController": false}, {"data": [0.5, 500, 1500, "ST14-040-POST-factor-trust"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 151, 1, 0.6622516556291391, 484.6622516556292, 0, 4867, 257.0, 938.0000000000003, 1296.600000000001, 4068.2799999999843, 1.6715373715905064, 5.15260605198924, 2.598447998998185], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ST06-040-GET-getPersonalInfo", 2, 1, 50.0, 252.5, 252, 253, 252.5, 253.0, 253.0, 253.0, 0.02603048169406375, 0.033707440162430206, 0.07068140073275807], "isController": false}, {"data": ["ST10-030-GET-customers/email", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 5.386003101145038, 10.175632156488549], "isController": false}, {"data": ["ST14-050-GET-maintenance/configuration", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.1393178501945527, 10.248206468871595], "isController": false}, {"data": ["ST16-010-POST-pre-sign-contract", 1, 0, 0.0, 3331.0, 3331, 3331, 3331.0, 3331.0, 3331.0, 3331.0, 0.30021014710297206, 0.19730608300810568, 0.824112034674272], "isController": false}, {"data": ["ST14-090-GET-id", 1, 0, 0.0, 1553.0, 1553, 1553, 1553.0, 1553.0, 1553.0, 1553.0, 0.643915003219575, 62.99488389407598, 1.6965651159047006], "isController": false}, {"data": ["ST05-010-POST-commercial/lead", 4, 0, 0.0, 376.25, 251, 522, 366.0, 522.0, 522.0, 522.0, 0.051316920471602495, 0.03598198134629941, 0.057230393729072314], "isController": false}, {"data": ["ST07-020-GET-maintenance/configuration", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 2.2441007653061225, 10.75015943877551], "isController": false}, {"data": ["ST09-020-PUT-businesses", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 2.6761239035087723, 9.964364035087721], "isController": false}, {"data": ["TEST-01-BUSINESS-CREATING-FLOW", 3, 0, 0.0, 4.666666666666667, 1, 11, 2.0, 11.0, 11.0, 11.0, 0.03840393256269442, 0.0, 0.0], "isController": false}, {"data": ["ST13-020-GET-maintenance/configuration", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.1645853838582676, 10.369248277559056], "isController": false}, {"data": ["ST15-020-GET-latestApplicationId", 1, 0, 0.0, 1221.0, 1221, 1221, 1221.0, 1221.0, 1221.0, 1221.0, 0.819000819000819, 80.75476044226043, 2.1578752047502046], "isController": false}, {"data": ["ST03-020-POST-commercial/lead", 6, 0, 0.0, 257.0, 243, 276, 251.0, 276.0, 276.0, 276.0, 0.0767538248989408, 0.0489080769009364, 0.06333689652305173], "isController": false}, {"data": ["AF-020-OPTIONS-maintenance/configuration", 6, 0, 0.0, 881.8333333333334, 868, 893, 883.0, 893.0, 893.0, 893.0, 0.07611508601004718, 0.13290407596285583, 0.0492072138072766], "isController": false}, {"data": ["ST14-070-PUT-middesk/objectId", 1, 0, 0.0, 2728.0, 2728, 2728, 2728.0, 2728.0, 2728.0, 2728.0, 0.36656891495601174, 0.2942574688416422, 0.9930294629765395], "isController": false}, {"data": ["ST11-030-GET-getPersonalInfo", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 7.7349950396825395, 10.808066716269842], "isController": false}, {"data": ["ST06-030-GET-suffixes", 2, 0, 0.0, 265.0, 262, 268, 265.0, 268.0, 268.0, 268.0, 0.026027094205067478, 0.019850742748200877, 0.06776194643624012], "isController": false}, {"data": ["ST07-050-GET-maintenance/configuration", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 2.2349784044715446, 10.706459603658537], "isController": false}, {"data": ["ST05-040-GET-applicants/email", 4, 0, 0.0, 410.5, 356, 456, 415.0, 456.0, 456.0, 456.0, 0.051892789496899405, 0.11247660770348461, 0.13854969383254198], "isController": false}, {"data": ["ST14-080-GET-maintenance/configuration", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.098491173664122, 10.052630009541984], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 3, 0, 0.0, 57.0, 2, 167, 2.0, 167.0, 167.0, 167.0, 0.03832249658291072, 0.0, 0.0], "isController": false}, {"data": ["ST12-020-GET-maintenance/configuration", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 2.19921875, 10.53515625], "isController": false}, {"data": ["ST07-030-GET-core/products", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 30.429231517509727, 10.130410992217898], "isController": false}, {"data": ["ST04-010-GET-maintenance/configuration", 4, 0, 0.0, 262.25, 242, 293, 257.0, 293.0, 293.0, 293.0, 0.051313628899835796, 0.02821247370176519, 0.0378838900862069], "isController": false}, {"data": ["AF-030-OPTIONS-commercial/lead", 6, 0, 0.0, 630.5, 236, 1063, 618.5, 1063.0, 1063.0, 1063.0, 0.07596956152901405, 0.047480975955633775, 0.052822585750642574], "isController": false}, {"data": ["ST06-010-PATCH-ssn", 2, 0, 0.0, 315.0, 252, 378, 315.0, 378.0, 378.0, 378.0, 0.025991916513964156, 0.01797097352723303, 0.07143969631694543], "isController": false}, {"data": ["ST08-020-GET-maintenance/configuration", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.147674560546875, 10.288238525390625], "isController": false}, {"data": ["ST14-060-POST-middesk", 1, 0, 0.0, 886.0, 886, 886, 886.0, 886.0, 886.0, 886.0, 1.128668171557562, 0.9457004796839729, 3.058646656320542], "isController": false}, {"data": ["ST16-030-GET-sign-contract", 1, 0, 0.0, 1911.0, 1911, 1911, 1911.0, 1911.0, 1911.0, 1911.0, 0.5232862375719519, 52.279054650706435, 1.4242175235478807], "isController": false}, {"data": ["AF-030-POST-commercial/lead", 6, 0, 0.0, 259.5, 251, 270, 259.5, 270.0, 270.0, 270.0, 0.07670182166826461, 0.057326621923937365, 0.08868648130393098], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 3, 0, 0.0, 18.333333333333336, 0, 55, 0.0, 55.0, 55.0, 55.0, 0.038409341151768105, 0.0, 0.0], "isController": false}, {"data": ["ST13-030-GET-businesses/applications", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 5.52488312007874, 10.519192913385826], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 6, 0, 0.0, 897.0, 881, 908, 897.5, 908.0, 908.0, 908.0, 0.07612087995737231, 0.13288941380579025, 0.061773878168531624], "isController": false}, {"data": ["ST03-010-GET-maintenance/configuration", 6, 0, 0.0, 251.33333333333331, 243, 262, 252.5, 262.0, 262.0, 262.0, 0.07677641428553149, 0.042212032463627175, 0.0564576562080129], "isController": false}, {"data": ["eProtect/paypage_01", 3, 0, 0.0, 1047.6666666666667, 654, 1816, 673.0, 1816.0, 1816.0, 1816.0, 0.03722592413356662, 0.01708611752224249, 0.04151563023489558], "isController": false}, {"data": ["ST02-020-POST-commercial/lead", 6, 0, 0.0, 257.6666666666667, 242, 276, 253.0, 276.0, 276.0, 276.0, 0.07672830507174097, 0.04867951386224712, 0.0625665378270544], "isController": false}, {"data": ["ST07-040-POST-selected-offer", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 1.7267520215633423, 7.544011118598383], "isController": false}, {"data": ["ST16-020-GET-maintenance/configuration", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 2.262570730452675, 10.838638117283951], "isController": false}, {"data": ["ST16-030-POST-sign-contract", 1, 0, 0.0, 4867.0, 4867, 4867, 4867.0, 4867.0, 4867.0, 4867.0, 0.20546537908362442, 0.15911527891925212, 0.5636252439901377], "isController": false}, {"data": ["ST04-020-POST-commercial/lead", 4, 0, 0.0, 361.25, 250, 477, 359.0, 477.0, 477.0, 477.0, 0.05119213688777404, 0.03296993581785838, 0.04614291244864789], "isController": false}, {"data": ["ST10-020-GET-maintenance/configuration", 2, 0, 0.0, 244.0, 243, 245, 244.0, 245.0, 245.0, 245.0, 1.549186676994578, 0.8517500968241674, 4.080230925639039], "isController": false}, {"data": ["ST02-010-GET-maintenance/configuration", 6, 0, 0.0, 250.0, 241, 257, 252.0, 257.0, 257.0, 257.0, 0.0767528430532281, 0.04219907288961662, 0.05644032306550855], "isController": false}, {"data": ["ST05-020-POST-auth/oauth/token", 4, 0, 0.0, 567.5, 500, 660, 555.0, 660.0, 660.0, 660.0, 0.05130375671758565, 0.23978494106480946, 0.047496056023702334], "isController": false}, {"data": ["ST14-020-POST-senti-link", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 1.1416153169014085, 4.985970510563381], "isController": false}, {"data": ["ST12-010-PUT-businesses", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 2.6846718189964154, 10.157650089605735], "isController": false}, {"data": ["ST10-010-PUT-businesses", 2, 0, 0.0, 287.5, 280, 295, 287.5, 295.0, 295.0, 295.0, 1.4903129657228018, 1.1308331780923992, 4.066342213114754], "isController": false}, {"data": ["ST08-010-PUT-businesses", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 2.663352272727273, 9.57782451923077], "isController": false}, {"data": ["ST09-030-GET-maintenance/configuration", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 2.181764632936508, 10.451543898809524], "isController": false}, {"data": ["ST14-010-PUT-businesses", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 2.699497767857143, 9.964425223214285], "isController": false}, {"data": ["ST15-010-POST-add-payment", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 1.0381175468483816, 5.428489672061329], "isController": false}, {"data": ["ST13-010-PUT-businesses", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 2.659574468085107, 9.751773049645392], "isController": false}, {"data": ["ST14-030-GET-maintenance/configuration", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 2.19921875, 10.53515625], "isController": false}, {"data": ["ST09-010-GET-industries", 1, 0, 0.0, 763.0, 763, 763, 763.0, 763.0, 763.0, 763.0, 1.3106159895150722, 37.68532929226736, 3.435247378768021], "isController": false}, {"data": ["ST06-020-GET-maintenance/configuration", 2, 0, 0.0, 248.5, 245, 252, 248.5, 252.0, 252.0, 252.0, 0.0260345478449903, 0.014313916442118692, 0.0685695073612684], "isController": false}, {"data": ["ST10-040-GET-businesses/applications", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 4.848613813229572, 10.396400778210117], "isController": false}, {"data": ["ST14-070-GET-middesk/objectId", 2, 0, 0.0, 271.5, 261, 282, 271.5, 282.0, 282.0, 282.0, 0.6110601894286587, 0.4964864039107852, 1.6296927512985029], "isController": false}, {"data": ["ST05-030-GET-maintenance/configuration", 12, 0, 0.0, 252.41666666666669, 243, 265, 253.0, 262.0, 265.0, 265.0, 0.15487867836861127, 0.08515302336086732, 0.41215273296334537], "isController": false}, {"data": ["ST01-010-GET-maintenance/configuration", 6, 0, 0.0, 249.66666666666666, 243, 255, 251.5, 255.0, 255.0, 255.0, 0.07674597083653108, 0.04219529451266308, 0.05643526957022256], "isController": false}, {"data": ["AF-010-GET-Welcome", 6, 0, 0.0, 959.6666666666666, 714, 1092, 992.0, 1092.0, 1092.0, 1092.0, 0.07585430915687937, 0.1322018135501081, 0.049409008015271996], "isController": false}, {"data": ["ST07-010-PUT-verifyPersonalInfos", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 2.20406830495356, 8.946279992260061], "isController": false}, {"data": ["ST14-040-POST-factor-trust", 1, 0, 0.0, 1410.0, 1410, 1410, 1410.0, 1410.0, 1410.0, 1410.0, 0.7092198581560284, 0.4647329343971631, 2.0500886524822697], "isController": false}]}, function(index, item){
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
