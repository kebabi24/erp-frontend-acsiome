const { print } = require('pdf-to-printer')
const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');
const fs = require('fs');
// var Edelweiss = (function () {
//     console.log("herrereeeeeeeeee")
//     return {
//         print3: function (lb) {
//             const options = {
//                 printer: "Zebra RW 420 - CPCL",

//             };
//             // const pageWidth = 284; // Width of the page in points
//             // const pageHeight = 284; // Height of the page in points
//             // const doc = new PDFDocument({ size: [pageWidth, pageHeight] });
//             // doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };
//             // const time = new Date().toLocaleTimeString();

//             // doc.text('FOURNISSEUR : ' + lb.lb_cust, 20, 18)
//             //     .font('Helvetica-Bold')
//             //     .fontSize(12)
//             //     .text('DATE: ' + lb.lb_date, 20, 58);

//             // doc

//             //     .text('PRODUIT :' + lb.lb_desc, 20, 78)
//             //     .font('Helvetica-Bold')
//             //     .fontSize(12)
//             //     .text('CODE :' + '', 20, 118)
//             //     .font('Helvetica-Bold')
//             //     .fontSize(12)

//             //     .text('QTE :' + lb.lb_qty + 'KG', 20, 138)
//             //     .font('Helvetica-Bold')
//             //     .fontSize(12)
//             //     .text('N° Lot:' + lb.lb_lot, 20, 158)
//             //     .font('Helvetica-Bold')
//             //     .fontSize(12)
//             //     .text('QUALITE:', 20, 178);

//             // // Define the third rectangle and its text lines
//             // doc

//             //     .text('BIGBAG N°:' + lb.lb__dec01, 20, 198)
//             //     .font('Helvetica-Bold')
//             //     .fontSize(12)

//             //     .text('HEURE:' + time, 180, 58);

//             // const filenamepdf = lb.lb_ref + '.pdf';

//             // doc.pipe(fs.createWriteStream(filenamepdf));


//             // bwipjs.toBuffer(
//             //     {
//             //         bcid: 'code128', // Barcode type (replace with the desired barcode format)
//             //         text: lb.lb_ref, // Barcode data
//             //         scale: 3, // Scaling factor for the barcode image
//             //         includetext: true, // Include the barcode text
//             //         height: 10,
//             //         width: 60,
//             //     },
//             //     function (err, png) {
//             //         if (err) {
//             //             console.log(err);
//             //             return;
//             //         }

//             //         // Load the barcode image from the generated PNG buffer
//             //         const image = doc.openImage(png);

//             //         // Draw the barcode image on the PDF document
//             //         doc.image(image, 50, 223, {
//             //             fit: [5400, 40], // Adjust the size of the barcode image as needed
//             //         });
//             //         // Save the PDF document
//             //         doc.end();
//             //     },
//             // );


//             print("PL-52.pdf", options).then(console.log);
//             console.log("all right")
//         },

//     }

// }(Edelweiss || {}))
var Edelweiss = (function () {
    console.log("herrereeeeeeeeee")
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
            console.log('edel.js')
            doc.text('FOURNISSEUR : ' + lb.lb_cust, 20, 18)
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('DATE: ' + lb.lb_date, 20, 58);

            doc

                .text('PRODUIT :' + lb.lb_desc, 20, 78)
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('CODE :' + '', 20, 118)
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

            const filenamepdf = lb.lb_ref + '.pdf';

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


            print(filenamepdf, options).then(console.log);
            console.log("all right")
        },

    }

}(Edelweiss || {}))