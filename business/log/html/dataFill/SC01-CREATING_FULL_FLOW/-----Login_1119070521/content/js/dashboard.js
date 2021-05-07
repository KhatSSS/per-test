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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9118852459016393, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-050-GET-payments/failed"], "isController": false}, {"data": [1.0, 500, 1500, "LG-070-GET-payments/failed"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Login"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-030-GET-customer/customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-050-GET-core/states/available"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-050-GET-payments/failed"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-040-GET-origination/applicants/3796"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-100-GET-customers/customerId_encrypt"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-070-POST-update/address"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-040-GET-origination/applicants/3796"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-070-PATCH-core/documents"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-080-GET-summary?emailEncrypted"], "isController": false}, {"data": [1.0, 500, 1500, "LG-020-POST-auth/oauth/token"], "isController": false}, {"data": [1.0, 500, 1500, "LG-SAVING-DETAILS-030-GET-accounts/savings/number"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-020-GET-documents/noaa/latest/user_uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-090-GET-payments"], "isController": false}, {"data": [1.0, 500, 1500, "LG-120-GET-missed-payment-time?customerUuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-020-GET-documents/noaa/latest/user_uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-040-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-LOGIN-FLOW"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-030-GET-customer/customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-060-GET-customers/customerId_encrypt"], "isController": false}, {"data": [1.0, 500, 1500, "LG-SAVING-DETAILS-050-GET-account/transactions"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-100-GET-account/transactions"], "isController": false}, {"data": [1.0, 500, 1500, "LG-SAVING-DETAILS-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "LG-060-GET-dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "LG-110-GET-applicants/popup/uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-030-GET-customer/customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-030-GET-full"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-030-GET-full"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-080-GET-autopay"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-050-GET-core/states/available"], "isController": false}, {"data": [0.5, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-060-GET-payments"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-040-PATCH-core/documents"], "isController": false}, {"data": [0.5, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-080-POST-method"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-060-GET-customers/customerId_encrypt"], "isController": false}, {"data": [1.0, 500, 1500, "LG-090-GET-customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-040-GET-origination/applicants/3796"], "isController": false}, {"data": [1.0, 500, 1500, "LG-030-GET-applicants/email"], "isController": false}, {"data": [0.7, 500, 1500, "LG-010-POST-check-lead-with-application"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-070-PUT-auth/users"], "isController": false}, {"data": [0.5, 500, 1500, "LG-LOAN-DETAILS-060-GET-payments"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-080-GET-payments/failed"], "isController": false}, {"data": [0.55, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.35, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-020-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-130-GET-customers/popup/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-060-GET-customers/customerId_encrypt"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-070-GET-eProtect/paypage_LINK-DEBIT-CARD"], "isController": false}, {"data": [1.0, 500, 1500, "LG-100-GET-applicants/id"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-050-GET-core/states/available"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-090-GET-customer/customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-040-PATCH-core/documents"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-070-GET-account/transactions"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-060-GET-full"], "isController": false}, {"data": [1.0, 500, 1500, "LG-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-SAVING-DETAILS-020-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-020-GET-documents/noaa/latest/user_uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-070-GET-account/transactions"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-040-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-030-POST-payment"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-SAVING-DETAILS-040-PATCH-core/documents"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-020-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-020-GET-noaa/latest/customerUUID"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 244, 0, 0.0, 386.1557377049181, 0, 2227, 284.5, 879.5, 1061.25, 2001.65, 1.3790998547423512, 2.519108119097142, 2.742811124079423], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LG-MAKE-PAYMENT-AUTOPAY-010-GET-maintenance/configuration", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 2.2719201962809916, 11.024664256198347], "isController": false}, {"data": ["LG-LOAN-DETAILS-050-GET-payments/failed", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.6898197525597272, 9.315672994880547], "isController": false}, {"data": ["LG-070-GET-payments/failed", 10, 0, 0.0, 294.0, 272, 310, 294.0, 309.5, 310.0, 310.0, 0.06331438122855225, 0.03134803836218358, 0.17281610891973], "isController": false}, {"data": ["AF-010-GET-Login", 10, 0, 0.0, 985.0999999999999, 876, 1297, 955.5, 1276.9, 1297.0, 1297.0, 0.06271401156446374, 0.10754473076874835, 0.04605560224265305], "isController": false}, {"data": ["LG-EIDT-INFO-030-GET-customer/customers/customerId", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 4.943218427835052, 9.097803908934708], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-050-GET-core/states/available", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 16.575471135496183, 10.097358062977099], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-050-GET-payments/failed", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.8405843401486988, 10.146811105947954], "isController": false}, {"data": ["LG-EIDT-INFO-040-GET-origination/applicants/3796", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 5.055609081769437, 7.108223022788204], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-100-GET-customers/customerId_encrypt", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 7.8125, 6.120834525171625], "isController": false}, {"data": ["LG-EIDT-INFO-070-POST-update/address", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 4.656456953642384, 9.118894867549669], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-040-GET-origination/applicants/3796", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 6.958458256457564, 9.783642758302582], "isController": false}, {"data": ["LG-MAKE-PAYMENT-070-PATCH-core/documents", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 20.028474130036628, 10.330815018315018], "isController": false}, {"data": ["LG-LOAN-DETAILS-010-GET-maintenance/configuration", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.1227980212355213, 10.301037644787645], "isController": false}, {"data": ["LG-080-GET-summary?emailEncrypted", 10, 0, 0.0, 327.79999999999995, 298, 431, 317.5, 421.30000000000007, 431.0, 431.0, 0.06326591295875694, 0.051094638688371094, 0.17126280343913505], "isController": false}, {"data": ["LG-020-POST-auth/oauth/token", 10, 0, 0.0, 474.8, 459, 487, 477.5, 486.6, 487.0, 487.0, 0.06306601750712645, 0.2935895561098358, 0.06023297375192352], "isController": false}, {"data": ["LG-SAVING-DETAILS-030-GET-accounts/savings/number", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 10.442680210583152, 5.787661987041036], "isController": false}, {"data": ["LG-EIDT-INFO-020-GET-documents/noaa/latest/user_uuid", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 2.6521029537671232, 9.200422731164384], "isController": false}, {"data": ["LG-MAKE-PAYMENT-090-GET-payments", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 148.3135857250755, 8.078030589123866], "isController": false}, {"data": ["LG-120-GET-missed-payment-time?customerUuid", 10, 0, 0.0, 294.4, 244, 359, 281.5, 358.1, 359.0, 359.0, 0.06304414981811764, 0.0336153376959885, 0.17078561679243975], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-020-GET-documents/noaa/latest/user_uuid", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 2.8160511363636362, 9.769176136363635], "isController": false}, {"data": ["LG-MAKE-PAYMENT-040-GET-maintenance/configuration", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 2.2908528645833335, 11.116536458333334], "isController": false}, {"data": ["TEST-01-BUSINESS-LOGIN-FLOW", 10, 0, 0.0, 1.9, 0, 15, 0.5, 13.600000000000005, 15.0, 15.0, 0.06302309166078451, 0.0, 0.0], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-030-GET-customer/customers/customerId", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 4.96026400862069, 9.129175646551724], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-060-GET-customers/customerId_encrypt", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 8.09713788507109, 6.338399733412323], "isController": false}, {"data": ["LG-SAVING-DETAILS-050-GET-account/transactions", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 4.623356780442804, 10.176429889298893], "isController": false}, {"data": ["LG-MAKE-PAYMENT-100-GET-account/transactions", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 6.34765625, 10.526001908396946], "isController": false}, {"data": ["LG-SAVING-DETAILS-010-GET-maintenance/configuration", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.1227980212355213, 10.301037644787645], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 35.8, 0, 349, 1.0, 314.60000000000014, 349.0, 349.0, 0.0628847762245238, 0.0, 0.0], "isController": false}, {"data": ["LG-060-GET-dashboard", 10, 0, 0.0, 402.6, 356, 479, 398.0, 477.3, 479.0, 479.0, 0.06324870656395076, 0.06720175072419769, 0.1697955999456061], "isController": false}, {"data": ["LG-110-GET-applicants/popup/uuid", 10, 0, 0.0, 253.9, 244, 261, 255.0, 260.9, 261.0, 261.0, 0.06304256003227779, 0.03620022001853451, 0.1694884450867781], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-030-GET-customer/customers/customerId", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 4.943218427835052, 9.097803908934708], "isController": false}, {"data": ["LG-LOAN-DETAILS-030-GET-full", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 9.4132016184573, 7.373988464187328], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-030-GET-full", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 9.818943067528735, 7.691832794540231], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-080-GET-autopay", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 7.490387761780105, 7.094138579842932], "isController": false}, {"data": ["LG-EIDT-INFO-010-GET-maintenance/configuration", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.1227980212355213, 10.301037644787645], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-050-GET-core/states/available", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 16.575471135496183, 10.097358062977099], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-060-GET-payments", 1, 0, 0.0, 1329.0, 1329, 1329, 1329.0, 1329.0, 1329.0, 1329.0, 0.7524454477050414, 36.92199844808127, 2.0119098006019565], "isController": false}, {"data": ["LG-LOAN-DETAILS-040-PATCH-core/documents", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 15.408368177816902, 9.93067781690141], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-080-POST-method", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.882561831550802, 5.506002116755793], "isController": false}, {"data": ["LG-EIDT-INFO-060-GET-customers/customerId_encrypt", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 8.11637099168646, 6.353455314726841], "isController": false}, {"data": ["LG-090-GET-customers/customerId", 10, 0, 0.0, 285.5, 270, 302, 286.5, 301.5, 302.0, 302.0, 0.0630179286006869, 0.09064981330938653, 0.1668375043324826], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-040-GET-origination/applicants/3796", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 7.010194005576207, 9.856383596654274], "isController": false}, {"data": ["LG-030-GET-applicants/email", 10, 0, 0.0, 302.70000000000005, 281, 344, 301.0, 340.6, 344.0, 344.0, 0.06351545330979028, 0.14092491203109717, 0.17113196843917125], "isController": false}, {"data": ["LG-010-POST-check-lead-with-application", 10, 0, 0.0, 768.2, 253, 1397, 1011.5, 1365.5, 1397.0, 1397.0, 0.0628456510809452, 0.03366906658496732, 0.0492454594017094], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 14.7, 1, 135, 1.0, 121.70000000000005, 135.0, 135.0, 0.0630290500891861, 0.0, 0.0], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-070-PUT-auth/users", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 6.875845102163462, 6.77490234375], "isController": false}, {"data": ["LG-LOAN-DETAILS-060-GET-payments", 1, 0, 0.0, 1447.0, 1447, 1447, 1447.0, 1447.0, 1447.0, 1447.0, 0.691085003455425, 33.911082195922596, 1.8478425190048375], "isController": false}, {"data": ["LG-MAKE-PAYMENT-080-GET-payments/failed", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.8474521921641789, 10.18467234141791], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 798.1999999999999, 241, 911, 850.5, 910.4, 911.0, 911.0, 0.06291484475762056, 0.1079505685929095, 0.05308440026424235], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 1075.3000000000002, 524, 2227, 741.0, 2204.6, 2227.0, 2227.0, 0.06161809107153861, 0.02804104535091503, 0.07605983116643046], "isController": false}, {"data": ["LG-MAKE-PAYMENT-020-GET-noaa/latest/customerUUID", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 3.0369178921568625, 10.535386029411764], "isController": false}, {"data": ["LG-130-GET-customers/popup/customerId", 10, 0, 0.0, 258.20000000000005, 244, 273, 259.5, 272.3, 273.0, 273.0, 0.06308352258390108, 0.040597696662881655, 0.16738079185591723], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-060-GET-customers/customerId_encrypt", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 8.41623691502463, 6.5881888854679795], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-070-GET-eProtect/paypage_LINK-DEBIT-CARD", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.9724245233050848, 2.6317531779661016], "isController": false}, {"data": ["LG-100-GET-applicants/id", 10, 0, 0.0, 269.69999999999993, 250, 290, 272.0, 288.6, 290.0, 290.0, 0.06303262568705562, 0.11886328144697696, 0.1671226354886289], "isController": false}, {"data": ["LG-EIDT-INFO-050-GET-core/states/available", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 14.771338222789117, 8.998325892857144], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-090-GET-customer/customers/customerId", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 4.78515625, 8.824869791666668], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-040-PATCH-core/documents", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 15.684503808243726, 10.108646953405017], "isController": false}, {"data": ["LG-MAKE-PAYMENT-050-GET-noaa/latest/customerUUID", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 3.0609251482213438, 10.618669713438734], "isController": false}, {"data": ["LG-LOAN-DETAILS-070-GET-account/transactions", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 4.856316618217054, 10.689195736434108], "isController": false}, {"data": ["LG-MAKE-PAYMENT-060-GET-full", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 10.056268601190476, 7.966541108630952], "isController": false}, {"data": ["LG-050-GET-noaa/latest/customerUUID", 10, 0, 0.0, 271.0, 256, 285, 271.5, 284.6, 285.0, 285.0, 0.06329474463735277, 0.04901634032951244, 0.17004281493882561], "isController": false}, {"data": ["LG-SAVING-DETAILS-020-GET-noaa/latest/customerUUID", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 2.8263286952554743, 9.804830063868613], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-020-GET-documents/noaa/latest/user_uuid", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 2.8263286952554743, 9.804830063868613], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-070-GET-account/transactions", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 4.728036556603773, 10.40683962264151], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-010-GET-maintenance/configuration", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.1310259205426356, 10.34096414728682], "isController": false}, {"data": ["LG-040-GET-maintenance/configuration", 10, 0, 0.0, 253.9, 240, 263, 257.5, 262.8, 263.0, 263.0, 0.06329714846346172, 0.034801068930594675, 0.16887481406462637], "isController": false}, {"data": ["LG-MAKE-PAYMENT-010-GET-maintenance/configuration", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 2.253297899590164, 10.934298155737705], "isController": false}, {"data": ["LG-MAKE-PAYMENT-030-POST-payment", 1, 0, 0.0, 2000.0, 2000, 2000, 2000.0, 2000.0, 2000.0, 2000.0, 0.5, 0.267578125, 1.3544921875], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-010-GET-maintenance/configuration", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.1227980212355213, 10.301037644787645], "isController": false}, {"data": ["LG-SAVING-DETAILS-040-PATCH-core/documents", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 15.473166961130744, 9.96576855123675], "isController": false}, {"data": ["LG-LOAN-DETAILS-020-GET-noaa/latest/customerUUID", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 2.8160511363636362, 9.769176136363635], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-020-GET-noaa/latest/customerUUID", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 2.7364454505300357, 9.493015680212014], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 244, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
