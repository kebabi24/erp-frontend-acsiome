// const { PosPrinter } = require('electron').remote.require("electron-pos-printer");
// const {PosPrinter} = require("electron-pos-printer"); //dont work in production (??)
const {PosPrinter} = require('electron').remote.require("electron-pos-printer");


var ElectronPrinter = (function (data) {
    console.log("herrereeeeeeeeee")
    return {
        print: function (data, data2) {
            console.log(data)
            let printerName;
            //let printerName2;
            let widthPage;

            printerName = 'Kyocera FS-1030MFP KX'
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

            if (printerName && widthPage) {
                PosPrinter.print(data, options)
                    .then(() => { console.log("everthing is right")})
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                alert("Select the printer and the width");
            }

        },

    }

}(ElectronPrinter || {}))








