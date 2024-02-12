const { print } = require('pdf-to-printer')
const { jsPDF } = require("jspdf");
const bwipjs = require('bwip-js');
var ElectronPrinter2 = (function () {
    console.log("herrereeeeeeeeee")
    return {
        print2: function (dataset, load_request_code, role_code, loadRequestInfo, userInfo, username, printLines) {
            const options = {
                printer: "Zebra RW 420 - CPCL",
                scale: "fit",
                paperSize: "4x6"
            };
            var doc = new jsPDF();
            let initialY = 65;
            let valueToAddToX = 5;

            var img = new Image();
            img.src = "companylogo.png";
            doc.addImage(img, "png", 150, 5, 50, 30);
            doc.setFontSize(9);

            // if (this.domain.dom_name != null) {
            //   doc.text(this.domain.dom_name, 10, 10);
            // }
            // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
            // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
            // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
            doc.setFontSize(14);

            doc.line(10, 35, 200, 35);
            doc.setFontSize(16);

            // doc.barcode(load_request_code, {
            //     fontSize: 70,
            //     textColor: "#000000",
            //     x: 100,
            //     y: 60,
            //     textOptions: { align: "center" }, // optional text options
            // });

            bwipjs.toBuffer(
                {
                    bcid: 'code128', // Barcode type (replace with the desired barcode format)
                    text: load_request_code, // Barcode data
                    scale: 3, // Scaling factor for the barcode image
                    includetext: true, // Include the barcode text
                    height: 10,
                    width: 60,
                },
                function (err, png) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    doc.addImage(png, 'PNG', 80, 45, 65, 20);
                    doc.save(load_request_code + ".pdf");
                },
            );

            doc.setFont("Times-Roman");

            doc.setFontSize(16);
            doc.text("Demande de chargement : " + load_request_code, 70, initialY + 5);

            doc.setFontSize(16);
            doc.text("Role    : " + role_code, 20, initialY + 10);
            doc.text("Date    : " + loadRequestInfo.date_creation, 20, initialY + 15);
            doc.text("Vendeur : " + userInfo.user_mobile_code + " - " + username, 20, initialY + 20);
            doc.setFontSize(14);

            doc.line(10, initialY + 25, 195, initialY + 25); // 85
            doc.line(10, initialY + 30, 195, initialY + 30); // 90
            doc.line(10, initialY + 25, 10, initialY + 30); // 90
            doc.text("N", 12.5, initialY + 28.5); // 88.5
            doc.line(20, initialY + 25, 20, initialY + 30); // 90
            doc.text("Code Article", 25, initialY + 28.5); // 88.5
            doc.line(45, initialY + 25, 45, initialY + 30); // 90
            doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
            doc.line(100, initialY + 25, 100, initialY + 30); // 90
            doc.text("Prix", 107, initialY + 28.5); // 88.5
            doc.line(120, initialY + 25, 120, initialY + 30); // 90
            doc.text("QTE D", 123, initialY + 28.5); // 88.5
            doc.line(145, initialY + 25, 145, initialY + 30); // 90
            doc.text("QTE V", 148, initialY + 28.5); // 88.5
            doc.line(170, initialY + 25, 170, initialY + 30); // 90
            doc.text("QTE C", 173, initialY + 28.5); // 88.5
            doc.line(195, initialY + 25, 195, initialY + 30); // 90
            var i = 95 + valueToAddToX;
            doc.setFontSize(16);

            for (let j = 0; j < dataset.length; j++) {
                if (j % 30 == 0 && j != 0) {
                    doc.addPage();
                    // img.src = "./assets/media/logos/companylogo.png";
                    // doc.addImage(img, "png", 150, 5, 50, 30);
                    doc.setFontSize(14);
                    //  if (this.domain.dom_name != null) {
                    //    doc.text(this.domain.dom_name, 10, 10);
                    //  }
                    //  if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
                    //  if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
                    //  if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
                    doc.setFontSize(16);
                    doc.line(10, 35, 200, 35);

                    doc.setFontSize(12);
                    doc.text(load_request_code, 70, 40);
                    doc.setFontSize(14);

                    doc.setFontSize(16);
                    doc.text("Demande de chargement : " + load_request_code, 70, 60);
                    doc.setFontSize(14);

                    doc.setFontSize(14);
                    doc.text("Role    : " + role_code, 20, 70);
                    doc.text("Date    : " + loadRequestInfo.date_creation, 20, 75);
                    doc.text("Vendeur : " + userInfo.user_mobile_code + " - " + username, 20, 80);

                    doc.line(10, initialY + 25, 195, initialY + 25); // 85
                    doc.line(10, initialY + 30, 195, initialY + 30); // 90
                    doc.line(10, initialY + 25, 10, initialY + 30); // 90
                    doc.text("N", 12.5, initialY + 28.5); // 88.5
                    doc.line(20, initialY + 25, 20, initialY + 30); // 90
                    doc.text("Code Article", 25, initialY + 28.5); // 88.5
                    doc.line(45, initialY + 25, 45, initialY + 30); // 90
                    doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
                    doc.line(100, initialY + 25, 100, initialY + 30); // 90
                    doc.text("Prix", 107, initialY + 28.5); // 88.5
                    doc.line(120, initialY + 25, 120, initialY + 30); // 90
                    doc.text("QTE Demandée", 123, initialY + 28.5); // 88.5
                    doc.line(145, initialY + 25, 145, initialY + 30); // 90
                    doc.text("QTE Validée", 148, initialY + 28.5); // 88.5
                    doc.line(170, initialY + 25, 170, initialY + 30); // 90
                    doc.text("QTE Chargée", 173, initialY + 28.5); // 88.5
                    doc.line(195, initialY + 25, 195, initialY + 30); // 90
                    var i = 95 + valueToAddToX;
                }

                if (printLines[j].product_name.length > 35) {
                    doc.setFontSize(14);

                    let line = printLines[j];

                    let desc1 = line.product_name.substring(0, 34);
                    let ind = desc1.lastIndexOf(" ");
                    desc1 = line.product_name.substring(0, ind);
                    let desc2 = line.product_name.substring(ind + 1);

                    doc.line(10, i - 5, 10, i);
                    doc.text(String(line.line), 12.5, i - 1);
                    doc.line(20, i - 5, 20, i);
                    doc.text(line.product_code, 25, i - 1);
                    doc.line(45, i - 5, 45, i);
                    doc.text(desc1, 47, i - 1);
                    doc.line(100, i - 5, 100, i);
                    doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
                    doc.line(120, i - 5, 120, i);
                    doc.text(String(line.qt_request), 143, i - 1, { align: "right" });
                    doc.line(145, i - 5, 145, i);
                    doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
                    doc.line(170, i - 5, 170, i);
                    doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
                    doc.line(195, i - 5, 195, i);

                    i = i + 5;

                    doc.text(desc2, 47, i - 1);

                    doc.line(10, i - 5, 10, i);
                    doc.line(20, i - 5, 20, i);
                    doc.line(45, i - 5, 45, i);
                    doc.line(100, i - 5, 100, i);
                    doc.line(120, i - 5, 120, i);
                    doc.line(145, i - 5, 145, i);
                    doc.line(170, i - 5, 170, i);
                    doc.line(195, i - 5, 195, i);

                    i = i + 5;
                } else {
                    doc.setFontSize(14);
                    let line = printLines[j];
                    doc.line(10, i - 5, 10, i);
                    doc.text(String(line.line), 12.5, i - 1);
                    doc.line(20, i - 5, 20, i);
                    doc.text(line.product_code, 25, i - 1);
                    doc.line(45, i - 5, 45, i);
                    doc.text(line.product_name, 47, i - 1);
                    doc.line(100, i - 5, 100, i);
                    doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
                    doc.line(120, i - 5, 120, i);
                    doc.text(String(line.qt_request), 143, i - 1, { align: "right" });
                    doc.line(145, i - 5, 145, i);
                    doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
                    doc.line(170, i - 5, 170, i);
                    doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
                    doc.line(195, i - 5, 195, i);
                    i = i + 5;
                }
                doc.line(10, i - 5, 195, i - 5);
            }

            doc.line(10, i - 5, 195, i - 5);
            doc.save(load_request_code + ".pdf")
            print(load_request_code + ".pdf", options).then(console.log);

        },

    }

}(ElectronPrinter2 || {}))