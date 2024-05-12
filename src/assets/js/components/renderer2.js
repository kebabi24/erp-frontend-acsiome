const { print } = require("pdf-to-printer");
const { jsPDF } = require("jspdf");
const PDFDocument = require("pdfkit");
const bwipjs = require("bwip-js");
const fs = require("fs");
const path = require("path");

var ElectronPrinter2 = (function () {
  console.log("herrereeeeeeeeee");
  return {
    print2: function (dataset, load_request_code, role_code, loadRequestInfo, userInfo, username, printLines, userPrinter, total, totalCartons) {
     // console.log(userPrinter);
      const options = {
        printer: userPrinter,
        paperSize: "4x6",
        scale:"fit",
      };
      // // Get the current directory of the script
      // const currentDirectory = __dirname;
      // console.log(currentDirectory);
      // // Define the file name
      // const newFileName = "file1.txt";

      // // Combine the current directory with the new file name
      // const filePath = path.join(currentDirectory, newFileName);

      // Content to write in the new file
      // const fileContent = "This is the content of the new file.\n It's pretty neat.";
      //var doc = new jsPDF('p', 'in', [4, 6]);
      // var doc = new jsPDF();
      //var doc = new jsPDF(4,6);
      var doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100,150]
        })
      let initialY = 5;
      let valueToAddToX = 5;
      doc.setLineWidth(0.2);
      var img = new Image();
      // img.src = "companylogo.png";
      // doc.addImage(img, "png", 150, 5, 50, 30);
      doc.setFontSize(12);

      //doc.text("Demande de chargement : " + load_request_code, 5, initialY + 5);
      // bwipjs.toBuffer(
      //   {
      //     bcid: "code128", // Barcode type (replace with the desired barcode format)
      //     text: load_request_code, // Barcode data
      //     scale: 3, // Scaling factor for the barcode image
      //     includetext: true, // Include the barcode text
      //     height: 10,
      //     width: 60,
      //   },
      //   function (err, png) {
      //     if (err) {
      //       console.log(err);
      //       return;
      //     }

      //     doc.addImage(png, "PNG", 80, 45, 65, 20);
      //     doc.save(load_request_code + ".pdf");
      //   }
      // );

      doc.setFont("Times-Roman");

      //console.log("initialy",initialY)
      doc.setFontSize(14);
      doc.text("Demande de chargement : " + load_request_code, 13, initialY + 5);

      doc.setFontSize(9);
      doc.text("Role    : " + role_code, 5, initialY + 10);
      doc.text("Date    : " + loadRequestInfo.date_creation, 5, initialY + 15);
      doc.text("Vendeur : " + userInfo.user_mobile_code + " - " + username, 5, initialY + 20);
      doc.text("Total cartons    : " + totalCartons, 65, initialY + 15);
      doc.text("Valeur : " + Number(total * 1.2019).toFixed(2) + " DZD", 65, initialY + 20);
      doc.setFontSize(9);

      doc.line(2, initialY + 25, 98, initialY + 25); // 85
      doc.line(2, initialY + 35, 98, initialY + 35); // 90
      doc.line(2, initialY + 25, 2, initialY + 35); // 90
      doc.text("N°", 4, initialY + 30); // 88.5
      doc.line(10, initialY + 25, 10, initialY + 35); // 90
      doc.text("Code ", 15, initialY + 30); // 88.5
      doc.line(33, initialY + 25, 33, initialY + 35); // 90
      doc.text("Désignation", 37, initialY + 30); // 88.5
      doc.line(65, initialY + 25, 65, initialY + 35); // 90
      doc.text("Lot", 70, initialY + 30); // 88.5
      doc.line(85, initialY + 25, 85, initialY + 35); // 90
      doc.text("Qt", 89, initialY + 30); // 88.5
      doc.line(98, initialY + 25, 98, initialY + 35); // 90

      var i = 40 + valueToAddToX;
      doc.setFontSize(8);

      for (let j = 0; j < printLines.length; j++) {
        if (j % 21 == 0 && j != 0) {
          doc.addPage();

          doc.setFontSize(8);
          doc.line(2, 5, 98, 5); // 85
          i = 10
        }
        doc.setFontSize(8);
        let line = printLines[j];
       // console.log("kamelkamel",line);
        doc.line(2, i - 5, 2, i);
        doc.text(String(line.line), 4, i - 2 );
        doc.line(10, i - 5, 10, i);
        doc.text(line.product_code, 13, i - 2);
        doc.line(33, i - 5, 33, i);
        doc.text(line.product_name, 35, i - 2);
        doc.line(65, i - 5, 65, i);
        doc.text(String(line.lot), 68, i - 2);
        doc.line(85, i - 5, 85, i);
        doc.text(String(line.qt_request), 95, i - 2, { align: "right" });
        doc.line(98, i - 5, 98, i);

       // i = i + 5;

        doc.line(2, i  , 98, i  );
        i = i + 5;

      }

      doc.setFontSize(9);
      //doc.line(2, i - 14, 98, i - 14);
      doc.save(load_request_code + ".pdf");

      // // Write content to the new file
      // let fileContent = "Demande de chargement : " + load_request_code + "\n" + "Role : " + role_code + "\n" + "Date : " + loadRequestInfo.date_creation + "\n" + "Vendeur : " + userInfo.user_mobile_code + "\n\n" + "--------------------------------------------------------------------" + "\n" + "|" + " Ligne " + "|" + " Code Prd " + "|" + "     Nom produit     " + "|" + "       Lot       " + "|" + "  Qté  " + "|" + "\n" + "--------------------------------------------------------------------" + "\n";
      // printLines.map((item) => {
      //   let name = item.product_name.substring(0, 18);
      //   fileContent = fileContent + "|" + "    " + item.line + "     " + "|" + "       " + item.product_code + "| " + name + "             | " + item.lot + " |    " + item.qt_request + "    |" + "\n" + "--------------------------------------------------------------------" + "\n";
      // });
      // fileContent = fileContent + "|                  Total cartons:" + "                    |                    |    " + totalCartons + "    |" + "\n" + "|                  Total:" + "                                |                 " + total + "    |" + "\n" + "--------------------------------------------------------------------";
      // fs.writeFile(filePath, fileContent, (err) => {
      //   if (err) {
      //     console.error("Error creating file:", err);
      //   } else {
      //     console.log("File created successfully:", filePath);
      //   }
      // });

      // const command = `print /d:"${userPrinter}" "${filePath}"`;
      // exec(command, (error, stdout, stderr) => {
      //     if (error) {
      //         console.error('Error printing:', error);
      //         return;
      //     }
      //     console.log('File printed successfully.');
      // });
     print(load_request_code + ".pdf", options)
       .then((result) => {
         console.log(result); // Print the result if needed
          // Now that printing is done, delete the file

          fs.unlink(load_request_code + ".pdf", (err) => {
            if (err) {
              console.error(`Error deleting file: ${err}`);
              return;
            }
            console.log('File deleted successfully');
          });
       })
       .catch((error) => {
         console.error('Error:', error); // Handle any errors that occur during printing
       });
    }

  };
})(ElectronPrinter2 || {});

var ElectronPrinter3 = (function () {
  console.log("herrereeeeeeeeee");
  return {
    print3: function (dataset, load_request_code, role_code, loadRequestInfo, userInfo, username, printLines, userPrinter, total, totalCartons) {
      console.log(userPrinter);
      const options = {
        printer: userPrinter,
        paperSize: "4x6",
        scale:"fit",
      };
     
      var doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100,150]
        })
        let initialY = 5;
        let valueToAddToX = 5;
        doc.setLineWidth(0.2);
      
      // // Get the current directory of the script
      // const currentDirectory = __dirname;
      // console.log(currentDirectory);
      // // Define the file name
      // const newFileName = "file2.txt";

      // // Combine the current directory with the new file name
      // const filePath = path.join(currentDirectory, newFileName);
      var img = new Image();
      // img.src = "companylogo.png";
      // doc.addImage(img, "png", 150, 5, 50, 30);
      doc.setFontSize(14);

      // if (this.domain.dom_name != null) {
      //   doc.text(this.domain.dom_name, 10, 10);
      // }
      // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
     
      //doc.line(10, 35, 200, 35);
      doc.setFontSize(14);

      // doc.barcode(load_request_code, {
      //     fontSize: 70,
      //     textColor: "#000000",
      //     x: 100,
      //     y: 60,
      //     textOptions: { align: "center" }, // optional text options
      // });

      // bwipjs.toBuffer(
      //   {
      //     bcid: "code128", // Barcode type (replace with the desired barcode format)
      //     text: load_request_code, // Barcode data
      //     scale: 3, // Scaling factor for the barcode image
      //     includetext: true, // Include the barcode text
      //     height: 10,
      //     width: 60,
      //   },
      //   function (err, png) {
      //     if (err) {
      //       console.log(err);
      //       return;
      //     }

      //     doc.addImage(png, "PNG", 80, 45, 65, 20);
      //     doc.save(load_request_code + ".pdf");
      //   }
      // );

      doc.setFont("Times-Roman");

      doc.text("Demande de chargement : " + load_request_code, 13, initialY + 5);

      doc.setFontSize(9);
      doc.text("Role    : " + role_code, 5, initialY + 10);
      doc.text("Date    : " + loadRequestInfo.date_creation, 5, initialY + 15);
      doc.text("Vendeur : " + userInfo.user_mobile_code + " - " + username, 5, initialY + 20);
      doc.text("Total cartons    : " + totalCartons, 65, initialY + 15);
      doc.text("Valeur : " + Number(total * 1.2019).toFixed(2) + " DZD", 65, initialY + 20);
      doc.setFontSize(9);

//      doc.setFontSize(22);

      doc.line(2, initialY + 25, 98, initialY + 25); // 85
      doc.line(2, initialY + 35, 98, initialY + 35); // 90
      doc.line(2, initialY + 25, 2, initialY + 35); // 90
      doc.text("N°", 4, initialY + 30); // 88.5
      doc.line(10, initialY + 25, 10, initialY + 35); // 90
      doc.text("Code ", 13, initialY + 30); // 88.5
      doc.line(30, initialY + 25, 30, initialY + 35); // 90
      doc.text("Désignation", 35, initialY + 30); // 88.5
      doc.line(70, initialY + 25, 70, initialY + 35); // 90
      // doc.text("Lot", 65, initialY + 30); // 88.5
      // doc.line(80, initialY + 25, 80, initialY + 35); // 90
      doc.text("QTED", 75, initialY + 30); // 88.5
      doc.line(84, initialY + 25, 84, initialY + 35); // 90
      doc.text("QTEC", 88, initialY + 30); // 88.5
      doc.line(98, initialY + 25, 98, initialY + 35); // 90

      var i = 40 + valueToAddToX;
      doc.setFontSize(8);

      // doc.line(2, initialY + 55, 210, initialY + 55); // 85
      // doc.line(2, initialY + 70, 210, initialY + 70); // 90
      // doc.line(2, initialY + 55, 2, initialY + 70); // 90
      // doc.text("N", 11, initialY + 63); // 88.5
      // doc.line(20, initialY + 55, 20, initialY + 70); // 90
      // doc.text("Code Article", 25, initialY + 63); // 88.5
      // doc.line(70, initialY + 55, 70, initialY + 70); // 90
      // doc.text("Désignation", 75, initialY + 63); // 88.5
      // doc.line(140, initialY + 55, 140, initialY + 70); // 90

      // doc.text("QTD", 145, initialY + 63); // 88.5
      // doc.line(192, initialY + 55, 192, initialY + 70); // 90
      // doc.text("QtC", 194, initialY + 63); // 88.5
      // doc.line(210, initialY + 55, 210, initialY + 70); // 90

      // var i = 143 + valueToAddToX;
      // doc.setFontSize(22);

      // doc.setFontSize(22);

      for (let j = 0; j < printLines.length; j++) {
        if (j % 21 == 0 && j != 0) {
          doc.addPage();

          doc.setFontSize(8);
          doc.line(2, 5, 98, 5); // 85
          i = 10
        
        }

        // if (printLines[j].product_name.length > 35) {
        //   doc.setFontSize(22);

        //   let line = printLines[j];

        //   let desc1 = line.product_name.substring(0, 34);
        //   let ind = desc1.lastIndexOf(" ");
        //   desc1 = line.product_name.substring(0, ind);
        //   let desc2 = line.product_name.substring(ind + 1);

        //   doc.line(10, i - 5, 10, i);
        //   doc.text(String(line.line), 12.5, i - 1);
        //   doc.line(20, i - 5, 20, i);
        //   doc.text(line.product_code, 25, i - 1);
        //   doc.line(45, i - 5, 45, i);
        //   doc.text(desc1, 47, i - 1);
        //   doc.line(100, i - 5, 100, i);
        //   // doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
        //   // doc.line(120, i - 5, 120, i);
        //   doc.text(String(line.qt_request), 143, i - 1, { align: "right" });
        //   doc.line(145, i - 5, 145, i);
        //   doc.text(String(line.qt_effected), 168, i - 1, { align: "right" });
        //   doc.line(170, i - 5, 170, i);
        //   // doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
        //   // doc.line(195, i - 5, 195, i);

        //   i = i + 5;

        //   doc.text(desc2, 47, i - 1);

        //   doc.line(10, i - 5, 10, i);
        //   doc.line(20, i - 5, 20, i);
        //   doc.line(45, i - 5, 45, i);
        //   doc.line(100, i - 5, 100, i);
        //   doc.line(120, i - 5, 120, i);
        //   doc.line(145, i - 5, 145, i);

        //   i = i + 5;
        // } else {
      //  doc.setFontSize(22);
        let line = printLines[j];
        doc.line(2, i - 5, 2, i);
        doc.text(String(line.line), 4, i - 2);
        doc.line(10, i - 5, 10, i);
        doc.text(line.product_code, 13, i - 2);
        doc.line(30, i - 5, 30, i);
        doc.text(line.product_name, 33, i - 2);
        doc.line(70, i - 5, 70, i);

        doc.text(String(line.qt_request), 82, i - 2, { align: "right" });
        doc.line(84, i - 5, 84, i);
        doc.text(String(line.qt_effected), 96, i - 2, { align: "right" });
        doc.line(98, i - 5, 98, i);

        doc.line(2, i  , 98, i  );
        i = i + 5;

      }

     
      //doc.line(2, i - 14, 210, i - 14);
      doc.save(load_request_code + ".pdf");

      print(load_request_code + ".pdf", options)
        .then((result) => {
          console.log(result); // Print the result if needed
          // Now that printing is done, delete the file
          const filePath = load_request_code + ".pdf";
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file: ${err}`);
              return;
            }
            console.log("File deleted successfully");
          });
        })
        .catch((error) => {
          console.error("Error:", error); // Handle any errors that occur during printing
        });

      // // Write content to the new file
      // let fileContent = "Demande de chargement : " + load_request_code + "\n" + "Role : " + role_code + "\n" + "Date : " + loadRequestInfo.date_creation + "\n" + "Vendeur : " + userInfo.user_mobile_code + "\n\n" + "--------------------------------------------------------------------" + "\n" + "|" + " Ligne " + "|" + " Code Prd " + "|" + "     Nom produit     " + "|" + "       QtD       " + "|" + "  QtC  " + "|" + "\n" + "--------------------------------------------------------------------" + "\n";
      // printLines.map((item) => {
      //   let name = item.product_name.substring(0, 5);
      //   fileContent = fileContent + "|" + "    " + item.line + "     " + "|" + "       " + item.product_code + "| " + name + "              | " + "       " + item.qt_request + "       " + " |    " + item.qt_effected + "     |" + "\n" + "--------------------------------------------------------------------" + "\n";
      // });
      // fileContent = fileContent + "|                  Total cartons:" + "                    |                    |    " + totalCartons + "    |" + "\n" + "|                  Total:" + "                                |                 " + total + "    |" + "\n" + "--------------------------------------------------------------------";
      // fs.writeFile(filePath, fileContent, (err) => {
      //   if (err) {
      //     console.error("Error creating file:", err);
      //   } else {
      //     console.log("File created successfully:", filePath);
      //   }
      // });
      // print({
      //   destination: userPrinter,
      //   file: filePath,
      // });
    },
  };
})(ElectronPrinter3 || {});

var Edelweiss = (function () {
    
    return {
        print3: function (lb, userPrinter) {
            const options = {
                printer: userPrinter,

            };
            const pageWidth = 284; // Width of the page in points
            const pageHeight = 284; // Height of the page in points
            const doc = new PDFDocument({ size: [pageWidth, pageHeight] });
            doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };
            const time = new Date().toLocaleTimeString();
            console.log('renderer.js')
            doc.text('FOURNISSEUR : ' + lb.lb_cust + '      GROUPE: ' + lb.lb_grp, 20, 18)
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('DATE: ' + lb.lb_date, 20, 58);

            doc

                .text('PRODUIT :' + lb.lb_desc, 20, 78)
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('CODE :' + lb.lb_rmks, 20, 118)
                .font('Helvetica-Bold')
                .fontSize(12)

                .text('QTE :' + lb.lb_qty + 'KG', 20, 138)
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('N° Lot:' + lb.lb_lot, 20, 158)
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('QUALITE:', 20, 178);

            // Define the third rectangle and its text lines
            doc

                .text('BIGBAG N°:' + lb.lb__dec01, 20, 198)
                .font('Helvetica-Bold')
                .fontSize(12)

                .text('HEURE:' + time, 180, 58);

            const filenamepdf = 'c://lb.lb_ref' + '.pdf';

            doc.pipe(fs.createWriteStream(filenamepdf));


            bwipjs.toBuffer(
                {
                    bcid: 'code128', // Barcode type (replace with the desired barcode format)
                    text: lb.lb_ref, // Barcode data
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

                    // Load the barcode image from the generated PNG buffer
                    const image = doc.openImage(png);

                    // Draw the barcode image on the PDF document
                    doc.image(image, 50, 223, {
                        fit: [5400, 40], // Adjust the size of the barcode image as needed
                    });
                    // Save the PDF document
                    doc.end();
                },
            );

            setTimeout(() => {
                fs.readFile(filenamepdf, (err, data) => {
                  if (err) {
                    console.error(err);
                   
                  }
                  print(filenamepdf, options).then(console.log);
                  
                });
              }, 5000);
            
            console.log("all right")
            
        },
        function (err, png) {
          if (err) {
            console.log(err);
            return;
          }

          // Load the barcode image from the generated PNG buffer
          const image = doc.openImage(png);

          // Draw the barcode image on the PDF document
          doc.image(image, 50, 223, {
            fit: [5400, 40], // Adjust the size of the barcode image as needed
          });
          // Save the PDF document
          doc.end();
        }
      );

      print(filenamepdf, options).then(console.log);
      console.log("all right");
    },
  };
})(Edelweiss || {});
