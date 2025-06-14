import { jsPDF } from "jspdf"
var font = 'undefined';
var callAddFont = function () {
this.addFileToVFS('arabic-normal.ttf', font);
this.addFont('arabic-normal.ttf', 'arabic', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
