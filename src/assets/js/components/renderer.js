let { remote } = require("electron");
// console.log(process.versions.electron);

const { PosPrinter } = remote.require("electron-pos-printer");
// const {PosPrinter} = require("electron-pos-printer"); //dont work in production (??)

const path = require("path");

var electronPrinter = (function (data) {



    return {
        print: function (data, data2) {
            console.log(data)
            let printerName;
            //let printerName2;
            let widthPage;




            printerName = 'XP-80C'
            //printerName2 = 'Microsoft Print to PDF'
            widthPage = '300px'



            const options = {
                preview: false, // Preview in window or print
                width: widthPage, //  width of content body
                margin: "0 0 0 0", // margin of content body
                copies: 1, // Number of copies to print
                printerName: printerName, // printerName: string, check it at webContent.getPrinters()
                timeOutPerLine: 400,
                silent: true,
            };
            // const options2 = {
            //     preview: false, // Preview in window or print
            //     width: widthPage, //  width of content body
            //     margin: "0 0 0 0", // margin of content body
            //     copies: 1, // Number of copies to print
            //     printerName: printerName2, // printerName: string, check it at webContent.getPrinters()
            //     timeOutPerLine: 400,
            //     silent: true,
            // };





            if (printerName && widthPage) {
                PosPrinter.print(data, options)
                    .then(() => { })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                alert("Select the printer and the width");
            }
            // if (printerName2 && widthPage) {
            //     PosPrinter.print(data2, options2)
            //         .then(() => { })
            //         .catch((error) => {
            //             console.error(error);
            //         });
            // } else {
            //     alert("Select the printer and the width");
            // }
        },

    }

})(electronPrinter || {})








