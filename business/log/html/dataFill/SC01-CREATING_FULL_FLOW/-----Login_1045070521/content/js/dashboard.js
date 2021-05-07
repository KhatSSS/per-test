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

    var data = {"OkPercent": 29.098360655737704, "KoPercent": 70.90163934426229};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.22336065573770492, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "LG-LOAN-DETAILS-050-GET-payments/failed"], "isController": false}, {"data": [0.0, 500, 1500, "LG-070-GET-payments/failed"], "isController": false}, {"data": [0.55, 500, 1500, "AF-010-GET-Login"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-030-GET-customer/customers/customerId"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-SECURITY-050-GET-core/states/available"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-050-GET-payments/failed"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-100-GET-customers/customerId_encrypt"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-070-POST-update/address"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-040-GET-origination/applicants/id_NOT_FOUND"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-070-PATCH-core/documents"], "isController": false}, {"data": [0.0, 500, 1500, "LG-LOAN-DETAILS-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "LG-080-GET-summary?emailEncrypted"], "isController": false}, {"data": [0.0, 500, 1500, "LG-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.0, 500, 1500, "LG-SAVING-DETAILS-030-GET-accounts/savings/number"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-020-GET-documents/noaa/latest/user_uuid"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-090-GET-payments"], "isController": false}, {"data": [0.0, 500, 1500, "LG-120-GET-missed-payment-time?customerUuid"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-SECURITY-020-GET-documents/noaa/latest/user_uuid"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-040-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-LOGIN-FLOW"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-040-GET-origination/applicants/id_NOT_FOUND"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-030-GET-customer/customers/customerId"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-060-GET-customers/customerId_encrypt"], "isController": false}, {"data": [0.0, 500, 1500, "LG-SAVING-DETAILS-050-GET-account/transactions"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-100-GET-account/transactions"], "isController": false}, {"data": [0.0, 500, 1500, "LG-SAVING-DETAILS-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [0.0, 500, 1500, "LG-060-GET-dashboard"], "isController": false}, {"data": [0.0, 500, 1500, "LG-110-GET-applicants/popup/uuid"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-SECURITY-030-GET-customer/customers/customerId"], "isController": false}, {"data": [0.0, 500, 1500, "LG-LOAN-DETAILS-030-GET-full"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-030-GET-full"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-080-GET-autopay"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-050-GET-core/states/available"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-060-GET-payments"], "isController": false}, {"data": [0.0, 500, 1500, "LG-LOAN-DETAILS-040-PATCH-core/documents"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-080-POST-method"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-060-GET-customers/customerId_encrypt"], "isController": false}, {"data": [0.0, 500, 1500, "LG-090-GET-customers/customerId"], "isController": false}, {"data": [0.0, 500, 1500, "LG-030-GET-applicants/email"], "isController": false}, {"data": [0.7, 500, 1500, "LG-010-POST-check-lead-with-application"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-SECURITY-070-PUT-auth/users"], "isController": false}, {"data": [0.0, 500, 1500, "LG-LOAN-DETAILS-060-GET-payments"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-080-GET-payments/failed"], "isController": false}, {"data": [0.6, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.5, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-020-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [0.0, 500, 1500, "LG-130-GET-customers/popup/customerId"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-SECURITY-060-GET-customers/customerId_encrypt"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-070-GET-eProtect/paypage_LINK-DEBIT-CARD"], "isController": false}, {"data": [0.0, 500, 1500, "LG-100-GET-applicants/id"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-050-GET-core/states/available"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-090-GET-customer/customers/customerId"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-040-PATCH-core/documents"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [0.0, 500, 1500, "LG-LOAN-DETAILS-070-GET-account/transactions"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-060-GET-full"], "isController": false}, {"data": [0.0, 500, 1500, "LG-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [0.0, 500, 1500, "LG-SAVING-DETAILS-020-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-020-GET-documents/noaa/latest/user_uuid"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-070-GET-account/transactions"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "LG-040-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-SECURITY-040-GET-origination/applicants/id_NOT_FOUND"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-030-POST-payment"], "isController": false}, {"data": [0.0, 500, 1500, "LG-EIDT-INFO-SECURITY-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "LG-SAVING-DETAILS-040-PATCH-core/documents"], "isController": false}, {"data": [0.0, 500, 1500, "LG-LOAN-DETAILS-020-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-020-GET-noaa/latest/customerUUID"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 244, 173, 70.90163934426229, 329.76639344262276, 0, 2742, 256.0, 826.0, 972.0, 1321.150000000002, 2.0216917582918366, 1.4389309528050973, 1.507149779706026], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LG-MAKE-PAYMENT-AUTOPAY-010-GET-maintenance/configuration", 1, 1, 100.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.952755905511811, 3.1680610236220472], "isController": false}, {"data": ["LG-LOAN-DETAILS-050-GET-payments/failed", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.3203125], "isController": false}, {"data": ["LG-070-GET-payments/failed", 10, 10, 100.0, 253.1, 236, 257, 256.0, 257.0, 257.0, 257.0, 0.09850081755678572, 0.07387561316758928, 0.08339864142747384], "isController": false}, {"data": ["AF-010-GET-Login", 10, 0, 0.0, 871.0, 256, 1003, 942.5, 1000.9, 1003.0, 1003.0, 0.09434318276161364, 0.16187594932827654, 0.06928327484056003], "isController": false}, {"data": ["LG-EIDT-INFO-030-GET-customer/customers/customerId", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.13568115234375], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-050-GET-core/states/available", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.0675551470588234], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-050-GET-payments/failed", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.3203125], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-100-GET-customers/customerId_encrypt", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.259037990196078], "isController": false}, {"data": ["LG-EIDT-INFO-070-POST-update/address", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.620147705078125], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-040-GET-origination/applicants/id_NOT_FOUND", 1, 1, 100.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.9182879377431905, 3.0968810797665367], "isController": false}, {"data": ["LG-MAKE-PAYMENT-070-PATCH-core/documents", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.6879595588235294], "isController": false}, {"data": ["LG-LOAN-DETAILS-010-GET-maintenance/configuration", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.143310546875], "isController": false}, {"data": ["LG-080-GET-summary?emailEncrypted", 10, 10, 100.0, 252.9, 239, 257, 255.0, 257.0, 257.0, 257.0, 0.09850469867412676, 0.07387852400559507, 0.08311333950629445], "isController": false}, {"data": ["LG-020-POST-auth/oauth/token", 10, 10, 100.0, 462.0, 447, 466, 464.5, 466.0, 466.0, 466.0, 0.09474003334849174, 0.06374597946983476, 0.09057665297673184], "isController": false}, {"data": ["LG-SAVING-DETAILS-030-GET-accounts/savings/number", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.278186274509804], "isController": false}, {"data": ["LG-EIDT-INFO-020-GET-documents/noaa/latest/user_uuid", 1, 1, 100.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.9069767441860463, 3.126514050387597], "isController": false}, {"data": ["LG-MAKE-PAYMENT-090-GET-payments", 1, 1, 100.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.9182879377431905, 3.229875972762646], "isController": false}, {"data": ["LG-120-GET-missed-payment-time?customerUuid", 10, 10, 100.0, 253.8, 236, 263, 256.0, 262.5, 263.0, 263.0, 0.09967406580481825, 0.07475554935361368, 0.08322395142882774], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-020-GET-documents/noaa/latest/user_uuid", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.163296568627451], "isController": false}, {"data": ["LG-MAKE-PAYMENT-040-GET-maintenance/configuration", 1, 1, 100.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.952755905511811, 3.1680610236220472], "isController": false}, {"data": ["TEST-01-BUSINESS-LOGIN-FLOW", 10, 0, 0.0, 2.7, 0, 19, 1.0, 17.200000000000006, 19.0, 19.0, 0.0950705899130104, 0.0, 0.0], "isController": false}, {"data": ["LG-EIDT-INFO-040-GET-origination/applicants/id_NOT_FOUND", 1, 1, 100.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 2.8846153846153846, 3.0611478365384612], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-030-GET-customer/customers/customerId", 1, 1, 100.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 2.8846153846153846, 3.0874399038461537], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-060-GET-customers/customerId_encrypt", 1, 1, 100.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 2.840909090909091, 3.147934422348485], "isController": false}, {"data": ["LG-SAVING-DETAILS-050-GET-account/transactions", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.5845588235294117], "isController": false}, {"data": ["LG-MAKE-PAYMENT-100-GET-account/transactions", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.5845588235294117], "isController": false}, {"data": ["LG-SAVING-DETAILS-010-GET-maintenance/configuration", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.155637254901961], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 35.9, 0, 352, 1.0, 316.90000000000015, 352.0, 352.0, 0.09475260095889633, 0.0, 0.0], "isController": false}, {"data": ["LG-060-GET-dashboard", 10, 10, 100.0, 255.29999999999998, 238, 267, 256.0, 266.3, 267.0, 267.0, 0.09850081755678572, 0.07387561316758928, 0.08282148819960206], "isController": false}, {"data": ["LG-110-GET-applicants/popup/uuid", 10, 10, 100.0, 253.10000000000002, 236, 260, 254.5, 259.8, 260.0, 260.0, 0.09967009199549491, 0.07475256899662118, 0.08039794530105351], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-030-GET-customer/customers/customerId", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.13568115234375], "isController": false}, {"data": ["LG-LOAN-DETAILS-030-GET-full", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.2666973039215685], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-030-GET-full", 1, 1, 100.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 2.8517110266159693, 3.1673300855513307], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-080-GET-autopay", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.37982177734375], "isController": false}, {"data": ["LG-EIDT-INFO-010-GET-maintenance/configuration", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.155637254901961], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-050-GET-core/states/available", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.0675551470588234], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-060-GET-payments", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.2552083333333335], "isController": false}, {"data": ["LG-LOAN-DETAILS-040-PATCH-core/documents", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.673553466796875], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-080-POST-method", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 4.947916666666667], "isController": false}, {"data": ["LG-EIDT-INFO-060-GET-customers/customerId_encrypt", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.246307373046875], "isController": false}, {"data": ["LG-090-GET-customers/customerId", 10, 10, 100.0, 252.5, 236, 257, 254.5, 256.9, 257.0, 257.0, 0.09966313859156052, 0.0747473539436704, 0.08000302726783472], "isController": false}, {"data": ["LG-030-GET-applicants/email", 10, 10, 100.0, 254.8, 235, 268, 255.0, 267.5, 268.0, 268.0, 0.09735581603645002, 0.07301686202733752, 0.08090800727247946], "isController": false}, {"data": ["LG-010-POST-check-lead-with-application", 10, 0, 0.0, 745.4, 258, 1226, 996.5, 1214.2, 1226.0, 1226.0, 0.09421252461302206, 0.05051042579350499, 0.07352993131906956], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 14.7, 0, 137, 1.0, 123.50000000000004, 137.0, 137.0, 0.0950877660080254, 0.0, 0.0], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-070-PUT-auth/users", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.80706787109375], "isController": false}, {"data": ["LG-LOAN-DETAILS-060-GET-payments", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.24249267578125], "isController": false}, {"data": ["LG-MAKE-PAYMENT-080-GET-payments/failed", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.3203125], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 10, 0, 0.0, 731.4, 232, 959, 826.0, 954.6, 959.0, 959.0, 0.0944608176528376, 0.16207778966409733, 0.07970131489458172], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 989.1999999999999, 497, 2742, 689.0, 2607.7000000000007, 2742.0, 2742.0, 0.09156670634557275, 0.04167000503616885, 0.11302765314531638], "isController": false}, {"data": ["LG-MAKE-PAYMENT-020-GET-noaa/latest/customerUUID", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.1862745098039214], "isController": false}, {"data": ["LG-130-GET-customers/popup/customerId", 10, 10, 100.0, 251.70000000000002, 235, 259, 254.5, 258.7, 259.0, 259.0, 0.09968201437414648, 0.07476151078060986, 0.080602253810345], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-060-GET-customers/customerId_encrypt", 1, 1, 100.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.9069767441860463, 3.221142199612403], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-070-GET-eProtect/paypage_LINK-DEBIT-CARD", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.9683214662447258, 2.620648734177215], "isController": false}, {"data": ["LG-100-GET-applicants/id", 10, 10, 100.0, 253.5, 236, 263, 254.5, 262.5, 263.0, 263.0, 0.0996661185030149, 0.07474958887726119, 0.0793241079882394], "isController": false}, {"data": ["LG-EIDT-INFO-050-GET-core/states/available", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.055572509765625], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-090-GET-customer/customers/customerId", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.13568115234375], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-040-PATCH-core/documents", 1, 1, 100.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.8625954198473282, 3.589426288167939], "isController": false}, {"data": ["LG-MAKE-PAYMENT-050-GET-noaa/latest/customerUUID", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.173828125], "isController": false}, {"data": ["LG-LOAN-DETAILS-070-GET-account/transactions", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.570556640625], "isController": false}, {"data": ["LG-MAKE-PAYMENT-060-GET-full", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.2666973039215685], "isController": false}, {"data": ["LG-050-GET-noaa/latest/customerUUID", 10, 10, 100.0, 254.8, 238, 261, 257.5, 260.8, 261.0, 261.0, 0.09849402633730264, 0.07387051975297698, 0.0800263963990584], "isController": false}, {"data": ["LG-SAVING-DETAILS-020-GET-noaa/latest/customerUUID", 1, 1, 100.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.9182879377431905, 3.1614785992217898], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-020-GET-documents/noaa/latest/user_uuid", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.163296568627451], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-070-GET-account/transactions", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.5845588235294117], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-010-GET-maintenance/configuration", 1, 1, 100.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.952755905511811, 3.1680610236220472], "isController": false}, {"data": ["LG-040-GET-maintenance/configuration", 10, 10, 100.0, 253.5, 235, 269, 254.5, 267.9, 269.0, 269.0, 0.09849208616087697, 0.07386906462065773, 0.07925535058258068], "isController": false}, {"data": ["LG-MAKE-PAYMENT-010-GET-maintenance/configuration", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.155637254901961], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-040-GET-origination/applicants/id_NOT_FOUND", 1, 1, 100.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.952755905511811, 3.1334584153543306], "isController": false}, {"data": ["LG-MAKE-PAYMENT-030-POST-payment", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.448486328125], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-010-GET-maintenance/configuration", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.143310546875], "isController": false}, {"data": ["LG-SAVING-DETAILS-040-PATCH-core/documents", 1, 1, 100.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.941176470588235, 3.6879595588235294], "isController": false}, {"data": ["LG-LOAN-DETAILS-020-GET-noaa/latest/customerUUID", 1, 1, 100.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 2.9296875, 3.173828125], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-020-GET-noaa/latest/customerUUID", 1, 1, 100.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.9069767441860463, 3.14922480620155], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 10, 5.780346820809249, 4.098360655737705], "isController": false}, {"data": ["401/Unauthorized", 163, 94.21965317919076, 66.80327868852459], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 244, 173, "401/Unauthorized", 163, "500/Internal Server Error", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["LG-MAKE-PAYMENT-AUTOPAY-010-GET-maintenance/configuration", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-LOAN-DETAILS-050-GET-payments/failed", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-070-GET-payments/failed", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["LG-EIDT-INFO-030-GET-customer/customers/customerId", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-050-GET-core/states/available", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-050-GET-payments/failed", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-100-GET-customers/customerId_encrypt", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-070-POST-update/address", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-040-GET-origination/applicants/id_NOT_FOUND", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-070-PATCH-core/documents", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-LOAN-DETAILS-010-GET-maintenance/configuration", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-080-GET-summary?emailEncrypted", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-020-POST-auth/oauth/token", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-SAVING-DETAILS-030-GET-accounts/savings/number", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-020-GET-documents/noaa/latest/user_uuid", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-090-GET-payments", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-120-GET-missed-payment-time?customerUuid", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-020-GET-documents/noaa/latest/user_uuid", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-040-GET-maintenance/configuration", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["LG-EIDT-INFO-040-GET-origination/applicants/id_NOT_FOUND", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-030-GET-customer/customers/customerId", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-060-GET-customers/customerId_encrypt", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-SAVING-DETAILS-050-GET-account/transactions", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-100-GET-account/transactions", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-SAVING-DETAILS-010-GET-maintenance/configuration", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["LG-060-GET-dashboard", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-110-GET-applicants/popup/uuid", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-030-GET-customer/customers/customerId", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-LOAN-DETAILS-030-GET-full", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-030-GET-full", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-080-GET-autopay", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-010-GET-maintenance/configuration", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-050-GET-core/states/available", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-060-GET-payments", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-LOAN-DETAILS-040-PATCH-core/documents", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-080-POST-method", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-060-GET-customers/customerId_encrypt", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-090-GET-customers/customerId", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-030-GET-applicants/email", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-070-PUT-auth/users", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-LOAN-DETAILS-060-GET-payments", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-080-GET-payments/failed", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LG-MAKE-PAYMENT-020-GET-noaa/latest/customerUUID", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-130-GET-customers/popup/customerId", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-060-GET-customers/customerId_encrypt", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["LG-100-GET-applicants/id", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-050-GET-core/states/available", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-090-GET-customer/customers/customerId", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-040-PATCH-core/documents", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-050-GET-noaa/latest/customerUUID", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-LOAN-DETAILS-070-GET-account/transactions", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-060-GET-full", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-050-GET-noaa/latest/customerUUID", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-SAVING-DETAILS-020-GET-noaa/latest/customerUUID", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-020-GET-documents/noaa/latest/user_uuid", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-070-GET-account/transactions", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-010-GET-maintenance/configuration", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-040-GET-maintenance/configuration", 10, 10, "401/Unauthorized", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-010-GET-maintenance/configuration", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-040-GET-origination/applicants/id_NOT_FOUND", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-030-POST-payment", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-010-GET-maintenance/configuration", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-SAVING-DETAILS-040-PATCH-core/documents", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-LOAN-DETAILS-020-GET-noaa/latest/customerUUID", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-020-GET-noaa/latest/customerUUID", 1, 1, "401/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
